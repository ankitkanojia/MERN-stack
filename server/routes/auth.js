const router = require('express').Router();
let User = require('../models/user.model');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.route('/register').post(async (req, res) => {
	try {
		let { email, password, username } = req.body;

		// validate
		if (!email || !password || !username)
			return res.status(400).json({ msg: "fields are required." });
		if (password.length < 5)
			return res
				.status(400)
				.json({ msg: "The password needs to be at least 5 characters long." });

		const existingUser = await User.findOne({ email: email });
		if (existingUser)
			return res
				.status(400)
				.json({ msg: "An account with this email already exists." });

		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(password, salt);

		const newUser = new User({
			email,
			password: passwordHash,
			username
		});
		const savedUser = await newUser.save();
		res.json(savedUser);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.post("/login", async (req, res) => {
    try {
        const { username , password } = req.body;

        // validate
        if (!username || !password)
            return res.status(400).json({ msg: "Not all fields have been entered." });

        const user = await User.findOne({ username: username });
        if (!user)
            return res
                .status(400)
                .json({ msg: "No account with this email has been registered." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        console.log("token", token);
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;