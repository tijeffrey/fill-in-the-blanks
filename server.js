const express = require('express');
const app = express();
const PORT = 1250;
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
let db;
let MongoUserPassword = process.env.MongoUserPassword;

MongoClient.connect(`${MongoUserPassword}`, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database');
    db = client.db('Project-0');
  })
  .catch(error => console.error(error));

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(express.json());

app.get('/', (request, response) =>{
    db.collection('fill-blanks').find().toArray()
    .then(results => {
        response.render('index.ejs', {info: results})
    })
});

app.post('/fill-blanks', (request, response) =>{
    db.collection('fill-blanks').insertOne({fullQuote: request.body.quote.toLowerCase(), workName: request.body.work, answer: '', completed: false, stanzaAndLineNumbers: request.body.poemLineNumber})
    .then(result =>{
        response.redirect('/');
    })
    .catch(error => console.error(error))
})

app.post('/checkAnswer', (request, response) => {
    console.log(request.body.newAnswer)
    console.log(request.body.poemLine)
    db.collection('fill-blanks').updateOne({stanzaAndLineNumbers: request.body.poemLine},{
        $set: {
            answer: request.body.newAnswer
        }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))
})

app.listen(PORT, () =>{
    console.log(`The server is now running on port ${PORT}`)
})