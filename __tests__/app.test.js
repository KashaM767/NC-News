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
                expect(body.topics.length).toBe(3);
                expect(body.topics[0]).toMatchObject({
                    slug: 'mitch',
                    description: 'The man, the Mitch, the legend'
                });
                body.topics.forEach((topic) => {
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
                expect(body.articles[0].comment_count).toBe(2)
                body.articles.forEach((article) => {
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        article_img_url: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        title: expect.any(String),
                        topic: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number)
                    })
                });
            });
    });
});

describe('GET /api/articles?sort_by', () => {
    test('200: returns an array of article objects sorted by valid column', () => {
        return request(app).get('/api/articles?sort_by=title')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles.length).toBe(13);
                expect(body.articles).toBeSortedBy("title", {
                    descending: true
                });
            })
    });
    test('400: sends an error message when given an invalid query', () => {
        return request(app).get('/api/articles?sort_by=banana')
            .expect(400).then(({ body }) => {
                expect(body.msg).toBe('bad request');
            })
    })
});
describe('GET /api/articles?order_by', () => {
    test('200: returns an array of articles, can be ordered either ascending or descending', () => {
        return request(app).get('/api/articles?order=asc')
            .expect(200).then(({ body }) => {
                expect(body.articles.length).toBe(13);
                expect(body.articles).toBeSortedBy("created_at");
            })
    });
    test('400: sends an error message when given an invalid query', () => {
        return request(app).get('/api/articles?order=banana')
            .expect(400).then(({ body }) => {
                expect(body.msg).toBe('bad request');
            })
    })
});

describe('GET /api/articles?', () => {
    test('200: accepts a combination of queries', () => {
        return request(app).get('/api/articles?topic=mitch&sort_by=author&order=asc')
            .expect(200).then(({ body }) => {
                expect(body.articles.length).toBe(12);
                body.articles.forEach((article) => {
                    expect(article.topic).toBe("mitch");
                })
                expect(body.articles).toBeSortedBy("author");
            })
    });
});

