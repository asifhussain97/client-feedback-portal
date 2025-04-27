import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { submitFeedback } from "../redux/slices/feedbackSlice";
import { toast } from "react-toastify"; 

export default function FeedbackPage() {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    dispatch(submitFeedback(data)).then((res) => {
          if (res.payload.status) {
            toast.success(res.payload.message);
          } else if (res.payload.error || res.payload.message) {
            toast.error(res.payload.error || res.payload.message);
          }
        });
  };

  const rating = watch("rating");

  return (
    <div className="feedback-form-container">
      <div className="feedback-form">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title Input */}
          <input
            type="text"
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters long",
              }
            })}
            placeholder="Your Feedback"
            className=""
          />
          {errors.title && <p className="error-message">{errors.title.message}</p>}

          {/* Description Textarea */}
          <textarea
            {...register("text", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters long",
              }
            })}
            placeholder="Description"
            className=""
          />
          {errors.text && <p className="error-message">{errors.text.message}</p>}

          {/* Rating Section */}
          <div className="flex items-center gap-2">
            <label>Rating:</label>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={rating >= star ? "text-yellow-500" : "text-gray-300"}
                onClick={() => setValue("rating", star, { shouldValidate: true })}
              >
                ★
              </button>
            ))}
            <input
              type="hidden"
              {...register("rating", {
                required: "Rating is required",
                validate: value => value >= 1 && value <= 5 || "Invalid rating selected"
              })}
            />
          </div>
          {errors.rating && <p className="error-message">{errors.rating.message}</p>}

          {/* Image Input */}
          <input
            type="file"
            {...register("image", {
              validate: (value) => {
                if (value && value[0]) {
                  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
                  return allowedTypes.includes(value[0].type) || "Only JPG, JPEG, PNG, WEBP files allowed";
                }
                return true; // image is optional
              }
            })}
            accept="image/*"
          />
          {errors.image && <p className="error-message">{errors.image.message}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}
