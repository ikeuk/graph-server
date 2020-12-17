const express = require('express');
const graphqIHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

//allow cross-origin request
app.use(cors()); 

//connect to database
mongoose.connect('mongodb://localhost:27017/ninja', { useNewUrlParser: true }, (err)=> {
	if (!err) { console.log('MongoDB Connection Succeeded.') }
	else { console.log('Error in DB Connection : ' + err) }
});

app.use('/graphql', graphqIHTTP({
	schema,
	graphiql:true
}));

app.listen(4000, () => console.log('App listening on port 4000'));