import React, {
  useState,
  useContext,
  ChangeEvent,
  useRef,
  useEffect,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import withLayout from "../../components/Layout/withLayout";
import {
  addNewRecipe,
  getRecipeById,
  updateRecipe,
} from "../../firebase/firebaseRecipes";
import "./addRecipeForm.css";

const CATEGORY_OPTIONS = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "dessert",
  "drink",
];

const RecipeForm = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { recipeId } = useParams<{ recipeId?: string }>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchRecipeData = async () => {
      if (recipeId) {
        try {
          const fetchedRecipe = await getRecipeById(recipeId);
          if (fetchedRecipe) {
            setTitle(fetchedRecipe.title || "");
            setDescription(fetchedRecipe.description || "");
            setInstructions(fetchedRecipe.instructions || "");
            setCategory(fetchedRecipe.category || "");
            setExistingImage(fetchedRecipe.imageUrl || null);
          }
        } catch (error) {
          console.error("Error fetching recipe data:", error);
        }
      }
    };

    fetchRecipeData();
  }, [recipeId]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setImage(selectedFile);
    } else {
      console.error("Invalid file type");
    }
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleTextareaChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
    field: string
  ) => {
    switch (field) {
      case "instructions":
        setInstructions(e.target.value);
        break;
      case "description":
        setDescription(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    switch (field) {
      case "title":
        setTitle(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleRecipeSubmission = async () => {
    if (!title || !description || !instructions || !category) {
      setError("All fields must be filled out.");
      return;
    }

    if (currentUser) {
      const recipeData = {
        title,
        description,
        instructions,
        category,
        user_id: currentUser.uid,
      };

      try {
        if (recipeId) {
          const updatedRecipe = await updateRecipe(recipeId, recipeData, image);
          if (updatedRecipe) {
            setStatus("Recipe updated successfully!");
          }
        } else {
          const newRecipe = await addNewRecipe(recipeData, image);
          if (newRecipe) {
            setStatus("Recipe added successfully!");
          }
        }
        setTimeout(() => {
          navigate("/lists");
        }, 1500);
      } catch (error) {
        console.error("Error:", error);
        // to set an error state or show to user error message
      }
    }
  };

  return (
    <div className="form-recipe-container">
      <form className="form-recipe">
        <div className="title">
          {recipeId ? "Modify your recipe" : "Share your recipe!"}
        </div>
        {["title", "description", "instructions", "category"].map((field) => (
          <div className="field-container" key={field}>
            <label>
              {field.charAt(0).toUpperCase() + field.slice(1)}:{" "}
              {field === "category" ? (
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e)}
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              ) : field === "instructions" || field === "description" ? (
                <textarea
                  value={field === "instructions" ? instructions : description}
                  onChange={(e) => handleTextareaChange(e, field)}
                />
              ) : (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleInputChange(e, field)}
                />
              )}
            </label>
          </div>
        ))}

        <label>
          Image:
          {existingImage && (
            <img
              src={existingImage}
              alt="recipe photo"
              className="recipe-img"
            />
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </label>
        <button type="button" onClick={handleRecipeSubmission}>
          {recipeId ? "Update Recipe" : "Add Recipe"}
        </button>
      </form>
      <div className="status">{status}</div>
      <div className="error">{error}</div>
    </div>
  );
};

export default withLayout(RecipeForm);
