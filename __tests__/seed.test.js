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
});

describe('GET:404 - bad path', () => {
    test('GET:404 returns status code of 404 and "path not found" msg if api path is invalid', () => {
        return request(app).get('/api/topiks')
            .expect(404).then(({ body }) => {
                expect(body.msg).toBe('path not found');
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
                expect(body.rows).toBeSortedBy("created_at", {
                    descending: true
                });
                body.rows.forEach((comment) => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        body: expect.any(String),
                        article_id: expect.any(Number),
                        author: expect.any(String),
                        votes: expect.any(Number),
                        created_at: expect.any(String)
                    });
                })
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

describe('POST /api/articles/:article_id/comments', () => {
    test('201: add a comment for an article and respod with the posted comment', () => {
        const newComment = {
            username: 'butter_bridge',
            body: 'random text generating..'
        };
        return request(app)
            .post('/api/articles/4/comments')
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                expect(body.comment.comment_id).toBe(19);
                expect(body.comment.body).toBe('random text generating..');
                expect(body.comment.article_id).toBe(4);
                expect(body.comment.author).toBe('butter_bridge');
                expect(body.comment.votes).toBe(0);
                expect(body.comment.created_at).toEqual(expect.any(String));
            })
    });
    test('400 responds with an appropriate status and error message when missing required field', () => {
        const newComment = {
            body: 'random text...'
        };
        return request(app)
            .post('/api/articles/4/comments')
            .send(newComment)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('bad request');
            });
    });
    test('400: responds with an error message if passed an invalid article_id', () => {
        return request(app)
            .post('/api/articles/banana/comments')
            .expect(400).then(({ body }) => {
                expect(body.msg).toBe('bad request');
            })
    });
});


