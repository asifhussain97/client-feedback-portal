const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');
const {
  submitFeedback,
  getAllFeedback,
  submitAdminReply,
  getAISuggestedReply,
  getUserFeedback,
  deleteFeedback
} = require('../controllers/feedbackController');

// Client submits feedback
router.post('/', auth, upload.single('image'), submitFeedback);

// Client feedback data
router.get('/user', auth, getUserFeedback);

// Admin gets feedbacks
router.get('/admin', auth, roleCheck('admin'), getAllFeedback);

// Admin ai suggetion
router.get('/:feedbackId/suggest-reply', auth, roleCheck('admin'), getAISuggestedReply);

// Admin reply to feedback
router.post('/:feedbackId/reply', auth, roleCheck('admin'), submitAdminReply);

// Admin delete to feedback
router.delete('/:feedbackId/delete', auth, roleCheck('admin'),  deleteFeedback);

module.exports = router;
