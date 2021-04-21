const router = require('express').Router();
let User = require('../models/user.model');
const auth = require("./../middleware/auth");

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
    const user = new User({
		username: req.body.username
	})
	await user.save()
	res.send(user)
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