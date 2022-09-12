# Customer Registration

## Context and Problem Statement

When a reservation is received a new customer is registered based on the email address.
This way we can keep track of the bookings that belong to a customer and we can open the door
to having a login where users can manage their bookings or can change the email address for
communication purposes.

Once the customer is registered, the reservation needs to be assigned to that customer.
When a reservation is received, if a customer with the same email already exists, the customer
will not be registered again but the reservation will get the same id.

## Analysis

### Data ownership

One of the first things to consider is where the link between customers and reservations live.
In a DB centric project, the Reservations table would have a reference to the Customers table and
therefore, the Reservations Svc seems like the owner of that data.

At the same time the Customers data seems to belong to the Customer svc. Following that path we would need to
decide a way for Customer svc and Reservations svc to communicate.

Going one step backwards, we need to ask why is that data needed? Reservations service does not need the customer
id for its current operations. The reservation has the email and name of the customer and that is enough to
identify a customer upon arrival.

At the same time if the customer email is going to be used to decide whether a customer already exists or is a new one
can we just use it as the identifier of the customer?

This leads to the next topic.

### Feature justification

It seems that the need for a customer registration is not justified yet. We do not have a strong reason to identify
customers by id.
Each feature we add to the system, specially if its purpose is not clear, promotes the stickiness and reduces its maintainability.


## Proposed solution

Postpone the customer registration feature until it is decided what purpose it follows so we can decide better about
its implementation and its location within the system.

## Status

Decided
