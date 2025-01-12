import React, { useEffect } from "react";
import OrderApi from "shared/api/OrderApi";
import Navbar from "../../components/Navbar";
import Page from "../../components/Page";
import Title from "../../components/Title";
import OrderDeliveryCard from "./OrderDeliveryCard";
import OrderPaymentCard from "./OrderPaymentCard";
import OrderStatusCard from "./OrderStatusCard";
import * as MyLayout from "../../lib/MyLayout";

const OrderPage = () => {
  const [order, setOrder] = React.useState();
  const fetch = async () => {
    //const { startLoading, finishLoading } = props;

    //startLoading("주문정보 로딩중...");
    try {
      const order = await OrderApi.fetchMyOrder();
      setOrder(order);
    } catch (e) {
      openDialog(<ErrorDialog />);
      return;
    }
    //finishLoading();
  };

  useEffect(() => {
    fetch();
  }, []);
  return (
    <div className="OrderPage">
      <Page header={<Title>주문내역</Title>} footer={<Navbar />}>
        {order && (
          <>
            <OrderDeliveryCard order={order} />
            <OrderPaymentCard order={order} />
            <OrderStatusCard order={order} />
          </>
        )}
      </Page>
    </div>
  );
};

export default MyLayout.withLayout(OrderPage);
