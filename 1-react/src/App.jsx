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

const Counter = () => {
  const [count, setCount] = React.useState(0);

  MyReact.useEffect(() => {
    document.title = `count: ${count}`;
    console.log("effect1");
  });

  const handleClick = () => setCount(count + 1);

  console.log("Counter rendered");
  return <button onClick={handleClick}>더하기</button>;
};

//export default App;

export default () => <Counter />;
