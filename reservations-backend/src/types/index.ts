import { BusinessError } from "../errors";

export type ResourceId = { id: string };

export type Command = (
  input: any
) => Promise<[null | ResourceId, BusinessError | null]>;

export type Query<TResult> = (
  input: any
) => Promise<[TResult | null, BusinessError | null]>;

export type Request = {
  body?: any;
  query?: any;
};

export type Response = {
  status: (status: number) => Response;
  end: () => void;
  send: (data: any) => Response;
  json: (data: any) => Response;
};
