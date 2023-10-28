import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "@firebase/firestore";
import { db } from "../firebase";
import useAuthState from "../utils/useAuthState";
import styles from "./styles/productStyles.module.css";
import { useNavigate } from "react-router";

function Product(props) {
  const [loading, setLoading] = useState(false);
  const [shopId, setShopId] = useState(null);
  const [productDocRefs, setProductDocRefs] = useState([]);
  const [productData, setProductData] = useState([]);
  const user = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(window.location.href.split("/")[4]);
    setShopId(window.location.href.split("/")[4]);
  }, []);

  useEffect(() => {
    if (!shopId) return;
    const shopDocRef = doc(db, "shops", shopId);

    console.log({ shopDocRef });
    const getDocData = async () => {
      const docSnap = await getDoc(shopDocRef);
      console.log({ docSnap });
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setProductDocRefs(docSnap.data().products);
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    getDocData();
  }, [shopId]);

  useEffect(() => {
    console.log("Here---->>>>>", productDocRefs);
    if (!productDocRefs || !productDocRefs.length) return;
    const productDataPromises = productDocRefs.map(async (productDocRef) => {
      const productDataSnap = await getDoc(productDocRef);
      console.log({ productDataSnap });
      if (productDataSnap.exists()) {
        return { ...productDataSnap.data(), id: productDataSnap.id };
      } else {
        return null;
      }
    });

    Promise.all(productDataPromises)
      .then((productDataArray) => {
        // shopDataArray contains the data of shops associated with the user
        console.log(productDataArray);
        setProductData(productDataArray);
      })
      .catch((error) => {
        console.error("Error fetching shop data:", error);
      });
  }, [productDocRefs]);

  // Function to navigate to the ProductForm component
  const navigateToProductForm = () => {
    navigate(`/shop/${shopId}/new-product`); // Adjust the route as needed
  };

  return (
    <div className={styles.productWrapper}>
      <div className={styles.header}>
        <h2>Products</h2>
        <button onClick={navigateToProductForm}>Add Product</button>
      </div>
      {loading ? (
        <div>Loading products...</div>
      ) : (
        <div className={styles.shops}>
          {productData.map((product) => (
            <div
              className={styles.shopCardWrapper}
              // onClick={() => navigate(`/shop/${shop.id}/products`)}
            >
              <div className={styles.shopName}>{product.name}</div>
              <div className={styles.shopBio}>{product.description}</div>
              <div className={styles.shopAddress}>
                <span className={styles.bold}>Price:</span> {product.price}
              </div>
              <div className={styles.shopAddress}>
                <span className={styles.bold}>Tags:</span> {product.tags}
              </div>
              <div className={styles.shopAddress}>
                <span className={styles.bold}>Avl:</span>{" "}
                {product.availableStock}
              </div>
              <button onClick={() => navigate(`/product/edit/${product.id}`)}>
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Product;
