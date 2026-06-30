import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService {
    
    private _ai: GoogleGenAI;

    constructor(private _configService: ConfigService) {
        this._ai = new GoogleGenAI({
            apiKey: _configService.getOrThrow('GEMINI_API_KEY')
        });
    }

    async sendPrompt(prompt: string) {
        try {
            const interaction = await this._ai.interactions.create({
            model: 'gemini-3.5-flash',
            input: prompt});

            return {
                answer: interaction.output_text
            };
        } catch (err) {
            throw new InternalServerErrorException('Failed to communicate with Gemini API');            
        }
    }
}
