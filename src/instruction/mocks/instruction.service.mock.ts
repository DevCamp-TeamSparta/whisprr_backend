export const mockInstructionService = {
  getInstruction: jest.fn(),
};

export const mockInstruction = { id: 1, target: 'interview', content: 'Some instructions' };

export const mockJournalInstruction = { id: 2, target: 'journal', content: 'Some instructions' };

export const mockInstructionRepository = {
  findOne: jest.fn(),
};
