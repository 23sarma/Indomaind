
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Buffer } from 'buffer';
import { GoogleGenAI, Operation, Modality, ChatMessage as GoogleChatMessage, Part, FunctionDeclaration, Type } from "@google/genai";
import { ChatMessage, Tool } from '../src/types';

// This function is deployed as a serverless function on Vercel.
// It acts as a secure backend that communicates with the Google AI API.

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Type guard to ensure roles are compatible with the Google AI SDK
function isValidGoogleChatRole(role: string): role is 'user' | 'model' {
    return role === 'user' || role === 'model';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { action, prompt, systemInstruction, history, attachment } = req.body;

    try {
        switch (action) {
            case 'generateText': {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    ...(systemInstruction && { config: { systemInstruction } }),
                });
                return res.status(200).json({ text: response.text });
            }

            case 'generateImage': {
                const response = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: prompt,
                    config: {
                        numberOfImages: 1,
                        outputMimeType: 'image/jpeg',
                        aspectRatio: '1:1',
                    },
                });
                const images = response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
                return res.status(200).json({ images });
            }

            case 'generateVideo': {
                // IMPORTANT: Long-running operations may exceed timeouts on free serverless tiers.
                const aiWithVideoKey = new GoogleGenAI({ apiKey: API_KEY });
                let operation: Operation = await aiWithVideoKey.models.generateVideos({
                    model: 'veo-3.1-fast-generate-preview',
                    prompt: prompt,
                    config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
                });

                // This loop might timeout on Vercel's hobby plan.
                // A more robust solution would use webhooks or a separate polling client.
                let attempts = 0;
                while (!operation.done && attempts < 20) { // Timeout after ~100 seconds
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    operation = await aiWithVideoKey.operations.getVideosOperation({ operation: operation });
                    attempts++;
                }
                
                if(!operation.done) {
                    throw new Error("Video generation timed out. Please try a shorter prompt or try again later.");
                }

                const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
                if (!downloadLink) {
                    throw new Error("Video generation completed, but no download link was found.");
                }

                const videoResponse = await fetch(`${downloadLink}&key=${API_KEY}`);
                if (!videoResponse.ok) {
                    throw new Error(`Failed to download video: ${videoResponse.statusText}`);
                }
                const videoBlob = await videoResponse.blob();
                const buffer = Buffer.from(await videoBlob.arrayBuffer());
                res.setHeader('Content-Type', 'video/mp4');
                return res.status(200).send(buffer);
            }

            case 'generateSpeech': {
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash-preview-tts",
                    contents: [{ parts: [{ text: `Say clearly: ${prompt}` }] }],
                    config: {
                        responseModalities: [Modality.AUDIO],
                        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
                    },
                });
                const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                if (!base64Audio) throw new Error("No audio data received from API.");
                return res.status(200).json({ base64Audio });
            }
             
            case 'chat': {
                 const validHistory: GoogleChatMessage[] = (history as ChatMessage[])
                    .filter(msg => isValidGoogleChatRole(msg.role))
                    .map(msg => ({
                        role: msg.role as 'user' | 'model',
                        parts: [{ text: msg.text }],
                    }));

                const chat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    history: validHistory,
                    config: { 
                        systemInstruction: 'You are Indomind, a powerful and helpful AI assistant with deep expertise in global cuisine and cooking techniques. When asked about non-cooking topics, answer helpfully, but always try to subtly relate it back to food or cooking if possible.'
                    },
                });
                
                const userMessageParts: Part[] = [];

                if (prompt) {
                    userMessageParts.push({ text: prompt });
                }
                
                if (attachment) {
                    userMessageParts.push({
                        inlineData: {
                            mimeType: attachment.mimeType,
                            data: attachment.data,
                        },
                    });
                }

                if (userMessageParts.length === 0) {
                    return res.status(400).json({ error: 'Empty prompt received.' });
                }

                const response = await chat.sendMessage({ message: { parts: userMessageParts } });
                return res.status(200).json({ text: response.text });
            }

            case 'adminChat': {
                const { prompt, tools: clientTools, history: clientHistory, functionResponse } = req.body;

                const functionDeclarations: FunctionDeclaration[] = [
                    {
                        name: 'addTool',
                        description: 'Adds a new tool to the user dashboard. The tool is a placeholder and not fully implemented.',
                        parameters: {
                            type: Type.OBJECT,
                            properties: {
                                toolName: { type: Type.STRING, description: 'The name of the new tool to create.' },
                                category: { type: Type.STRING, description: 'The category the new tool belongs to.' },
                            },
                            required: ['toolName', 'category'],
                        },
                    },
                    {
                        name: 'toggleToolStatus',
                        description: 'Enables or disables an existing tool for all users.',
                        parameters: {
                            type: Type.OBJECT,
                            properties: {
                                toolName: { type: Type.STRING, description: 'The exact name of the tool to enable or disable.' },
                            },
                            required: ['toolName'],
                        },
                    },
                     {
                        name: 'listTools',
                        description: 'Lists all available tools, optionally filtering by category.',
                        parameters: {
                            type: Type.OBJECT,
                            properties: {
                                category: { type: Type.STRING, description: 'The optional category to filter the tool list by.' },
                            },
                        },
                    },
                    {
                        name: 'runSystemDiagnostics',
                        description: 'Runs a full system health check and reports the status.',
                        parameters: { type: Type.OBJECT, properties: {} },
                    }
                ];

                const toolNames = clientTools.map((t: Tool) => t.name).join(', ');
                const toolCategories = [...new Set(clientTools.map((t: Tool) => t.category))].join(', ');
                const sysInstruction = `You are the AI Core of the Indomind platform. You can manage the platform by calling functions. The user is an admin. Respond to the admin's commands.
                - Available tool names for toggling: ${toolNames}.
                - Existing categories for adding new tools: ${toolCategories}. You can also create a new category.
                - Always confirm after executing an action.`;

                const model = 'gemini-2.5-flash';
                
                const contents = functionResponse
                  ? [ ...clientHistory, { parts: [{ text: prompt }] }, { parts: [{ functionResponse }] } ]
                  : [ ...clientHistory, { parts: [{ text: prompt }] } ];

                const response = await ai.models.generateContent({
                    model,
                    contents,
                    config: {
                      systemInstruction: sysInstruction,
                      tools: [{ functionDeclarations }],
                    },
                });

                return res.status(200).json({ 
                    text: response.text, 
                    functionCalls: response.functionCalls 
                });
            }


            default:
                return res.status(400).json({ error: 'Invalid action specified.' });
        }
    } catch (error: any) {
        console.error(`Error in action '${action}':`, error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}
