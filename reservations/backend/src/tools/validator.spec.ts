import { Reservation } from "../models/reservation";
import { EventHeader, ReservationEvent } from "../models/reservation-event";
import { ReservationRequest } from "../models/reservation-request";
import validator, { validate } from "./validator";

describe("validator", () => {
  test("Event header should be validated", () => {
    const eventHeaderValidator = validator.getSchema<EventHeader>(
      "http://example.com/schemas/event-header.json"
    );

    if (!eventHeaderValidator) {
      throw new Error("eventHeaderValidator could not be created");
    }

    const data = {
      id: "dedb98f9-c0dc-4fa6-95b1-82715ac1f788",
      type: "some-event",
      timestamp: 34242344,
    };
    const [validatedData, err] = validate(eventHeaderValidator, data);

    expect(err).toBeNull();
    expect(data).toEqual(validatedData);
  });

  test("Reservation event should be validated", () => {
    const reservationEventValidator = validator.getSchema<ReservationEvent>(
      "http://example.com/schemas/reservation-event.json"
    );

    if (!reservationEventValidator) {
      throw new Error("reservationEventValidator could not be created");
    }

    const data = {
      header: {
        id: "dedb98f9-c0dc-4fa6-95b1-82715ac1f788",
        type: "some-event",
        timestamp: 34242344,
      },
      body: {
        id: "0ba4b93d-f6ea-4e06-bb02-c4c1bb80cef6",
      },
    };
    const [validatedData, err] = validate(reservationEventValidator, data);

    expect(err).toBeNull();
    expect(data).toEqual(validatedData);
  });

  test("Reservation request should be validated", () => {
    const reservationRequestValidator = validator.getSchema<ReservationRequest>(
      "http://example.com/schemas/reservation-draft.json"
    );

    if (!reservationRequestValidator) {
      throw new Error("reservationRequestValidator could not be created");
    }

    const data = {
      customer: {
        email: "john.doe@example.com",
        name: "John Doe",
      },
      reservation: {
        checkin: "2022-10-25",
        checkout: "2022-10-27",
        numAdults: 2,
        numChildren: 0,
        roomType: "suite",
      },
      source: {
        reservationId: "test-1234",
        origin: "test",
      },
    };
    const [validatedData, err] = validate(reservationRequestValidator, data);

    expect(err).toBeNull();
    expect(data).toEqual(validatedData);
  });

  test("Reservation should be validated", () => {
    const reservationValidator = validator.getSchema<Reservation>(
      "http://example.com/schemas/reservation.json"
    );

    if (!reservationValidator) {
      throw new Error("reservationValidator could not be created");
    }

    const data = {
      id: "c88addd0-7c0f-4871-944b-32c6abe26aa8",
      customer: { email: "john.doe@example.com", name: "John Doe" },
      reservation: {
        checkin: "2022-10-25",
        checkout: "2022-10-27",
        numAdults: 2,
        numChildren: 0,
        roomType: "suite",
      },
      source: {
        reservationId: "test-1234",
        origin: "test",
      },
    };
    const [validatedData, err] = validate(reservationValidator, data);

    expect(err).toBeNull();
    expect(data).toEqual(validatedData);
  });
});
