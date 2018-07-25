'use strict';

const chai = require("chai");
const chaiHttp = require('chai-http');
const expect = chai.expect;
const {
    app,
    runServer,
    closeServer
} = require('../server'); //.js not required

chai.use(chaiHttp)

describe('Blog Posts', function () {
    before(function () {
        runServer()
    })

    after(function () {
        closeServer()
    })

    it('should show blog posts on GET', function () {
        return chai
            .request(app)
            .get('/blog-posts')
            .then(function (res) {
                expect(res).to.have.status(200)
                expect(res).to.be.json
                expect(res.body).to.be.a('array')

                const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate']
                res.body.forEach(function (item) {
                    expect(item).to.be.a('object')
                    expect(item).to.include.keys(expectedKeys)
                })
            })
    })
    it('should add blog post on POST', function () { //error: Missing `title` in request body
        const newPost = {
            title: 'Great post title',
            content: 'lorem ipsum',
            author: 'Buzz Poster'
        }
        return chai
            .request(app)
            .post('/blog-posts')
            .send(newPost)
            .then(function (res) {
                expect(res).to.have.status(201)
                expect(res).to.be.json
                expect(res.body).to.be.a('object')
                expect(res.body).to.include.keys('title', 'content', 'author', 'publishDate')
            })
    })
    it('should updated post on PUT', function () { //error: Missing `title` in request body
        const updateData = {
            title: 'lorem',
            content: 'ipsum'
        }

        return (
            chai
            .request(app)
            .get('/blog-posts')
            .then(function (res) {
                updateData.id = res.body[0].id
                return chai
                    .request(app)
                    .put(`/blog-posts/${updateData.id}`)
                    .send(updateData)
            })
            .then(function (res) {
                expect(res).to.have.status(204)
            })
        )
    })
    it('should delete post on DELETE', function () {
        return (
            chai
            .request(app)
            .get('/blog-posts')
            .then(function (res) {
                return chai.request(app).delete(`/blog-posts/${res.body[0].id}`)
            })
            .then(function (res) {
                expect(res).to.have.status(204)
            })
        )
    })
})