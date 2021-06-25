const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()


const app = express()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xrnpv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
})

client.connect(err => {
    const blogsCollection = client.db("blogsApp").collection("blogs");
   
    // all blog get with Home and AllBlogs use the get method
    app.get('/blogs', (req, res) => {
        blogsCollection.find({})
        .toArray((err, document) => {
            res.send(document);
        })
    })

    // all blog get with Home use the get method
    app.get('/blog/:id', (req, res) => {
        blogsCollection.find({_id: ObjectId(req.params.id)})
        .toArray((err, document) => {
            res.send(document[0]);
        })
    })

    // blog add with BlogPost use the post method
    app.post('/addBlog', (req, res) => {
        const newBlog = req.body;
        blogsCollection.insertOne(newBlog)
        .then(result => {
            res.send(result.insertedCount > 0);
        }) 
    })

    // blog delete with allBlogs use the delete method
    app.delete('/delete/:id', (req, res) => {
        blogsCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.send(result.deletedCount > 0);
        })
    })



    // client.close();
});

app.listen(process.env.PORT || 4000);