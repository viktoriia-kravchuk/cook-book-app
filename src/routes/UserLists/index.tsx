import withLayout from "../../components/Layout/withLayout";
import "./index.css";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/auth-context";
import { getRecipesByUserId } from "../../firebase/firebaseRecipes";
import { Recipe } from "../../types";
import RecipesList from "../../components/RecipesList/RecipesList";
import { useNavigate } from "react-router-dom";
const UserLists = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        if (currentUser && currentUser.uid) {
          const recipes = await getRecipesByUserId(currentUser.uid);
          if (recipes) {
            setUserRecipes(recipes);
          }
        }
      } catch (error) {
        console.error("Error fetching user recipes:", error);
      }
    };

    fetchUserRecipes();
  }, [currentUser]);

  const handleShowAddingRecipe = () => {
    navigate("/add-recipe");
  };

  return (
    <div className="lists">
      <h3>My recipes</h3>
      <RecipesList recipes={userRecipes} />
      <div className="lists-info">
        <button className="classic-button" onClick={handleShowAddingRecipe}>
          Add Recipe +
        </button>
      </div>
    </div>
  );
};

export default withLayout(UserLists);
