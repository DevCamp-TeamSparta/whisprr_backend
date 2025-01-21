export const mockInstructionService = {
  getInstruction: jest.fn(),
};

export const mockInstruction = { id: 1, target: 'interview', content: 'Some instructions' };

export const mockInstructionRepository = {
  findOne: jest.fn(),
};
