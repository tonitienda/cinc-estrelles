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
