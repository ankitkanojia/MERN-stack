const router = require('express').Router();
let User = require('../models/user.model');
let Post = require('../models/post.model');

router.get("/", async (req, res) => {
    await Post.find({})
    .populate('user')
    .exec()
    .then((posts) => {
      res.json(posts);
    }, (err) => {
      res.send(err);
    });
})

router.route('/add').post(async (req, res) => {
    const userID = await req.body.userID;
    const title = await req.body.title;
    const newPost = new Post({ title : title });

    await User.findOne({ _id: userID }, async (err, user) => {
        if (!user) {
            return err;
        }
        user.posts.push(newPost);
        newPost.user = user;
        await newPost.save((error, savedPost) => {
          if (error) {
            return error;
          }
          return res.json(savedPost);
        });
        await user.save((error, savedAuthor) => {
          if (error) {
            return error;
          }
          savedAuthor;
        });
        return user;
    });
});

router.delete("/:id", async (req, res) => {
	try {
		await Post.deleteOne({ _id: req.params.id })
		res.status(204).send()
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})

module.exports = router;