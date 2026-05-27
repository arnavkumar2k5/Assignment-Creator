"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuestionPaper = void 0;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const openai_1 = __importDefault(require("openai"));
const logger_1 = require("../utils/logger");
const buildPrompt = (assignment) => {
    const questionBreakdown = assignment.questionTypes
        .map((qt) => `- ${qt.count} ${qt.type} question(s), each worth ${qt.marks} mark(s)`)
        .join('\n');
    const sourceMaterial = assignment.sourceText
        ? `\nUploaded Source Material (${assignment.sourceFileName || 'uploaded file'}):\n${assignment.sourceText}\n`
        : '';
    return `You are an expert academic question paper creator.

Assignment Title: ${assignment.title}
Due Date: ${new Date(assignment.dueDate).toDateString()}
Additional Instructions: ${assignment.instructions || 'None'}
${sourceMaterial}

Question Requirements:
${questionBreakdown}

Generate a structured academic question paper. Group questions into logical sections (Section A, Section B, etc.) based on question types. Vary difficulty across easy, medium, and hard.

Return ONLY valid JSON with NO markdown, NO backticks, NO explanation. Just raw JSON.

Required format:
{
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions. Each question carries equal marks.",
      "questions": [
        {
          "question": "Full question text here",
          "difficulty": "easy",
          "marks": 2
        }
      ]
    }
  ]
}

Rules:
- Each section corresponds to one question type
- Generate exactly the number of questions specified
- difficulty must be exactly: "easy", "medium", or "hard"
- marks must match the specified marks per question type
- If uploaded source material is provided, base the questions primarily on that material
- Questions must be academically rigorous and relevant to the title/source material
- Do NOT include answers`;
};
const parseAIResponse = (raw) => {
    let cleaned = raw.trim();
    // Strip markdown code fences if present
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    // Extract JSON object
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No valid JSON object found in AI response');
    }
    cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
    let parsed;
    try {
        parsed = JSON.parse(cleaned);
    }
    catch {
        throw new Error(`JSON parse failed: ${cleaned.slice(0, 200)}`);
    }
    // Validate structure
    if (!parsed.sections || !Array.isArray(parsed.sections)) {
        throw new Error('Invalid paper structure: missing sections array');
    }
    for (const section of parsed.sections) {
        if (!section.title || !section.instruction || !Array.isArray(section.questions)) {
            throw new Error(`Invalid section structure: ${JSON.stringify(section)}`);
        }
        for (const q of section.questions) {
            if (!q.question || !['easy', 'medium', 'hard'].includes(q.difficulty) || typeof q.marks !== 'number') {
                throw new Error(`Invalid question structure: ${JSON.stringify(q)}`);
            }
        }
    }
    return parsed;
};
const generateQuestionPaper = async (assignment) => {
    const prompt = buildPrompt(assignment);
    const provider = process.env.AI_PROVIDER || 'groq';
    const groqModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    const openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    logger_1.logger.info(`Generating paper using ${provider} for: ${assignment.title}`);
    let rawResponse;
    if (provider === 'groq') {
        const groq = new groq_sdk_1.default({ apiKey: process.env.GROQ_API_KEY });
        const completion = await groq.chat.completions.create({
            model: groqModel,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 4096,
        });
        rawResponse = completion.choices[0]?.message?.content || '';
    }
    else {
        const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
            model: openaiModel,
            messages: [
                { role: 'system', content: 'You are an expert academic question paper creator. Always respond with valid JSON only.' },
                { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 4096,
            response_format: { type: 'json_object' },
        });
        rawResponse = completion.choices[0]?.message?.content || '';
    }
    if (!rawResponse) {
        throw new Error('Empty response from AI provider');
    }
    logger_1.logger.debug(`Raw AI response (first 300 chars): ${rawResponse.slice(0, 300)}`);
    return parseAIResponse(rawResponse);
};
exports.generateQuestionPaper = generateQuestionPaper;
//# sourceMappingURL=ai.service.js.map