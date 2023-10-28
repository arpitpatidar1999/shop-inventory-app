import React, { useState } from "react";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router";
import useAuthState from "../utils/useAuthState";
import styles from "./styles/shopStyles.module.css";
import {Dna} from 'react-loader-spinner';

function ShopForm() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const user = useAuthState();

  const createShop = async () => {
    console.log("Called this function");
    setLoading(true);
    // Prepare the shop data
    const shopData = {
      name,
      bio,
      address,
      latitude,
      longitude,
    };

    try {
      const docRef = await addDoc(collection(db, "shops"), shopData);
      console.log("Shop added with ID: ", docRef.id);

      if (user) {
        console.log({ user });
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          shops: arrayUnion(doc(db, "shops", docRef.id)),
        });
        console.log("Shop reference added to the user document.");
        navigate("/shop");
      } else {
        console.error("User is not authenticated.");
        setLoading(false);
      }

      // Clear the form fields after successful submission
      setName("");
      setBio("");
      setAddress("");
      setLatitude("");
      setLongitude("");
    } catch (error) {
      console.error("Error adding shop: ", error);
    }
  };

  return loading ? (
    <div className={styles.loaderWrapper}>
      <Dna
        visible={true}
        height="80"
        width="80"
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
      />
    </div>
  ) : (
    <MDBContainer
      fluid
      className="d-flex align-items-center justify-content-center bg-image"
      style={{
        backgroundImage:
          "url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp)",
      }}
    >
      <div className="mask gradient-custom-3"></div>
      <MDBCard className="m-5" style={{ maxWidth: "600px" }}>
        <MDBCardBody className="px-5">
          <h2 className="text-uppercase text-center mb-5">Create a new Shop</h2>
          <MDBInput
            wrapperClass="mb-4"
            label="Shop Name"
            size="lg"
            id="form1"
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Shop Bio"
            size="lg"
            id="form2"
            type="text"
            onChange={(e) => setBio(e.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Shop Address"
            size="lg"
            id="form3"
            type="text"
            onChange={(e) => setAddress(e.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Shop Latitude"
            size="lg"
            id="form4"
            type="text"
            onChange={(e) => setLatitude(e.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Shop Longitude"
            size="lg"
            id="form4"
            type="text"
            onChange={(e) => setLongitude(e.target.value)}
          />
          <MDBBtn
            className="mb-4 w-100 gradient-custom-4"
            size="lg"
            onClick={createShop}
          >
            Create Shop
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default ShopForm;
