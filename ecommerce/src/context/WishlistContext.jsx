
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { AuthContext } from "./AuthContext";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/api";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user, loading: authLoading } = useContext(AuthContext);

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadWishlist = async () => {
      if (authLoading) return;

      const token = localStorage.getItem("token");

      if (!user || !token) {
        setWishlist([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const result = await getWishlist(token);

      if (active) {
        if (result.success) {
          setWishlist(result.products || []);
        } else {
          setWishlist([]);
          console.error("Could not load wishlist:", result.message);
        }

        setLoading(false);
      }
    };

    loadWishlist();

    return () => {
      active = false;
    };
  }, [user, authLoading]);

  const toggleWishlist = async (product) => {
    const token = localStorage.getItem("token");

    if (!user || !token) {
      return { success: false, message: "Please log in first." };
    }

    const productId = product._id || product.id;

    if (!productId) {
      return { success: false, message: "Product ID is missing." };
    }

    const alreadySaved = wishlist.some(
      (item) => String(item._id || item.id) === String(productId)
    );

    const result = alreadySaved
      ? await removeFromWishlist(productId, token)
      : await addToWishlist(productId, token);

    if (result.success) {
      setWishlist(result.products || []);
    }

    return result;
  };

  const isInWishlist = (productId) =>
    wishlist.some(
      (item) =>
        String(item._id || item.id) === String(productId)
    );

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
}
