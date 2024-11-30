import * as MyRouter from "../lib/MyRouter";

const Navbar = ({}) => {
  return (
    <nav className="Navbar">
      <MyRouter.Link className="active" to="/">
        메뉴목록
      </MyRouter.Link>
      <MyRouter.Link className="" to="/order">
        주문내역
      </MyRouter.Link>
    </nav>
  );
};

export default Navbar;
