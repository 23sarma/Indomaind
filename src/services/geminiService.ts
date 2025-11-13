import { ChatMessage, Tool } from '@/types';

/**
 * A helper function to call our secure backend API.
 * @param action The specific API action to perform (e.g., 'generateText').
 * @param body The data payload for the action.
 * @returns The JSON response from the API.
 */
const callApi = async (action: string, body: object) => {
    const response = await fetch('/api/handler', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, ...body }),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorBody.error || `API call failed with status: ${response.status}`);
    }
    
    // For video, the response is a blob, not json
    if (action === 'generateVideo') {
        const videoBlob = await response.blob();
        return { videoUrl: URL.createObjectURL(videoBlob) };
    }

    return response.json();
};

export const generateText = async (prompt: string, systemInstruction?: string): Promise<string> => {
    try {
        const data = await callApi('generateText', { prompt, systemInstruction });
        return data.text;
    } catch (error) {
        console.error("Error generating text:", error);
        throw error;
    }
};

export const generateImage = async (prompt: string): Promise<string[]> => {
    const data = await callApi('generateImage', { prompt });
    return data.images;
};

export const sendChatMessage = async (
    prompt: string, 
    history: ChatMessage[],
    attachment: { name: string; data: string; mimeType: string } | null
): Promise<{ text: string }> => {
    const data = await callApi('chat', { prompt, history, attachment });
    return data;
};


export const generateVideo = async (prompt: string): Promise<string> => {
    const data = await callApi('generateVideo', { prompt });
    return data.videoUrl;
};

export const generateSpeech = async (prompt: string): Promise<string> => {
    const data = await callApi('generateSpeech', { prompt });
    return data.base64Audio;
};

export const sendAdminCommand = async (
    prompt: string,
    history: any[],
    tools: Tool[],
    functionResponse?: any,
): Promise<any> => {
    const data = await callApi('adminChat', { prompt, history, tools, functionResponse });
    return data;
};