import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./providers";
import { Router } from "./router";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
