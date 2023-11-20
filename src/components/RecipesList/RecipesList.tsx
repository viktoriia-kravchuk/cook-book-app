import React from "react";
import { Recipe } from "../../types";
import "./recipesList.css";

interface RecipesListProps {
  recipes: Recipe[];
}

const RecipesList: React.FC<RecipesListProps> = ({ recipes }) => {
  return (
    <div className="cards-container">
      {recipes.map((recipe) => (
        <div className="recipe-card" key={recipe.id}>
          <img src="https://img.freepik.com/free-photo/chicken-salad-with-vegetables-olives_1220-4069.jpg?w=1060&t=st=1700500942~exp=1700501542~hmac=d5c7aefc9e40fe215db8cd055db680fbb57f9b575a4e277ba3be5c6e11a65c28" />
          <p className="recipe-title">{recipe.title}</p>
          <p>Description: {recipe.description}</p>
          {/* <p>Instructions: {recipe.instructions}</p> */}
          <p>Added by: {recipe.user_id}</p>
          {/* <p>Date: {recipe.created_at}</p> */}


        </div>
      ))}
    </div>
  );
};

export default RecipesList;
