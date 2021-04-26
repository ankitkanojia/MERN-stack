const router = require('express').Router();
let User = require('../models/user.model');
const auth = require("./../middleware/auth");
const bcrypt = require("bcryptjs");
const io = require("./../socket");

router.get("/", auth, async (req, res) => {
	await User.find({})
    .populate('posts')
    .exec()
    .then((users) => {
      res.json(users);
    }, (err) => {
      res.send(err);
    });
})

router.route('/add').post(async (req, res) => {
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
		io.getIO().emit("userAdded");
		res.json(savedUser);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/:id", async (req, res) => {
    try {
		const user = await User.findOne({ _id: req.params.id })
		res.send(user)
	} catch {
		res.status(404)
		res.send({ error: "User doesn't exist!" })
	}
});

router.patch("/:id", async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id })

		if (req.body.username) {
			user.username = req.body.username
		}

		await user.save()
		res.send(user)
	} catch {
		res.status(404)
		res.send({ error: "User doesn't exist!" })
	}
})

router.delete("/:id", async (req, res) => {
	try {
		await User.deleteOne({ _id: req.params.id })
		res.status(204).send()
	} catch {
		res.status(404)
		res.send({ error: "User doesn't exist!" })
	}
})

module.exports = router;