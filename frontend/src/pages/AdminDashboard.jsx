import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {fetchAllFeedback, getAISuggestedReply, filterByRating, filterByDate, submitReply, deleteFeedback} from '../redux/slices/feedbackSlice';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { items, loading, aiReplies, filteredItems } = useSelector((state) => state.feedback);

  const [replies, setReplies] = useState({});
  const [filters, setFilters] = useState({
    rating: '',
    date: 'all',
  });
  const [sortNewestFirst, setSortNewestFirst] = useState(true); 
  const [sortHighestFirst, setSortHighestFirst] = useState(true); 
  const [sortByDate, setSortByDate] = useState(true); 

  useEffect(() => {
    dispatch(fetchAllFeedback());
  }, [dispatch]);

  const handleAISuggest = (id) => {
    dispatch(getAISuggestedReply(id));
  };

  const handleReplyChange = (id, value) => {
    setReplies({
      ...replies,
      [id]: value,
    });
  };

  const handleSubmitReply = (feedbackId) => {
    const replyText = replies[feedbackId];
    if (!replyText) return;
    dispatch(submitReply({ feedbackId, text: replyText }))
      .then((res) => {
        if (res.payload.status) {
          dispatch(fetchAllFeedback()); 
          toast.success(res.payload.message);
          setReplies((prev) => ({
            ...prev,
            [feedbackId]: '',
          }));
        } else if (res.payload.error || res.payload.message) {
            toast.error(res.payload.error || res.payload.message);
        }
      })
      .catch((err) => {
        toast.error(err?.message || 'Error submitting reply!');
      });
  };

  const handleDeleteFeedback = (feedbackId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will permanently delete the feedback. Do you want to continue?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteFeedback(feedbackId))
          .then((res) => {
                if (res.payload.status) {
                    dispatch(fetchAllFeedback()); 
                    toast.success(res.payload.message);
                } else if (res.payload.error || res.payload.message) {
                    toast.error(res.payload.error || res.payload.message);
                }
            })
          .catch((err) => {
            toast.error(err?.message || 'Error deleting feedback!');
          });
      }
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
    if (name === 'rating') {
      dispatch(filterByRating(value));
    } else if (name === 'date') {
      dispatch(filterByDate(value));
    }
  };

  const sortedFeedbacks = [...filteredItems].sort((a, b) => {
    if (sortByDate) {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      if (sortNewestFirst) {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    } else {
      const ratingA = a.rating;
      const ratingB = b.rating;
      if (sortHighestFirst) {
        return ratingB - ratingA;
      } else {
        return ratingA - ratingB;
      }
    }
  });

  return (
    <div className="admin-dashboard">
      <div className="feedback-sidebar">
        <div className="feedback-content-wrapperadmin">
          <div>
          <h2 className="feedback-headingside">Filter</h2>

          <div className="filter-section">
            <label className="filter-label">Filter by Rating:</label>
            <select
              name="rating"
              value={filters.rating}
              onChange={handleFilterChange}
              className="admin-select"
            >
              <option value="">All Ratings</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
          
          <div className="filter-section">
            <label className="filter-label">Filter by Date:</label>
            <select
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="admin-select"
            >
              <option value="all">All Time</option>
              <option value="last7">Last 7 Days</option>
              <option value="last30">Last 30 Days</option>
            </select>
          </div>
          </div>
          <div>
          <h2 className="feedback-headingside">Sort</h2>

          <div className="filter-section">
            {/* Date sorting */}
            <button className="sort-buttonadmin" onClick={() => { 
              setSortByDate(true); // Enable Date sorting
              setSortNewestFirst(!sortNewestFirst); // Toggle Newest/Oldest
            }}>
              By Date: {sortNewestFirst ? 'Newest' : 'Oldest'}
            </button>

            {/* Rating sorting */}
            <button className="sort-buttonadmin" onClick={() => { 
              setSortByDate(false); // Enable Rating sorting
              setSortHighestFirst(!sortHighestFirst); // Toggle Highest/Lowest
            }}>
              By Rating: {sortHighestFirst ? 'Highest' : 'Lowest'}
            </button>
          </div>
          </div>
        </div>      
      </div>

      <div className="admin-content">
        <div className="feedback-list">
          <h2 className="admin-heading">Admin Feedback Dashboard</h2>

          {loading ? (
            <p>Loading feedback...</p>
          ) : (
            <>
              {sortedFeedbacks.map((fb) => (
                <div key={fb._id} className="feedback-cardadmin">
                  <div className="feedback-top">
                    <div className="feedback-left">
                      <div className="feedback-actions">
                        <p className="feedback-user">User: {fb.user?.name}</p>
                        <p className="feedback-rating">Rating: {fb.rating} ⭐</p>
                      </div>
                      <p className="feedback-texttitle">{fb.title}</p>
                      <p className="feedback-text">{fb.text}</p>
                      <div className="feedback-headeradmin">
                        <span>Date: {new Date(fb.createdAt).toLocaleDateString()}</span>
                        <span>Time: {new Date(fb.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <div className="feedback-right">
                      {fb.image && (
                        <img
                          src={`http://localhost:5000/uploads/${fb.image}`}
                          alt="feedback"
                          className="feedback-imageadmin"
                        />
                      )}
                    </div>
                  </div>

                  <div className="feedback-bottom">
                    {!fb.adminReply && (
                        <div className="feedback-actions">
                            <button
                                className="suggest-reply-btn"
                                onClick={() => handleAISuggest(fb._id)}
                            >
                                Suggest Reply
                            </button>

                            {aiReplies[fb._id] && (
                            <div className="ai-reply">
                                <strong>AI:</strong> {aiReplies[fb._id]}
                            </div>
                            )}
                        </div>
                    )}

                    {!fb.adminReply && (
                        <>
                            <textarea
                                value={replies[fb._id] || ''}
                                onChange={(e) => handleReplyChange(fb._id, e.target.value)}
                                placeholder="Write your reply here"
                                rows="4"
                                className="feedback-textarea"
                            />
                        </>
                    )}
                    {fb.adminReply && (
                        <div>
                            <p className="feedback-textreplay">You Replied:</p>
                            <p className="feedback-text">{fb.adminReply}</p>
                        </div>
                    )}
                    <div className="buttons-container">
                        {!fb.adminReply && (
                            <button
                                onClick={() => handleSubmitReply(fb._id)}
                                className="submit-reply-btn"
                            >
                                Submit Reply
                            </button>
                        )}

                        <button
                        onClick={() => handleDeleteFeedback(fb._id)}
                        className="delete-reply-btn"
                        >
                        Delete Feedback
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
