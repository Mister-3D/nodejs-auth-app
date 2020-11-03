const express = require("express");
const router = express.Router();



const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

const { userById } = require("../controllers/user");


// when surfing through our application, we want to ensure authentication
// so we use our middlewares from the controllers/auth.js
// the 'requireSignin' makes sure the user is always signed in/has logged in with an authenticated token (express-jwt)
// the 'isAuth' ensures the current logged in user token will only be used by that user and not any other user
// the 'isAdmin' checks if the logged in user(role:1/0) is an admin or just a normal user
router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
	res.json({
		user: req.profile
	});
});

// whenever there is a "userById" in the route parameter,
// e.g. http://localhost:8800/api/secret/:userId
// this method (userById)from the (controller/user.js) will run
// and make the user information available in the request object
// this methods checks to see if a user with the sent ID exists or not
router.param('userId', userById);


module.exports = router;