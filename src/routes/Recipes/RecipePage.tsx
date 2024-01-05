import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { useParams } from "react-router-dom";
import { getRecipeById } from "../../firebase/firebaseRecipes";
import { Recipe } from "../../types";
import withLayout from "../../components/Layout/withLayout";
import { FaRegCalendarAlt } from "react-icons/fa";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import {
  MdBookmarkAdded,
  MdBookmarkAdd,
  MdDeleteOutline,
  MdMode,
} from "react-icons/md";

import {
  likeRecipe,
  unlikeRecipe,
  saveRecipe,
  unsaveRecipe,
  updateRecipeLikes,
  updateRecipeSaves,
  checkUserInteraction,
  deleteRecipe,
} from "../../firebase/recipeInteractions";

import "./recipePage.css";

interface RecipePageProps {}

const RecipePage: React.FC<RecipePageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser?.uid;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        if (id) {
          const recipeData = await getRecipeById(id);
          setRecipe(recipeData);
          const likedRecipe = await checkUserInteraction(userId!, id, "likes");
          setIsLiked(likedRecipe);

          const savedRecipe = await checkUserInteraction(userId!, id, "saves");
          setIsSaved(savedRecipe);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    fetchRecipe();
  }, [id, userId]);

  const handleInteraction = async () => {
    try {
      if (recipe?.id && userId) {
        if (isLiked) {
          await unlikeRecipe(userId!, recipe.id);
          await updateRecipeLikes(recipe.id!, -1);
          setIsLiked(false);
        } else {
          await likeRecipe(userId!, recipe.id);
          await updateRecipeLikes(recipe.id!, 1);
          setIsLiked(true);
        }
      }
    } catch (error) {
      console.error("Error interacting with recipe:", error);
    }
  };

  const handleSave = async () => {
    try {
      if (recipe?.id && userId) {
        if (isSaved) {
          await unsaveRecipe(userId!, recipe.id);
          await updateRecipeSaves(recipe.id!, -1);
          setIsSaved(false);
        } else {
          await saveRecipe(userId!, recipe.id);
          await updateRecipeSaves(recipe.id!, 1);
          setIsSaved(true);
        }
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };
  if (!recipe) {
    return <div>Loading...</div>;
  }

  const handleDelete = async () => {
    try {
      if (recipe?.id && userId && recipe?.user_id === userId) {
        await deleteRecipe(userId!, recipe.id!);
        navigate("/lists");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <div className="recipe-container">
      <div className="recipe-img-container">
        <img
          className="recipe-img"
          src={
            recipe.imageUrl ||
            "https://img.freepik.com/free-photo/chicken-salad-with-vegetables-olives_1220-4069.jpg?w=1060&t=st=1700500942~exp=1700501542~hmac=d5c7aefc9e40fe215db8cd055db680fbb57f9b575a4e277ba3be5c6e11a65c28"
          }
          alt={recipe.title}
        />
      </div>
      <div className="recipe-header">
        <h2 className="recipe-title">{recipe.title}</h2>
        <div className="recipe-actions">
          <span onClick={handleInteraction}>
            {isLiked ? <AiFillLike /> : <AiOutlineLike />}
          </span>
          <span onClick={handleSave}>
            {isSaved ? <MdBookmarkAdded /> : <MdBookmarkAdd />}
          </span>
        </div>
      </div>
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
      <div className="recipe-actions-center">
        {userId === recipe.user_id && (
          <>
            <MdMode className="action-icon" />
            <MdDeleteOutline onClick={handleDelete} className="action-icon" />
          </>
        )}
      </div>
    </div>
  );
};

export default withLayout(RecipePage);
