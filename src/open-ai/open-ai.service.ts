import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { ConfigService } from '@nestjs/config';

export interface Journal {
  title?: string;
  keyword?: string[];
  content?: string;
}

@Injectable()
export class OpenAiService {
  constructor(private readonly configService: ConfigService) {}

  async getJournalByAI(interview: object[], instruction: string) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('OpenAI API key is not configured.');
    }

    const openai = new OpenAI({ apiKey });

    const CalendarEvent = z.object({
      title: z.string(),
      keyword: z.array(z.string()),
      content: z.string(),
    });

    try {
      const completion = await openai.beta.chat.completions.parse({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: instruction,
          },
          {
            role: 'user',
            content: JSON.stringify(interview),
          },
        ],
        response_format: zodResponseFormat(CalendarEvent, 'event'),
      });

      if (!completion.choices || !completion.choices[0] || !completion.choices[0].message.parsed) {
        throw new Error('Unexpected OpenAI response format.');
      }

      const event: Journal = completion.choices[0].message.parsed;
      return event;
    } catch (error) {
      throw new Error(`OpenAI API request failed: ${error.message}`);
    }
  }
}
