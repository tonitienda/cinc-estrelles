# Import reservations

## Introduction

The import-reservations feature and endpoint is used record reservations that
have been received from external systems, like for example booking.com.
These reservations are already stored in the external system and the customers
assume they are received by the hotel and maybe confirmed.

## Context and Problem Statement

Reservations being received in the endpoint might have some errors in the format of the data
or in other invariants required to process a reservation automatically.

These errors need to be fixed by a human agent before the system can make sense of what that reservation
means. For example, if the email address is not correct, the notifications cannot be sent. If the
number of people is not a number or the room type is not valid, calculations over the availability cannot
be made, etc.

## Analysis

### Correcting invalid reservation requests

We need to let the human agent access the information of the invalid reservation request to take measures and
convert it into a valid request.

#### Option A - Separated table in DB

One solution to the problem is storing the reservations with errors into a separated table in the DB, so the human agent can
correct the errors and make the reservation valid moving the data into the official table for reservations.

Since the data has errors and we cannot know a priori what they can be, the table could have a JSON column where
we store the request as is. This will make that all requests are stored, but will make the schema of the data
impossible to know, so the response of the API returning the data is difficult to define as so it is the UI that will
handle the functionality to correct the data.

Another solution could be to store the data in a table with defined schema with the right columns but having the columns
be nullable and all string-like types, so the data we can accept is broader that with the approved reservation requests.
One problem with this approach is that if the error is in the name of the fields and not the data, there will be fields
in the request that will not be saved into the table.

#### Option B - Notification only

Another solution is to notify about the erroneous reservation and do not persist it in the Database.
Users can import the right data in the reservations by hand once they clarify the problem and fix the data format
or contents.

### Notification of invalid reservation requests

Regardless of the approach of persisting or not the reservation, once we receive an erroneous resevations we will need to send a
notification to users so they can react as soon as possible.
The requested system is Slack. The mechanism will be derived from the [ADR about notifications](2022-07-18-notifications.md).

## Proposed solution

Persisting the failed request is a better option since, apart from making it easier for users to fix the data, it will allow us to understand the common errors when importing them and react to them by automating the fix whenever possible.

So it means that the data in the DB will include the reservation data and the error.
We will store it as JSON, so we can store all failed requests.

## Status

Decided
