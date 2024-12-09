import React from "react";
import * as MyRouter from "./lib/MyRouter";
import * as MyLayout from "./lib/MyLayout";
import OrderPage from "./pages/OrderPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import Dialog from "./components/Dialog";
import MyReact from "./lib/MyReact";

const App = () => (
  <MyLayout.Layout>
    <MyRouter.Router>
      <MyRouter.Routes>
        <MyRouter.Route path="/cart" element={<CartPage />} />
        <MyRouter.Route path="/order" element={<OrderPage />} />
        <MyRouter.Route path="/" element={<ProductPage />} />
      </MyRouter.Routes>
    </MyRouter.Router>
  </MyLayout.Layout>
);

function NameField() {
  const [firstname, setFirstName] = MyReact.useName("jk");

  const handleChange = (e) => {
    setFirstName(e.target.value);
    console.log(e.target.value);
  };
  return <input value={firstname} onChange={handleChange} />;
}

//export default App;

export default () => <NameField />;
