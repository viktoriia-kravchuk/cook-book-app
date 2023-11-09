import { ChangeEvent, FormEvent, useState } from "react";
import { signInUser, signUpUser } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

type FormFields = {
  email: string;
  password: string;
  confirmPassword: string;
};

const AuthForm = () => {
  const [formFields, setFormFields] = useState<FormFields>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const resetForm = () => {
    setFormFields({ email: "", password: "", confirmPassword: "" });
    setError("");
  };

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const validateFields = (
    email: string,
    password: string,
    confirmPassword: string
  ): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email address");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    isLogin: boolean
  ) => {
    event.preventDefault();
    const { email, password, confirmPassword } = formFields;

    if (!validateFields(email, password, confirmPassword)) {
      return;
    }

    try {
      if (isLogin) {
        const userCredential = await signInUser(email, password);
        if (userCredential) {
          resetForm();
          navigate("/profile");
        }
      } else {
        const userData = await signUpUser(email, password);
        if (userData) {
          resetForm();
          navigate("/profile");
        }
      }
    } catch (error: any) {
      const splittedErrorMessage = error.message.split("/");
      const errorEssential = splittedErrorMessage[
        splittedErrorMessage.length - 1
      ].replace(")", "");
      setError(
        `User ${isLogin ? "Sign In" : "Sign Up"} Failed: ${errorEssential}`
      );
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
    setError("");
  };

  return (
    <div className="container">
      <input type="checkbox" id="check" />
      <div className={isLogin ? "login form" : "registration form"}>
        <header>{isLogin ? "Login" : "Signup"}</header>
        <form onSubmit={(e) => handleSubmit(e, isLogin)}>
          <input
            type="text"
            placeholder="Enter your email"
            value={formFields.email}
            onChange={handleChange}
            name="email"
            required
          />
          <input
            type="password"
            placeholder={`Enter your ${isLogin ? "" : "new "}password`}
            name="password"
            value={formFields.password}
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <>
              <input
                type="password"
                placeholder="Confirm your password"
                name="confirmPassword"
                value={formFields.confirmPassword}
                onChange={handleChange}
                required
              />
            </>
          )}
          <span className="error">{error}</span>
          <input
            type="submit"
            className="button"
            value={isLogin ? "Login" : "Signup"}
          />
        </form>
        <div className="signup">
          <span className="signup">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <label htmlFor="check" onClick={handleToggleForm}>
              {isLogin ? "Signup" : "Login"}
            </label>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;