const User = require("../models/user");


// we create a method that gives us a user object whenever
// a user id is sent via a request, we reference it in the 
// (routes/user.js: line 8, 16)
exports.userById = (req, res, next, id) => {
	// i think this method (User.findById) comes with the mongoose schema module
	User.findById(id).exec((err, user) => {
		// if a user is not found then we return the error
		if(err || !user){
			return res.status(400).json({
				error: "User not found"
			});
		}
		// if a user is found, we store the user in the req (http request object) 
		// with the name of "profile" so we can access it later referencing the name
		req.profile = user;
		next();

	});
}; 