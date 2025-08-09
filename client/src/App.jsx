import MessageForm from "./Components/MessageForm.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateEmail from "./Components/CreateEmail.jsx";
import Header from "./Components/Header.jsx";

function App() {

   window.SERVER_URL = import.meta.env.VITE_API_URL;

  return (

      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Header />}>
              <Route index element={<MessageForm />} />
              <Route path="emails" element={<CreateEmail />} />
            </Route>
        </Routes>
      </BrowserRouter>
  
  );
}

export default App;
