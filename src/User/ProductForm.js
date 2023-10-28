import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  arrayUnion,
} from "@firebase/firestore";
import { db } from "../firebase";
import styles from "./styles/productStyles.module.css";
import { useNavigate } from "react-router";
import useAuthState from "../utils/useAuthState";

function ProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState("");
  const [availableStock, setAvailableStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [shopId, setShopId] = useState(null);

  const navigate = useNavigate();
  const user = useAuthState();

  useEffect(() => {
    console.log(window.location.href.split("/")[4]);
    setShopId(window.location.href.split("/")[4]);
  }, []);

  // Add logic for submitting a new product

  const createProduct = async () => {
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
      const docRef = await addDoc(collection(db, "products"), productData);
      console.log("Product added with ID: ", docRef.id);

      if (shopId) {
        console.log({ shopId });
        const shopDocRef = doc(db, "shops", shopId);
        await updateDoc(shopDocRef, {
          products: arrayUnion(doc(db, "products", docRef.id)),
        });
        console.log("Product reference added to the shop document.");
        navigate(`/shop/${shopId}/products`);
      } else {
        console.error("User is not authenticated.");
        setLoading(false);
      }

      // Clear the form fields after successful submission
      setName("");
      setDescription("");
      setTags("");
      setPrice("");
      setAvailableStock("");
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  return (
    <div className={styles.productFormWrapper}>
      <h2>Create a New Product</h2>
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
      <button onClick={createProduct} disabled={loading}>
        Create Product
      </button>
    </div>
  );
}

export default ProductForm;
