// we import the modules and middlewares
const User = require("../models/user");
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for authorization check
const { errorHandler } = require("../helpers/dbErrorHandler");


// this handles the signup
exports.signup = (req, res) => {
	// console.log("req.body", req.body);
	const user = new User(req.body);
	user.save((error, user) => {
		if(error) {
			return res.status(400).json({
				error: errorHandler(error)
			});
		}
		user.salt = undefined;
		user.hashed_password = undefined;
		res.json({
			user
		});
	});
};

// this handles the sign in
exports.signin = ( req, res ) => {
	// find the user based on email
	const { email, password } = req.body;
	User.findOne({email}, ( error, user ) => {
		if(error || !user){
			return res.status(400).json({
				error: "User with email does not exist. Please signup"
			});
		}

		// if user is found, make sure the email and password match
		// create authenticate method in user model
		if(!user.authenticate(password)){
			return res.status(401).json({
				error: "Email and password don't match!"
			});
		}

		// if authenticated, we want to generate a signed token with user id and secret
		const token = jwt.sign({_id: user._id }, process.env.JWT_SECRET);
		// we want to persist the token as "t" in cookie with expiry date
		res.cookie("t", token, {expire: new Date() + 9999});
		// return response with user and token to frontend client
		const {_id, name, email, role } =  user;
		return res.json({token, user:{_id, email, name, role } });
	});
};


exports.signout = ( req, res ) => {
	// we clear the cookie from the response
	res.clearCookie('t');
	res.json({ message: "Signout success" });
};

// we want to work on protecting routes so that only LOGGED IN USERS
// will have access navigation through the app
// we use this as a middleware to protect any route
// we are using the (expressJwt package) for authentication
exports.requireSignin = expressJwt({
	secret: process.env.JWT_SECRET,
	userProperty: "auth"
});




// this helps us confirm that the current express.jwt token can only be used for one user
exports.isAuth = (req, res, next) => {
	let user = req.profile && req.auth && req.profile._id == req.auth._id;
	if(!user) {
		return res.status(403).json({
			error: "Access denied! User does not match current authentication token. Please Sign in"
		});
	}
	next();
};
// a method to check if the current logged in user is an admin/normal user
// this determines the kind of access the user can have
// Admin user role = 1
// Normal user role = 0
exports.isAdmin = (req, res, next) => {
	if(req.profile.role === 0){
		return res.status(403).json({
			error: "Admin resource! Access denied"
		});
	}

	next();
};