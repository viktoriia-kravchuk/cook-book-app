import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRecipeById } from "../../firebase/firebaseRecipes";
import { Recipe } from "../../types";
import withLayout from "../../components/Layout/withLayout";
import { FaRegCalendarAlt } from "react-icons/fa";
import "./recipePage.css";

interface RecipePageProps {}

const RecipePage: React.FC<RecipePageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        if (id) {
          const recipeData = await getRecipeById(id);
          setRecipe(recipeData);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recipe-container">
      <img
        className="recipe-img"
        src="https://img.freepik.com/free-photo/chicken-salad-with-vegetables-olives_1220-4069.jpg?w=1060&t=st=1700500942~exp=1700501542~hmac=d5c7aefc9e40fe215db8cd055db680fbb57f9b575a4e277ba3be5c6e11a65c28"
        alt={recipe.title}
      />
      <h2 className="recipe-title">{recipe.title}</h2>
      <p className="recipe-category">Category: {recipe.category}</p>
      <FaRegCalendarAlt />{" "}
      {recipe.created_at?.toDate().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}
      <div className="recipe-description">
        <h3>Description:</h3>
        <p>{recipe.description}</p>
      </div>
      <div className="recipe-instructions">
        <h3>Instructions:</h3>
        <p>{recipe.instructions}</p>
      </div>
    </div>
  );
};

export default withLayout(RecipePage);
