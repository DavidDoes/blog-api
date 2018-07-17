const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json(); //to get object

const {BlogPosts} = require('./models');

//create BlogPosts objects so we have something to work with
BlogPosts.create(
        'What could the shortest blog post ever be?',
        'Pretty short, it turns out...',
        'Lazy Luther',
        'July 8, 2018' //not working
);
BlogPosts.create(
        'You will not believe what you find in here!',
        'A lot of eye-grabbing nonsense!',
        'Buzzfeed Freak',
        'July 1, 2018' //not working
);

//when route called with GET, return current BlogPosts items
router.get('/', (req, res) => { //working
    res.json(BlogPosts.get());
});

//verify required fields present, if not log error return 400
//if okay add new item return 201
router.post('/', jsonParser, (req, res) => { //working
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++){
        const field = requiredFields[i];
        if (!(field in req.body)){
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = BlogPosts.create(req.body.name, req.body.content, req.body.author);
    res.status(201).json(item);
});

//
router.put('/:id', jsonParser, (req, res) => { //not working 500 error [object Object]
    const requiredFields = ['id', 'title', 'content'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
        }
        if (req.params.id !== req.body.id) {
        const message = (
            `Request path id (${req.params.id}) and request body id `
            `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).send(message);
        }
    console.log(`Updating blog post \`${req.params.id}\``);
    const updatedItem = BlogPosts.update({
        id: req.params.id,
        title: req.body.name,
        content: req.body.content,
        author: req.body.author
    });
    res.status(204).end();
})

router.delete('/:id', jsonParser, (req, res) => { //working
    BlogPosts.delete(req.params.id);
    console.log(`Delete blog post \`${req.params.ID}\``);
    res.status(204).end();
});

module.exports = router;