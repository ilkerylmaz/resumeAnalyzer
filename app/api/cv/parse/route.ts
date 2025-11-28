import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";
import type { Part } from "@google/genai";

// Validation schema for uploaded file
const uploadSchema = z.object({
    file: z
        .instanceof(File)
        .refine((file) => file.type === "application/pdf", {
            message: "File must be a PDF",
        })
        .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: "File size must be less than 5MB",
        }),
});

// Parsed CV schema (matches Zustand store structure)
const parsedCVSchema = z.object({
    personalInfo: z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        phone: z.string(),
        location: z.string(),
        title: z.string(),
        summary: z.string().optional(),
    }),
    experiences: z.array(
        z.object({
            id: z.string(),
            company: z.string(),
            position: z.string(),
            location: z.string().optional(),
            startDate: z.string(),
            endDate: z.string().optional(),
            current: z.boolean(),
            description: z.string().optional(),
        })
    ),
    education: z.array(
        z.object({
            id: z.string(),
            institution: z.string(),
            degree: z.string(),
            field: z.string(),
            location: z.string().optional(),
            startDate: z.string(),
            endDate: z.string().optional(),
            current: z.boolean(),
            gpa: z.string().optional(),
            description: z.string().optional(),
        })
    ),
    skills: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            category: z.string(),
            proficiency: z.enum(["beginner", "intermediate", "advanced", "expert"]),
        })
    ),
    projects: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            description: z.string().optional(),
            technologies: z.array(z.string()),
            url: z.string().optional(),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
            current: z.boolean(),
        })
    ),
    certificates: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            issuer: z.string(),
            date: z.string().optional(),
            url: z.string().optional(),
        })
    ),
    languages: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            proficiency: z.enum([
                "elementary",
                "limited",
                "professional",
                "native",
            ]),
        })
    ),
    socialMedia: z.array(
        z.object({
            id: z.string(),
            platform: z.string(),
            url: z.string(),
        })
    ),
    interests: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
        })
    ),
});

