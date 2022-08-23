import { connect as natsConnect, JSONCodec, NatsConnection } from "nats";

// TODO - Move this to env var
const NATS_SERVER_URL = "broker:4222";

type Broker = {
  publish: (topic: string, data: any) => void;
};

//TODO -  This is just used for Tracing start will not be required in the future
const traceEvents = async (nc: NatsConnection) => {
  const jsonCodec = JSONCodec();
  const reservationEvents = nc.subscribe("reservation_events");

  for await (let m of reservationEvents) {
    console.log(
      `[${reservationEvents.getProcessed()}]`,
      jsonCodec.decode(m.data)
    );
  }
  console.log("subscription closed");
};

// TODO - Use singleton so only one connection is established for the whole service
export const connect = async (): Promise<Broker> => {
  const jsonCodec = JSONCodec();
  const nc = await natsConnect({ servers: NATS_SERVER_URL });

  traceEvents(nc);

  return {
    publish: (topic: string, data: object): void => {
      nc.publish(topic, jsonCodec.encode(data));
    },
  };
};
