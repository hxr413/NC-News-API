const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data");

beforeEach(() => seed({ articleData, commentData, topicData, userData }));
afterAll(() => db.end());

describe("/api", () => {
  test("GET:200 sends an object describing all the available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { doc } = body;
        const expectedDoc = require(`${__dirname}/../endpoints.json`);
        expect(doc).toEqual(expectedDoc);
      });
  });
});

describe("/api/topics", () => {
  test("GET:200 sends an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toEqual(expect.any(Array));
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(Object.keys(topic).length).toBe(2);
          expect(topic.slug).toEqual(expect.any(String));
          expect(topic.description).toEqual(expect.any(String));
        });
      });
  });
});

describe("/api/users", () => {
  test("GET:200 sends an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toEqual(expect.any(Array));
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(Object.keys(user).length).toBe(3);
          expect(user.username).toEqual(expect.any(String));
          expect(user.name).toEqual(expect.any(String));
          expect(user.avatar_url).toEqual(expect.any(String));
        });
      });
  });
});

describe("/api/users/:username", () => {
  test("GET:200 sends the specified user", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        const expectedUser = {
          username: "lurker",
          name: "do_nothing",
          avatar_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        };
        expect(user).toEqual(expectedUser);
      });
  });
  test("GET:404 sends an error message when given a non-existent username", () => {
    return request(app)
      .get("/api/users/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("user does not exist");
      });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    test("GET:200 sends an array of article objects, sorted by date in descending order by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toEqual(expect.any(Array));
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(Object.keys(article).length).toBe(8);
            expect(article.article_id).toEqual(expect.any(Number));
            expect(article.title).toEqual(expect.any(String));
            expect(article.topic).toEqual(expect.any(String));
            expect(article.author).toEqual(expect.any(String));
            expect(article.created_at).toEqual(expect.any(String));
            expect(article.votes).toEqual(expect.any(Number));
            expect(article.article_img_url).toEqual(expect.any(String));
            expect(article.comment_count).toEqual(expect.any(Number));
          });
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    describe("GET query sort_by", () => {
      test("GET:200 sends an array of article objects sorted by date", () => {
        return request(app)
          .get("/api/articles?sort_by=created_at")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
      test("GET:200 sends an array of article objects sorted by author", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("author", { descending: true });
          });
      });
      test("GET:400 sends an error message when given an invalid sort_by query", () => {
        return request(app)
          .get("/api/articles?sort_by=invalid")
          .expect(400)
          .then(({ body }) => {
            const { message } = body;
            expect(message).toBe("invalid query of sort_by");
          });
      });
    });
    describe("GET query order", () => {
      test("GET:200 sends an array of article objects in asc order", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("created_at", { ascending: true });
          });
      });
      test("GET:200 sends an array of article objects in desc order", () => {
        return request(app)
          .get("/api/articles?order=desc")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
      test("GET:400 sends an error message when given an invalid order query", () => {
        return request(app)
          .get("/api/articles?order=invalid")
          .expect(400)
          .then(({ body }) => {
            const { message } = body;
            expect(message).toBe("invalid query of order");
          });
      });
    });
    describe("GET query topic", () => {
      test("GET:200 sends an array of all articles with given topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles.length).toBe(12);
            articles.forEach((article) => {
              expect(article.topic).toBe("mitch");
            });
          });
      });
      test("GET:200 sends an error message given a valid topic which no articles have", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then((response) => {
            expect(response.body.message).toBe("no article with this topic");
          });
      });
      test("GET:404 sends an error message given an invalid topic", () => {
        return request(app)
          .get("/api/articles?topic=000")
          .expect(404)
          .then((response) => {
            expect(response.body.message).toBe("topic does not exist");
          });
      });
    });
  });
  describe("POST", () => {
    test("POST:201 inserts a new article and returns the posted article with comment_comment", () => {
      const testArticle = {
        title: "test title",
        topic: "mitch",
        author: "icellusedkars",
        body: "test body",
        article_img_url: "https://test.img.com",
      };
      return request(app)
        .post("/api/articles")
        .send(testArticle)
        .expect(201)
        .then(({ body }) => {
          const { article } = body;
          expect(Object.keys(article).length).toEqual(9);
          expect(article).toMatchObject(testArticle);
          expect(article.article_id).toEqual(14);
          expect(article.votes).toEqual(0);
          expect(article.comment_count).toEqual(0);
          expect(article.created_at).toEqual(expect.any(String));
        });
    });
    test("POST:201 inserts a new article and returns the posted article with default url when given no url", () => {
      const testArticle = {
        title: "test title",
        topic: "mitch",
        author: "icellusedkars",
        body: "test body",
      };
      return request(app)
        .post("/api/articles")
        .send(testArticle)
        .expect(201)
        .then(({ body }) => {
          const { article } = body;
          expect(Object.keys(article).length).toEqual(9);
          expect(article).toMatchObject(testArticle);
          expect(article.article_id).toEqual(14);
          expect(article.votes).toEqual(0);
          expect(article.comment_count).toEqual(0);
          expect(article.article_img_url).toEqual(
            "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
          );
          expect(article.created_at).toEqual(expect.any(String));
        });
    });
    test("POST:201 inserts a new article and returns the posted article when given an article object with redundant keys", () => {
      const testArticle = {
        title: "test title",
        topic: "mitch",
        author: "icellusedkars",
        body: "test body",
        article_img_url: "https://test.img.com",
        article_id: 999,
        votes: 900,
        comment_count: 899,
      };
      const expectArticle = {
        title: "test title",
        topic: "mitch",
        author: "icellusedkars",
        body: "test body",
        article_img_url: "https://test.img.com",
        article_id: 14,
        votes: 0,
        comment_count: 0,
      };
      return request(app)
        .post("/api/articles")
        .send(testArticle)
        .expect(201)
        .then(({ body }) => {
          const { article } = body;
          expect(Object.keys(article).length).toEqual(9);
          expect(article).toMatchObject(expectArticle);
          expect(article.created_at).toEqual(expect.any(String));
        });
    });
    test("POST:404 sends an error message with non-existent topic", () => {
      const testArticle = {
        title: "test title",
        topic: "test",
        author: "icellusedkars",
        body: "test body",
        article_img_url: "https://test.img.com",
      };
      return request(app)
        .post("/api/articles")
        .send(testArticle)
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("topic does not exist");
        });
    });
    test("POST:404 sends an error message with non-existent user", () => {
      const testArticle = {
        title: "test title",
        topic: "mitch",
        author: "test_user",
        body: "test body",
        article_img_url: "https://test.img.com",
      };
      return request(app)
        .post("/api/articles")
        .send(testArticle)
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("user does not exist");
        });
    });
    test("POST:400 sends an error message when given a bad article object(missing keys)", () => {
      const testArticle = {
        topic: "mitch",
        author: "icellusedkars",
        article_img_url: "https://test.img.com",
      };
      return request(app)
        .post("/api/articles")
        .send(testArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("invalid request");
        });
    });
    test("POST:400 sends an error message when given a bad article object(wrong keys)", () => {
      const testArticle = {
        titles: "test title",
        topic: "mitch",
        author: "icellusedkars",
        bodys: "test body",
        url: "https://test.img.com",
      };
      return request(app)
        .post("/api/articles")
        .send(testArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("invalid request");
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("GET:200 sends the specified article with correct comment count", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          const expectedArticle = {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 11,
          };
          expect(article).toEqual(expectedArticle);
        });
    });
    test("GET:200 sends 0 comment count when the specified article has no comment", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article.comment_count).toBe(0);
        });
    });
    test("GET:404 sends an error message when given a valid but non-existent id", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("article does not exist");
        });
    });
    test("GET:400 sends an error message when given an invalid id", () => {
      return request(app)
        .get("/api/articles/invalid")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("invalid request");
        });
    });
  });
  describe("PATCH", () => {
    test("PATCH:201 increases votes and returns the updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 50 })
        .expect(201)
        .then(({ body }) => {
          const { article } = body;
          const expectedArticle = {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 150,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          };
          expect(article).toEqual(expectedArticle);
        });
    });
    test("PATCH:201 decreases votes and returns the updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -50 })
        .expect(201)
        .then(({ body }) => {
          const { article } = body;
          const expectedArticle = {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 50,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          };
          expect(article).toEqual(expectedArticle);
        });
    });
    test("PATCH:201 changes votes and returns the updated article when given redundant key(s)", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -50, title: "test title", topic: "test" })
        .expect(201)
        .then(({ body }) => {
          const { article } = body;
          const expectedArticle = {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 50,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          };
          expect(article).toEqual(expectedArticle);
        });
    });
    test("PATCH:404 sends an error message when given a valid but non-existent id", () => {
      return request(app)
        .patch("/api/articles/999")
        .send({ inc_votes: 50 })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("article does not exist");
        });
    });
    test("PATCH:400 sends an error message when given an invalid id", () => {
      return request(app)
        .patch("/api/articles/invalid")
        .send({ inc_votes: 50 })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("invalid request");
        });
    });
    test("PATCH:400 sends an error message when given an object with wrong key(s)", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ votes: 50, title: "test title", topic: "test" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("no inc_votes sent");
        });
    });
    test("PATCH:400 sends an error message when given an object with wrong value", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "fifty" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("invalid request");
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("GET:200 sends an array of comment objects for the specified article", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toEqual(expect.any(Array));
          expect(comments.length).toBe(11);
          comments.forEach((comment) => {
            expect(Object.keys(comment).length).toEqual(6);
            expect(comment.comment_id).toEqual(expect.any(Number));
            expect(comment.votes).toEqual(expect.any(Number));
            expect(comment.created_at).toEqual(expect.any(String));
            expect(comment.author).toEqual(expect.any(String));
            expect(comment.body).toEqual(expect.any(String));
            expect(comment.article_id).toEqual(1);
          });
        });
    });
    test("GET:404 sends an error message when given a existent id with no comments", () => {
      return request(app)
        .get("/api/articles/13/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("article has no comments");
        });
    });
    test("GET:404 sends an error message when given a valid but non-existent id", () => {
      return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("article does not exist");
        });
    });
    test("GET:400 sends an error message when given an invalid id", () => {
      return request(app)
        .get("/api/articles/invalid/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("invalid request");
        });
    });
  });
  describe("POST", () => {
    test("POST:201 inserts a new comment and returns the posted comment", () => {
      const testComment = { username: "lurker", body: "test comment" };
      return request(app)
        .post("/api/articles/1/comments")
        .send(testComment)
        .expect(201)
        .then(({ body }) => {
          expect(body).toEqual({ comment: "test comment" });
        });
    });
    test("POST:201 inserts a new comment and returns the posted comment when given a comment object with redundant keys", () => {
      const testComment = {
        username: "lurker",
        body: "test comment",
        votes: 50,
        article_id: 1,
        time: "now",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(testComment)
        .expect(201)
        .then(({ body }) => {
          expect(body).toEqual({ comment: "test comment" });
        });
    });
    test("POST:404 sends an error message when given a valid but non-existent id", () => {
      const testComment = { username: "lurker", body: "test comment" };
      return request(app)
        .post("/api/articles/999/comments")
        .send(testComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("article does not exist");
        });
    });
    test("POST:404 sends an error message when given a non-existent user", () => {
      const testComment = { username: "testuser", body: "test comment" };
      return request(app)
        .post("/api/articles/1/comments")
        .send(testComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("user does not exist");
        });
    });
    test("POST:400 sends an error message when given an invalid id", () => {
      const testComment = { username: "lurker", body: "test comment" };
      return request(app)
        .post("/api/articles/invalid/comments")
        .send(testComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("invalid request");
        });
    });
    test("POST:400 sends an error message when given a bad comment object(missing keys)", () => {
      const testComment = { username: "lurker" };
      return request(app)
        .post("/api/articles/1/comments")
        .send(testComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("invalid request");
        });
    });
    test("POST:400 sends an error message when given a bad comment object(wrong keys)", () => {
      const testComment = { usernames: "lurker", bodys: "test comment" };
      return request(app)
        .post("/api/articles/1/comments")
        .send(testComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("invalid request");
        });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE:204 deletes the specified comment and sends no body back", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE:404 responds with an error message when given a non-existent id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("comment does not exist");
      });
  });
  test("DELETE:400 responds with an error message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("invalid request");
      });
  });
});

describe("ALL /not-a-path", () => {
  test("404 sends an error message for a non-existent path", () => {
    return request(app)
      .get("/api/invalid")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("path does not exist");
      });
  });
});
