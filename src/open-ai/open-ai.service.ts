import { Injectable } from '@nestjs/common';
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

  async getJournalByAI(interview: object[]) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    const openai = new OpenAI({ apiKey });

    const CalendarEvent = z.object({
      title: z.string(),
      keyword: z.array(z.string()),
      content: z.string(),
    });

    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'write a journal, based on user interview, The journal should have  1 paragraph',
        },
        {
          role: 'user',
          content: `${interview}`,
        },
      ],
      response_format: zodResponseFormat(CalendarEvent, 'event'),
    });

    const event: Journal = completion.choices[0].message.parsed;

    return event;
  }
}
