export declare interface IParamsId {
  id: string;
}

export declare interface IPaginationRequest {
  limit: number;
  page: number;
}

export declare interface IPaginatedResponse<T> {
  count: number;
  rows: T[];
}
