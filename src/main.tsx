import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Wrapper from "./wrapper.tsx";

createRoot(document.getElementById("root")!).render(
  <Wrapper>
    <App />
  </Wrapper>
);
