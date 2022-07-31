import { When, Then } from "@cucumber/cucumber";
import axios from "axios";
import { strict as assert } from "assert";

// TODO - See this. State should be initialized before every test runs
//        and should not be shared to allow paralel execution
let world: any = {};

const ignored = (str: string) => str === "<ignore>";

When(
  "the client requests a reservation with {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}",
  async (
    customerEmail,
    customerName,
    checkin,
    checkout,
    numAdults,
    numChildren,
    roomType,
    specialRequests
  ) => {
    const data = {
      ...(ignored(customerEmail) ? {} : { customerEmail }),
      ...(ignored(customerName) ? {} : { customerName }),
      ...(ignored(checkin) ? {} : { checkin }),
      ...(ignored(checkout) ? {} : { checkout }),
      ...(ignored(numAdults) ? {} : { numAdults: Number(numAdults) }),
      ...(ignored(numChildren) ? {} : { numChildren: Number(numChildren) }),
      ...(ignored(roomType) ? {} : { roomType }),
      ...(ignored(specialRequests) ? {} : { specialRequests }),
    };

    try {
      const result = await axios.post("http://backend:3000/reservations", data);
      console.log(`result:`, result.data);
      world.result = result;
    } catch (error: any) {
      world.result = error.response;
    }
  }
);

Then("the status2 should be {int}", (status) => {
  assert.strictEqual(world.result.status, status);
});
