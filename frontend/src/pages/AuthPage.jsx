import Login from "./Login";
import Signup from "./Signup";
import { useState } from "react";

export default function AuthPage() {
  const [active, setActive] = useState(false); // false = Login, true = Signup

  return (
    <div className={`App ${active ? "active" : ""}`}>
      <div className="container">
        <div className="leftbg">
          <div className="box signin">
            <h2 className="h1">Already Have an Account?</h2>
            <button onClick={() => setActive(false)} className="btn signinbtn">
              Sign in
            </button>
          </div>
          <div className="box signup">
            <h2 className="h2">Don't Have an Account?</h2>
            <button onClick={() => setActive(true)} className="btn signupbtn">
              Sign Up
            </button>
          </div>
        </div>

        <div className={`form-cont ${active ? "active" : ""}`}>
          {!active ? <Login /> : <Signup />}
        </div>
      </div>
    </div>
  );
}
