# Types and validations

## Context and Problem Statement

### Error classification

Errors in APIs (and other applications but I prefer to be specific) can be classified in
two categories.

#### Business related errors

Business related errors concern the user. The action the user is trying to perform
cannot be executed for various reasons. For example the information provided is insufficient
or the format is not correct, the state of the application does not allow that action to be
executed, the user does not have enough permissions to perform it, etc.

In this kind of errors the user needs to know details (more or less, depending on the action and 
nature of the error) so they can correct the request or at least understand the situation.

#### Technical or unexpected errors

Technical or unexpected errors tend to be related to the nature of the application itself and
not so much to the user that is executing the action. For example bugs in the code, networking
issues when connecting to external systems, hardware problems, wrong resource configuration, etc.

In this case the nature of the error and its details is not relevant to the user executing the action
but it is relevant to the owners or maintainers of the application.

### Handling errors

The general rule is that business related errors should be thrown/returned by the domain logic
with user readable context and message, and that message should be propagated to the user.
In case of a HTTP-based API, the message should be returned in the response and the status should be
the correct one based on the standard.

The technical/unexpected errors should be hidden to the user but logged into a repository where the
people that can do something about them (developers, support team, product owners) can access.

In case that some technical errors can be handled both technically and by business rules or the user can do
something about them, an hybrid approach should be followed. For example, an external service cannot be reached
and the system has a way to keep the request in a job scheduler for later processing. The user needs to be notified
that the request will be handled later and a notification will be sent, and the developers should be notified about
the partial failure to find the root cause.

Propagate readable business errors to clients.
Do not propagate technical error (crashes in DB, etc).
Return the right HTTP status for each error.


## Proposed solution

- Business related errors should be returned by the domain functions. 
- Technical or unexpected errors should be caught in the outmost later, logged
and hidden from the user. A generic message should be generated.
- Specific type for each business related error should be created. These error types should
containg the message to be shown to the user and the HTTP status code related to it.

For example:

```typescript
type BusinessError = {
  status: number;
  message: string;
};

const ResourceNotFound = (resourceType: string): BusinessError => ({
  status: 404,
  message: `The ${resourceType} could not be found.`,
});
```

## Status

Decided
