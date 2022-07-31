Feature: Create a Reservation
    Background: Backend is ready

    Scenario Outline: Valid Reservation Request
        When the client requests a reservation with "<customerEmail>", "<customerName>", "<checkin>", "<checkout>", "<numAdults>", "<numChildren>", "<roomType>", "<specialRequests>"
        Then the status2 should be 200

        # Fields with <ignore> valud are not sent
        Examples:
            | customerEmail    | customerName | checkin    | checkout   | numAdults | numChildren | roomType | specialRequests |
            | test@example.com | John Doe     | 2022-10-01 | 2022-10-02 | 2         | 0           | suite    | <ignore>        |


