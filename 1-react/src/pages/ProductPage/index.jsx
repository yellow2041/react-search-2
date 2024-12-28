import React, { useEffect } from "react";
import ProductApi from "shared/api/ProductApi";
import Navbar from "../../components/Navbar";
import Page from "../../components/Page";
import ProductItem from "../../components/ProductItem";
import Title from "../../components/Title";
import OrderableProductItem from "./OrderableProductItem";
import FormControl from "../../components/FormControl";
import * as MyLayout from "../../lib/MyLayout";
import Dialog from "../../components/Dialog";
import ErrorDialog from "../../components/ErrorDialog";

const ProductPage = () => {
  const [productList, setProductList] = React.useState([]);

  const fetch = async () => {
    try {
      const productList = await ProductApi.fetchProductList();
      setProductList(productList);
    } catch (e) {
      //openDialog(<ErrorDialog />);
      return;
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  return (
    <div className="ProductPage">
      <Page header={<Title>메뉴목록</Title>} footer={<Navbar />}>
        <ul>
          {productList.map((product) => (
            <li key={product.id}>
              <OrderableProductItem product={product} />
            </li>
          ))}
        </ul>
      </Page>
    </div>
  );
};

// class ProductPage extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       productList: [],
//     };
//   }

//   async fetch() {
//     const { startLoading, finishLoading, openDialog } = this.props;
//     startLoading("메뉴 목록 로딩중...");
//     try {
//       const productList = await ProductApi.fetchProductList();
//       this.setState({ productList });
//     } catch (e) {
//       openDialog(<ErrorDialog />);
//       return;
//     }
//     finishLoading();
//   }

//   componentDidMount() {
//     this.fetch();
//   }

//   render() {

//   }
// }

export default ProductPage;
