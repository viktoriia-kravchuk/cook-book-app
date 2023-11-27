import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth-context";
import { getAllRecipes } from "../firebase/firebaseRecipes";
import withLayout from "../components/Layout/withLayout";
import "./explore.css";
import { Recipe, RecipeCategory } from "../types";
import { RecipeCategories } from "../const";
import RecipesList from "../components/RecipesList/RecipesList";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";

const Explore: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipes);
  const [selectedCategory, setSelectedCategory] = useState<
    RecipeCategory | "all"
  >("all");
  const [lastSearchQuery, setLastSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipesData = await getAllRecipes();
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
      {loading ? <p>Loading...</p> : <RecipesList recipes={filteredRecipes} />}
    </div>
  );
};

export default withLayout(Explore);
