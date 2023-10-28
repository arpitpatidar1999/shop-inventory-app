import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "@firebase/firestore";
import { db } from "../firebase";
import styles from "./styles/productStyles.module.css";
import { useNavigate } from "react-router";
import useAuthState from "../utils/useAuthState";

function ProductUpdateForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState("");
  const [availableStock, setAvailableStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [productId, setProductId] = useState(null);

  const navigate = useNavigate();
  const user = useAuthState();

  useEffect(() => {
    console.log(window.location.href.split("/").pop());
    setProductId(window.location.href.split("/").pop());
  }, []);

  useEffect(()=>{
    if(productId){
        /**
         * Get product data
         */
        const fetchProductData = async()=>{
            const productRef = doc(db, "products", productId)
            const productSnap = await getDoc(productRef)
            if(productSnap.exists()){
                console.log(productSnap.data())
                const productData = productSnap.data();
                setName(productData.name)
                setDescription(productData.description)
                setTags(productData.tags)
                setPrice(productData.price)
                setAvailableStock(productData.availableStock)

            }

        }
        fetchProductData()
    }
  },[productId])

  // Add logic for submitting a new product

  const updateProduct = async () => {
    console.log("Called this function");
    setLoading(true);
    // Prepare the shop data
    const productData = {
      name,
      description,
      price,
      tags,
      availableStock,
    };

    try {
      const docRef = await updateDoc(doc(db, "products", productId), productData);
    //   console.log("Product updated with ID: ", docRef.id);

      // Clear the form fields after successful submission
      navigate("/shop")
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  return (
    <div className={styles.productFormWrapper}>
      <h2>Update Product</h2>
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <input
        type="text"
        placeholder="Available Stock"
        value={availableStock}
        onChange={(e) => setAvailableStock(e.target.value)}
      />
      <button onClick={updateProduct} disabled={loading}>
        Updatae Product
      </button>
    </div>
  );
}

export default ProductUpdateForm;
