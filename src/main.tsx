import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Toaster from "./components/toaster.tsx";
import Wrapper from "./wrapper.tsx";

createRoot(document.getElementById("root")!).render(
  <Toaster>
    <Wrapper>
      <App />
    </Wrapper>
  </Toaster>
);
