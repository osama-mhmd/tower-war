import { useState, useEffect } from "react";
import images from "./config/resources.json";

// `glob` makes a very bad white screen at the first load
// const images = import.meta.glob("/public/textures/*.png", { eager: true });

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState(
    "loading" as "loading" | "loaded" | "error"
  );

  useEffect(() => {
    // const promises = Object.entries(images).map(([key]: [string, unknown]) =>
    //   loadImage(key.replace("/public/textures/", ""))
    // );
    const promises = images.map((src) => loadImage(src));

    Promise.all(promises)
      .then(() => setState("loaded"))
      .catch(() => setState("error"));
  }, []);

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = "/textures/" + src;
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });
  };

  if (state === "loading") {
    return (
      <div className="loading">
        Loading resources, please wait... <span className="spinner"></span>
      </div>
    );
  }

  if (state === "error") {
    return <div className="error">Error loading resources</div>;
  }

  return children;
};

Wrapper.displayName = "Wrapper";

export default Wrapper;
