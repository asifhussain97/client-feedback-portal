import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Submit feedback (user)
export const submitFeedback = createAsyncThunk(
  'feedback/submit',
  async (data, { getState }) => {
    const token = getState().auth.token;
    const form = new FormData();

    form.append('title', data.title);
    form.append('text', data.text);
    form.append('rating', data.rating);

    if (data.image && data.image.length > 0) {
      form.append('image', data.image[0]);
    }

    const res = await axios.post(`/feedback`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

// Fetch all feedback (admin)
export const fetchAllFeedback = createAsyncThunk(
  'feedback/fetchAll',
  async (_, { getState }) => {
    const token = getState().auth.token;
    const res = await axios.get(`/feedback/admin`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }
);

// Fetch feedback submitted by logged-in user
export const fetchUserFeedback = createAsyncThunk(
  'feedback/fetchUserFeedback',
  async (_, { getState }) => {
    const token = getState().auth.token;
    const res = await axios.get(`/feedback/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }
);

// AI Suggested Reply (admin)
export const getAISuggestedReply = createAsyncThunk(
  'feedback/aiReply',
  async (feedbackId, { getState }) => {
    const token = getState().auth.token;
    const res = await axios.get(`/feedback/${feedbackId}/suggest-reply`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { id: feedbackId, reply: res.data.suggestedReply };
  }
);

// Submit a reply to feedback (admin)
export const submitReply = createAsyncThunk(
  'feedback/submitReply',
  async ({ feedbackId, text }, { getState }) => {
    const token = getState().auth.token;
    const res = await axios.post(
      `/feedback/${feedbackId}/reply`,
      { text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  }
);

// Delete feedback (admin)
export const deleteFeedback = createAsyncThunk(
  'feedback/delete',
  async (feedbackId, { getState }) => {
    const token = getState().auth.token;
    const res = await axios.delete(`/feedback/${feedbackId}/delete`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data; 
  }
);

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    items: [],
    filteredItems: [],
    userFeedback: [],
    loading: false,
    error: null,
    aiReplies: {},
    submittingReply: false,
  },
  reducers: {
    filterByRating(state, action) {
      const rating = action.payload;
      if (rating) {
        state.filteredItems = state.items.filter(
          (item) => item.rating === parseInt(rating)
        );
      } else {
        state.filteredItems = state.items;
      }
    },
    filterByDate(state, action) {
      const dateRange = action.payload;
      const today = new Date();
      const dateMap = {
        last7: 7,
        last30: 30,
      };

      if (dateRange !== 'all') {
        const daysAgo = new Date(today.setDate(today.getDate() - dateMap[dateRange]));
        state.filteredItems = state.items.filter((item) => {
          const feedbackDate = new Date(item.createdAt);
          return feedbackDate >= daysAgo;
        });
      } else {
        state.filteredItems = state.items;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all feedback (admin)
      .addCase(fetchAllFeedback.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.filteredItems = action.payload;
      })
      .addCase(fetchAllFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch user's feedback
      .addCase(fetchUserFeedback.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.userFeedback = action.payload;
      })
      .addCase(fetchUserFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // AI Suggested Reply
      .addCase(getAISuggestedReply.fulfilled, (state, action) => {
        state.aiReplies[action.payload.id] = action.payload.reply;
      })

      // Submit Reply
      .addCase(submitReply.pending, (state) => {
        state.submittingReply = true;
      })
      .addCase(submitReply.fulfilled, (state) => {
        state.submittingReply = false;
      })
      .addCase(submitReply.rejected, (state, action) => {
        state.submittingReply = false;
        state.error = action.error.message;
      })

      // Delete feedback
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        const feedbackId = action.payload;
        state.items = state.items.filter((item) => item._id !== feedbackId);
        state.filteredItems = state.filteredItems.filter((item) => item._id !== feedbackId);
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { filterByRating, filterByDate } = feedbackSlice.actions;
export default feedbackSlice.reducer;
