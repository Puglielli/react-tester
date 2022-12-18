import { generatePayload } from '../common/GeneratePayload';
import { request, RequestProps, ResponseError } from '../config/Client';
import { ClusterDTO } from './dto/ClusterDTO';
import { TopicDTO } from './dto/TopicDTO';
import { SchemaDTO } from './dto/SchemaDTO';
import { capitalize } from '../common/StringUtils';
import { VersionDTO } from './dto/VersionDTO';
import { isJson } from '../common/JsonUtils';

export const getClusters = async (): Promise<Array<ClusterDTO>> => {
  const response = await request('/clusters');

  return response.map((name: string) => new ClusterDTO(name, capitalize(name)));
};

export const getTopicNames = async (
  cluster: string
): Promise<Array<TopicDTO>> => {
  const response = await request(`/topics/${cluster}`);

  return response.map((name: string) => new TopicDTO(name));
};

export const getSchemaNames = async (
  topicName: string
): Promise<Array<SchemaDTO>> => {
  const response = await request(`/schemas/${topicName}`);

  if (response instanceof ResponseError) throw response;

  return (
    response?.map(
      (name: string) => new SchemaDTO(name, undefined, undefined)
    ) ?? []
  );
};

export const getSchemaAvro = async (
  topicName: string,
  schemaName: string,
  version: string
): Promise<SchemaDTO> => {
  try {
    const schema = await request(
      `/schemas/${topicName}/${schemaName}/${version}`
    );

    const avro = JSON.stringify(schema, undefined, 2);

    const avroData = JSON.stringify(generatePayload(schema), undefined, 2);

    return new SchemaDTO(schemaName, avro, avroData);
  } catch (err) {
    throw new ResponseError('Error found!', err);
  }
};

export const getVersions = async (
  topicName: string,
  schemaName: string
): Promise<Array<VersionDTO>> => {
  try {
    const response = await request(
      `/schemas/${topicName}/${schemaName}/versions`
    );

    const versions = response.toString().split(',');

    return versions.map((version: string) => new VersionDTO(version));
  } catch (err) {
    throw new ResponseError('Error found!', err);
  }
};

export const sendEvent = async (data: any): Promise<any> => {
  try {
    const requestProps = new RequestProps(data, 'POST');
    const response = await request(`/send`, requestProps);

    return isJson(response) ? JSON.parse(response) : response;
  } catch (err) {
    throw new ResponseError('Error found!', err);
  }
};
