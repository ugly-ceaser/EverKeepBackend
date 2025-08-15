export const mockPrisma = {
  user: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  contact: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  vault: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  vaultEntry: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  vaultRecipient: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  notification: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
};

jest.mock('../../config/database', () => ({
  prisma: mockPrisma,
})); 