export const mockReportRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

export const mockReportService = {
  createReport: jest.fn(),
  getAllReport: jest.fn(),
  getUserReport: jest.fn(),
  getReportById: jest.fn(),
};
