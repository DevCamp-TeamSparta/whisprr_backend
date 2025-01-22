import { Test, TestingModule } from '@nestjs/testing';
import { OpenAiService } from './open-ai.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      beta: {
        chat: {
          completions: {
            parse: jest.fn(),
          },
        },
      },
    })),
  };
});

describe('OpenAiService', () => {
  let openAiService: OpenAiService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockOpenAI = {
    beta: {
      chat: {
        completions: {
          parse: jest.fn(),
        },
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenAiService, { provide: ConfigService, useValue: mockConfigService }],
    }).compile();

    openAiService = module.get<OpenAiService>(OpenAiService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // it('정상적으로 AI로부터 Journal 데이터를 받아온다.', async () => {
  //   const mockInstruction = 'Generate a journal.';
  //   const mockInterview = ['Question 1', 'Answer 1'];
  //   const mockResponse = {
  //     choices: [
  //       {
  //         message: {
  //           parsed: {
  //             title: 'Generated Title',
  //             keyword: ['test', 'journal'],
  //             content: 'Generated content',
  //           },
  //         },
  //       },
  //     ],
  //   };

  //   mockConfigService.get.mockReturnValue('mock-api-key');
  //   mockOpenAI.beta.chat.completions.parse.mockResolvedValue(mockResponse);

  //   const result = await openAiService.getJournalByAI(mockInterview, mockInstruction);

  //   expect(mockConfigService.get).toHaveBeenCalledWith('OPENAI_API_KEY');
  //   expect(mockOpenAI.beta.chat.completions.parse).toHaveBeenCalledWith({
  //     model: 'gpt-4o-mini',
  //     messages: [
  //       { role: 'system', content: mockInstruction },
  //       { role: 'user', content: JSON.stringify(mockInterview) },
  //     ],
  //     response_format: expect.any(Function), // zodResponseFormat 검증
  //   });
  //   expect(result).toEqual({
  //     title: 'Generated Title',
  //     keyword: ['test', 'journal'],
  //     content: 'Generated content',
  //   });
  // });

  it('API 키가 없을 경우 InternalServerErrorException을 던진다.', async () => {
    mockConfigService.get.mockReturnValue(null);

    await expect(openAiService.getJournalByAI([], 'Generate a journal.')).rejects.toThrow(
      InternalServerErrorException,
    );

    expect(mockConfigService.get).toHaveBeenCalledWith('OPENAI_API_KEY');
  });
});
