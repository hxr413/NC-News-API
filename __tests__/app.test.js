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
          expect(Object.keys(topic).length).toEqual(2);
          expect(Object.keys(topic)).toEqual(
            expect.arrayContaining(["slug", "description"])
          );
        });
      });
  });
});

describe("/api/articles", () => {
  test("GET:200 sends an array of article objects, sorted by date in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toEqual(expect.any(Array));
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(Object.keys(article).length).toEqual(8);
          expect(article.article_id).toEqual(expect.any(Number));
          expect(article.title).toEqual(expect.any(String));
          expect(article.topic).toEqual(expect.any(String));
          expect(article.author).toEqual(expect.any(String));
          expect(article.created_at).toEqual(expect.any(String));
          expect(article.votes).toEqual(expect.any(Number));
          expect(article.article_img_url).toEqual(expect.any(String));
          expect(article.comment_count).toEqual(expect.any(String));
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("/api/articles/:article_id", () => {
  desceibe("GET", () => {
    test("GET:200 sends the specified article", () => {
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
          };
          expect(article).toEqual(expectedArticle);
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
    test("", () => {});
    // 201: add
    // 201: minus
    // 201: too many keys
  });
});

/* describe("/api/treasures/:treasure_id", () => {
  test("PATCH:201 update specified treasure's prices and sends the updated treasure back to the client", () => {
    return request(app)
      .patch("/api/treasures/1")
      .send({ price: 69.55 })
      .expect(201)
      .then(({ body }) => {
        expect(body.treasure).toMatchObject({
          treasure_id: 1,
          treasure_name: "treasure-a",
          colour: "turquoise",
          age: 200,
          cost_at_auction: 69.55,
          shop_id: 1,
        });
      });
  });
  test("PATCH:201 update specified treasure's prices and sends the updated treasure back to the client, given multiple keys in the input object", () => {
    return request(app)
      .patch("/api/treasures/1")
      .send({ treasure_name: "treasure-a", colour: "turquoise", price: 69.55 })
      .expect(201)
      .then(({ body }) => {
        expect(body.treasure).toMatchObject({
          treasure_id: 1,
          treasure_name: "treasure-a",
          colour: "turquoise",
          age: 200,
          cost_at_auction: 69.55,
          shop_id: 1,
        });
      });
  });
  test("PATCH:400 sends an appropriate error message when client doesn't send a price value", () => {
    return request(app)
      .patch("/api/treasures/1")
      .send({ treasure_name: "treasure-a", colour: "turquoise" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request: no price sent as an object");
      });
  });
  test("PATCH:400 sends an appropriate error message when client doesn't send an object", () => {
    return (
      request(app)
        .patch("/api/treasures/1")
        // can deal with a string here, but not a number
        .send("65.99")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request: no price sent as an object");
        })
    );
  });
  test("PATCH:404 sends an appropriate error message hen given a valid but non-existent id", () => {
    return request(app)
      .patch("/api/treasures/999")
      .send({ price: 69.55 })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request: treasure does not exist");
      });
  });
  test("PATCH:400 sends an appropriate error message hen given an invalid id", () => {
    return request(app)
      .patch("/api/treasures/invalid")
      .send({ price: 69.55 })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request: invalid id");
      });
  });
}); */

describe("/api/articles/:article_id/comments", () => {
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
