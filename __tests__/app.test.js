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
          expect(Object.keys(article)).toEqual(
            expect.arrayContaining([
              "article_id",
              "title",
              "topic",
              "author",
              "created_at",
              "votes",
              "article_img_url",
              "comment_count",
            ])
          );
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("/api/articles/:article_id", () => {
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
