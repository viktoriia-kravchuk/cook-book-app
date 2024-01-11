import React, { useState, useEffect } from "react";
import { Recipe } from "../../types";
import "./recipesList.css";
import { getUserDataById } from "../../firebase/firebaseAuth";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";


interface RecipesListProps {
  recipes: Recipe[];
}

const RecipesList: React.FC<RecipesListProps> = ({ recipes }) => {
  const [userDetails, setUserDetails] = useState<{ [key: string]: any }>({});

  useEffect(() => {

    const fetchUserDetails = async () => {
      const uniqueUserIds = Array.from(
        new Set(recipes.map((recipe) => recipe.user_id))
      );

      const userDetailsPromises = uniqueUserIds.map(async (userId) => {
        const userData = await getUserDataById(userId);
        return { [userId]: userData };
      });

      const userDetailsArray = await Promise.all(userDetailsPromises);
      const combinedUserDetails = userDetailsArray.reduce(
        (accumulator, currentValue) => ({ ...accumulator, ...currentValue }),
        {}
      );

      setUserDetails(combinedUserDetails);
    };

      fetchUserDetails();

  }, [recipes]);

  return (
    <div className="cards-container">
      {recipes.map((recipe) => (
        <Link to={`/recipes/${recipe.id}`} key={recipe.id}>
          <div className="recipe-card" key={recipe.id}>
            <img
              src={
                recipe.imageUrl ||
                "https://img.freepik.com/free-photo/chicken-salad-with-vegetables-olives_1220-4069.jpg?w=1060&t=st=1700500942~exp=1700501542~hmac=d5c7aefc9e40fe215db8cd055db680fbb57f9b575a4e277ba3be5c6e11a65c28"
              }
            />
            <p className="recipe-title">{recipe.title}</p>
            <IoIosArrowRoundForward />
            <p>Description: {recipe.description}</p>
            <p className="user-email">
              {" "}
              {userDetails[recipe.user_id]?.email} <FaRegCalendarAlt />{" "}
              {recipe.created_at?.toDate().toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecipesList;
