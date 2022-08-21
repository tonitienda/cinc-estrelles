import * as db from "./tools/db-client";
import * as broker from "./tools/broker";

export type SystemDependencies = {
  dbClient: {
    query: (statement: string, params: any[]) => any;
    executeTransaction: (
      statements: { statement: string; params: any[] }[]
    ) => Promise<void>;
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
  const dbClient = db.connectClient();
  console.log(`\t💾 DB connected`);

  const messageBroker = await broker.start();
  console.log(`\t✉️ Message broker connected`);

  return {
    dbClient,
    broker: messageBroker,
  };
};
