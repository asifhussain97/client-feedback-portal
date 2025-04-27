import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { signupUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import React, { useEffect } from 'react'; 

export default function Signup() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();  // <-- Destructure watch here
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
    dispatch(signupUser(data)).then((res) => {
      if (res.payload.status) {
              toast.success("User registered successfully");
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
    <div className="form signupForm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Sign Up</h2>
        
        {/* Name Field */}
        <input 
          {...register("name", {
            required: "Name is required",
            pattern: {
              value: /^[A-Za-z ]*$/,
              message: "Name should not contain numbers"
            }
          })} 
          type="text" 
          placeholder="Name" 
        />
        {errors.name && <p className="error-message">{errors.name.message}</p>}
        
        {/* Email Field */}
        <input 
          {...register("email", { required: "Email is required" })} 
          type="email" 
          placeholder="Email" 
        />
        {errors.email && <p className="error-message">{errors.email.message}</p>}
        
        {/* Password Field */}
        <input 
          {...register("password", { 
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long"
            }
          })} 
          type="password" 
          placeholder="Password" 
        />
        {errors.password && <p className="error-message">{errors.password.message}</p>}
        
        {/* Confirm Password Field */}
        <input 
          {...register("confirmPassword", { 
            required: "Confirm Password is required",
            validate: (value) => value === watch("password") || "Passwords do not match"  // <-- Using watch here
          })} 
          type="password" 
          placeholder="Confirm Password" 
        />
        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
        
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
