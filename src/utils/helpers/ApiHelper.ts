export type GatewayPathResponse = {
  host: string;
  DEVELOPER_ID: string;
  SCOPE_ID: string;
};

export const readGatewayPath = (path: string): GatewayPathResponse => {
  // console.log(path);

  const data = path.split('/gateway/default/');
  // console.log(data);
  if (data?.length !== 2) {
    throw new Error('invalid input');
  }

  const params = data[1].split(/\/|\\$/);

  if (params?.length < 2) {
    throw new Error('invalid input');
  }

  return {
    host: data[0],
    DEVELOPER_ID: params[0],
    SCOPE_ID: params[1],
  };
};
