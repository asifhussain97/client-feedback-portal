import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUserFeedback } from "../redux/slices/feedbackSlice";

export default function FeedbackHistory() {
  const dispatch = useDispatch();
  const [allFeedbacks, setAllFeedbacks] = useState([]); // original data
  const [feedbacks, setFeedbacks] = useState([]); // filtered data
  const [sortNewestFirst, setSortNewestFirst] = useState(true); 
  const [sortHighestFirst, setSortHighestFirst] = useState(true); 
  const [sortByDate, setSortByDate] = useState(true); 
  const [filters, setFilters] = useState({
    rating: '',
    date: 'all',
  });

  useEffect(() => {
    dispatch(fetchUserFeedback()).then((response) => {
      if (response.payload) {
        setAllFeedbacks(response.payload);
        setFeedbacks(response.payload); // initially show all
      }
    });
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value,
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (newFilters) => {
    let filtered = [...allFeedbacks];

    // Filter by Rating
    if (newFilters.rating) {
      filtered = filtered.filter(
        (feedback) => feedback.rating === parseInt(newFilters.rating)
      );
    }

    // Filter by Date
    if (newFilters.date === 'last7') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = filtered.filter(
        (feedback) => new Date(feedback.createdAt) >= sevenDaysAgo
      );
    } else if (newFilters.date === 'last30') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter(
        (feedback) => new Date(feedback.createdAt) >= thirtyDaysAgo
      );
    }

    setFeedbacks(filtered);
  };

  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    if (sortByDate) {
      // Sort by Date
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      if (sortNewestFirst) {
        return dateB - dateA; // Newest first
      } else {
        return dateA - dateB; // Oldest first
      }
    } else {
      // Sort by Rating
      const ratingA = a.rating;
      const ratingB = b.rating;
      if (sortHighestFirst) {
        return ratingB - ratingA; // Highest rating first
      } else {
        return ratingA - ratingB; // Lowest rating first
      }
    }
  });

  return (
    <div className="feedback-history-container">
      <div className="feedback-history-wrapper">
        {/* Sidebar */}
        <div className="feedback-sidebar">
          <div className="feedback-content-wrapperadmin"> {/* Add a wrapper for padding */}
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

            {/* Date sorting */}
            <button className="sort-button" onClick={() => { 
              setSortByDate(true); // Enable Date sorting
              setSortNewestFirst(!sortNewestFirst); // Toggle Newest/Oldest
            }}>
              By Date: {sortNewestFirst ? 'Newest' : 'Oldest'}
            </button>

            {/* Rating sorting */}
            <button className="sort-button" onClick={() => { 
              setSortByDate(false); // Enable Rating sorting
              setSortHighestFirst(!sortHighestFirst); // Toggle Highest/Lowest
            }}>
              By Rating: {sortHighestFirst ? 'Highest' : 'Lowest'}
            </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="feedback-content">
          <h2 className="feedback-heading">Your Feedback</h2>
          {sortedFeedbacks.length === 0 ? (
            <p className="no-feedback-message">No Feedbacks Received.</p>
          ) : (
            sortedFeedbacks.map((feedback, index) => (
              <div className="feedback-card" key={index}>
                <div className="feedback-card-content">
                  {/* Left Side: Text Content */}
                  <div className="feedback-details">
                    <div className="feedback-header">
                      <span>Date: {new Date(feedback.createdAt).toLocaleDateString()}</span>
                      <span>Time: {new Date(feedback.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <h3 className="feedback-title">{feedback.title}</h3>
                    <div className="feedback-text">{feedback.text}</div>
                    <p className="feedback-rating">Rating: {feedback.rating} ⭐</p>

                    {feedback.adminReply ? (
                      <div className="admin-reply">Admin Reply: {feedback.adminReply}</div>
                    ) : (
                      <div className="no-reply">No reply from admin yet.</div>
                    )}
                  </div>

                  {/* Right Side: Image */}
                  {feedback.image && (
                    <div className="feedback-image-wrapper">
                      <img 
                        src={`http://localhost:5000/uploads/${feedback.image}`} 
                        alt="feedback" 
                        className="feedback-image"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
