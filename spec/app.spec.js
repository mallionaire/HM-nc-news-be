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
  describe("/api", () => {
    it('INVALID METHODS Status 405 - responds with "Method not allowed" message', () => {
      const invalidMethods = ["put", "patch", "delete", "options"];

      const requests = invalidMethods.map((method) => {
        return request(app)
          [method]("/api")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(requests);
    });
  });
  describe("/invalid_path", () => {
    it("NOT FOUND Status 404: responds with 'Path not found.' message", () => {
      return request(app)
        .get("/api/invalid_path")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Path not found.");
        });
    });
    it("NOT FOUND Status 404: responds with 'Path not found.' message, different invalid_path", () => {
      return request(app)
        .get("/api/articles/not_a_path/invalid_path")
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
    it('INVALID METHODS Status 405 - responds with "Method not allowed" message', () => {
      const invalidMethods = ["put", "patch", "delete"];

      const requests = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(requests);
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
    it('INVALID METHODS Status 405 - responds with "Method not allowed" message', () => {
      const invalidMethods = ["put", "patch", "delete"];

      const requests = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/users/*")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(requests);
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
    it("PATCH Status 200: ignores a patch request with no information in the request body, does not change vote count", () => {
      return request(app)
        .patch("/api/articles/1")
        .expect(200)
        .send({})
        .then(({ body: { article } }) => {
          expect(article.votes).to.equal(100);
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
    it('INVALID METHODS Status 405 - responds with "Method not allowed" message', () => {
      const invalidMethods = ["put", "options", "trace", "delete"];

      const requests = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/articles/*")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(requests);
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
          expect(msg).to.equal("required field cannot be empty");
        });
    });
    it("BAD REQUEST Status 400: responds with an error if the username body is empty", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .expect(400)
        .send({
          username: null,
          body: "I'm a comment",
        })
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("required field cannot be empty");
        });
    });
    it("BAD REQUEST Status 400: responds with an error if the comment & username values aren't included", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .expect(400)
        .send({})
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("required field cannot be empty");
        });
    });
    it('INVALID METHODS Status 405 - responds with "Method not allowed" message', () => {
      const invalidMethods = ["put", "patch", "delete"];

      const requests = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/articles/*/comments")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(requests);
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
      return request(app)
        .get("/api/articles/200/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("No comments could be found for that article");
        });
    });
    it("GET Status 200: responds with an empty array if no comments are found", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.eql([]);
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
  describe("/api/articles", () => {
    it("GET Status 200: responds with an array of articles objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.an("array");
        });
    });
    it("GET Status 200: each articles object has the correct keys, and comment_count", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article).to.have.all.keys([
              "author",
              "title",
              "article_id",
              "topic",
              "votes",
              "created_at",
              "comment_count",
            ]);
          });
        });
    });
    it('INVALID METHODS Status 405 - responds with "Method not allowed" message', () => {
      const invalidMethods = ["put", "options", "delete"];

      const requests = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/articles")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(requests);
    });
    it("GET Status 200: responds with the articles sorted by created_at column by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.sortedBy("created_at", { descending: true });
        });
    });
    it("GET Status 200: responds with the articles sorted by author", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.sortedBy("author", { descending: true });
        });
    });
    it("BAD REQUEST Status 400: responds with an error if passed an invalid sort_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=invalid")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Unable to sort_by invalid query");
        });
    });
    it("GET Status 200: responds with all articles, ordered by DESC by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.descendingBy("created_at");
        });
    });
    it("GET Status 200: responds with articles, ordered by ASC when passed", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.ascendingBy("created_at");
        });
    });
    it("GET Status 200: responds with articles in DESC order if invalid order query is passed", () => {
      return request(app)
        .get("/api/articles?order=invalid")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.descendingBy("created_at");
        });
    });
    it("GET Status 200: accepts an author query, responds with articles filtered by author", () => {
      return request(app)
        .get("/api/articles?author=butter_bridge")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.equal(3);
        });
    });
    it("GET Status 200: accepts a topic query, responds with an empty array if no articles are found", () => {
      return request(app)
        .get("/api/articles?author=lurker")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.deep.equal([]);
        });
    });
    it("NOT FOUND Status 404: responds with an error if an invalid author query is passed", () => {
      return request(app)
        .get("/api/articles?author=invalid_author")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("That author could not be found");
        });
    });
    it("GET Status 200: accepts a topic query, responds with articles filtered by author", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.equal(1);
        });
    });
    it("GET Status 200: accepts a topic query, responds with an empty array if no articles are found", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.deep.equal([]);
        });
    });
    it("NOT FOUND Status 404: responds with an error if an invalid topic query is passed", () => {
      return request(app)
        .get("/api/articles?topic=invalid")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("That topic could not be found");
        });
    });
  });
  describe("/api/comments/:comment_id", () => {
    it("PATCH Status 200: changes the vote count on the specified comment_id", () => {
      return request(app)
        .patch("/api/comments/3")
        .send({ inc_votes: 2 })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).to.equal(102);
        });
    });
    it("PATCH Status 200: changes the vote count on the specified comment_id, works with negative numbers", () => {
      return request(app)
        .patch("/api/comments/3")
        .send({ inc_votes: -12 })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).to.equal(88);
        });
    });
    it("BAD REQUEST Status 400: invalid comment_id, responds with an error if comment_id is in invalid", () => {
      return request(app)
        .patch("/api/comments/invalid_id")
        .send({ inc_votes: 2 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request");
        });
    });
    it("BAD REQUEST Status 400: invalid inc_votes value, responds with an error if inc_votes is in an incorrect format", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: "twelve" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request");
        });
    });
    it("PATCH Status 200: ignores a patch request with no information in the request body, does not change vote count", () => {
      return request(app)
        .patch("/api/comments/1")
        .expect(200)
        .send({})
        .then(({ body: { comment } }) => {
          expect(comment.votes).to.equal(16);
        });
    });
    it("NOT FOUND Status 404: invalid comment_id, responds with an error if comment_id does not exist", () => {
      return request(app)
        .patch("/api/comments/3000")
        .send({ inc_vote: 12 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Comment not found");
        });
    });
    it("DELETE Status 204: deletes a comment by a specified comment_id", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    it("NOT FOUND 404: responds with an error if the comment_id is incorrect", () => {
      return request(app)
        .delete("/api/comments/3000")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Could not delete, comment not found");
        });
    });
    it('INVALID METHODS Status 405 - responds with "Method not allowed" message', () => {
      const invalidMethods = ["put", "trace", "options"];

      const requests = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/comments/*")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(requests);
    });
  });
});

/* 
// GET /api/topics

// GET /api/users/:username

// GET /api/articles/:article_id
// PATCH /api/articles/:article_id

// POST /api/articles/:article_id/comments
// GET /api/articles/:article_id/comments

// GET /api/articles

// PATCH /api/comments/:comment_id

----------------------------------------------
DELETE /api/comments/:comment_id
----------------------------------------------

#### Should

- delete the given comment by `comment_id`

#### Responds with

- status 204 and no content

----------------------------------------------

GET /api
*/
