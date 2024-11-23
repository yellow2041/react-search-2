import React from "react";
import FormControl from "../../components/FormControl";
import Page from "../../components/Page";
import ProductItem from "../../components/ProductItem";
import Title from "../../components/Title";
import OrderForm from "./OrderForm";
import PaymentButton from "./PaymentButton";
import ProductApi from "shared/api/ProductApi";

const fakeProduct = {
  id: "CACDA425",
  name: "매운 푸팟퐁 커리",
  price: 20000,
  thumbnail: "./images/menu-매운푸팟퐁커리.jpg",
};

class CartPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { product: null };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async fetch() {
    try {
      const product = await ProductApi.fetchProduct("CACDA425");
      this.setState({ product });
    } catch (e) {
      console.error(e);
    }
  }

  handleSubmit(values) {
    console.log("Love it when it rains");
    console.log(values);
  }

  componentDidMount() {
    this.fetch();
  }

  render() {
    const { product } = this.state;

    return (
      <div className="CartPage">
        <Page
          header={<Title backUrl={"/"}>장바구니</Title>}
          footer={<PaymentButton />}
        >
          {product && <ProductItem product={product} />}
          <OrderForm onSubmit={this.handleSubmit} />
        </Page>
      </div>
    );
  }
}

export default CartPage;
