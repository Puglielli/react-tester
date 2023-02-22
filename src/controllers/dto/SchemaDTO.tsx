export class SchemaDTO {
  name: string;
  schema?: string;
  avro?: string;

  constructor(name: string, schema?: string, avro?: string) {
    this.name = name;
    this.schema = schema;
    this.avro = avro;
  }
}
