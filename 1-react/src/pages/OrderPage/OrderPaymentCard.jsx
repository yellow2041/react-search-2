import Card from "../../components/Card";

const OrderPaymentCard = ({ order }) => {
  const {
    totalPrice,
    productPrice,
    deliveryPrice,
    discountPrice,
    paymentMethod,
  } = order;

  return (
    <Card
      header={
        <>
          총 결제금액:{totalPrice.toLocaleString()}원<br />
          결제 방법:{paymentMethod}
        </>
      }
      data={[
        { term: "메뉴가격", description: productPrice },
        { term: "배달료", description: deliveryPrice },
        { term: "할인금액", description: discountPrice },
      ]}
    />
  );
};

export default OrderPaymentCard;
