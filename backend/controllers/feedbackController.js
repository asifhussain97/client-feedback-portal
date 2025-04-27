const Feedback = require('../models/Feedback');
const generateAdminReply = require('../utils/aiReply');

exports.submitFeedback = async (req, res) => {
    try {
      const { title, text, rating } = req.body;
      const image = req.file ? req.file.filename : null;
      const feedback = new Feedback({
        user: req.user.id,
        title, 
        text,
        rating,
        image
      });
  
      await feedback.save();
      res.status(201).json({ status:true,message: 'Feedback submitted successfully' });
    } catch (err) {
      res.status(500).json({ status:false,error: err.message });
    }
};
  
exports.getUserFeedback = async (req, res) => {
    try {
      const userId = req.user.id; 
      const feedbacks = await Feedback.find({ user: userId }).sort({ createdAt: -1 });
      res.json(feedbacks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status:false,message: "Server Error" });
    }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const { rating } = req.query;
    const filter = rating ? { rating: Number(rating) } : {};

    const feedbacks = await Feedback.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ status:false,error: err.message });
  }
};

exports.getAISuggestedReply = async (req, res) => {
    try {
      const { feedbackId } = req.params;
      const feedback = await Feedback.findById(feedbackId);
  
      if (!feedback) return res.status(404).json({ error: 'Feedback not found' });
  
      const reply = await generateAdminReply(feedback.text, feedback.rating);
      res.json({ suggestedReply: reply });
    } catch (err) {
      res.status(500).json({ status:false,error: err.message });
    }
};

exports.submitAdminReply = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const { text } = req.body;

        const feedback = await Feedback.findById(feedbackId);
        console.log(req.params,req.body,feedback,"feedback");
        if (!feedback) {
        return res.status(404).json({ error: 'Feedback not found' });
        }

        feedback.adminReply = text; 
        await feedback.save();

        res.status(200).json({ status:true,message: 'Reply submitted successfully' });
    } catch (err) {
        res.status(500).json({ status:false,error: err.message });
    }
};

exports.deleteFeedback = async (req, res) => {
    try {
      const { feedbackId } = req.params;
  
      const feedback = await Feedback.findByIdAndDelete(feedbackId);
  
      if (!feedback) {
        return res.status(404).json({ status: false, message: 'Feedback not found' });
      }
  
      res.status(200).json({ status: true, message: 'Feedback deleted successfully' });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  };
  