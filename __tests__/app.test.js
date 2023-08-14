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

describe("/api/topics", () => {
  test("GET:200 sends an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toEqual(expect.any(Array));
        topics.forEach((topic) => {
          expect(Object.keys(topic).length).toEqual(2);
          expect(Object.keys(topic)).toEqual(
            expect.arrayContaining(["slug", "description"])
          );
        });
        expect(topics).toBeSortedBy("slug", { descending: false });
      });
  });
  describe("GET query sort_by", () => {
    test("GET:200 sends an array of topic objects sorted by slug", () => {
      return request(app)
        .get("/api/topics?sort_by=slug")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(topics).toBeSortedBy("slug");
        });
    });
    test("GET:200 sends an array of topic objects sorted by description", () => {
      return request(app)
        .get("/api/topics?sort_by=slug")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(topics).toBeSortedBy("description");
        });
    });
    test("GET:400 sends an error message when given an invalid sort_by query", () => {
      return request(app)
        .get("/api/topics?sort_by=invalid")
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("invalid query of sort_by");
        });
    });
  });
  describe("GET query order", () => {
    test("GET:200 sends an array of topic objects in asc order", () => {
      return request(app)
        .get("/api/topics?order=asc")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(topics).toBeSorted({ descending: false });
        });
    });
    test("GET:200 sends an array of topic objects sorted by description", () => {
      return request(app)
        .get("/api/topics?order=desc")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(topics).toBeSorted({ descending: true });
        });
    });
    test("GET:400 sends an error message when given an invalid order query", () => {
      return request(app)
        .get("/api/topics?order=invalid")
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("invalid query of order");
        });
    });
  });
});
