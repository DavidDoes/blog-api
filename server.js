const express = require('express');
const morgan = require('morgan');

const app = express();

const blogPostRouter = require('./blogPostRouter');

app.use(express.json());
app.use(morgan('common'));

// app.get('/', (req, res) => {
//     res.send('hello');
// });

// requests to `/blog-posts` will be routed to express router instance
app.use('/blog-posts', blogPostRouter); //(url endpoint, js file)

//declare empty variable 
let server;

//start server, return Promise.
function runServer(){
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => {
        server = app
            .listen(port, () => {
                console.log(`Your app is listening on port ${port}`)
                resolve(server)
            })
            .on('error', err => {
                reject(err)
            })
    })
}

//return Promise manually
function closeServer(){
    return new Promise((resolve, reject) => {
        console.log('Closing server')
        server.close(err => {
            if(err){
                reject(err) //don't call resolve 
                return
            }
            resolve()
        })
    })
}

//if server called directly (i.e. command line), run this line. 
//also export runServer command so useable elsewhere
if (require.main === module){
    runServer().catch(err => console.error(err));
}

//don't need app.listen due to line 21 in runServer()
// app.listen(process.env.PORT || 8080, () => {
//     console.log(`App is listening on port ${process.env.PORT || 8080}`)
// });

//export app, runServer, closeServer
module.exports = { app, runServer, closeServer };