"use server"

export interface Settings {
    temp: number,
    max_tokens: number,
    gpt_model: string,
}

export async function saveSettings(temperature: number, maxTokens: number, gptModelSet: string) {
    console.log("temperature: " + temperature + " maxTokens: " + maxTokens + " gptModel: " + gptModelSet);
}