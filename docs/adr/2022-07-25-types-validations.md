# Types and validations

## Context and Problem Statement

Data received from external systems (http requests, event we are subscribed
to, data from DB) can have missing fields, extra fields or fields with the wrong
format. That can make out application crash without a clear reason.

Data being sent to external services, both 3rd party or other components in the application,
can fail if the data being sent does not conform to the expected format.
Furthermore, if the data is send as a message and there are multiple subscribers a
message with the wrong format can make many services/functionalities to fail.

Typescript offers a type system on top of javascript that is very useful to improve
code readability. Being transpiled, it does not offer any guarantees in runtime
so data received in a request (for example) can have a different format than the type
that was assumed. It can produce errors in runtime that are difficult to understand and
correct.

## Analysis

Data received from and sent to external sources should be validated.
For example request made to the API need to be conform to the expected format
so the requested operations (both queries or commands) can be fulfilled.

The returning data in queries should also be validated to ensure that clients
receive the expected data in the right format. Events, or other means of outgoing
data should also be validated internally before making other services, both external
or part of the system, fail.

There are many ways to validate the data, but a declarative way is preferable. JSON Schema
is very powerful and easy to read (specially for simple models).
Performance might not be the best, but libraries like AJV offer pretty good one.
See the [Json Schema benchmarks](https://www.npmjs.com/package/json-schema-benchmark).
In order to make the best use of AJV the schemas need to be precompiled when the service starts,
and not compile them in every request.

There is a risk that the json schemas defined for the models, do not match the types in Typescript
and therefore the code processing data with these types defined might fail even if the validation
is being performed.

Tests can help to find out these errors, but there is another approach to generate the domain model
based on JSON schema. So we can defile the jsonschema for the models first, and generate the typescript
types from them. That offers guarantees that the types and schemas match but adds a step to generate the
types everytime we add / edit one of the schemas for the domain model.

## Proposed solution

- Use JsonSchema to validate data from/to external sources.
- Define JsonSchema first for domain models (internal models to not need jsonschema)
- Use AJV for the validation.
- Precompile schemas to improve performance.

## Status

Decided
