// we import our modules
const express = require("express");
const router = express.Router();

//
const { signup, signin, signout, requireSignin } = require("../controllers/auth");
const { userSignupValidator } = require("../validator");

// routes for signup, signin and signout 
router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

// the route below is just for testing purposes to see the effect of the (requireSignin)
router.get("/hello", requireSignin, (req, res) => {
	res.send("hello there");
});


module.exports = router;