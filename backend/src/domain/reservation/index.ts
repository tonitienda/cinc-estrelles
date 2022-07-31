import { ReservationRequest } from "../../models/reservation-request";
import CmdSchema from "../../schemas/reservation-request.json";
import { makeValidator, validate } from "../../tools/validator";
import { Command } from "../../types";
import { v4 as uuid } from "uuid";

const createReservationValidator = makeValidator<ReservationRequest>(CmdSchema);

export const createReservation: Command = (input: unknown) => {
  const [reservationRequest, err] = validate(createReservationValidator, input);

  if (err) {
    return [null, err];
  }

  const reservation = { id: uuid(), ...reservationRequest };

  console.log(reservation);
  // TODO - See proper response based on Rest API
  return [{ id: reservation.id }, null];
};
