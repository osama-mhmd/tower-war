import { useState, useEffect } from "react";
import resources from "./build/resources.json";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const promises = resources.map((src) => loadImage(src));

    Promise.all(promises)
      .then(() => {
        setIsLoading(false); // Hide the loading screen
      })
      .catch((error) => console.error("Error loading resources:", error));
  }, []);

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = "/textures/" + src;
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });
  };

  if (isLoading) {
    return (
      <div className="loading">
        Loading resources, please wait... <span className="spinner"></span>
      </div>
    );
  }

  return children;
};

Wrapper.displayName = "Wrapper";

export default Wrapper;
