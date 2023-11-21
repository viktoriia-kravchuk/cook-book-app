import { useState, useContext, ChangeEvent } from "react";
import { AuthContext } from "../../context/auth-context";
import withLayout from "../../components/Layout/withLayout";
import { addNewRecipe } from "../../firebase/firebaseRecipes";
import "./addRecipeForm.css"

const AddRecipeForm = () => {
  const { currentUser } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);


  const setFormData = (field: string, value: string) => {
    switch (field) {
      case "title":
        setTitle(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "instructions":
        setInstructions(value);
        break;
      case "category":
        setCategory(value);
        break;
      case "reset":
        setTitle("");
        setDescription("");
        setInstructions("");
        setCategory("");
        break;
      default:
        break;
    }
  };

  const handleTextareaChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
    field: string
  ) => {
    setFormData(field, e.target.value);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData(field, e.target.value);
  };

  const handleCategoryChange = (
    e: ChangeEvent<HTMLSelectElement>,
    field: string
  ) => {
    setFormData(field, e.target.value);
  };

  const handleRecipeSubmission = async () => {
    if (!title || !description || !instructions || !category) {
      setError("All fields must be filled out.");
      return;
    }
    if (currentUser) {
      const recipe = {
        title,
        description,
        instructions,
        category,
        user_id: currentUser.uid
      };

      const newRecipe = await addNewRecipe(recipe);

      if (newRecipe) {
        setFormData("reset", "");
        setStatus("Recipe added successfully!");
      }
    }
  };

  return (
    <div className="form-recipe-container">
    
      <form className="form-recipe">
      <div className="title">Share your recipe!</div>
        {["title", "description", "instructions", "category"].map((field) => (
        <div className="field-container">
          <label key={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}:{" "}
            {field === "category" ? (
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e, field)}
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
                <option value="dessert">Dessert</option>
                <option value="drink">Drink</option>
              </select>
            ) : field === "instructions" || field === "description" ? (
              <textarea
                value={field === "instructions" ? instructions : description}
                onChange={(e) =>
                  handleTextareaChange(e, field)
                }
              />
            ) : (
              <input
                type="text"
                value={title}
                onChange={(e) =>
                  handleInputChange(e, field)
                }
              />
            )}
          </label>
          </div>
        ))}
        {/* Add input for file upload
        <label>
          Image:
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </label> */}
        <button type="button" onClick={handleRecipeSubmission}>
          Add Recipe
        </button>
      </form>
      <div className="status">{status}</div>
      <div className="error">{error}</div>
    </div>
  );
};

export default withLayout(AddRecipeForm);