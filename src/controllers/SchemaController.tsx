import { generatePayload } from '../presentation/pages/Endpoints/GeneratePayload';
import { get, Response, ResponseError } from '../config/Client';

export const getSchemasByName = async (name: string): Promise<Response> => {
  if (name.length < 1) throw new ResponseError('Variable name null ou blank!');

  try {
    const response = await get(`/schema/${name}`);

    const schema = response.data;
    const schemaJson = JSON.stringify(schema, undefined, 2);

    const payload = generatePayload(schema);
    const payloadJson = JSON.stringify(payload, undefined, 2);

    return {
      data: {
        schema: schemaJson,
        payload: payloadJson
      }
    };
  } catch (err) {
    throw new ResponseError('Error found!', err);
  }
};

export const getSchemasByTopic = async (name: string): Promise<Response> => {
  if (name.length < 1) throw new ResponseError('Variable name null ou blank!');

  try {
    const response = await get(`/schema/topic/${name}`);

    return { data: { schemas: response.data } };
  } catch (err) {
    throw new ResponseError('Error found!', err);
  }
};
