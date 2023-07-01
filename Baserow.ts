export type BaserowRecordType<Item> = Item & { id: number };

export interface BaserowListResponse<Item> {
  count: number;
  next: null | string;
  previous: null | string;
  results: BaserowRecordType<Item>[];
}

export interface BaserowListParams<Item> {
  page?: number;
  size?: number;
  search?: string;
  orderBy?: keyof BaserowRecordType<Item>;
  orderDir?: 'ASC' | 'DESC';
}

interface BaserowCreateParams {
  page?: number;
  size?: number;
  search?: string;
  orderBy?: string | number | symbol;
  orderDir?: 'ASC' | 'DESC';
}

export class BaserowRecord<Item> {
  private readonly record: BaserowRecordType<Item>;

  constructor(record: BaserowRecordType<Item>) {
    this.record = record;
  }

  public getID(): number {
    return this.record['id'];
  }

  public getStringValue(key: keyof Item): string {
    return this.record[key] as string;
  }

  public getNumberValue(key: keyof Item): number {
    return parseFloat(this.record[key] as string);
  }
}

export class BaserowTable<Item> {
  private baserow: Baserow;

  private readonly tableID: number;

  private apiUrl = 'https://api.baserow.io/api/database/rows/table/';
  constructor(baserow: Baserow, { tableID }: { tableID: number }) {
    this.baserow = baserow;
    this.tableID = tableID;
  }

  private getQueryParams({
    page = 1,
    size = 100,
    search = '',
    orderBy = 'id',
    orderDir = 'ASC',
  }: BaserowCreateParams): string {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    params.append(
      'user_field_names',
      this.baserow.showUserFieldNames.toString()
    );
    params.append('search', search);
    if (typeof orderBy !== 'symbol') {
      params.append('order_by', `${orderDir === 'ASC' ? '+' : '-'}${orderBy}`);
    }
    return params.toString();
  }

  public async list(
    params: BaserowListParams<Item> = {}
  ): Promise<BaserowRecord<Item>[]> {
    const response: Response = await fetch(
      `${this.apiUrl}${this.tableID}/?${this.getQueryParams(params)}`,
      {
        method: 'GET',
        headers: { Authorization: `Token ${this.baserow.apiKey}` },
      }
    );
    const data = (await response.json()) as BaserowListResponse<Item>;
    return data.results.map((item) => new BaserowRecord<Item>(item));
  }

  public async get(id: number): Promise<BaserowRecord<Item>> {
    const response: Response = await fetch(
      `${this.apiUrl}${this.tableID}/${id}/?user_field_names=${this.baserow.showUserFieldNames}`,
      {
        method: 'GET',
        headers: { Authorization: `Token ${this.baserow.apiKey}` },
      }
    );
    const data = (await response.json()) as BaserowRecordType<Item>;
    return new BaserowRecord<Item>(data);
  }

  public async create(
    fields: Record<
      keyof Item,
      string | number | Array<number | string> | undefined | boolean
    >
  ): Promise<BaserowRecord<Item>> {
    const response: Response = await fetch(
      `${this.apiUrl}${this.tableID}/?user_field_names=${this.baserow.showUserFieldNames}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${this.baserow.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fields),
      }
    );
    const data = (await response.json()) as BaserowRecordType<Item>;
    return new BaserowRecord<Item>(data);
  }

  public async update(
    id: number,
    fields: Record<
      keyof Item,
      string | number | Array<number | string> | undefined | boolean
    >
  ): Promise<BaserowRecord<Item>> {
    const response: Response = await fetch(
      `${this.apiUrl}${this.tableID}/${id}/?user_field_names=${this.baserow.showUserFieldNames}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Token ${this.baserow.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fields),
      }
    );
    const data = (await response.json()) as BaserowRecordType<Item>;
    return new BaserowRecord<Item>(data);
  }

  public async move(
    id: number,
    beforeId: number
  ): Promise<BaserowRecord<Item>> {
    const response: Response = await fetch(
      `${this.apiUrl}${this.tableID}/${id}/move/?user_field_names=${this.baserow.showUserFieldNames}&before_id=${beforeId}`,
      {
        method: 'PATCH',
        headers: { Authorization: `Token ${this.baserow.apiKey}` },
      }
    );
    const data = (await response.json()) as BaserowRecordType<Item>;
    return new BaserowRecord<Item>(data);
  }

  public async delete(id: number): Promise<BaserowRecord<Item>> {
    const response: Response = await fetch(
      `${this.apiUrl}${this.tableID}/${id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Token ${this.baserow.apiKey}` },
      }
    );
    const data = (await response.json()) as BaserowRecordType<Item>;
    return new BaserowRecord<Item>(data);
  }
}

class Baserow {
  private readonly API_KEY: string;

  private readonly SHOW_USER_FIELD_NAMES: boolean;

  constructor({
    apiKey,
    showUserFieldNames = true,
  }: {
    apiKey?: string;
    showUserFieldNames?: boolean;
  }) {
    if (!apiKey) {
      throw new Error('Cant create Baserow instance without apiKey');
    }
    this.API_KEY = apiKey;
    this.SHOW_USER_FIELD_NAMES = showUserFieldNames;
  }

  get apiKey(): string {
    return this.API_KEY;
  }

  get showUserFieldNames(): boolean {
    return this.SHOW_USER_FIELD_NAMES;
  }

  public table<Item>(tableID: number): BaserowTable<Item> {
    return new BaserowTable<Item>(this, { tableID });
  }
}

export default Baserow;
