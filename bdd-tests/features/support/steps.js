"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
(0, cucumber_1.When)('the greeter says hello', function () {
    console.log('Hello');
});
(0, cucumber_1.Then)('I should have heard {string}', function (expectedResponse) {
    console.log(`Heard hello`);
});
