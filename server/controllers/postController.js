import Post from "../models/Post.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// @desc    Create a new post (listing)
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    const { title, description, images, price, negotiable, category, condition, location } =
      req.body;

    if (!title || !description || !price || !category || !condition || !location) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const post = await Post.create({
      owner: req.user._id,
      title,
      description,
      images: images || [],
      price,
      negotiable,
      category,
      condition,
      location,
    });

    // Reward eco-score for posting (encourages reuse over waste)
    await User.findByIdAndUpdate(req.user._id, { $inc: { ecoScore: 10 } });

    const populated = await post.populate("owner", "name avatar location");
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get news feed (all posts, paginated, filterable)
// @route   GET /api/posts?category=&search=&condition=&page=&minPrice=&maxPrice=
// @access  Public
export const getFeed = async (req, res, next) => {
  try {
    const { category, search, condition, page = 1, limit = 10, minPrice, maxPrice } = req.query;

    const query = { status: "available" };
    if (category && category !== "All") query.category = category;
    if (condition) query.condition = condition;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const posts = await Post.find(query)
      .populate("owner", "name avatar location ecoScore")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single post by ID (also increments views)
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("owner", "name avatar location socialLinks ecoScore");

    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    next(error);
  }
};

// @desc    Update own post (owner controls)
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this post" });
    }

    const fields = [
      "title",
      "description",
      "images",
      "price",
      "negotiable",
      "category",
      "condition",
      "location",
      "status",
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) post[f] = req.body[f];
    });

    const updated = await post.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete own post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark post as sold/reserved/available (owner control)
// @route   PATCH /api/posts/:id/status
// @access  Private
export const updatePostStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    post.status = status;
    await post.save();
    res.json(post);
  } catch (error) {
    next(error);
  }
};

// @desc    Like / Unlike a post
// @route   POST /api/posts/:id/like
// @access  Private
export const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id.toString();
    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(req.user._id);

      // Notify post owner (skip self-notify)
      if (post.owner.toString() !== userId) {
        await Notification.create({
          recipient: post.owner,
          sender: req.user._id,
          type: "like",
          post: post._id,
          text: `${req.user.name} liked your post "${post.title}"`,
        });
      }
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: !alreadyLiked });
  } catch (error) {
    next(error);
  }
};

// @desc    Save / Unsave a post (bookmark)
// @route   POST /api/posts/:id/save
// @access  Private
export const toggleSave = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const postId = req.params.id;

    const alreadySaved = user.savedPosts.some((id) => id.toString() === postId);

    if (alreadySaved) {
      user.savedPosts = user.savedPosts.filter((id) => id.toString() !== postId);
    } else {
      user.savedPosts.push(postId);
    }

    await user.save();
    res.json({ saved: !alreadySaved });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a share event
// @route   POST /api/posts/:id/share
// @access  Private
export const sharePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { shareCount: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ shareCount: post.shareCount });
  } catch (error) {
    next(error);
  }
};
