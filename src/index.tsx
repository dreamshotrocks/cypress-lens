import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

document.documentElement.classList.add("dark");
document.documentElement.style.colorScheme = "dark";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
