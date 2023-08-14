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
        expect(doc).toEqual(expect.any(Object));
        // As the number of endpoints increases, this test must be updated as well. Is there a clever way to test this endpoint?
        expect(Object.keys(doc).length).toEqual(3);
        expect(Object.keys(doc)).toEqual(
          expect.arrayContaining([
            "GET /api",
            "GET /api/topics",
            "GET /api/articles",
          ])
        );
        for (const endpoint in doc) {
          expect(Object.keys(doc[endpoint]).length).toEqual(4);
          expect(Object.keys(doc[endpoint])).toEqual(
            expect.arrayContaining([
              "description",
              "queries",
              "requestFormat",
              "exampleResponse",
            ])
          );
        }
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
