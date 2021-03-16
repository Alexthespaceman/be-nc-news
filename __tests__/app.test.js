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
      test("GET Status: 200 and responds with a user object from a valid userName - icellusedkars", () => {
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
    test("GET Status: 200 and responds with a user object from a valid userName - 'butter_bridge'", () => {
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
    test("GET Status: 404 and responds with a 404 error message - 'coolDude'", () => {
      return request(app)
        .get("/api/users/coolDude")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Username does not exist");
        });
    });
  });
  test("GET - STATUS:200 - get all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
      });
  });
  test("INVALID METHODS - status:405", () => {
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
    test("GET, status: 200, and responds with an article object by its unique ID - article_id = 9", () => {
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
    test("GET, status: 200, and responds with an article object by its unique ID - article_id = 3", () => {
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
    test("PATCH, status: 200, and responds with an updated articles object - adding votes", () => {
      return request(app)
        .patch("/api/articles/9")
        .send({ inc_votes: 45 })
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveProperty("votes", 45);
        });
    });
    test("PATCH, status: 200, and responds with an updated article object - decreasing votes", () => {
      return request(app)
        .patch("/api/articles/9")
        .send({ inc_votes: -15 })
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveProperty("votes", -15);
        });
    });
    test("GET: INVALID article ID - status:400", () => {
      return request(app)
        .get("/api/articles/pigeons")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("POST, status: 201, and responds with a comments object by article ID - article_id: 9", () => {
      return request(app)
        .post("/api/articles/9/comments")
        .send({ userName: "icellusedkars", body: "Hello world!" })
        .expect(201)
        .then(({ body }) => {
          expect(body.article).toHaveProperty("body", "Hello world!");
          expect(body.article).toHaveProperty("author", "icellusedkars");
        });
    });
    test("POST, status: 201, and responds with a comments object by article ID - article_id: 6", () => {
      return request(app)
        .post("/api/articles/6/comments")
        .send({ userName: "butter_bridge", body: "The best day ever!" })
        .expect(201)
        .then(({ body }) => {
          expect(body.article).toHaveProperty("body", "The best day ever!");
          expect(body.article).toHaveProperty("author", "butter_bridge");
        });
    });
    test("INVALID METHODS - status:405", () => {
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
      test("GET - article comments by article ID, sorted by column created_at, and ordered in desending order by default - article_id:9", () => {
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
      test("GET - article comments by article ID, sorted by column created_at, and ordered in desending order by default - article_id: 3", () => {
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
      test("comments are sorted in descending order by created_at", () => {
        return request(app)
          .get("/api/articles/9/comments")
          .expect(200)
          .then((res) => {
            expect(res.body.comments).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      test("comments are sorted in descending order by created_at", () => {
        return request(app)
          .get("/api/articles/9/comments")
          .expect(200)
          .then((res) => {
            expect(res.body.comments).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      test("PATCH: INVALID article ID - status:400", () => {
        return request(app)
          .patch("/api/articles/pigeons")
          .send({ inc_votes: 7 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
      it("status: 400, reject patch request if inc_votes key is an invalid data type", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({ inc_votes: "seven" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
      it("status: 400, rejects malformed body", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ incorrect_property: 4 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
      test("comments can be sorted by other columns when passed a valid column as a url sort_by query", () => {
        return request(app)
          .get("/api/articles/9/comments?sort_by=votes")
          .expect(200)
          .then((res) => {
            expect(res.body.comments).toBeSortedBy("votes", {
              descending: true,
            });
          });
      });
    });
  });
  describe("/articles", () => {
    test("GET Status: 200 and returns an object of articles", () => {
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
    test("GET: articles can be sorted by other columns when passed a valid article column as a url sort_by query - topic", () => {
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
    test("GET: articles can be sorted by other columns when passed a valid article column as a url sort_by query - author", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("author", {
            descending: true,
          });
        });
    });
    test("GET: articles can be filtered, if the query asks for a valid topic", () => {
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
    test("GET: articles can be filtered, if the query asks for a valid author", () => {
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
      test("PATCH: update specified comment votes, using comment_id - adding votes", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 20 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).toHaveProperty("votes", 36);
            expect(body.comment).toHaveProperty(
              "body",
              "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
            );
            expect(body.comment).toHaveProperty("author", "butter_bridge");
          });
      });
      test("PATCH: update specified comment votes, using comment_id - decreasing votes", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: -6 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).toHaveProperty("votes", 10);
            expect(body.comment).toHaveProperty(
              "body",
              "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
            );
            expect(body.comment).toHaveProperty("author", "butter_bridge");
          });
      });
      test("DELETE - staus:204 - delete a specified comment, using its specific comment_id", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204)
          .then(({ body }) => {
            expect(body).toEqual({});
          });
      });
      test("DELETE - staus:204 - delete a specified comment, using its specific comment_id", () => {
        return request(app).delete("/api/comments/2").expect(204);
      });
      test("DELETE - staus:204 - end point does not exist", () => {
        return request(app).delete("/api/comments/300").expect(204);
      });
      // test("DELETE - staus:204 - end point does not exist", () => {
      //   return request(app).delete("/api/comments/300").expect(204);
    });
  });
});

// GET /api/articles/:article_id/comments - get the test from here <<<< test yet to do - copy and paste tests from here and add too patch
// to ammend method, path, and send body
//'GET /api/articles/:article_id' - copy and paste from here

//post POST /api/articles/:article_id/comments - use the same test as the get - test for the article_id is the wrong data type
//malformed body, and invalid method. you can copy and paste, alter model to reject promise so error can be caught

//PATCH Request
// 10:27
// add test from GET /api/articles/:article_id

// Tests for GET /api/articles/:article_id/comments will be the same as the tests youve written for GET /api/articles/:article_id
// 10:28
// POST /api/articles/:article_id/comments will be similar to Patch

// do the below to make propper tests

// describe('/films', () => {
//   describe('GET', () => {
//     test('status:200 responds wtesth an array of <resource_name> objects', () => {
//       // test here...
//     });
//     test('status:200 adds a director key to the film object', () => {
//       // test here...
//     });
//     test('status:200 sorts by rating by default', () => {
//       // test here...
//     });
//     test('status:200 results are ordered by a passed sort_by query', () =>
//       // test here...
//     });
//     test('status:400 for invalid sortBy column', () => {
//       // test here...
//     });
//   });
//   describe('POST', () => {
//     test('status:201 responds with a created film', () => {
//       // test here...
//     });
//     test('status:400 when posting a value of incorrect type', () => {
//       // test here...
//     });
//     test('status:400 when missing required columns', () => {
//       // test here...
//     });
//     test('status:400 when adding non-existent columns', () => {
//       // test here...
//     });
//     test('status:422 when posting correctly formatted id that does not exist', () => {
//       // test here...
//     });
//   });
//   describe('INVALID METHODS', () => {
//     // test here...
//   });
// });
