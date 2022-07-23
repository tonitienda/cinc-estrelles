# Import reservations

## Context and Problem Statement

The application will have to handle commands to perform actions in the system and
mutate the state and queries to let the user access the data and make decisions over it.

The commands tend to prioritize different quality attributes than queries.
For example in the command side of things we tend to prioritize data correctness, consistency, accuracy, etc. and performance is not usually the highest priority.
In the query side of things we tend to prioritize performance over the rest of quality attributes
and we often do concesions on the fressness of the data being shown to the user.


## Analysis

Instead of trying to keep endpoints for mutations and query as similar as possible (as part
of offering a coherent code style in the whole project) we can separate the endpoints into
Queries and Commands and try not to mix them up (for example having commands return data).

This offers the possibility to analyze and take decisions independently and optimize each side
of the application taking into account the concerns and requirements specific to each area.

## Proposed solution

Analyze commands and queries independently. Try to decouple queries and commands while
keeping the solution as simple as possible.

## Decision Outcome

Apply CQRS principles without overengineering.
Subsequent analysis for commands and queries will be created.

## Status

Decided
