/* eslint-disable @typescript-eslint/no-non-null-assertion */

import Baserow, {
  BaserowListResponse,
  BaserowRecord,
  BaserowTable,
} from '../Baserow';

interface Item {
  id: number;
  Name: string;
  Age: number;
}

const mockResponse: BaserowListResponse<Item> = {
  count: 1,
  next: null,
  previous: null,
  results: [
    { id: 1, Name: 'John Doe', Age: 25 },
    { id: 2, Name: 'Jane Doe', Age: 24 },
    { id: 3, Name: 'John Smith', Age: 30 },
  ],
};
describe('BaserowRecord', () => {
  // Create a mock record for testing
  const mockRecord = {
    id: 123,
    Name: 'John Doe',
    Age: 25,
  };

  // Create an instance of BaserowRecord using the mock record
  const baserowRecord = new BaserowRecord<Item>(mockRecord);

  test('should return the correct ID', () => {
    expect(baserowRecord.getID()).toBe(123);
  });

  test('should return the correct string value for a given key', () => {
    expect(baserowRecord.getStringValue('Name')).toBe('John Doe');
  });

  test('should return the correct number value for a given key', () => {
    expect(baserowRecord.getNumberValue('Age')).toBe(25);
  });
});

describe('BaserowTable', () => {
  const baserow: Baserow = new Baserow({ apiKey: 'api-key' });
  const baserowTable: BaserowTable<Item> = baserow.table<Item>(123);
  const unmockedFetch = global.fetch;

  afterEach(() => {
    global.fetch = unmockedFetch;
  });

  test('should return the correct table data', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      });
    });

    const result = await baserowTable.list();
    expect(result).toEqual([
      new BaserowRecord(mockResponse.results[0]!),
      new BaserowRecord(mockResponse.results[1]!),
      new BaserowRecord(mockResponse.results[2]!),
    ]);
  });

  test('should return the correct data for get function', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        json: () => Promise.resolve(mockResponse.results[0]),
      });
    });
    const result = await baserowTable.get(1);
    expect(result).toEqual(new BaserowRecord(mockResponse.results[0]!));
    expect(result.getID()).toEqual(1);
    expect(result.getStringValue('Name')).toEqual('John Doe');
    expect(result.getNumberValue('Age')).toEqual(25);
  });

  test('should create a new record', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        json: () => Promise.resolve(mockResponse.results[1]),
      });
    });
    const result = await baserowTable.create({ Name: 'Jane Doe', Age: 24 });
    expect(result).toEqual(new BaserowRecord(mockResponse.results[1]!));
    expect(result.getID()).toEqual(2);
    expect(result.getStringValue('Name')).toEqual('Jane Doe');
    expect(result.getNumberValue('Age')).toEqual(24);
  });

  test('should update a record', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        json: () => Promise.resolve({ id: 3, Name: 'Jane Doe', Age: 26 }),
      });
    });
    const result = await baserowTable.update(3, {
      id: 3,
      Name: 'Jane Doe',
      Age: 26,
    });
    expect(result).toEqual(
      new BaserowRecord({ id: 3, Name: 'Jane Doe', Age: 26 })
    );
    expect(result.getID()).toEqual(3);
    expect(result.getStringValue('Name')).toEqual('Jane Doe');
    expect(result.getNumberValue('Age')).toEqual(26);
  });

  test('should update a record with partial data', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        json: () => Promise.resolve({ id: 3, Name: 'Jane Doe Doe', Age: 26 }),
      });
    });
    const result = await baserowTable.update(3, { Name: 'Jane Doe Doe' });
    expect(result).toEqual(
      new BaserowRecord({ id: 3, Name: 'Jane Doe Doe', Age: 26 })
    );
    expect(result.getID()).toEqual(3);
    expect(result.getStringValue('Name')).toEqual('Jane Doe Doe');
    expect(result.getNumberValue('Age')).toEqual(26);
  });

  test('should move record', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        json: () => Promise.resolve({ id: 4, Name: 'Jane Smith', Age: 29 }),
      });
    });
    const result = await baserowTable.move(4, 1);
    expect(result).toEqual(
      new BaserowRecord({ id: 4, Name: 'Jane Smith', Age: 29 })
    );
    expect(result.getID()).toEqual(4);
    expect(result.getStringValue('Name')).toEqual('Jane Smith');
    expect(result.getNumberValue('Age')).toEqual(29);
  });

  test('should delete a record', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        json: () => Promise.resolve(mockResponse.results[1]!),
      });
    });
    const result = await baserowTable.delete(3);
    expect(result).toEqual(new BaserowRecord(mockResponse.results[1]!));
  });
});

describe('Baserow', () => {
  describe('init with default params', () => {
    const baserow = new Baserow({
      apiKey: 'api-key',
    });

    test('should set the correct default params', () => {
      expect(baserow.apiKey).toBe('api-key');
      expect(baserow.showUserFieldNames).toBe(true);
    });
  });

  describe('init with params', () => {
    const baserow = new Baserow({
      apiKey: 'api-key',
      showUserFieldNames: false,
    });

    test('should set the correct default params', () => {
      expect(baserow.apiKey).toBe('api-key');
      expect(baserow.showUserFieldNames).toBe(false);
    });
  });
});
