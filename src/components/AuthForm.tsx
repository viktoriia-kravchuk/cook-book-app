import { ChangeEvent, FormEvent, useState } from "react";
import { signInUser, signUpUser } from "../firebase/firebaseAuth";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

type FormFields = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  surname: string;
  nickname: string;
  photo: File | null;
};

const AuthForm = () => {
  const [formFields, setFormFields] = useState<FormFields>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    surname: "",
    nickname: "",
    photo: null,
  });

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const resetForm = () => {
    setFormFields({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      surname: "",
      nickname: "",
      photo: null,
    });
    setError("");
  };

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const validateFields = (
    email: string,
    password: string,
    confirmPassword: string,
    name: string,
    surname: string,
    nickname: string,
    photo: File | null,
    isLogin: boolean
  ): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  
    // Validate email
    if (!emailRegex.test(email)) {
      setError("Invalid email address");
      return false;
    }
  
    // Validate password
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
  
    // Validate password match for signup
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
  
    // Validate name, surname, nickname for signup
    if (!isLogin && (!name.trim() || !surname.trim() || !nickname.trim())) {
      setError("Name, surname, and nickname are required");
      return false;
    }
  
    // Validate photo for signup
    if (!isLogin && !photo) {
      setError("Profile photo is required");
      return false;
    }
  
    return true;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setFormFields({ ...formFields, photo: file });
    setError("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    isLogin: boolean
  ) => {
    event.preventDefault();
    const { email, password, confirmPassword, name, surname, nickname, photo } = formFields;

    if (!validateFields(email, password, confirmPassword, name, surname, nickname, photo, isLogin)) {
      return;
    }

    try {
      if (isLogin) {
        const userCredential = await signInUser(email, password);
        if (userCredential) {
          resetForm();
          navigate("/explore");
        }
      } else {

        if (photo !== null) {
          const userData = await signUpUser(email, password, name, surname, nickname, photo);
          if (userData) {
            resetForm();
            navigate("/explore");
          }
        } else {
          setError("Profile photo is required");
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
              <input
                type="text"
                placeholder="Enter your name"
                value={formFields.name}
                onChange={handleChange}
                name="name"
                required
              />
              <input
                type="text"
                placeholder="Enter your surname"
                value={formFields.surname}
                onChange={handleChange}
                name="surname"
                required
              />
              <input
                type="text"
                placeholder="Enter your nickname"
                value={formFields.nickname}
                onChange={handleChange}
                name="nickname"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
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
