# Things to consider in different functionalities

This topics should be addressed, documented or implemented and removed from this document.
Therefore, the list of things to consider should not grow indefenitely.

## Importing reservations

- Reservations that are received from external resources cannot be "not saved". The customer considers
  them as "entered" so our users need to address them.
- Once thing we can do: Store correct reservations into `reservations` and incorrect into `incorrect_reservations`?
  - Then we need an operation to move from one place to the other when they are corrected

## Comments on Entities

- Create a microservice that will manage comments only. It can be some GraphDB and it should
  offer a frontend to be embedded in other frontends. Sort of Microfrontends.
  See if we can use the ServerRendered components in react or something similar.

## Schemas

Consider in / out schemas. Out schemas can add new "required" fields.
"In" schemas should only require what is really needed for the operation.
See if it is possible to create a "shape" schema (reservation-shape.json) with all the fields and no requirements
and define "operation" schemas (reservation-request.json) that references the "shape" schema and defines only
the required fields.
Same for events and events header for example.
Shape schemas can be shared accross boundaries? (see in/out data. Maybe we need reservations-shape-public.json with a subset
of reservations-shape and this is the one used for public events and can be published to an external module)
