import User from "../models/User.js";
import Post from "../models/Post.js";

// @desc    Update user profile (details, avatar, social links)
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, bio, location, phone, avatar, coverPhoto, socialLinks } = req.body;

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (phone !== undefined) user.phone = phone;
    if (avatar) user.avatar = avatar;
    if (coverPhoto) user.coverPhoto = coverPhoto;

    if (socialLinks) {
      user.socialLinks = { ...user.socialLinks.toObject(), ...socialLinks };
    }

    const updated = await user.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get public profile of any user + their posts
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-savedPosts -cart -email"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ owner: req.params.id }).sort("-createdAt");

    res.json({ user, posts });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's own post list ("My Posts")
// @route   GET /api/users/me/posts
// @access  Private
export const getMyPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ owner: req.user._id }).sort("-createdAt");
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get saved posts list
// @route   GET /api/users/me/saved
// @access  Private
export const getSavedPosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedPosts",
      populate: { path: "owner", select: "name avatar" },
    });
    res.json(user.savedPosts);
  } catch (error) {
    next(error);
  }
};

// @desc    Add / remove item from cart
// @route   POST /api/users/cart/:postId
// @access  Private
export const toggleCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const postId = req.params.postId;

    const exists = user.cart.find((c) => c.post.toString() === postId);

    if (exists) {
      user.cart = user.cart.filter((c) => c.post.toString() !== postId);
      await user.save();
      return res.json({ message: "Removed from cart", inCart: false });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    user.cart.push({ post: postId });
    await user.save();
    res.json({ message: "Added to cart", inCart: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cart contents
// @route   GET /api/users/me/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "cart.post",
      populate: { path: "owner", select: "name avatar" },
    });
    res.json(user.cart);
  } catch (error) {
    next(error);
  }
};
