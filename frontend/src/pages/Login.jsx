import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import React, { useEffect } from 'react'; 

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/feedback");
    }
  }, [navigate]); 

  const onSubmit = (data) => {
    dispatch(loginUser(data)).then((res) => {
      if (res.payload.status) {
        toast.success("Login successful!");
        if(res.payload.user.role=="admin"){
            navigate("/admin");
        }
        else{
            navigate("/feedback");
        }
      } else if (res.payload.error || res.payload.message) {
        toast.error(res.payload.error || res.payload.message);
      }
    });
  };

  return (
    <div className="form signinForm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Sign In</h2>

        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
          placeholder="Email"
          type="text"
        />
        {errors.email && (
          <p className="error-message">{errors.email.message}</p>
        )}

        <input
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          placeholder="Password"
          type="password"
        />
        {errors.password && (
          <p className="error-message">{errors.password.message}</p>
        )}

        <button type="submit">Login</button>
      </form>

    </div>
  );
}
