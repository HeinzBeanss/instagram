import './CSS/App.css';
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./Components/Nav";
import Home from "./Components/Home"

function App() {
  return (
    <BrowserRouter >
    {/* ADD basename={process.env.PUBLIC_URL} to the BrowserRouter element when deploying! */}
        <Nav />
        
        <Routes>
            <Route path={"/"} element={<Home />} />
            {/* <Route path={"/profile}"} element={ } /> */}
            
        </Routes>
        
    </BrowserRouter>
    )
}

export default App;
