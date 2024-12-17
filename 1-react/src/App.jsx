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
  MyReact.resetCursor();
  const [count, setCount] = React.useState(0);
  const [name, setName] = React.useState("");

  const handleClick = () => setCount(count + 1);
  const handleChangeName = (e) => setName(e.target.value);

  MyReact.useEffect(() => {
    document.title = `count: ${count} | name: ${name}`;
    console.log("effect1");

    return function cleanup() {
      document.title = "";
      console.log("effect1 cleanup");
    };
  }, [count, name]);

  MyReact.useEffect(() => {
    localStorage.setItem("name", name);
    console.log("effect2");
  }, [name]);

  MyReact.useEffect(() => {
    setName(localStorage.getItem("name") || "");
    console.log("effect3");
  }, []);

  console.log("Counter rendered");

  return (
    <>
      <button onClick={handleClick}>더하기</button>
      <input value={name} onChange={handleChangeName} />
    </>
  );
};

//export default App;

export default () => {
  const [mounted, setMounted] = React.useState(false);
  const handleToggle = () => {
    const nextMounted = !mounted;
    if (!nextMounted) MyReact.cleanupEffects();
    setMounted(nextMounted);
  };
  return (
    <>
      <button onClick={handleToggle}>컴포넌트 토글</button>
      {mounted && <Counter />}
    </>
  );
};
