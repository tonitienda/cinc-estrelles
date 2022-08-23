import { connect as natsConnect, JSONCodec, NatsConnection } from "nats";

// TODO - Move this to env var
const NATS_SERVER_URL = "broker:4222";

type Broker = {
  subscribe: (
    topic: string,
    callback: (topic: string, data: any) => void
  ) => void;
  close: () => void;
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
  const nc = await natsConnect({ servers: NATS_SERVER_URL });

  traceEvents(nc);

  return {
    subscribe: async (
      topic: string,
      callback: (topic: string, data: any) => void
    ) => {
      const jsonCodec = JSONCodec();
      const events = nc.subscribe(topic);

      for await (let m of events) {
        callback(m.subject, jsonCodec.decode(m.data));
      }
      console.log("subscription closed");
    },
    close: () => nc.close(),
  };
};
