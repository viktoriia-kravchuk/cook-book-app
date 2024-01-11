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
import LoadingScreen from "../components/LoadingScreen";

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
        console.log(recipesData);
      } catch (error) {

        console.error("Error fetching recipes:", error);
      }
      finally {
        setLoading(false);
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
    <>
    {loading && <LoadingScreen/>}
    <div>
      <SearchBar onSearch={handleSearch} />
      <FilterBar
        options={RecipeCategories}
        onFilter={handleCategoryFilter}
        label="Category"
      />
      <RecipesList recipes={filteredRecipes} />
    </div>
    </>
  );
};

export default withLayout(Explore);
