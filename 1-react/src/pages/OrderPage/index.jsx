import React from "react";
import OrderApi from "shared/api/OrderApi";
import Navbar from "../../components/Navbar";
import Page from "../../components/Page";
import Title from "../../components/Title";
import OrderDeliveryCard from "./OrderDeliveryCard";
import OrderPaymentCard from "./OrderPaymentCard";
import OrderStatusCard from "./OrderStatusCard";

class OrderPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { order: null };
  }

  async fetch() {
    try {
      const order = await OrderApi.fetchMyOrder();
      this.setState({ order });
    } catch (e) {
      console.error(e);
    }
  }

  componentDidMount() {
    this.fetch();
  }

  render() {
    const { order } = this.state;
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
  }
}

export default OrderPage;
