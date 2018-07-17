const express = require('express');

const app = express();

const blogPostRouter = require('./blogPostRouter');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello');
});

// requests to `/blog-posts` will be routed to express router instance
app.use('/blog-posts', blogPostRouter); //(url endpoint, js file)

app.listen(process.env.PORT || 8080, () => {
    console.log(`App is listening on port ${process.env.PORT || 8080}`)
});