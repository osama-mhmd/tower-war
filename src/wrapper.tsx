import { useState, useEffect } from "react";
import images from "@/config/images.json";
import sounds from "@/config/sounds.json";

// `glob` makes a very bad white screen at the first load
// const images = import.meta.glob("/public/textures/*.png", { eager: true });

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState(
    "loading" as "loading" | "loaded" | "error"
  );

  useEffect(() => {
    const imagesPromises = images.map((src) => loadImages(src));
    const soundsPromises = sounds.map((src) => loadSounds(src));

    Promise.all([...imagesPromises, ...soundsPromises])
      .then(() => setState("loaded"))
      .catch(() => setState("error"));
  }, []);

  const loadImages = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = `/textures/` + src;
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });
  };
  const loadSounds = (src: string): Promise<HTMLAudioElement> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.src = `/sounds/` + src;
      audio.onload = () => resolve(audio);
      audio.onerror = (err) => reject(err);
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
