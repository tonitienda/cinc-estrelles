# Import reservations

## Context and Problem Statement

The customer has already some ways to get reservations. One is via Booking.com and
the other one via telephone.
They need to have a place where they can check and manage all reservations regardless of
where they come from. They also need to enable notifications in some cases. For example
when a reservation is done for the same day.

This analysis focus on the notifications part.

## Analysis

### Async vs Sync notifications

There are different ways to handle notifications.

- Send the notification from the API itself when a reservation is being stored.
- Build an async system where notifications and storing reservations is decoupled

#### Error handling

Regardless of using a sync or an async method to store and send notifications, we need to handle partial errors.

| Error   | Consequence                                                |
| ------- | ---------------------------------------------------------- |
| Storage | The reservation is not stored but the notification is sent |
| Notify  | The reservation is stored but the notification is not sent |

#### Separate the API to store reservations and the notification system

In this approach once the reservation is received from Booking.com the API will send an event
(or similar) to a Queue and another component will take it and decide to send the notification
or not.

Advantages:

- When multiple sources of reservations are needed the same notification component can be reused.

Disadvantages:

- More moving pieces

## Proposed solution

- Create a separate modules for api/storege and notifications within the same binary for now.
- Communicate between both modules using in-memory queues. So we can split the notification module
  into a different process later on.
- To keep things simple for now, store the reservation first and send the notification later.
  To avoid notifications not being sent we can add a job that checks if the notifications were
  sent for a specific reservation, and if not, send it again. 
  Keep track of failed notifications to not retry the same notification too many times or send the same
  notification multiple times.

## Decision Outcome

As a first step, create the api and notification modules.
Analyse the job to check not sent notifications in a separate document and work on that later.

## Status

Decided
