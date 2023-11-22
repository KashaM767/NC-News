const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require('../app');
const request = require('supertest');

const { articleData, commentData, topicData, userData } = require('../db/data/test-data/index');

beforeEach(() => {
    return seed({ articleData, commentData, topicData, userData })
});
afterAll(() => db.end());

describe('GET /api/topics', () => {
    test('GET:200 sends a 200 status code and array of topics to the client', () => {
        return request(app)
            .get('/api/topics')
            .expect(200).then((res) => {
                expect(res.body.topics.rows.length).toBe(3);
                expect(res.body.topics.rows[0]).toMatchObject({
                    slug: 'mitch',
                    description: 'The man, the Mitch, the legend'
                });
                res.body.topics.rows.forEach((topic) => {
                    expect(topic).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                    });
                })
            })
    });
});

describe('GET:404 - bad path', () => {
    test('GET:404 returns status code of 404 and "path not found" msg if api path is invalid', () => {
        return request(app).get('/api/topiks')
            .expect(404).then((res) => {
                expect(res.body.msg).toBe('path not found');
            })
    })
})

describe('GET /api', () => {
    test("GET:200 returns object containing all apis", () => {
        return request(app).get('/api')
            .expect(200)
            .then(({ body }) => {
                expect(body.apis["GET /api/topics"]).toEqual(expect.any(Object));
                expect(body.apis["GET /api"]).toEqual(expect.any(Object));
            })
    })
});

describe('/api/articles/:article_id/comments', () => {
    test("200: returns an empty array if no comments for the given article_id", () => {
        return request(app).get('/api/articles/2/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body.rows).toEqual([])
            })
    });
    test("200: returns an array of comments for the given article_id", () => {
        return request(app).get('/api/articles/3/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body.rows.length).toBe(2);
                console.log(body)
                expect(body.rows).toBeSortedBy("created_at", {
                    descending: true
                });
                expect(body.rows[0]).toMatchObject(
                    {
                        comment_id: 11,
                        body: 'Ambidextrous marsupial',
                        article_id: 3,
                        author: 'icellusedkars',
                        votes: 0,
                        created_at: "2020-09-19T23:10:00.000Z"
                    },
                )
            })
    });
    test("404: responds with an error message if the article_id does not exist", () => {
        return request(app)
            .get('/api/articles/26/comments')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    });
    test('400: responds with an error message if passed an invalid article_id', () => {
        return request(app).get('/api/articles/banana/comments')
            .expect(400).then(({ body }) => {
                expect(body.msg).toBe('bad request');
            })
    });
});