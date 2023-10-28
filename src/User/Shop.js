import React, { useEffect, useState } from "react";
import useAuthState from "../utils/useAuthState";
import styles from "./styles/shopStyles.module.css";
import { signOut } from "@firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router";
import { collection, doc, getDoc } from "@firebase/firestore";
import { async } from "@firebase/util";

// const shopData = [
//   {
//     name: "Shop 1",
//     bio: "Shop 1 bio",
//     address: "Shop 1 address",
//     latitude: 123,
//     longitude: 123,
//   },
//   {
//     name: "Shop 2",
//     bio: "Shop 2 bio",
//     address: "Shop 2 address",
//     latitude: 123,
//     longitude: 123,
//   },
//   {
//     name: "Shop 3",
//     bio: "Shop 3 bio",
//     address: "Shop 3 address",
//     latitude: 123,
//     longitude: 123,
//   },
//   {
//     name: "Shop 4",
//     bio: "Shop 4 bio",
//     address: "Shop 4 address",
//     latitude: 123,
//     longitude: 123,
//   },
// ];

function Shop() {
  const [loading, setLoading] = useState(false);
  const [shopDocRefs, setShopDocRefs] = useState([]);
  const [shopData, setShopData] = useState([]);
  const navigate = useNavigate();
  const user = useAuthState();

  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);

    console.log({ userDocRef });
    const getDocData = async () => {
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setShopDocRefs(docSnap.data().shops);
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    getDocData();
  }, [user]);

  useEffect(() => {
    if (!shopDocRefs.length) return;
    const shopDataPromises = shopDocRefs.map(async (shopDocRef) => {
      const shopDataSnap = await getDoc(shopDocRef);
      console.log({ shopDataSnap });
      if (shopDataSnap.exists()) {
        return { ...shopDataSnap.data(), id: shopDataSnap.id };
      } else {
        return null;
      }
    });

    Promise.all(shopDataPromises)
      .then((shopDataArray) => {
        // shopDataArray contains the data of shops associated with the user
        console.log(shopDataArray);
        setShopData(shopDataArray);
      })
      .catch((error) => {
        console.error("Error fetching shop data:", error);
      });
  }, [shopDocRefs]);

  const handleSignout = () => {
    signOut(auth)
      .then(() => {
        console.log("User has been logged out.");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <div>
      {user ? (
        <div className={styles.shopWrapper}>
          <div className={styles.userName}>Welcome {user.email}</div>
          <div className={styles.buttonContainer}>
            <div
              className={`${styles.buttonWrapper} ${styles.createNewShopButton}`}
              onClick={() => navigate("/new-shop")}
            >
              Create New Shop
            </div>
            <div
              className={`${styles.buttonWrapper} ${styles.logoutButton}`}
              onClick={handleSignout}
            >
              Logout
            </div>
          </div>
          <div className={styles.shops}>
            {shopData.map((shop) => {
              return (
                <div
                  key={shop.id}
                  className={styles.shopCardWrapper}
                  onClick={() => navigate(`/shop/${shop.id}/products`)}
                >
                  <div className={styles.shopName}>{shop.name}</div>
                  <div className={styles.shopBio}>{shop.bio}</div>
                  <div className={styles.shopAddress}>
                    <span className={styles.bold}>Address:</span> {shop.address}
                    , <span className={styles.bold}>Lat:</span> {shop.latitude},
                    <span className={styles.bold}>Long:</span> {shop.longitude}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>Please log in to continue.</div>
      )}
    </div>
  );
}

export default Shop;
