process.env.NODE_ENV = "test";
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-sorted"));
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

// beforeEach -> runs seed file to reset db
beforeEach(() => {
  return connection.seed.run();
});
// Mocha Hook -> closes connection with the server
after(() => {
  return connection.destroy();
});

describe("App", () => {
  describe("/invalid_path", () => {
    it("NOT FOUND Status 404: responds with 'Path not found.' message", () => {
      return request(app)
        .get("/api/invalid_path")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Path not found.");
        });
    });
  });
  describe("/api/topics", () => {
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
  describe("/api/users/:username", () => {
    it("GET Status 200: responds with a specific user when passed a username", () => {
      return request(app)
        .get("/api/users/rogersop")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).to.have.all.keys(["username", "avatar_url", "name"]);
        });
    });
    it('NOT FOUND Status 404: it responds with "User not found" message when passed an invalid username', () => {
      return request(app)
        .get("/api/users/invalid_username")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("User not found");
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    it("GET Status 200: responds with a single article object when passed a valid article_id in the right format", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).to.have.all.keys([
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count",
          ]);
        });
    });
    it('NOT FOUND  Status 404: responds with "Article not found" message when passed an invalid article_id', () => {
      return (
        request(app)
          //.get("/api/articles/invalid_id") <-- why does this not work with text?
          .get("/api/articles/900")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Article not found");
          })
      );
    });
    it('BAD REQUEST Status 400: responds with a "Bad Request" message when passed an article_id in an invalid format', () => {
      return request(app)
        .get("/api/articles/invalid_id")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request");
        });
    });
    it("PATCH Status 200: responds with an article that matches the article_id and changes the vote count", () => {
      return request(app)
        .patch("/api/articles/1")
        .expect(200)
        .send({ inc_votes: 2 })
        .then(({ body: { article } }) => {
          expect(article.votes).to.equal(102);
        });
    });
    it('BAD REQUEST Status 400: responds with a "Bad Request" message when passed an invalid inc_vote format', () => {
      return request(app)
        .patch("/api/articles/1")
        .expect(400)
        .send({ inc_votes: "twenty two" })
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request");
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    it("POST Status 201: allows the user to add a comment, responds with the posted comment", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .expect(201)
        .send({ username: "lurker", body: "Its all a huge conspiracy!!" })
        .then(({ body: { comment } }) => {
          expect(comment).to.contain.keys(["article_id", "author", "body"]);
        });
    });
    it("NOT FOUND Status 404: invalid article_id, responds with an error if article_id cannot be found", () => {
      return request(app)
        .post("/api/articles/200/comments")
        .expect(404)
        .send({ username: "lurker", body: "Its all a huge conspiracy!!" })
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("article_id or username not found");
        });
    });
    it("NOT FOUND Status 404: invalid username, responds with an error if username cannot be found", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .expect(404)
        .send({
          username: "invalid_username",
          body: "Its all a huge conspiracy!!",
        })
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("article_id or username not found");
        });
    });
    it("BAD REQUEST Status 400: responds with an error if the comment body is empty", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .expect(400)
        .send({
          username: "lurker",
          body: null,
        })
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("comment field cannot be empty");
        });
    });
  });

  describe("/api/articles/:article_id/comments", () => {
    it("GET Status 200: responds with an array of comments objects for a specified article", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          comments.forEach((comment) => {
            expect(comment).to.have.all.keys([
              "comment_id",
              "author",
              "body",
              "votes",
              "created_at",
            ]);
          });
        });
    });
    it("BAD REQUEST Status 400: invalid article_id, responds with an error if article_id is in an incorrect format", () => {
      return request(app)
        .get("/api/articles/invalid_id/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request");
        });
    });
    it("NOT FOUND Status 404: invalid article_id, responds with an error if article_id is not found", () => {
      // this also catches a validID with no comments ??
      return request(app)
        .get("/api/articles/200/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("No comments could be found for that article");
        });
    });
  });
  describe("/api/articles/:article_id/comments?queries", () => {
    it("GET Status 200: responds with the comments sorted by created_at column by default", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.sortedBy("created_at", { descending: true });
        });
    });
    it("GET Status 200: responds with the comments sorted by specified column", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=votes")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.sortedBy("votes", { descending: true });
        });
    });
    it("BAD REQUEST Status 400: responds with an error if passed an invalid sort_by query", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=invalid")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Unable to sort_by invalid query");
        });
    });
    it("GET Status 200: responds with ordered comments, DESC by default", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.descendingBy("created_at");
        });
    });
    it("GET Status 200: responds with comments in ASC order when passed", () => {
      return request(app)
        .get("/api/articles/1/comments?order=asc")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.ascendingBy("created_at");
        });
    });
    it("GET Status 200: responds with comments in DESC order if invalid order query is passed", () => {
      return request(app)
        .get("/api/articles/1/comments?order=65")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.descendingBy("created_at");
        });
    });
  });
});

/* 
// GET /api/topics

// GET /api/users/:username

// GET /api/articles/:article_id
// PATCH /api/articles/:article_id

//POST /api/articles/:article_id/comments
//GET /api/articles/:article_id/comments


----------------------------------------------
GET /api/articles
----------------------------------------------

#### Responds with

- an `articles` array of article objects, each of which should have the following properties:
  - `author` which is the `username` from the users table
  - `title`
  - `article_id`
  - `topic`
  - `created_at`
  - `votes`
  - `comment_count` which is the total count of all the comments with this article_id - you should make use of knex queries in order to achieve this

#### Should accept queries

- `sort_by`, which sorts the articles by any valid column (defaults to date)
- `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)
- `author`, which filters the articles by the username value specified in the query
- `topic`, which filters the articles by the topic value specified in the query


----------------------------------------------
PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id

GET /api
*/
