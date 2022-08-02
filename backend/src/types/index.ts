import { BusinessError } from "../errors";

type ResourceId = { id: string };
export type Command = (
  input: unknown
) => [null | ResourceId, BusinessError | null];

export type Query<TResult> = (
  input: unknown
) => [TResult | null, BusinessError | null];

export type Request = {
  body?: unknown;
  query?: unknown;
};

export type Response = {
  status: (status: number) => Response;
  end: () => void;
  send: (data: any) => Response;
  json: (data: any) => Response;
};