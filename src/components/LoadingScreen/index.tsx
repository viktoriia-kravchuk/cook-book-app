import "./index.css";

const LoadingScreen = () => {
  return (
        <div className="loader-container">
          <div className="loader">
            <div className="sk-chase">
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
            </div>
          </div>
        </div>
  );
};

export default LoadingScreen;
