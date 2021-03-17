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
    test("GET: and returns an object of topics - Status: 200", () => {
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
      test("GET (test 1): Responds with a user object from a valid userName - icellusedkars - Status: 200", () => {
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
    test("GET (test 2): Responds with a user object from a valid userName - butter_bridge - Status: 200", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).toHaveProperty("username", "butter_bridge");
          expect(user).toHaveProperty(
            "avatar_url",
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
          );
          expect(user).toHaveProperty("name", "jonny");
        });
    });
    test("GET (test 1): Responds with a 404 error message when user does not exsist - 'coolDude' - Status: 404", () => {
      return request(app)
        .get("/api/users/coolDude")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Username does not exist");
        });
    });
  });
  test("GET (test 1): Respond with a get all users array of objects - Status:200 ", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
      });
  });
  test("GET (test 1): testing for INVALID METHODS - status:405", () => {
    const invalidMethods = ["patch", "put", "delete"];
    const methodPromises = invalidMethods.map((method) => {
      return request(app)
        [method]("/api/users")
        .expect(405)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Method not allowed");
        });
    });
    return Promise.all(methodPromises);
  });
});
describe("/articles", () => {
  describe("/:articles_id", () => {
    test("GET (test 1): Responds with an article object by its unique ID - article_id = 9 - status: 200", () => {
      return request(app)
        .get("/api/articles/9")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveProperty("article_id", 9);
          expect(articles).toHaveProperty("author", "butter_bridge");
          expect(articles).toHaveProperty(
            "title",
            "They're not exactly dogs, are they?"
          );
          expect(articles).toHaveProperty(
            "created_at",
            "1986-11-23T12:21:54.171Z"
          );
          expect(articles).toHaveProperty("body", "Well? Think about it.");
          expect(articles).toHaveProperty("topic", "mitch");
          expect(articles).toHaveProperty("votes", 0);
          expect(articles).toHaveProperty("comment_count");
        });
    });
    test("GET (test 2): Responds with an article object by its unique ID - article_id = 3 - status: 200", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveProperty("article_id", 3);
          expect(articles).toHaveProperty("author", "icellusedkars");
          expect(articles).toHaveProperty(
            "title",
            "Eight pug gifs that remind me of mitch"
          );
          expect(articles).toHaveProperty(
            "created_at",
            "2010-11-17T12:21:54.171Z"
          );
          expect(articles).toHaveProperty("body", "some gifs");
          expect(articles).toHaveProperty("topic", "mitch");
          expect(articles).toHaveProperty("votes", 0);
          expect(articles).toHaveProperty("comment_count", "0");
        });
    });
    test("GET (test1): INVALID METHODS - status:405", () => {
      const invalidMethods = ["put", "delete"];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/articles/9")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    test("PATCH (test 1): Responds with an updated articles object - adding votes - status: 200", () => {
      return request(app)
        .patch("/api/articles/9")
        .send({ inc_votes: 45 })
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveProperty("votes", 45);
          expect(body.articles).toHaveProperty("article_id", 9);
          expect(body.articles).toHaveProperty("body", "Well? Think about it.");
        });
    });
    test("PATCH (test 2): Responds with an updated articles object - adding votes - status: 200", () => {
      return request(app)
        .patch("/api/articles/10")
        .send({ inc_votes: 29 })
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveProperty("votes", 29);
          expect(body.articles).toHaveProperty("article_id", 10);
          expect(body.articles).toHaveProperty(
            "body",
            "Who are we kidding, there is only one, and it's Mitch!"
          );
        });
    });
    test("PATCH (test 1): Responds with an updated article object - decreasing votes - status: 200", () => {
      return request(app)
        .patch("/api/articles/11")
        .send({ inc_votes: -15 })
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveProperty("votes", -15);
          expect(body.articles).toHaveProperty("article_id", 11);
          expect(body.articles).toHaveProperty(
            "body",
            "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?"
          );
        });
    });
    test("PATCH (test 2): Responds with an updated article object - decreasing votes - status: 200", () => {
      return request(app)
        .patch("/api/articles/12")
        .send({ inc_votes: -34 })
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveProperty("votes", -34);
          expect(body.articles).toHaveProperty("article_id", 12);
          expect(body.articles).toHaveProperty(
            "body",
            "Have you seen the size of that thing?"
          );
        });
    });
    test("PATCH (test 1): INVALID comment_id: responds with a status code of 400 - status:400", () => {
      return request(app)
        .patch("/api/articles/pigeons123")
        .send({ inc_votes: 7 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("PATCH (test 1): INVALID comment_id: responds with a status code of 400 - status:400", () => {
      return request(app)
        .patch("/api/articles/pigeons")
        .send({ inc_votes: 7 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("PATCH (test 2): rejected patch request if inc_votes key is an invalid data type - status:400", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: "seven" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("PATCH (test 3):rejects malformed body - status: 400", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ incorrect_property: 4 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("POST (test1): INVALID METHODS - status:405", () => {
      const invalidMethods = ["put", "delete"];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/articles/9")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    test("POST (test 1): Responds with an updated comments object, with added author and comment body, by article ID - article_id: 9 - status: 201", () => {
      return request(app)
        .post("/api/articles/9/comments")
        .send({ userName: "icellusedkars", body: "Hello world!" })
        .expect(201)
        .then(({ body }) => {
          expect(body.article).toHaveProperty("body", "Hello world!");
          expect(body.article).toHaveProperty("author", "icellusedkars");
        });
    });
    test("POST (test 2): Responds with an updated comments object, with added author and comment body, by article ID - article_id: 6 - status: 201", () => {
      return request(app)
        .post("/api/articles/6/comments")
        .send({ userName: "butter_bridge", body: "The best day ever!" })
        .expect(201)
        .then(({ body }) => {
          expect(body.article).toHaveProperty("body", "The best day ever!");
          expect(body.article).toHaveProperty("author", "butter_bridge");
        });
    });
    test("POST (test 1): INVALID article_id: responds with a status code of 400 - status:400", () => {
      return request(app)
        .post("/api/articles/parrot/comments")
        .send({ userName: "butter_bridge", body: "The best day ever!" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("POST (test 2): End point not found: responds with a status code of 404 - status:404", () => {
      return request(app)
        .post("/api/articles/400/comments")
        .send({ userName: "butter_bridge", body: "lucy in the sky!" })
        .expect(404);
    });
    test("POST (test 2): Rejects malformed body - status: 400", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ hello: "butter_bridge", world: "The best day ever!" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("POST (test1): INVALID METHODS - status:405", () => {
      const invalidMethods = ["put", "delete"];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/articles/6/comments")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    test("GET (test 1): INVALID article ID: responds with a status code of 400 - status:400", () => {
      return request(app)
        .get("/api/articles/pigeons")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("GET (test 1): testing for INVALID METHODS - status:405", () => {
      const invalidMethods = ["patch", "put", "delete"];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/articles")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
});
describe("/articles", () => {
  describe("/:article_id", () => {
    describe("/comments", () => {
      test("GET (test1): Article comments by article ID, sorted by column created_at, and ordered in desending order by default - article_id:9 - status:200", () => {
        return request(app)
          .get("/api/articles/9/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments.length).toBe(2);
            comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  author: expect.any(String),
                  article_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  body: expect.any(String),
                })
              );
            });
          });
      });
      test("GET(test 2): Article comments by article ID, sorted by column created_at, and ordered in desending order by default - article_id: 3 - status:200", () => {
        return request(app)
          .get("/api/articles/5/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments.length).toBe(2);
            comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  author: expect.any(String),
                  article_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  body: expect.any(String),
                })
              );
            });
          });
      });
      test("GET (test 1): Comments are sorted in descending order by created_at - comment 9 - status:200", () => {
        return request(app)
          .get("/api/articles/9/comments")
          .expect(200)
          .then((res) => {
            expect(res.body.comments).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      test("GET (test 2): Comments are sorted in descending order by created_at - comment 6 - status:200", () => {
        return request(app)
          .get("/api/articles/6/comments")
          .expect(200)
          .then((res) => {
            expect(res.body.comments).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      test("GET (test 3): Comments can be sorted by other columns when passed a valid column as a url sort_by query - status: 200", () => {
        return request(app)
          .get("/api/articles/9/comments?sort_by=votes")
          .expect(200)
          .then((res) => {
            expect(res.body.comments).toBeSortedBy("votes", {
              descending: true,
            });
          });
      });
      test("PATCH (test 1): INVALID article ID: responds with a status code of 400 - status:400", () => {
        return request(app)
          .patch("/api/articles/pigeons")
          .send({ inc_votes: 7 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
      test("PATCH (test 2): reject patch request if inc_votes key is an invalid data type - status: 400", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({ inc_votes: "seven" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
      test("PATCH (test 3): rejects malformed body - status: 400,", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ incorrect_property: 4 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
    });
  });
  describe("/articles", () => {
    test("GET (test 1): Returns an object of articles - Status: 200", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(12);
          expect(articles[0]).toHaveProperty("author");
          expect(articles[0]).toHaveProperty("title");
          expect(articles[0]).toHaveProperty("article_id");
          expect(articles[0]).toHaveProperty("topic");
          expect(articles[0]).toHaveProperty("created_at");
          expect(articles[0]).toHaveProperty("votes");
          expect(articles[0]).toHaveProperty("comment_count");
        });
    });
    test("GET(test 1): Articles can be sorted by other columns when passed a valid article column as a url sort_by query - topic - status: 200", () => {
      return request(app)
        .get("/api/articles?sort_by=topic")
        .send({
          sort_by: "article_id",
          order: "asc",
          author: "icellusedkars",
          topic: "mitch",
        })
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeSortedBy("topic", {
            descending: true,
          });
        });
    });
    test("GET (test 2): Articles can be sorted by other columns when passed a valid article column as a url sort_by query - column: author - status:200", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("author", {
            descending: true,
          });
        });
    });
    test("GET(test 3): Articles can be filtered, if the query asks for a valid topic column - column: mitch - status:200", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => {
          let count = 0;
          articles.forEach((article) => {
            if (article.topic === "mitch") {
              return count++;
            }
            return count--;
          });
          expect(count).toBe(11);
          expect(articles.length).toBe(11);
          expect(articles[0]).toHaveProperty("author");
          expect(articles[0]).toHaveProperty("title");
          expect(articles[0]).toHaveProperty("article_id");
          expect(articles[0]).toHaveProperty("topic");
          expect(articles[0]).toHaveProperty("votes");
          expect(articles[0]).toHaveProperty("comment_count");
          expect(articles[0]).toHaveProperty("created_at");
        });
    });
    test("GET (test 4): articles can be filtered, if the query asks for a valid author - author: icellusedkars - status:200", () => {
      return request(app)
        .get("/api/articles?author=icellusedkars")
        .expect(200)
        .then(({ body: { articles } }) => {
          let count = 0;
          articles.forEach((article) => {
            if (article.author === "icellusedkars") {
              return count++;
            }
            return count--;
          });
          expect(count).toBe(6);
          expect(articles.length).toBe(6);
          expect(articles[0]).toHaveProperty("author");
          expect(articles[0]).toHaveProperty("title");
          expect(articles[0]).toHaveProperty("article_id");
          expect(articles[0]).toHaveProperty("topic");
          expect(articles[0]).toHaveProperty("votes");
          expect(articles[0]).toHaveProperty("comment_count");
          expect(articles[0]).toHaveProperty("created_at");
        });
    });
    describe("/:comment_id", () => {
      test("PATCH (test 1): update specified comment votes, using comment_id - adding votes - comment_id:1 - status: 200", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 20 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).toHaveProperty("votes", 36);
            expect(body.comment).toHaveProperty("comment_id", 1);
            expect(body.comment).toHaveProperty(
              "body",
              "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
            );
            expect(body.comment).toHaveProperty("author", "butter_bridge");
          });
      });
      test("PATCH (test 2): update specified comment votes, using comment_id - adding votes - comment_id:2 - status: 200", () => {
        return request(app)
          .patch("/api/comments/2")
          .send({ inc_votes: 20 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).toHaveProperty("votes", 34);
            expect(body.comment).toHaveProperty("comment_id", 2);
            expect(body.comment).toHaveProperty(
              "body",
              "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
            );
            expect(body.comment).toHaveProperty("author", "butter_bridge");
          });
      });
      test("PATCH (test 1): Update specified comment votes, using comment_id - decreasing votes - comment_id: 1  - status:200", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: -6 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).toHaveProperty("votes", 10);
            expect(body.comment).toHaveProperty("comment_id", 1);

            expect(body.comment).toHaveProperty(
              "body",
              "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
            );
            expect(body.comment).toHaveProperty("author", "butter_bridge");
          });
      });
      test("PATCH (test 2): Update specified comment votes, using comment_id - decreasing votes - comment_id: 3 - status:200", () => {
        return request(app)
          .patch("/api/comments/3")
          .send({ inc_votes: -6 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).toHaveProperty("votes", 94);
            expect(body.comment).toHaveProperty("comment_id", 3);
            expect(body.comment).toHaveProperty(
              "body",
              "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works."
            );
            expect(body.comment).toHaveProperty("author", "icellusedkars");
          });
      });
      test("PATCH (test 1): INVALID comment_id: responds with a status code of 400 - status:400", () => {
        return request(app)
          .patch("/api/comments/pigeons")
          .send({ inc_votes: 7 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
      test("PATCH (test 2): End point not found: responds with a status code of 404 - status:404", () => {
        return request(app)
          .patch("/api/comments/400")
          .send({ inc_votes: 7 })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("End point not found");
          });
      });
      test("PATCH (test 3): rejected patch request if inc_votes key is an invalid data type - status:400", () => {
        return request(app)
          .patch("/api/comments/3")
          .send({ inc_votes: "seven" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
      test("PATCH (test 4):rejects malformed body - status: 400", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ incorrect_property: 4 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
      test("PATCH (test 1): testing for INVALID METHODS - status:405", () => {
        const invalidMethods = ["get", "put"];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/comments/4")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
      test("DELETE (test 1): Delete a specified comment, using its specific comment_id - comment 1 - staus:204", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204)
          .then(({ body }) => {
            expect(body).toEqual({});
          });
      });
      test("DELETE (test 2): Delete a specified comment, using its specific comment_id - comment 2 - staus:204 ", () => {
        return request(app).delete("/api/comments/2").expect(204);
      });
      test("DELETE (test 3): End point does not exist - staus:404", () => {
        return request(app)
          .delete("/api/comments/300")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("End point not found");
          });
      });
      test("DELETE (test 1): testing for INVALID METHODS - status:405", () => {
        const invalidMethods = ["get", "put"];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/comments/2")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
});
