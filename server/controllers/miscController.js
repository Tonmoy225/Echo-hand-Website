import Report from "../models/Report.js";
import Feedback from "../models/Feedback.js";

// @desc    Submit a report (problem reporting feature)
// @route   POST /api/reports
// @access  Private
export const submitReport = async (req, res, next) => {
  try {
    const { reason, details, targetPost, targetUser } = req.body;

    if (!reason || !details) {
      return res.status(400).json({ message: "Reason and details are required" });
    }

    const report = await Report.create({
      reporter: req.user._id,
      reason,
      details,
      targetPost: targetPost || undefined,
      targetUser: targetUser || undefined,
    });

    res.status(201).json({ message: "Report submitted. We'll review within 24 hours.", report });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private
export const submitFeedback = async (req, res, next) => {
  try {
    const { type, subject, message } = req.body;

    if (!type || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      type,
      subject,
      message,
    });

    res.status(201).json({ message: "Feedback sent — thank you!", feedback });
  } catch (error) {
    next(error);
  }
};
