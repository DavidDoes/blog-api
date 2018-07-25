const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json(); 

const {BlogPosts} = require('./models');

//create BlogPosts objects so we have something to work with
BlogPosts.create(
        'Override the Digital Divide',
        'Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.',
        'Tech Bro',
        'July 8, 2018' 
);
BlogPosts.create(
        'All the Finest Materials...',
        'Boulevard sleepy ryokan, concierge ANA cutting-edge Tsutaya emerging lovely espresso the best Gaggenau. Business class essential smart exquisite global boulevard pintxos. Nordic hand-crafted intricate perfect, conversation hub Melbourne espresso sharp bespoke carefully curated cosy Helsinki. Charming uniforms boulevard alluring sophisticated, craftsmanship ANA pintxos emerging. Boutique hand-crafted hub, sharp soft power emerging exquisite premium Baggu intricate quality of life remarkable.',
        'Artisinal Artisian',
        'July 1, 2018' 
);

//when route called with GET, return current BlogPosts items
router.get('/', (req, res) => { 
    res.json(BlogPosts.get());
});

//verify required fields present, if not log error return 400
//if okay add new item return 201
router.post('/', jsonParser, (req, res) => { 
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++){
        const field = requiredFields[i];
        if (!(field in req.body)){
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(item);
});

//
router.put('/:id', jsonParser, (req, res) => { 
    const requiredFields = ['title', 'content', 'id']; 
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
        title: req.body.title,
        content: req.body.content,
        // author: req.body.author
    });
    res.status(204).end();
})

router.delete('/:id', jsonParser, (req, res) => { 
    BlogPosts.delete(req.params.id);
    console.log(`Delete blog post \`${req.params.ID}\``);
    res.status(204).end();
});

module.exports = router;