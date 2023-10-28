import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Login from "./Components/Login";
import Registration from "./Components/Registration";
import Shop from "./User/Shop";
import ShopForm from "./User/ShopForm";
import Product from "./User/Product";
import ProductForm from "./User/ProductForm";
import ProductUpdateForm from "./User/ProductUpdateForm";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/registration"
            element={
              <Registration switchToLogin={() => setCurrentPage("login")} />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                switchToRegistration={() => setCurrentPage("registration")}
              />
            }
          />
          <Route path="/shop" element={<Shop />} />
          <Route path="/new-shop" element={<ShopForm />} />
          <Route path="/product" element={<Product />} /> 
          <Route path="/shop/:id/new-product" element={<ProductForm />} />
          <Route path="/shop/:id/products" element={<Product />} />
          <Route path="/product/edit/:id" element={<ProductUpdateForm />} />

          <Route
            index
            element={
              <Navigate
                to={currentPage === "login" ? "/login" : "/registration"}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
