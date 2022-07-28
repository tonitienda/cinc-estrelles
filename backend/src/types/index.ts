import { BusinessError } from "../errors";

export type Command = (input: unknown) => [null, BusinessError | null];

export type Query<TResult> = (
  input: unknown
) => [TResult | null, BusinessError | null];

export type Request = {
  body: unknown;
};

export type Response = {
  status: (status: number) => Response;
  end: () => void;
  send: (data: any) => Response;
};
