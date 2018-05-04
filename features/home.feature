Feature: Home route advertises message

  Scenario: Visiting the home route returns a message
    When I visit the home route
    Then the response is an HTTP success
    And the message encourages testing
