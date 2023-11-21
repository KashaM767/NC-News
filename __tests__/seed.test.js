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
    test('GET:200 sends a 200 status code', () => {
        return request(app)
            .get('/api/topics')
            .expect(200).then(({ body }) => {
                expect(body.topics.rows.length).toBe(3);
                expect(body.topics.rows[0]).toMatchObject({
                    slug: 'mitch',
                    description: 'The man, the Mitch, the legend'
                });
                body.topics.rows.forEach((topic) => {
                    expect(topic).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                    });
                })
            })
    });
    test('GET:400 returns an err msg if api path is invalid', () => {
        return request(app).get('/api/topiks')
            .expect(404).then(({ body }) => {
                expect(body.msg).toBe('path not found');
            })
    })
});

describe('GET /api/articles/:article_id', () => {
    test('GET:200 sends a single article to the client', () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toMatchObject(
                    {
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        topic: 'mitch',
                        author: 'butter_bridge',
                        body: 'I find this existence challenging',
                        created_at: "2020-07-09T20:11:00.000Z",
                        votes: 100,
                        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                    })
            })
    });
    test("404: responds with an error message if the article_id does not exist", () => {
        return request(app)
            .get('/api/articles/26')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    });
    test('400: responds with an error message if passed an invalid article_id', () => {
        return request(app).get('/api/articles/banana')
            .expect(400).then(({ body }) => {
                expect(body.msg).toBe('bad request');
            })
    });
});


