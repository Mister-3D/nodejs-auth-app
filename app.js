const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require('express-validator');
require('dotenv').config(); 
// import routes 
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user'); 


// app
const app = express();

/* db connections */
// connection to our local database
mongoose
	.connect(process.env.DATABASE, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	})
	.then(() => console.log("DB Connected"));




// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());



// routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);


const port = process.env.PORT || 99999999

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

app.use(function(req, res) {
  res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	res.end("<h1>Hello World!</h1><br><br><p>Getting Started with my First NodeJS Cloud App.</p><p>Let's Begin....</p>");
});