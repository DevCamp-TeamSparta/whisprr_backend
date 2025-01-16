import { ConfigService } from '@nestjs/config';
export interface Journal {
    title?: string;
    keyword?: string[];
    content?: string;
}
export declare class OpenAiService {
    private readonly configService;
    constructor(configService: ConfigService);
    getJournalByAI(interview: object[]): Promise<Journal>;
}
