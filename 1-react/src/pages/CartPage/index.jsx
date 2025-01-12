import React, { useEffect, useState } from "react";
import Page from "../../components/Page";
import ProductItem from "../../components/ProductItem";
import Title from "../../components/Title";
import OrderForm from "./OrderForm";
import PaymentButton from "./PaymentButton";
import ProductApi from "shared/api/ProductApi";
import * as MyRouter from "../../lib/MyRouter";
import * as MyLayout from "../../lib/MyLayout";
import ErrorDialog from "../../components/ErrorDialog";
import OrderApi from "shared/api/OrderApi";
import PaymentSuccessDialog from "./PaymentSuccessDialog";

const CartPage = ({ startLoading, finishLoading, openDialog }) => {
  const [product, setProduct] = useState();
  const { productId } = MyRouter.useParams();

  const handleSubmit = async (values) => {
    startLoading("결제중...");
    try {
      await OrderApi.createOrder(values);
    } catch (e) {
      openDialog(<ErrorDialog />);
      return;
    }
    openDialog(<PaymentSuccessDialog />);
  };

  const fetch = async (productId) => {
    try {
      const product = await ProductApi.fetchProduct(productId);
      setProduct(product);
      //finishLoading();
    } catch (e) {
      openDialog(<ErrorDialog />);
      return;
    }
  };
  useEffect(() => {
    if (productId) fetch(productId);
  }, [productId]);
  return (
    <div className="CartPage">
      <Page
        header={<Title backUrl={"/"}>장바구니</Title>}
        footer={<PaymentButton />}
      >
        {product && <ProductItem product={product} />}
        <OrderForm onSubmit={handleSubmit} />
      </Page>
    </div>
  );
};

export default MyLayout.withLayout(MyRouter.withRouter(CartPage));
