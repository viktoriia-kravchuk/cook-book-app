import { ChangeEvent, FormEvent, useState } from "react";
import { signInUser, signUpUser } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import ".././App.css";
import "./home.css";

const defaultFormFields = {
  email: "",
  password: "",
};

function Home() {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [isLogin, setIsLogin] = useState(true);
  const { email, password } = formFields;
  const navigate = useNavigate();

  const resetFormFields = () => {
    return setFormFields(defaultFormFields);
  };

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Send the email and password to firebase
      const userCredential = await signInUser(email, password);

      if (userCredential) {
        resetFormFields();
        navigate("/profile");
      }
    } catch (error: any) {
      console.log("User Sign In Failed", error.message);
    }
  };

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const userData = await signUpUser(email, password);

      if (userData) {
        console.log("signed up")
        // resetFormFields();
        // navigate("/profile");
      }
    } catch (error: any) {
      console.log("User Sign Up Failed", error.message);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className="App">
      <div className="container">
        <input type="checkbox" id="check" />
        {isLogin ? (
          <div className="login form">
            <header>Login</header>
            <form onSubmit={handleSignIn}>
              <input
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={handleChange}
                name="email"
                required
              />
              <input
                type="password"
                placeholder="Enter your password"
                name="password"
                value={password}
                onChange={handleChange}
                required
              />
              <a href="/">Forgot password?</a>
              <input type="submit" className="button" value="Login" />
            </form>
            <div className="signup">
              <span className="signup">
                Don't have an account?{" "}
                <label htmlFor="check" onClick={handleToggleForm}>
                  Signup
                </label>
              </span>
            </div>
          </div>
        ) : (
          <div className="registration form">
            <header>Signup</header>
            <form onSubmit={handleSignUp}>
            <input
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={handleChange}
                name="email"
                required
              />
              <input
                type="password"
                placeholder="Create a password"
                name="password"
                value={password}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                placeholder="Confirm your password"
                required
              />
              <input type="submit" className="button" value="Signup" />
            </form>
            <div className="signup">
              <span className="signup">
                Already have an account?{" "}
                <label htmlFor="check" onClick={handleToggleForm}>
                  Login
                </label>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
