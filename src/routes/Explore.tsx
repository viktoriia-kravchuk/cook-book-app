import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth-context";
import { getRecipes } from "../firebase/firebaseRecipes";
import { useNavigate } from "react-router-dom";
import withLayout from "../components/Layout/withLayout";
import "./explore.css";
import { Recipe } from "../types";
import RecipesList from "../components/RecipesList/RecipesList";

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipesData = await getRecipes();
        setRecipes(recipesData);
        console.log(recipesData);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []); 

  const handleShowAddingRecipe = () => {
    navigate("/add-recipe");
  };

  return (
    <div>
      <button className="classic-button" onClick={handleShowAddingRecipe}>Add Recipe</button>
      <div>
          <h2>Recipes</h2>
          <RecipesList recipes={recipes} />
        </div>
    </div>
  );
};

export default withLayout(Explore);
