import React, { Children } from "react";
import * as MyRouter from "./lib/MyRouter";
import * as MyLayout from "./lib/MyLayout";
import OrderPage from "./pages/OrderPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import Dialog from "./components/Dialog";
import MyReact from "./lib/MyReact";

const App = () => (
  <>
    <MyRouter.Router>
      <MyRouter.Routes>
        <MyRouter.Route path="/cart" element={<CartPage />} />
        <MyRouter.Route path="/order" element={<OrderPage />} />
        <MyRouter.Route path="/" element={<ProductPage />} />
      </MyRouter.Routes>
    </MyRouter.Router>
  </>
);

//export default App;
const countContext = MyReact.createContext({});

// const CountProvider = ({ children }) => {
//   const [count, setCount] = React.useState(0);
//   const value = { count, setCount };
//   return (
//     <countContext.Provider value={value}>{children}</countContext.Provider>
//   );
// };

// const Count = () => {
//   const { count } = MyReact.useContext(countContext);
//   return <div>{count}</div>;
// };

// const PlusButton = () => {
//   const { count, setCount } = MyReact.useContext(countContext);
//   const handleClick = () => setCount(count + 1);
//   return <button onClick={handleClick}>PLUS</button>;
// };

export default App;
