import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FormExample from "./components/examples/FormExample";
import FormPage from "./pages/FormPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormExample />} />
        <Route path="/form/:id" element={<FormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
