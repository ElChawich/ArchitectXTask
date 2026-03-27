const store: Record<string, string> = {};

const mockInstance = {
  getString: jest.fn((key: string) => store[key]),
  set: jest.fn((key: string, value: string) => {
    store[key] = value;
  }),
  remove: jest.fn((key: string) => {
    delete store[key];
  }),
};

export const createMMKV = jest.fn(() => mockInstance);
