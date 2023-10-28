import {
  addDoc,
  collection,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase"; // Assuming you have Firebase auth set up

const createShopForUser = async (name, bio, address, latitude, longitude) => {
  const user = auth.currentUser;

  if (user) {
    try {
      // Step 1: Add the shop data to the 'shops' collection in Firestore
      const shopData = {
        name,
        bio,
        address,
        latitude,
        longitude,
      };

      const shopRef = await addDoc(collection(db, "shops"), shopData);
      const shopId = shopRef.id;

      // Step 2: Update the user's document to associate the shop with the user
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        shops: arrayUnion(shopId),
      });

      // If you want to store additional user-specific data about the shop:
      // Example: await updateDoc(userDocRef, { shopId: shopId });

      console.log("Shop added and associated with the user.");
    } catch (error) {
      console.error("Error creating shop:", error);
    }
  } else {
    console.error("User is not authenticated. Cannot create a shop.");
  }
};

export default createShopForUser;
