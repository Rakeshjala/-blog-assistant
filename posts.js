const router = require("express").Router();
const { Post } = require("../models");
const { wrap, protect } = require("../middleware/auth");

router.use(protect);

router.get("/", wrap(async (req, res) => res.json(await Post.find({ user: req.user._id }).sort("-createdAt"))));

router.post("/", wrap(async (req, res) => {
  const { type, prompt, result } = req.body;
  if (!result) return res.status(400).json({ error: "Nothing to save" });
  res.status(201).json(await Post.create({ user: req.user._id, type, prompt, result }));
}));

router.delete("/:id", wrap(async (req, res) => {
  const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!post) return res.status(404).json({ error: "Not found" });
  res.json({ message: "Deleted" });
}));

module.exports = router;
