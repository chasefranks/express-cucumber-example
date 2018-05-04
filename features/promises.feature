Feature: Cucumber handles promises logically

  Scenario: Step returns a promise that fullfills
    When I get a promise that fullfills
    Then I make it to this step

  Scenario: Step returns a promise that rejects
    When I get a promise that is rejected
    Then I don't make it to this step

  Scenario: Step returns a promise that fullfills with the string 'pending'
    When I get a promise that fullfills with 'pending'
    Then this scenario is marked pending the step
