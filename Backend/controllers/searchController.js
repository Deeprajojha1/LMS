import { Course } from "../models/courseModel.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();


export const searchWtihAi = async (req, res) => {
    try {
        const rawQuery = req.query?.q ?? req.body?.input ?? "";
        const query = String(rawQuery).trim();
        if (!query) {
            return res.status(400).json({ message: "Search query is required." });
        }



        const prompt = `You are a smart learning assistant designed for an LMS platform. 
Your task is to analyze the user's query and identify the most relevant keyword that matches the intent of the query.
Select the keyword only from the following predefined categories and levels:

Course Categories:
- App Development
- AI/ML
- Data Science
- Data Analytics
- Ethical Hacking
- UI/UX Designing
- Web Development
- Others


Course Levels:
- Beginner
- Intermediate
- Advanced

Rules:
- Carefully understand the meaning of the user's query.
- Return ONLY one single keyword from the list above that best matches the query.
- Do NOT provide explanations.
- Do NOT add extra text, punctuation, or formatting.
- The output must contain only the selected keyword.

User Query: ${query}`;
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });
        let keyword = query;
        try {
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: prompt,
            });
            keyword = String(response?.text || "").trim() || query;
        } catch (aiError) {
            console.log("AI keyword fallback:", aiError?.message || aiError);
        }
        // 1) Find matching published courses.
        const courses = await Course.find({
            isPublished: true,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { subTitle: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } },
                { level: { $regex: query, $options: "i" } }
            ],
        }).sort({ updatedAt: -1 });


        if (courses.length > 0) {
            const resultCourses = courses.map((course) => course.toObject());
            return res.status(200).json({
                message: "Search completed successfully",
                courses: resultCourses,
            });
        } else {
            const courses = await Course.find({
                isPublished: true,
                $or: [
                    { title: { $regex: keyword, $options: "i" } },
                    { subTitle: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                    { category: { $regex: keyword, $options: "i" } },
                    { level: { $regex: keyword, $options: "i" } }
                ],
            }).sort({ updatedAt: -1 });
            const resultCourses = courses.map((course) => course.toObject());
            return res.status(200).json({
                message: "Search completed successfully",
                courses: resultCourses,
            });

        }
        // Keep response simple for beginners.



    } catch (error) {
        console.log("Search API error:", error);
        return res.status(500).json({ message: "An error occurred while processing search." });
    }
};
