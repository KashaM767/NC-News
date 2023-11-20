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

describe.only('GET /api', () => {
    test("GET:200 returns status code of 200, object containing all apis", () => {
        return request(app).get('/api')
            .expect(500).then((res) => {
                console.log(res.body)
            })
    })
})
