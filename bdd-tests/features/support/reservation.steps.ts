import { When, Then } from "@cucumber/cucumber";
import axios from "axios";
import { strict as assert } from "assert";

// TODO - See this. State should be initialized before every test runs
//        and should not be shared to allow paralel execution
let world: any = {};

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
        "http://backend:3000/import-reservation",
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

  const requestUrl = `http://backend:3000/reservations/${reservationId}`;

  const result = await axios.get(requestUrl);

  assert.strictEqual(result.status, 200);
});

Then("the status2 should be {int}", (status) => {
  assert.strictEqual(world.result.status, status);
});
