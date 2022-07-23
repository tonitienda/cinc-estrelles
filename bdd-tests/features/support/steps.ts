import { When, Then } from '@cucumber/cucumber'

When('the greeter says hello', function () {
 console.log('Hello')
});

Then('I should have heard {string}', function (expectedResponse) {
  console.log(`Heard hello`)
});