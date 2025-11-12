import type { VercelRequest, VercelResponse } from '@vercel/node';
// FIX: Import Buffer to make it available in the Node.js environment.
import { Buffer } from 'buffer';
import { GoogleGenAI, Operation, Modality, ChatMessage as GoogleChatMessage } from "@google/genai";
import { ChatMessage } from '../src/types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Type guard to check if a role is valid for Google's ChatMessage
function isValidGoogleChatRole(role: string): role is 'user' | 'model' {
    return role === 'user' || role === 'model';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { action, prompt, systemInstruction, history } = req.body;

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
                // IMPORTANT: Long-running operations like this may exceed the timeout
                // on free serverless function tiers (e.g., Vercel Hobby is 10s).
                // A more robust solution for production would involve webhooks or client-side polling.
                const aiWithVideoKey = new GoogleGenAI({ apiKey: API_KEY });
                let operation: Operation = await aiWithVideoKey.models.generateVideos({
                    model: 'veo-3.1-fast-generate-preview',
                    prompt: prompt,
                    config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
                });

                while (!operation.done) {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    operation = await aiWithVideoKey.operations.getVideosOperation({ operation: operation });
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
                    ...(systemInstruction && { config: { systemInstruction } }),
                });
                const response = await chat.sendMessage({ message: prompt });
                return res.status(200).json({ text: response.text });
            }

            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error: any) {
        console.error(`Error in action '${action}':`, error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}