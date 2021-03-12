process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const dbConnection = require("../db/dbConnection");

beforeEach(() => {
  return dbConnection.seed.run();
});

afterAll(() => {
  return dbConnection.destroy();
});

describe("/api", () => {
  describe("/topics", () => {
    test("GET Status: 200 and returns an object of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics.length).toBe(3);
          expect(topics[0]).toHaveProperty("slug");
          expect(topics[0]).toHaveProperty("description");
        });
    });
    test("INVALID METHODS - status:405", () => {
      const invalidMethods = ["patch", "put", "delete"];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe("/users", () => {
    describe("/:username", () => {
      test("GET Status: 200 and responds with a user object ", () => {
        return request(app)
          .get("/api/users/icellusedkars")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).toHaveProperty("username", "icellusedkars");
            expect(user).toHaveProperty(
              "avatar_url",
              "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
            );
            expect(user).toHaveProperty("name", "sam");
          });
      });
    });
  });
  describe("/:artile_id", () => {
    describe("/articles", () => {
      test("GET, status: 200, and responds with an article object by its unique ID", () => {
        return request(app)
          .get("/api/articles/9")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toHaveProperty("article_id", 9);
            expect(article).toHaveProperty("author", "butter_bridge");
            expect(article).toHaveProperty(
              "title",
              "They're not exactly dogs, are they?"
            );
            expect(article).toHaveProperty(
              "created_at",
              "1986-11-23T12:21:54.171Z"
            );
            expect(article).toHaveProperty("body", "Well? Think about it.");
            expect(article).toHaveProperty("topic", "mitch");
            expect(article).toHaveProperty("votes", 0);
            expect(article).toHaveProperty("comment_count");
          });
      });
      test("PATCH, status: 200, and responds with an updated article object", () => {
        return request(app)
          .patch("/api/articles/9")
          .send({ inc_votes: 45 })
          .expect(200)
          .then(({ body }) => {
            console.log(body.article);
            expect(body.article).toHaveProperty("votes", 45);
          });
      });
      test("INVALID article ID - status:404", () => {
        return request(app)
          .patch("/api/articles/pigeons")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Article_id not found");
          });
      });
      test("POST, status: 201, and responds with a comments object by article ID", () => {
        return request(app)
          .post("/api/articles/9/comments")
          .send({ body: "Hello world!" })
          .expect(201)
          .then(({ body }) => {
            expect(body.article).toHaveProperty("body", "Hello world!");
          });
      });
    });
  });
  describe("/articles", () => {
    describe("/:article_id", () => {
      describe("/comments", () => {
        test("GET - article comments by article ID, sorted by column created_at, and ordered in desending order", () => {
          return request(app)
            .get("/api/articles/9/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments.length).toBe(2); //foreach
              // expect(body.comment).toHaveProperty("comment_id");
              // expect(body.comment).toHaveProperty("created_at");
              // expect(body.comment).toHaveProperty("author");
              // expect(body.comment).toHaveProperty("body");
            });
        });
        test("comments are sorted in descending order by created_at", () => {
          return request(app)
            .get("/api/articles/9/comments")
            .expect(200)
            .then((res) => {
              console.log(res.body.comments);
              expect(res.body.comments).toBeSortedBy("created_at", {
                descending: true,
              });
            });
        });
      });
    });
  });
});
