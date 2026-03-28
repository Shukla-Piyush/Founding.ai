import { Mistral } from '@mistralai/mistralai';

let mistralClient: Mistral | null = null;

function getMistralClient(): Mistral {
    if (!mistralClient) {
        mistralClient = new Mistral({
            apiKey: process.env.MISTRAL_API_KEY || '',
        });
    }
    return mistralClient;
}

export async function callClaude(
    systemPrompt: string,
    userMessage: string,
    options?: {
        maxTokens?: number;
        temperature?: number;
    }
): Promise<string> {
    const client = getMistralClient();
    
    // Note: mistral-large-latest or open-mixtral-8x22b
    const response = await client.chat.complete({
        model: 'mistral-large-latest',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
        ],
        maxTokens: options?.maxTokens || 4096,
        temperature: options?.temperature ?? 0.7,
    });

    return response.choices?.[0]?.message?.content?.toString() || '';
}

export async function callClaudeJSON<T>(
    systemPrompt: string,
    userMessage: string,
    options?: {
        maxTokens?: number;
        temperature?: number;
    }
): Promise<T> {
    const client = getMistralClient();

    const maxRetries = 2;
    let lastError: Error | null = null;

    const jsonSystemPrompt = systemPrompt + '\n\nCRITICAL: Respond ONLY with a valid JSON file structure. Be CONCISE — keep all string values under 200 characters. No markdown. No code blocks.';

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await client.chat.complete({
                model: 'mistral-large-latest',
                messages: [
                    { role: 'system', content: jsonSystemPrompt },
                    { role: 'user', content: userMessage }
                ],
                maxTokens: options?.maxTokens || 4096,
                temperature: options?.temperature ?? 0.7,
                responseFormat: { type: 'json_object' }
            });

            const text = response.choices?.[0]?.message?.content?.toString().trim() || '';
            
            if (!text) {
                throw new Error('Empty response from Mistral');
            }

            return JSON.parse(text) as T;
        } catch (e) {
            lastError = e as Error;
            console.error(`[Mistral] Attempt ${attempt + 1} failed:`, (e as Error).message?.substring(0, 150));

            if ((e as Error).message?.includes('JSON')) {
                try {
                    const retryResponse = await client.chat.complete({
                        model: 'mistral-large-latest',
                        messages: [
                            { role: 'system', content: 'You are a concise JSON responder. Keep ALL values SHORT. Respond ONLY with valid JSON.' },
                            { role: 'user', content: userMessage + '\n\nIMPORTANT: Keep your entire response under 2000 characters. Be extremely concise.' }
                        ],
                        maxTokens: options?.maxTokens || 4096,
                        temperature: 0.3,
                        responseFormat: { type: 'json_object' }
                    });

                    const retryText = retryResponse.choices?.[0]?.message?.content?.toString().trim() || '';
                    if (retryText) {
                        return JSON.parse(retryText) as T;
                    }
                } catch (retryError) {
                    console.error(`[Mistral] Retry also failed:`, (retryError as Error).message?.substring(0, 100));
                    lastError = retryError as Error;
                }
            }
        }
    }

    throw lastError || new Error('Failed to get valid JSON from Mistral');
}
