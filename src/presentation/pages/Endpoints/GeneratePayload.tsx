const typeOf = (obj: any, match: string) =>
  equals(Object.prototype.toString.call(obj).toLowerCase(), `object ${match}`);
const equals = (obj: any, match: string) =>
  obj.toString().match(match)?.length > 0 ?? false;

const addObject = (key: string, field: any): any => {
  if (typeOf(field, 'array')) {
    const obj: any = {};
    field.forEach((item: any) => (obj[item.name] = addObject(item.name, item)));
    return obj;
  }

  if (equals(field?.type?.type ?? field.type, 'record')) {
    return addObject(field.name, field.fields ?? field.type);
  }

  if (equals(field.type, 'string')) return field.default ?? '';
  if (equals(field.type, 'long|double')) return field.default ?? 1.0;
  if (equals(field.type, 'int')) return field.default ?? 1;
  if (equals(field.type, 'enum')) return field.default ?? field.symbols[0];
  if (equals(field.type, 'boolean')) return field.default ?? false;
  if (equals(field.type, 'map')) return field.default ?? {};
  if (equals(field.type, 'array'))
    return [addObject(field.name ?? key, field.items)];

  if (equals(field.type, 'object')) {
    if (Array.isArray(field.type)) {
      let obj = {};
      field.type.forEach((objectField: any) => {
        if (equals(objectField, 'object'))
          obj = addObject(field.name ?? key, objectField);
      });
      return obj;
    } else {
      return addObject(field.name, field.type);
    }
  }

  console.error({ data: field, message: 'Error Field' });
};

export const generatePayload = (schema: any) => {
  const json: any = {};
  schema.fields.forEach(
    (field: any) => (json[field.name] = addObject(field.name, field))
  );
  return json;
};
