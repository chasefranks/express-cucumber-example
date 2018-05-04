Feature: Ads for items for sell can be posted and retrieved

  Scenario: A new ad can be created
    Given an ad I want to place
    When I create the ad
    Then I get an HTTP created
    And the location of the newly created add is returned
    And the newly created add can be found there

  Scenario: An existing ad can be retrieved
    Given an ad exists
    When I get the ad
    Then I get an HTTP ok
    And the ad is returned

  Scenario: An add can be deleted
    Given an ad exists
    When I delete the ad
    Then I get an HTTP ok
    And the ad has been deleted

  Scenario Outline: Ads without the item, price, and minimal contact details can't be created
    When I try to create an add that is missing a required <field>
    Then I get an HTTP bad request
    And the response tells me what <field> is missing
      Examples:
      | field   |
      | item    |
      | contact |

  Scenario: Ads without some way to contact the seller can't be created
    When I try to create an ad that is missing both the contact's phone and email
    Then I get an HTTP bad request
    And the response tells me that at least contact phone number or email is required
