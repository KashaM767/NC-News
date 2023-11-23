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

describe('GET /api/articles', () => {
    test("200 returns an array of article objects sorted by date desc", () => {
        return request(app).get('/api/articles')
            .expect(200).then(({ body }) => {
                expect(body.articles.length).toBe(13);
                expect(body.articles).toBeSortedBy("created_at", {
                    descending: true
                });
                expect(body.articles[0].comment_count).toBe("2")
                body.articles.forEach((article) => {
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        article_img_url: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        title: expect.any(String),
                        topic: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(String)
                    })
                });
            });
    });
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
                        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                        comment_count: "11"
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
    test('201: add a comment for an article and responds with the posted comment', () => {
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
    test('201: Ignores any unnecessary properties on the request body.', () => {
        const newComment = {
            username: 'butter_bridge',
            body: 'random text generating..',
            pets: 'Kobi'
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
    test('404: responds with an error message if article_id does not exist', () => {
        const newComment = {
            username: 'butter_bridge',
            body: 'random text generating..'
        };
        return request(app)
            .post('/api/articles/62/comments')
            .send(newComment)
            .expect(404).then(({ body }) => {
                expect(body.msg).toBe('not found');
            })
    });
    test('404: responds with an error message if username does not exist', () => {
        const newComment = {
            username: 'ParrotFish',
            body: 'random text generating..'
        };
        return request(app)
            .post('/api/articles/3/comments')
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('not found');
            })
    });
});

describe('/api/comments/:comment_id', () => {
    test('204: deletes requested comment by comment_id returns 204', () => {
        return request(app).delete('/api/comments/5')
            .expect(204)
    });
    test('404: returns an error message if comment_id is valid but not found', () => {
        return request(app).delete('/api/comments/77')
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe('not found');
            })
    });
    test('400 returns an error message if comment_id is invalid', () => {
        return request(app).delete('/api/comments/banana')
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe('bad request');
            })
    });
});
describe('PATCH /api/articles/:article_id', () => {
    test("200 update an article by article_id and responds with the updated article ", () => {
        const input = {
            inc_votes: 10
        };
        return request(app).patch('/api/articles/1')
            .expect(200)
            .send(input)
            .then(({ body }) => {
                expect(body.article.votes).toEqual(110)
            })
    });
    test("200 can increase and decrease an article's vote total by article_id and responds with the updated article ", () => {
        const input = {
            inc_votes: -30
        };
        return request(app).patch('/api/articles/1')
            .expect(200)
            .send(input)
            .then(({ body }) => {
                expect(body.article.votes).toEqual(70)
            })
    });
    test('404 returns an error message if article_id is valid but not found', () => {
        const input = {
            inc_votes: 30
        };
        return request(app).patch('/api/articles/44')
            .expect(404)
            .send(input)
            .then((res) => {
                expect(res.body.msg).toBe('not found');
            })
    })
    test('400 returns an err msg if article_id is invalid', () => {
        const input = {
            inc_votes: 30
        };
        return request(app).patch('/api/articles/banana')
            .expect(400)
            .send(input)
            .then((res) => {
                expect(res.body.msg).toBe('bad request');
            })
    })
    test('400 for invalid inc_votes value', () => {
        const input = { inc_votes: 'banana' };
        return request(app).patch('/api/articles/3')
            .expect(400)
            .send(input)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request");
            });
    });
});

describe('GET /api/users', () => {
    test('200: gets all users returns an array of objects', () => {
        return request(app).get('/api/users')
            .expect(200)
            .then(({ body }) => {
                expect(body.users.rows.length).toBe(4);
                body.users.rows.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                })
            });
    });
})
