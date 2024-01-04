import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/auth-context";
import { getSavedOrLikedRecipesByUser } from "../../firebase/recipeInteractions";
import { Recipe } from "../../types";
import RecipesList from "../../components/RecipesList/RecipesList";
import withLayout from "../../components/Layout/withLayout";

type interactionType = "save" | "like";

const ListPage = ({
  interaction,
  pageTitle,
}: {
  interaction: interactionType;
  pageTitle: string;
}) => {
  const { currentUser } = useContext(AuthContext);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        if (currentUser) {
          const recipes = await getSavedOrLikedRecipesByUser(
            currentUser.uid,
            interaction
          );
          setUserRecipes(recipes);
        }
      } catch (error) {
        console.error("Error fetching user recipes:", error);
      }
    };

    fetchUserRecipes();
  }, [currentUser, interaction]);

  return (
    <div className="lists">
      <h3>{pageTitle}</h3>
      <RecipesList recipes={userRecipes} />
      <div className="lists-info"></div>
    </div>
  );
};

export default withLayout(ListPage);
