import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";

// @desc    Add comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      post: req.params.id,
      author: req.user._id,
      text,
    });

    if (post.owner.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.owner,
        sender: req.user._id,
        type: "comment",
        post: post._id,
        text: `${req.user.name} commented on your post "${post.title}"`,
      });
    }

    const populated = await comment.populate("author", "name avatar");
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all comments for a post
// @route   GET /api/posts/:id/comments
// @access  Public
export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate("author", "name avatar")
      .sort("-createdAt");
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete own comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    next(error);
  }
};
