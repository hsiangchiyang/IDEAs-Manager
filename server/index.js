const {MONGODB,EXPRESSPORT,PATHTOSWAGGERUI} = require('./config.js');
const express = require('express')
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const mongoose = require('mongoose');
const schema = require('./schema/schema');

// Express Setup
const app = express()
var bodyParser = require('body-parser');
var port = EXPRESSPORT || 8080; 

// connect to mongoDB
mongoose
.connect(MONGODB,{ useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
        console.log('MongoDB connected!');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// graphql 
app.use('/graphql',graphqlHTTP({
    schema,
    graphiql:true
}));

// api routes
var router = require('./routes/routes')
app.use('/api', router);

// swaggerui 
app.use('/swagger', express.static(PATHTOSWAGGERUI));

app.use(express.static(`swagger-ui`))

app.use(function(req, res, next) {
  res.status(404).send('404 page not found');
});

app.listen(port, () => {
  console.log(`Service App listening at http://localhost:${port}/`)
})

