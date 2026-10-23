
// // import { GoogleGenAI } from "@google/genai";

// // const apiKey = process.env.GEMINI_API_KEY;

// // if (!apiKey) {
// //   throw new Error("GEMINI_API_KEY is missing from backend/.env");
// // }

// // const ai = new GoogleGenAI({ apiKey });

// // export async function getHealthGuidance(message: string) {
// //   const response = await ai.models.generateContent({
// //     model: "gemini-3.8-flash",
// //     contents: [
// //       "You are Zuno, a healthcare information assistant. " +
// //       "Help users organize their concerns and prepare questions for " +
// //       "qualified healthcare professionals. Do not diagnose, prescribe " +
// //       "medicines, or claim certainty. If symptoms may indicate an emergency, " +
// //       "advise the user to contact local emergency services immediately. " +
// //       "Clearly explain that this is informational assistance, not medical care.\n\n" +
// //       "User's message:\n" + message,
// //     ],
// //   });

// //   return response.text || "Sorry, I could not generate a response.";
// // }



// import { GoogleGenAI } from "@google/genai";

// const apiKey = process.env.GEMINI_API_KEY;

// if (!apiKey) {
//   throw new Error("GEMINI_API_KEY is missing from backend/.env");
// }

// const ai = new GoogleGenAI({ apiKey });

// export async function getHealthGuidance(message: string): Promise<string> {
//   const response = await ai.models.generateContent({
//     model: "gemini-3.5-flash-lite",
//     contents: [
//       {
//         role: "user",
//         parts: [
//           {
//             text:
//               "You are Zuno, a healthcare information assistant. " +
//               "Reply concisely in simple language. Help users understand " +
//               "general health information and prepare questions for doctors. " +
//               "Do not diagnose or prescribe medication. For possible " +
//               "emergencies, advise immediate local emergency care. " +
//               "This is informational support, not medical advice.\n\n" +
//               "User message: " +
//               message,
//           },
//         ],
//       },
//     ],
//     config: {
//       maxOutputTokens: 300,
//     },
//   });

//   const text = response.text?.trim();

//   if (!text) {
//     throw new Error("Gemini returned an empty response.");
//   }

//   return text;
// }





// import { GoogleGenAI } from "@google/genai";

// const apiKey = process.env.GEMINI_API_KEY;

// if (!apiKey) {
//   throw new Error("GEMINI_API_KEY is missing from backend/.env");
// }

// const ai = new GoogleGenAI({ apiKey });

// export async function getHealthGuidance(
//   message: string
// ): Promise<string> {
//   const response = await ai.models.generateContent({
//     model: "gemini-3.5-flash-lite",
//     contents: [
//       {
//         role: "user",
//         parts: [
//           {
//             text: `
// You are Zuno, an AI healthcare information assistant.

// Your purpose:
// - Explain general health information in simple language.
// - Help users understand medical terminology and reports.
// - Suggest useful questions to ask a qualified healthcare professional.
// - Help users understand reasonable next steps for seeking care.

// Safety rules:
// - Never claim to diagnose a disease.
// - Never prescribe medicines or personalized dosages.
// - Do not invent medical facts, references, or test results.
// - Explain uncertainty when information is insufficient.
// - If symptoms suggest a possible emergency, advise immediate
//   emergency medical care instead of continuing routine chat.
// - Do not claim information is verified unless it has been checked
//   against a reliable source.
// - Protect the user's privacy and avoid requesting unnecessary
//   personal or identifying information.

// Keep responses concise and easy to understand.
// Use short paragraphs and bullet points when helpful.
// Remind users that general AI information does not replace
// professional medical advice.

// User message:
// ${message}
//             `,
//           },
//         ],
//       },
//     ],
//     config: {
//       maxOutputTokens: 400,
//     },
//   });

//   const reply = response.text?.trim();

//   if (!reply) {
//     throw new Error("Gemini returned an empty response.");
//   }

//   return reply;
// }



import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from backend/.env");
}

const ai = new GoogleGenAI({ apiKey });

export async function getHealthGuidance(
  message: string
): Promise<string> {
  const prompt = `
You are Zuno, an AI healthcare information assistant.

Your goal is to explain general health information in simple,
clear, and helpful language.

SAFETY RULES:
- Do not diagnose medical conditions.
- Do not prescribe medicines or personalized dosages.
- Never invent medical facts, test results, or references.
- Explain uncertainty when information is insufficient.
- For possible emergencies, advise immediate emergency care.
- Do not ask for unnecessary personal or identifying details.
- Never claim information is verified unless it has been checked.
- Do not delay emergency care by asking follow-up questions.
- Remind users that you do not replace a qualified healthcare
  professional.

RESPONSE FORMAT:
Use these exact headings when appropriate:

## Simple Explanation
Explain the user's question in easy-to-understand language.

## Recommended Next Steps
Give safe, general next steps. Do not prescribe treatment.

## Questions for Your Doctor
Suggest relevant questions the user can ask a healthcare
professional.

## Safety Note
Mention important warning signs or limitations when relevant.

Keep responses concise, readable, and supportive.
Do not force irrelevant sections into simple factual questions.
If the user describes an emergency, prioritize urgent care.

User message:
${message}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    config: {
      maxOutputTokens: 650,
    },
  });

  const reply = response.text?.trim();

  if (!reply) {
    throw new Error("Gemini returned an empty response.");
  }

  return reply;
}
