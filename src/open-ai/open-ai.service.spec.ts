import { Test, TestingModule } from '@nestjs/testing';
import { OpenAiService } from './open-ai.service';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('openai', () => {
  const mockParse = jest.fn().mockResolvedValue({
    choices: [
      {
        message: {
          parsed: {
            title: 'Generated Title',
            keyword: ['test', 'journal'],
            content: 'Generated content',
          },
        },
      },
    ],
  });

  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      beta: {
        chat: {
          completions: {
            parse: mockParse,
          },
        },
      },
    })),
    mockParse,
  };
});

describe('OpenAiService', () => {
  let openAiService: OpenAiService;
  let configService: ConfigService;
  const mockApiKey = 'mock-api-key';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenAiService,
        { provide: ConfigService, useValue: { get: jest.fn(() => mockApiKey) } },
      ],
    }).compile();

    openAiService = module.get<OpenAiService>(OpenAiService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('저널을 생성하고 반환한다.', async () => {
    const mockInstruction = 'Generate a journal.';
    const mockInterview = ['Question 1', 'Answer 1'];
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { mockParse } = require('openai');

    const result = await openAiService.getJournalByAI(mockInterview, mockInstruction);

    expect(configService.get).toHaveBeenCalledWith('OPENAI_API_KEY');
    expect(mockParse).toHaveBeenCalledWith({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: mockInstruction },
        { role: 'user', content: JSON.stringify(mockInterview) },
      ],
      response_format: expect.anything(),
    });
    expect(result).toEqual({
      title: 'Generated Title',
      keyword: ['test', 'journal'],
      content: 'Generated content',
    });
  });

  it('API 키를 불러 오는데 실패하면  nternalServerErrorException를 반환한다.', async () => {
    jest.spyOn(configService, 'get').mockReturnValueOnce(null);

    await expect(openAiService.getJournalByAI([], 'Generate a journal.')).rejects.toThrow(
      InternalServerErrorException,
    );

    expect(configService.get).toHaveBeenCalledWith('OPENAI_API_KEY');
  });

  it('저널 생성에 실패하면 에러를 반환한다.', async () => {
    const mockInstruction = 'Generate a journal.';
    const mockInterview = ['Question 1', 'Answer 1'];
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { mockParse } = require('openai');

    mockParse.mockRejectedValueOnce(new Error('API error'));

    await expect(openAiService.getJournalByAI(mockInterview, mockInstruction)).rejects.toThrow(
      'OpenAI API request failed: API error',
    );

    expect(mockParse).toHaveBeenCalledWith({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: mockInstruction },
        { role: 'user', content: JSON.stringify(mockInterview) },
      ],
      response_format: expect.anything(),
    });
  });
});
