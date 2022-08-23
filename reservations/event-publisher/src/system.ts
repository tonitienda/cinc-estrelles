import * as db from "./tools/db-client";
import * as broker from "./tools/broker";
import { PoolClient } from "pg";

export type SystemDependencies = {
  dbClient: {
    queryOne: (statement: string, params: any[]) => Promise<any>;
    onNotification: (
      listener: (message: { channel: string; payload: string | null }) => void
    ) => void;
  };
  broker: {
    publish: (topic: string, data: object) => void;
  };
};

export const connect = async (): Promise<SystemDependencies> => {
  // Bootstrapping the actual dependencies for all commands
  // The type of the dependencies for the commands are defined on each command
  // Here we will need all the dependencies. If something is missing or
  // the types do not match between the provided and the expected dependencies
  // the compiler will complain about it
  const dbClient = await db.connectClient();
  console.log(`\t💾 DB connected`);

  const messageBroker = await broker.start();
  console.log(`\t✉️ Message broker connected`);

  return {
    dbClient,
    broker: messageBroker,
  };
};