describe('GET /api/articles/?topic', () => {
    test('200: filters the articles by the topic value specified in the query.', () => {
        return request(app).get('/api/articles?topic=mitch')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy("created_at", {
                    descending: true
                });
                expect(body.articles.length).toBe(12);
                body.articles.forEach((article) => {
                    expect(article.topic).toBe('mitch')
                })
            })
    });
    test('200: sends an empty array if topic exists but has no articles', () => {
        return request(app).get('/api/articles?topic=paper')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toEqual([])
            })
    });
    test('404: sends an error message if topic is invalid', () => {
        return request(app).get('/api/articles?topic=banana')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('not found');
            })
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
                        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                    })
            })
    });
    test('200: correct comment_count value should be added', () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toMatchObject(
                    {
                        comment_count: 11
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

describe('GET /api/articles/:article_id/comments', () => {
    test("200: returns an empty array if no comments for the given article_id", () => {
        return request(app).get('/api/articles/2/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toEqual([])
            })
    });
    test("200: returns an array of comments for the given article_id", () => {
        return request(app).get('/api/articles/3/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body.comments.length).toBe(2);
                expect(body.comments).toBeSortedBy("created_at", {
                    descending: true
                });
                body.comments.forEach((comment) => {
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

describe('DELETE /api/comments/:comment_id', () => {
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
                expect(body.users.length).toBe(4);
                body.users.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                })
            });
    });
})

describe('GET /api/users/:username', () => {
    test('200: returns object contining a single user', () => {
        return request(app)
            .get('/api/users/icellusedkars')
            .expect(200)
            .then(({ body }) => {
                expect(body.user).toMatchObject(
                    {
                        username: 'icellusedkars',
                        name: 'sam',
                        avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
                    }
                )
            })
    });
    test("404: responds with an error message if the username does not exist", () => {
        return request(app)
            .get('/api/users/parrotfish')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    });
});

describe('PATCH /api/comments/:commnent_id', () => {
    test("200 update an comment by comment_id and responds with the updated comment", () => {
        const input = {
            inc_votes: 30
        };
        return request(app).patch('/api/comments/2')
            .expect(200)
            .send(input)
            .then(({ body }) => {
                expect(body.comment.votes).toEqual(44)
            })
    });
    test("200 can increase and decrease a comment's vote total by comment_id and responds with the updated comment", () => {
        const input = {
            inc_votes: -10
        };
        return request(app).patch('/api/comments/3')
            .expect(200)
            .send(input)
            .then(({ body }) => {
                expect(body.comment.votes).toEqual(90)
            })
    });
    test('404 returns an error message if comment_id is valid but not found', () => {
        const input = {
            inc_votes: 30
        };
        return request(app).patch('/api/comments/66')
            .expect(404)
            .send(input)
            .then(({ body }) => {
                expect(body.msg).toBe('not found');
            })
    });
    test('400 returns an error message if comment_id is invalid', () => {
        const input = {
            inc_votes: 30
        };
        return request(app).patch('/api/comments/banana')
            .expect(400)
            .send(input)
            .then(({ body }) => {
                expect(body.msg).toBe('bad request');
            })
    });
    test('400 for invalid inc_votes value', () => {
        const input = { inc_votes: 'banana' };
        return request(app).patch('/api/comments/4')
            .expect(400)
            .send(input)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request");
            });
    });
});

describe('POST /api/articles', () => {
    test('201: adds a new article to articles and responds with the posted article', () => {
        const newArticle = {
            title: "G",
            topic: "mitch",
            author: "butter_bridge",
            body: "Great hair!",
            article_img_url:
                "https://images.unsplash.com/photo-1627843221135-995cc6e9f723?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        };
        return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(201)
            .then(({ body }) => {
                expect(body.article.article_id).toBe(14);
                expect(body.article.title).toBe('G');
                expect(body.article.topic).toBe('mitch');
                expect(body.article.author).toBe('butter_bridge');
                expect(body.article.body).toBe('Great hair!');
                expect(body.article.created_at).toEqual(expect.any(String));
                expect(body.article.votes).toBe(0);
                expect(body.article.article_img_url).toBe('https://images.unsplash.com/photo-1627843221135-995cc6e9f723?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
                expect(body.article.comment_count).toBe(0);
            })
    });
    test('201: adds a default image URL if not provided with one', () => {
        const newArticle = {
            title: "G",
            topic: "mitch",
            author: "butter_bridge",
            body: "Great hair!"
        };
        return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(201)
            .then(({ body }) => {
                expect(body.article.article_id).toBe(14);
                expect(body.article.title).toBe('G');
                expect(body.article.topic).toBe('mitch');
                expect(body.article.author).toBe('butter_bridge');
                expect(body.article.body).toBe('Great hair!');
                expect(body.article.created_at).toEqual(expect.any(String));
                expect(body.article.votes).toBe(0);
                expect(body.article.article_img_url).toBe('https://images.unsplash.com/photo-1586339949216-35c2747cc36d?q=80&w=2666&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
                expect(body.article.comment_count).toBe(0);
            })
    });
    test('201: Ignores any unnecessary properties on the request body.', () => {
        const newArticle = {
            title: "G",
            topic: "mitch",
            author: "butter_bridge",
            body: "Great hair!",
            contact: "bb@gmail.com"
        };
        return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(201)
            .then(({ body }) => {
                expect(body.article.article_id).toBe(14);
                expect(body.article.title).toBe('G');
                expect(body.article.topic).toBe('mitch');
                expect(body.article.author).toBe('butter_bridge');
                expect(body.article.body).toBe('Great hair!');
                expect(body.article.created_at).toEqual(expect.any(String));
                expect(body.article.votes).toBe(0);
                expect(body.article.article_img_url).toBe('https://images.unsplash.com/photo-1586339949216-35c2747cc36d?q=80&w=2666&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
                expect(body.article.comment_count).toBe(0);
            })
    });
    test('400 responds with an appropriate status and error message when missing required field', () => {
        const newArticle = {
            topic: "mitch",
            author: "butter_bridge",
            body: "Great hair!",
        };
        return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('bad request');
            });
    });
    test('404: responds with an error message if username does not exist', () => {
        const newArticle = {
            title: "G",
            topic: "mitch",
            author: "joe99",
            body: "Great hair!",
        };
        return request(app)
            .post('/api/articles')
            .send(newArticle)
            .then(({ body }) => {
                expect(body.msg).toBe('not found');
            })
    });
});