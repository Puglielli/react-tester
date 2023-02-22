import { generatePayload } from '../common/GeneratePayload';
import { request, RequestProps, ResponseError } from '../config/Client';
import { ClusterDTO } from './dto/ClusterDTO';
import { SchemaDTO } from './dto/SchemaDTO';
import { capitalize } from '../common/StringUtils';
import { isJson } from '../common/JsonUtils';
import { ResponseDTO } from './dto/ResponseDTO';

export const getClusters = async (): Promise<Array<ClusterDTO>> => {
  const response = await request('/clusters');

  return response.map(
    (cluster: any) => new ClusterDTO(cluster.id, capitalize(cluster.name))
  );
};

export const getTopicAndSchemas = async (cluster: ClusterDTO): Promise<any> => {
  return await request(`/topics-with-schemas/${cluster.id}`);
};

export const getSchemaAvro = async (
  cluster: ClusterDTO,
  topic: string,
  schemaName: string,
  version: string
): Promise<SchemaDTO> => {
  try {
    const response = await request(
      `/schemas/${cluster.id}/${topic}/${schemaName}/${version}`
    );

    const schema = JSON.parse(response.schema);

    const schemaBeautify = JSON.stringify(schema, undefined, 2);

    const avro = JSON.stringify(generatePayload(schema), undefined, 2);

    return new SchemaDTO(schemaName, schemaBeautify, avro);
  } catch (err) {
    throw new ResponseError('Error found!', err);
  }
};

export const getVersions = async (
  cluster: ClusterDTO,
  topicName: string,
  schemaName: string
): Promise<Array<number>> => {
  try {
    return await request(
      `/schemas/${cluster.id}/${topicName}/${schemaName}/versions`
    );
  } catch (err) {
    throw new ResponseError('Error found!', err);
  }
};

export const sendEvent = async (data: any): Promise<ResponseDTO> => {
  try {
    const requestProps = new RequestProps(data, 'POST');
    const response = await request(`/send`, requestProps);

    return new ResponseDTO(
      response.key,
      isJson(response.record) ? JSON.parse(response.record) : response.record,
      response.headers,
      response.metadata
    );
  } catch (err) {
    throw new ResponseError('Error found!', err);
  }
};
