import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth-context";
import { getRecipes } from "../firebase/firebaseRecipes";
import { useNavigate } from "react-router-dom";
import withLayout from "../components/Layout/withLayout";
import "./explore.css";
import { Recipe, RecipeCategory } from "../types";
import { RecipeCategories } from "../const";
import RecipesList from "../components/RecipesList/RecipesList";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipes);
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | "all">("all");
  const [lastSearchQuery, setLastSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipesData = await getRecipes();
        setRecipes(recipesData);
        setFilteredRecipes(recipesData);
        setLoading(false);
        console.log(recipesData);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  const handleShowAddingRecipe = () => {
    navigate("/add-recipe");
  };

  const handleSearchAndFilter = (
    query: string,
    category: RecipeCategory | "all"
  ) => {
    const filtered = recipes.filter(
      (recipe) =>
        (recipe.title.toLowerCase().includes(query.toLowerCase()) ||
          recipe.description.toLowerCase().includes(query.toLowerCase())) &&
        (category === "all" || recipe.category === category)
    );
    setFilteredRecipes(filtered);
  };

  const handleSearch = (query: string) => {
    setLastSearchQuery(query);
    handleSearchAndFilter(query, selectedCategory);
  };

  const handleCategoryFilter = (category: RecipeCategory | "all") => {
    setSelectedCategory(category);
    handleSearchAndFilter(lastSearchQuery, category);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <FilterBar
        options={RecipeCategories}
        onFilter={handleCategoryFilter}
        label="Category"
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <RecipesList recipes={filteredRecipes} />
        </div>
      )}
      <button className="classic-button" onClick={handleShowAddingRecipe}>
        Add Recipe
      </button>
    </div>
  );
};

export default withLayout(Explore);
