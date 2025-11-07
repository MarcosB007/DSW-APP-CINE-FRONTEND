import {BrowserRouter, Routes, Route} from "react-router-dom"
import { HomePage } from "../pages/HomePage.jsx"
import LoginPage from "../pages/LoginPage.jsx"
import RegisterPage from "../pages/RegisterPage.jsx"
import { AuthProvider, useAuth } from "../context/AuthContext.jsx";

function AppRouter() {
  return (
    <AuthProvider>
      <AppLR />
    </AuthProvider>
  );
}

function AppLR() {
    const auth = useAuth(); // hook useAuth para obtener la información del usuario
    return (
        
            <BrowserRouter>

                <Routes>

                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/home" element={<HomePage/>}/>
                    <Route path="/" element={<HomePage/>}/>


                </Routes>

            </BrowserRouter>
        
    );
}

export default AppRouter;