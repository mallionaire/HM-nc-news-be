process.env.NODE_ENV = "test";
const { expect } = require("chai");
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

// beforeEach -> runs seed file to reset db
beforeEach(() => {
  return connection.seed.run();
});
//Mocha Hook -> closes connection with the server
after(() => {
  return connection.destroy();
});

describe("App", () => {
  describe("/invalid_path", () => {
    it("NOT FOUND Status 404 - responds with 'Path not found' message", () => {
      return request(app)
        .get("/api/invalid_path")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Path not found.");
        });
    });
  });
  describe.only("/api/topics", () => {
    it("GET Status 200: responds with an array", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).to.be.an("array");
        });
    });
    it("GET Status 200: responds with an array of topics objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          topics.forEach((topic) => {
            expect(topic).to.contain.keys(["slug", "description"]);
          });
        });
    });
  });
});

/* 
GET /api/topics

GET /api/users/:username

GET /api/articles/:article_id
PATCH /api/articles/:article_id

POST /api/articles/:article_id/comments
GET /api/articles/:article_id/comments

GET /api/articles

PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id

GET /api
*/
