export type QueryParams = {
  querystring?: { [x: string]: any };
  case?: string;
  path?: string;
};

export interface BaseRepository<T> {
  getAll(queryParams?: QueryParams): Promise<T[]>;
}

export interface BaseGetAllRepository<T> {
  getAll(queryParams?: QueryParams): Promise<T[]>;
}

export interface BaseFindOneRepository<T> {
  findOne(queryParams?: QueryParams): Promise<T>;
}

export interface BaseRemoveRepository<T> {
  remove(item: T): Promise<T>;
}

export interface BaseSaveRepository<T> {
  save(item: T): Promise<T>;
}

export interface BaseDeleteRepository<T> {
  delete(item: T): Promise<T>;
}
