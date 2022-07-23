# Testing strategy

## Context and Problem Statement

In the one hand, need to avoid regressions in the functionality.
In other words we need to ensure that the requirements and the existing functionality
keeps running when changes are performed in the code.

In the other, we need to implement the functionalities that fulfill requirements and solve
our customer problems and, in general, no more than that.

## Analysis

There are multiple techniques used to accomplish the above mentioned points:
- Requirement based testing: ensures that high level tests are written based on the
  requirements and the features are implemented to accomplish them.
- TDD: when writing a unit (function, class, etc) start by writing a test that describes
  the functionality and implement/change the code only if the test fails.
  This helps to write only what is necessary and one of the effects seen is that the coverage
  is very high (if not 100%) since there should not be code that is not covered by tests.
- System testing: tests that ensure some attributes of the system that are not directly
  related to business requirements. For example, the healthcheck in a service works, the application is online, etc. 


## Proposed solution

- Write requirements based tests using Gherkin language and cucumber framework.
- Write other technical tests as simple system tests (no need to try to convert them to Gherkin)
- Use TDD for the implementation. Starting with the requirement based test, implement each component
  related to that requirement using TDD.

## Status

Decided
