const superTest = require("supertest");
const app = require("../server");
const assert = require("assert");

describe("GET / shortenHistory array", () => {
  it("Responds with json data", done => {
    superTest(app)
      .get("/")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .end((err, res) => {
        if (err) done(err);
        done();
      });
  });

  it("it should receive JSON data", done => {
    superTest(app)
      .get("/")
      .expect({ shortenHistory: [] })
      .end(function(err, res) {
        if (err) done(err);
        done();
      });
  });
});
