import "./App.css";
import Team from "./components/Team";
import Home from "./components/Home";
import PasswordResetPage from "./pages/PasswordResetPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UIProvider } from "./store/ui-context";

function App() {
  return (
    <>
      <UIProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/password-reset" element={<PasswordResetPage />} />
          </Routes>
        </BrowserRouter>
      </UIProvider>
    </>
  );
}

export default App;