export async function POST(request: NextRequest) {
    console.log("=== CV Parse API Called ===");

    try {
        // 1. Get file from request
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        console.log("File received:", file?.name, file?.size, file?.type);

        if (!file) {
            console.log("ERROR: No file provided");
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // 2. Validate file
        try {
            console.log("Validating file...");
            uploadSchema.parse({ file });
            console.log("File validation passed");
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.log("ERROR: File validation failed:", error.issues[0].message);
                return NextResponse.json(
                    { error: error.issues[0].message },
                    { status: 400 }
                );
            }
            throw error;
        }

        // 3. Convert file to buffer and validate PDF
        console.log("Converting file to buffer...");
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        console.log("Buffer created, size:", buffer.length);

        // 4. Validate PDF and get page count
        let numPages = 0;
        try {
            console.log("Loading PDF document...");
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            numPages = pdfDoc.getPageCount();
            console.log(`PDF loaded successfully: ${numPages} pages`);

            if (numPages > 10) {
                console.log("ERROR: Too many pages");
                return NextResponse.json(
                    { error: "PDF must have 10 pages or less" },
                    { status: 400 }
                );
            }
        } catch (error) {
            console.error("PDF loading error:", error);
            return NextResponse.json(
                {
                    error:
                        "Failed to load PDF. The file may be corrupted or password-protected.",
                },
                { status: 400 }
            );
        }

        // 5. Convert PDF to base64
        const base64PDF = buffer.toString("base64");
        console.log("PDF converted to base64");

        // 6. Call Gemini API
        console.log("Initializing Gemini API...");
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const prompt = `You are a professional CV/Resume parsing expert. Extract structured information from this CV/Resume PDF and return it as valid JSON.

CRITICAL RULES:
1. Return ONLY valid JSON, no markdown code blocks, no explanations
2. Use ISO 8601 date format (YYYY-MM-DD)
3. Generate unique IDs using timestamp + random string (e.g., "exp_${Date.now()}_${Math.random()}")
4. If a field is not found, use empty string "" or empty array []
5. For proficiency levels:
   - Skills: "beginner", "intermediate", "advanced", or "expert"
   - Languages: "elementary", "limited", "professional", or "native"
6. For current positions/education: set current: true and endDate: ""
7. Extract social media links (LinkedIn, GitHub, Twitter) into socialMedia array
8. Categorize skills (e.g., "Programming Languages", "Frameworks", "Tools", "Soft Skills")
9. Extract technologies from project descriptions

Expected JSON structure:
{
  "personalInfo": {
    "firstName": "",
    "lastName": "",
    "email": "",
    "phone": "",
    "location": "",
    "title": "",
    "summary": ""
  },
  "experiences": [
    {
      "id": "exp_1234567890_0.123",
      "company": "",
      "position": "",
      "location": "",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "current": false,
      "description": ""
    }
  ],
  "education": [
    {
      "id": "edu_1234567890_0.123",
      "institution": "",
      "degree": "",
      "field": "",
      "location": "",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "current": false,
      "gpa": "",
      "description": ""
    }
  ],
  "skills": [
    {
      "id": "skill_1234567890_0.123",
      "name": "",
      "category": "",
      "proficiency": "intermediate"
    }
  ],
  "projects": [
    {
      "id": "proj_1234567890_0.123",
      "name": "",
      "description": "",
      "technologies": [],
      "url": "",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "current": false
    }
  ],
  "certificates": [
    {
      "id": "cert_1234567890_0.123",
      "name": "",
      "issuer": "",
      "date": "YYYY-MM-DD",
      "url": ""
    }
  ],
  "languages": [
    {
      "id": "lang_1234567890_0.123",
      "name": "",
      "proficiency": "professional"
    }
  ],
  "socialMedia": [
    {
      "id": "social_1234567890_0.123",
      "platform": "",
      "url": ""
    }
  ],
  "interests": [
    {
      "id": "interest_1234567890_0.123",
      "name": ""
    }
  ]
}

Return ONLY the JSON object, nothing else.`;

        // Create PDF part
        const pdfPart: Part = {
            inlineData: {
                mimeType: "application/pdf",
                data: base64PDF,
            },
        };

        console.log("Calling Gemini API with model: gemini-2.5-flash");

        let response;
        try {
            response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [pdfPart, prompt],
            });
        } catch (error) {
            console.error("Gemini API error:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            return NextResponse.json(
                {
                    error: "Failed to connect to AI service. Please try again.",
                    details: errorMessage
                },
                { status: 500 }
            );
        }

        console.log("Gemini API call completed");
        const text = response.text;

        if (!text) {
            console.error("No text in Gemini response");
            return NextResponse.json(
                { error: "AI service returned invalid response" },
                { status: 500 }
            );
        }

        console.log("Gemini response length:", text.length);
        console.log("Gemini response preview:", text.substring(0, 200));

        // 7. Parse JSON response
        let parsedData;
        try {
            const cleanedText = text
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim();
            parsedData = JSON.parse(cleanedText);
            console.log("JSON parsing successful");
        } catch (error) {
            console.error("JSON parsing error:", error);
            console.error("Gemini response:", text);
            return NextResponse.json(
                {
                    error:
                        "Failed to parse CV data. Please try a different CV format.",
                },
                { status: 500 }
            );
        }

        // 8. Validate schema
        try {
            const validatedData = parsedCVSchema.parse(parsedData);
            console.log("Schema validation passed");

            return NextResponse.json({
                success: true,
                data: validatedData,
                metadata: {
                    pages: numPages,
                    fileName: file.name,
                },
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("Validation error:", error.issues);
                return NextResponse.json(
                    {
                        error:
                            "Parsed data structure is invalid. Please try a different CV.",
                    },
                    { status: 500 }
                );
            }
            throw error;
        }
    } catch (error) {
        console.error("CV parsing error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred while parsing your CV." },
            { status: 500 }
        );
    }
}
