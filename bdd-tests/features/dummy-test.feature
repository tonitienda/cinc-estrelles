Feature: Dummy
    Background: Backend is ready

    Scenario Outline: Send Valid Dummy Request
        When the client sends "<id>", "<name>", "<description>", "<extra>"
        Then the status should be 201

        # Fields with <ignore> valud are not sent
        Examples:
            | id                                   | name | description                | extra    |
            | 1f3654a4-6bbb-4173-b117-6dccda2e1920 | Test | This is a long description |          |
            | 1f3654a4-6bbb-4173-b117-6dccda2e1920 | Test | This is a long description | <ignore> |
            | 1f3654a4-6bbb-4173-b117-6dccda2e1920 | Test | This is a long description | abcde    |
            | 1f3654a4-6bbb-4173-b117-6dccda2e1920 | Test | <ignore>                   | abcde    |


    Scenario Outline: Send invalid Dummy Request
        When the client sends "<id>", "<name>", "<description>", "<extra>"
        Then the status should be 400


        # Fields with <ignore> valud are not sent
        Examples:
            | id                                   | name     | description                | extra |
            | abcde                                | Test     | This is a long description |       |
            |                                      | Test     | This is a long description |       |
            | <ignore>                             | Test     | This is a long description |       |
            | <ignore>                             | Test     |                            |       |
            | 1f3654a4-6bbb-4173-b117-6dccda2e1920 |          | This is a long description |       |
            | 1f3654a4-6bbb-4173-b117-6dccda2e1920 | <ignore> | This is a long description |       |
            | 1f3654a4-6bbb-4173-b117-6dccda2e1920 | Test     |                            |       |
