import { ReservationRequest } from "../../models/reservation-request";
import ReservationRequestSchema from "../../schemas/reservation-request.json";
import DraftReservationRequestSchema from "../../schemas/draft-reservation-request.json";
import { makeValidator, validate } from "../../tools/validator";
import { Command } from "../../types";
import { v4 as uuid } from "uuid";
import {
  BusinessError,
  InvalidRequest,
  ResourceAcceptedWithErrors,
  UnknownError,
} from "../../errors";
import { ValidateFunction } from "ajv";
import { DraftReservationRequest } from "../../models/draft-reservation-request";

type Dependencies = {
  dbClient: {
    query: (statement: string, params: any[]) => any;
  };
};

const reservationRequestValidator = makeValidator<ReservationRequest>(
  ReservationRequestSchema
);
const draftReservationRequestValidator = makeValidator<DraftReservationRequest>(
  DraftReservationRequestSchema
);

type ReservationRequestCombined = DraftReservationRequest | ReservationRequest;

const importReservationToTable = async (
  dependencies: Dependencies,
  input: unknown,
  table: string,
  validator: ValidateFunction<ReservationRequestCombined>
): Promise<[string | null, BusinessError | null]> => {
  const [reservationRequest, err] = validate(validator, input);

  if (err) {
    return [null, InvalidRequest(err.message)];
  }

  if (!reservationRequest) {
    return [null, UnknownError()];
  }

  const newId = uuid();
  const {
    customerEmail,
    customerName,
    checkin,
    checkout,
    numAdults,
    numChildren,
    roomType,
    specialRequests,
    source,
  } = reservationRequest;

  const { origin, reservationId } = source || {};

  const params = [
    newId,
    customerEmail,
    customerName,
    checkin,
    checkout,
    numAdults,
    numChildren,
    roomType,
    specialRequests,
    origin,
    reservationId,
  ];

  await dependencies.dbClient.query(
    `INSERT INTO reservations.${table} (id, customer_email, customer_name, checkin, checkout, num_adults, num_children, room_type, special_requests, source_origin, source_reservation_id)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`,
    params
  );

  return [newId, null];
};

// If a reservation has the correct format it will be saved in the reservations table
// If there is some missing information we still need to store the request and process it manually
// before if can be considered a correct reservation.
export const importReservation: (dependencies: Dependencies) => Command =
  (dependencies: Dependencies) => async (input: unknown) => {
    let [newId, err] = await importReservationToTable(
      dependencies,
      input,
      "reservations",
      reservationRequestValidator
    );

    if (err) {
      let [_, err2] = await importReservationToTable(
        dependencies,
        input,
        "reservation_requests",
        draftReservationRequestValidator
      );

      if (err2) {
        return [null, err];
      }

      return [
        null,
        ResourceAcceptedWithErrors("The reservation request was not correct."),
      ];
    }

    if (newId) {
      return [{ id: newId }, null];
    }

    return [null, UnknownError()];
  };
