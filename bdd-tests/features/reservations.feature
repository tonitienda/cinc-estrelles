Feature: Create a Reservation
    Background: Backend is ready

    Scenario Outline: Valid Reservation Request
        When the client requests a reservation with "<customerEmail>", "<customerName>", "<checkin>", "<checkout>", "<numAdults>", "<numChildren>", "<roomType>", "<specialRequests>", "<origin>", "<reservationId>"
        Then the status2 should be <status>
        And the reservation should be found
        And the reservation event should have been received

        # Fields with <ignore> valud are not sent
        Examples:
            | customerEmail    | customerName | checkin    | checkout   | numAdults | numChildren | roomType | specialRequests | origin      | reservationId | status |
            | test@example.com | John Doe     | 2022-10-01 | 2022-10-02 | 2         | 0           | suite    | <ignore>        | booking.com | abc123        | 200    |


    Scenario Outline: Invalid Reservation Request
        When the client requests a reservation with "<customerEmail>", "<customerName>", "<checkin>", "<checkout>", "<numAdults>", "<numChildren>", "<roomType>", "<specialRequests>", "<origin>", "<reservationId>"
        Then the status2 should be <status>

        # Fields with <ignore> valud are not sent
        Examples:
            | customerEmail    | customerName | checkin    | checkout   | numAdults | numChildren | roomType | specialRequests | origin      | reservationId | status |
            | test@example     | John Doe     | 2022-10-01 | 2022-10-02 | 2         | 0           | suite    | <ignore>        | booking.com | abc123        | 202    |
            | test@example.com |              | 2022-10-01 | 2022-10-02 | 2         | 0           | suite    | <ignore>        | booking.com | abc123        | 202    |
            | test@example.com | John Doe     | 20221001   | 2022-10-02 | 2         | 0           | suite    | <ignore>        | booking.com | abc123        | 202    |
            | test@example.com | John Doe     | 2022-10-01 | 20221002   | 2         | 0           | suite    | <ignore>        | booking.com | abc123        | 202    |
            | test@example.com | John Doe     | 2022-10-01 | 20221002   | 2         | 0           | suite    | <ignore>        | booking.com | abc123        | 202    |
            | test@example.com | John Doe     | 2022-10-01 | 2022-10-02 | two       | 0           | suite    | <ignore>        | booking.com | abc123        | 202    |
            | test@example.com | John Doe     | 2022-10-01 | 2022-10-02 | 2         | zero        | suite    | <ignore>        | booking.com | abc123        | 202    |
            | test@example.com | John Doe     | 2022-10-01 | 2022-10-02 | 2         | 0           |          | <ignore>        | booking.com | abc123        | 202    |
            | test@example.com | John Doe     | 2022-10-01 | 2022-10-02 | 2         | 0           | suite    | <ignore>        |             | abc123        | 202    |
            | test@example.com | John Doe     | 2022-10-01 | 2022-10-02 | 2         | 0           | suite    | <ignore>        | booking.com |               | 202    |


