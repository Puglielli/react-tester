export class ResponseDTO {
  key: string;
  record: string;
  headers: Map<string, any>;
  metadata: Map<string, any>;

  constructor(
    key: string,
    record: string,
    headers: Map<string, any>,
    metadata: Map<string, any>
  ) {
    this.key = key;
    this.record = record;
    this.headers = headers;
    this.metadata = metadata;
  }
}
