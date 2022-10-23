export class SchemaDTO {
  name: string;
  avro?: string;
  data?: string;

  constructor(name: string, avro?: string, data?: string) {
    this.name = name;
    this.avro = avro;
    this.data = data;
  }
}
