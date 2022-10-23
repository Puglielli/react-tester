const HOSTNAME = process.env.HOSTNAME ?? 'http://localhost:9091';
const PATH_BASE = process.env.PATH_BASE ?? '/api/v1';
const buildUrl = (path: string): URL =>
  new URL(`${PATH_BASE}${path}`, HOSTNAME);

export class ResponseError extends Error {
  constructor(msg: string, err?: any) {
    super(msg, err);

    Object.setPrototypeOf(this, ResponseError.prototype);
  }
}

type HTTP_METHODS = 'GET' | 'POST';

export class RequestProps {
  body: any;
  method: HTTP_METHODS;
  headers: any;
  options: any[];

  constructor(
    body: any = '',
    method: HTTP_METHODS = 'GET',
    headers: any = '',
    options: any[] = []
  ) {
    this.method = method;
    this.body = body;
    this.headers = headers;
    this.options = options;
  }

  build = () => {
    return {
      method: this.method,
      body: this.method === 'GET' ? undefined : this.body,
      headers: { 'Content-Type': 'application/json', ...this.headers },
      ...this.options
    };
  };
}

export const request = async (
  path: string,
  props: RequestProps = new RequestProps()
): Promise<any> => {
  try {
    const response = await fetch(buildUrl(path).href, props.build());

    return response.ok ? await response.json() : await Promise.reject(response);
  } catch (err) {
    throw new ResponseError('communication client error', err);
  }
};

// export const getAsync = (
//   path: string,
//   props: RequestProps = new RequestProps()
// ): any => {
//   return fetch(buildUrl(path).href, props.build())
//     .then((res) => (res.ok ? res.json() : Promise.reject(res)))
//     .then((res) => res)
//     .catch((err) => console.error(`Client communication error: ${err}`));
// };
