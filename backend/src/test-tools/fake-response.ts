const DefaultResponseData = {
  status: -1,
  body: null,
};

export const FakeResponse = () => {
  let status = -1;
  let body: any = null;

  const response = {
    get: () => {
      return {
        status,
        body,
      };
    },
    status: (s: number) => {
      status = s;
      return response;
    },
    send: (b: any) => {
      body = b;
      return response;
    },
    json: (b: unknown) => {
      body = b;
      return response;
    },
    end: () => {},
  };

  return response;
};
