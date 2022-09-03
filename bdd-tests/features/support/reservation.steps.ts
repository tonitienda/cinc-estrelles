import { When, Then, Before, BeforeAll, AfterAll } from "@cucumber/cucumber";
import axios from "axios";
import { strict as assert } from "assert";
import * as broker from "./tools/broker";

type World = {
  events: { topic: string; data: any }[];
  // TODO : Define type
  result: any | null;
  broker: any;
};

let world: World = { events: [], result: null, broker: null };

BeforeAll(async () => {
  world = {
    events: [],
    result: null,
    broker: null,
  };

  world.broker = await broker.connect();

  world.broker.subscribe("reservation_events", (topic: string, data: any) => {
    world.events.push({ topic, data });
  });
});

Before(async () => {
  world.events = [];
  world.result = null;
});

AfterAll(() => {
  return world.broker.close();
});

const ignored = (str: string) => str === "<ignore>";
const tryNumber = (str: string) => {
  let number = Number(str);

  if (isNaN(number)) {
    return str;
  }
  return number;
};

When(
  "the client requests a reservation with {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}",
  async (
    customerEmail,
    customerName,
    checkin,
    checkout,
    numAdults,
    numChildren,
    roomType,
    specialRequests,
    origin,
    reservationId
  ) => {
    const data = {
      ...(ignored(customerEmail) ? {} : { customerEmail }),
      ...(ignored(customerName) ? {} : { customerName }),
      ...(ignored(checkin) ? {} : { checkin }),
      ...(ignored(checkout) ? {} : { checkout }),
      ...(ignored(numAdults) ? {} : { numAdults: tryNumber(numAdults) }),
      ...(ignored(numChildren) ? {} : { numChildren: tryNumber(numChildren) }),
      ...(ignored(roomType) ? {} : { roomType }),
      ...(ignored(specialRequests) ? {} : { specialRequests }),
      source: {
        ...(ignored(origin) ? {} : { origin }),
        ...(ignored(reservationId) ? {} : { reservationId }),
      },
    };

    try {
      const result = await axios.post(
        "http://reservations-backend:3000/import-reservation",
        data
      );
      world.result = result;
    } catch (error: any) {
      world.result = error.response;
      throw error;
    }
  }
);

Then("the reservation should be found", async () => {
  const reservationId = world.result.data.id;
  console.log("id:", reservationId);

  const requestUrl = `http://reservations-backend:3000/reservations/${reservationId}`;

  const result = await axios.get(requestUrl);

  assert.strictEqual(result.status, 200);
});

Then("the status2 should be {int}", (status) => {
  assert.strictEqual(world.result.status, status);
});

Then("the reservation event should have been received", () => {
  const reservationId = world.result.data.id;
  const event = world.events.filter(
    (e) => e.topic === "reservation_events" && e.data.body.id === reservationId
  );

  assert(!!event);
});

Then("the reservation request event should have been received", () => {
  const reservationId = world.result.data.id;
  const event = world.events.filter(
    (e) =>
      e.topic === "reservation_request_events" &&
      e.data.body.id === reservationId
  );

  assert(!!event);
});
