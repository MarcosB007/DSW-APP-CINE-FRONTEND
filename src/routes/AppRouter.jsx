import {BrowserRouter, Routes, Route} from "react-router-dom"
import { HomePage } from "../pages/HomePage"

export const AppRouter = () => {
    return (
        <>
            <BrowserRouter>

                <Routes>

                    <Route path="/login"/>
                    <Route path="/home" element={<HomePage/>}/>

                </Routes>

            </BrowserRouter>
        </>
    )
} 