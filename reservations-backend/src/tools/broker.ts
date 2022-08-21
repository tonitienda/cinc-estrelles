import { connect, JSONCodec } from "nats";

// TODO - Move this to env var
const NATS_SERVER_URL = "broker:4222";

type Broker = {
  publish: (topic: string, data: any) => void;
};

// TODO - Use singleton so only one connection is established for the whole service
export const start = async (): Promise<Broker> => {
  const nc = await connect({ servers: NATS_SERVER_URL });

  const jsonCodec = JSONCodec();

  return {
    publish: (topic: string, data: object): void => {
      nc.publish(topic, jsonCodec.encode(data));
    },
  };
};
