import { useState } from "react";
import "./explore.css";
import Sidebar from "../components/Sidebar";
import AddRecipeForm from "../components/AddRecipeForm/AddRecipeForm";

function Explore() {
  const [showAddingRecipe, setShowAddingRecipe] = useState(false);

  const handleShowAddingRecipe = () => {
    setShowAddingRecipe(true);
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <button onClick={handleShowAddingRecipe}>Add Recipe</button>

        {showAddingRecipe && <AddRecipeForm />}
      </div>
    </div>
  );
}
export default Explore;
