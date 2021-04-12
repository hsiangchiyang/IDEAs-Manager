var express = require('express')
var router = express.Router();
const querystring = require('querystring');
const url = require('url');
const axios = require('axios');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', new Date().toISOString());
    next();
});

// root api testing
router.get('/', function (req, res) {
    res.send('APIs are working!');
});

// define routes for idea
router.get('/ideas', function (req, res) {
    var query = '{ideas{id title body createdAt user{ id username email}}}'
    axios.get('http://localhost:3000/graphql',{params:{query:query}}).then(response => {
        console.log(response.data);
        if (response.data.errors){
            res.status(400).send({Message:'Bad Request'});
        }else{
            res.json(response.data);
        }
      })
      .catch(error => {
        console.log(error);
        res.send(error);
      });
});

router.get('/idea/:id', function (req, res) {
    console.log(req.params.id);
    var query = `{idea(id:"${req.params.id}"){id title body createdAt user{ id username email}}}`;
    
    axios.get('http://localhost:3000/graphql',{params:{query:query}}).then(response => {
        console.log(response.data);
        if (response.data.errors){
            res.status(400).send({Message:'Bad Request'});
        }else{
            res.json(response.data);
        }
      })
      .catch(error => {
        console.log(error);
        res.status(400).send(error);
      });
});

router.post('/addIdea', function (req, res) {
    const queryObject = url.parse(req.url,true).query;
    var title = String(queryObject.title);
    var body = String(queryObject.body);
    var userId = String(queryObject.userId);
    // console.log(querystring.parse(req.url));
    console.log(queryObject);
    var query = `mutation{addIdea(title: "${title}", body: "${body}", userId: "${userId}"){id title body createdAt user{ id username email}}}`;
    
    axios.post('http://localhost:3000/graphql',{query:query}).then(response => {
        console.log(response.data);
        if (response.data.errors){
            res.status(400).send({Message:'Bad Request'});
        }else{
            res.json(response.data);
        }
      })
      .catch(error => {
        console.log(error);
        res.status(400).send(error);
      });
});

// define routes for user

router.get('/users', function (req, res) {
    var query = '{users{id email username createdAt}}'
    axios.get('http://localhost:3000/graphql',{params:{query:query}}).then(response => {
        console.log(response.data);
        if (response.data.errors){
            res.status(400).send({Message:'Bad Request'});
        }else{
            res.json(response.data);
        }
      })
      .catch(error => {
        console.log(error);
        res.send(error);
      });
});

router.get('/user/:id', function (req, res) {
    console.log(req.params.id);
    var query = `{user(id:"${req.params.id}"){id email username createdAt ideas{id title body createdAt}}}`;
    
    axios.get('http://localhost:3000/graphql',{params:{query:query}}).then(response => {
        console.log(response.data);
        if (response.data.errors){
            res.status(400).send({Message:'Bad Request'});
        }else{
            res.json(response.data);
        }
      })
      .catch(error => {
        console.log(error);
        res.status(400).send(error);
      });
});

router.post('/addUser', function (req, res) {
    const queryObject = url.parse(req.url,true).query;
    var username = String(queryObject.username);
    var email = String(queryObject.email);
    var password = String(queryObject.password);
    // console.log(querystring.parse(req.url));
    console.log(queryObject);
    var query = `mutation{addUser(password: "${password}", email: "${email}", username: "${username}"){id email username createdAt}}`;
    
    axios.post('http://localhost:3000/graphql',{query:query}).then(response => {
        console.log(response.data);
        if (response.data.errors){
            res.status(400).send({Message:'Bad Request'});
        }else{
            res.json(response.data);
        }
      })
      .catch(error => {
        console.log(error);
        res.status(400).send(error);
      });
});


module.exports = router;