
const BACKEND_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const API_URL = `${BACKEND_URL}/api`;

const PRODUCT_CACHE_KEY = "shopEase_products_cache";
const PRODUCT_CACHE_TTL = 5 * 60 * 1000;

// -------------------- COMMON HELPERS --------------------

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : options.body
          ? { "Content-Type": "application/json" }
          : {}),
      ...(options.token
        ? { Authorization: `Bearer ${options.token}` }
        : {}),
      ...options.headers,
    },
    body: options.body instanceof FormData
      ? options.body
      : options.body === undefined
        ? undefined
        : typeof options.body === "string"
          ? options.body
          : JSON.stringify(options.body),
  });

  const text = await response.text();
  let result = {};

  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    result = { message: text || "Invalid server response" };
  }

  if (!response.ok) {
    return {
      success: false,
      message: result.message || `Request failed (${response.status})`,
      status: response.status,
    };
  }

  return result;
}

function getToken(token) {
  return token || localStorage.getItem("token");
}

function readProductCache() {
  try {
    const cached = JSON.parse(
      localStorage.getItem(PRODUCT_CACHE_KEY) || "null"
    );

    if (
      cached &&
      Array.isArray(cached.products) &&
      Date.now() - cached.timestamp < PRODUCT_CACHE_TTL
    ) {
      return cached.products;
    }
  } catch (error) {
    console.warn("Unable to read product cache:", error);
  }

  return null;
}

function saveProductCache(products) {
  try {
    localStorage.setItem(
      PRODUCT_CACHE_KEY,
      JSON.stringify({
        products,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.warn("Unable to save product cache:", error);
  }
}

// -------------------- AUTHENTICATION --------------------

export const registerUser = async (data) => {
  try {
    return await apiRequest("/auth/register", {
      method: "POST",
      body: data,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Unable to connect to the server.",
    };
  }
};

export const verifyOTP = async (data) => {
  try {
    return await apiRequest("/auth/verify-otp", {
      method: "POST",
      body: data,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return {
      success: false,
      message: "Unable to verify OTP. Please try again.",
    };
  }
};

export const resendOTP = async (email) => {
  try {
    return await apiRequest("/auth/resend-otp", {
      method: "POST",
      body: { email },
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return {
      success: false,
      message: "Unable to resend OTP.",
    };
  }
};

export const loginUser = async (data) => {
  try {
    const result = await apiRequest("/auth/login", {
      method: "POST",
      body: data,
    });

    if (result.success && result.token) {
      localStorage.setItem("token", result.token);

      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }
    }

    return result;
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Unable to connect to the server.",
    };
  }
};

export const logoutUser = async (token) => {
  try {
    const result = await apiRequest("/auth/logout", {
      method: "POST",
      token: getToken(token),
    });

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return result;
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    console.error("Logout error:", error);
    return {
      success: true,
      message: "Logged out locally.",
    };
  }
};

// -------------------- PRODUCTS --------------------

export const getProducts = async (forceRefresh = false) => {
  if (!forceRefresh) {
    const cachedProducts = readProductCache();

    if (cachedProducts) {
      return {
        success: true,
        products: cachedProducts,
      };
    }
  }

  try {
    const result = await apiRequest("/products");

    if (result.success !== false) {
      const products = Array.isArray(result)
        ? result
        : result.products || [];

      saveProductCache(products);

      return Array.isArray(result)
        ? { success: true, products: result }
        : { ...result, products };
    }

    return {
      ...result,
      products: [],
    };
  } catch (error) {
    console.error("Get products error:", error);

    return {
      success: false,
      products: [],
      message: "Unable to load products from the server.",
    };
  }
};

export const getProduct = async (id) => {
  try {
    return await apiRequest(
      `/products/${encodeURIComponent(id)}`
    );
  } catch (error) {
    console.error("Get product error:", error);
    return {
      success: false,
      product: null,
      message: "Unable to load product.",
    };
  }
};

export const getBestSellers = async () => {
  try {
    return await apiRequest("/products/best-sellers");
  } catch (error) {
    console.error("Get best sellers error:", error);
    return {
      success: false,
      products: [],
      message: "Unable to load best sellers.",
    };
  }
};

export const createProduct = async (formData, token) => {
  try {
    return await apiRequest("/products", {
      method: "POST",
      token: getToken(token),
      body: formData,
    });
  } catch (error) {
    console.error("Create product error:", error);
    return {
      success: false,
      message: "Unable to create product.",
    };
  }
};

export const updateProduct = async (id, data, token) => {
  try {
    return await apiRequest(
      `/products/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        token: getToken(token),
        body: data,
      }
    );
  } catch (error) {
    console.error("Update product error:", error);
    return {
      success: false,
      message: "Unable to update product.",
    };
  }
};

export const deleteProduct = async (id, token) => {
  try {
    const result = await apiRequest(
      `/products/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        token: getToken(token),
      }
    );

    if (result.success !== false) {
      localStorage.removeItem(PRODUCT_CACHE_KEY);
    }

    return result;
  } catch (error) {
    console.error("Delete product error:", error);
    return {
      success: false,
      message: "Unable to delete product.",
    };
  }
};

// -------------------- USER PROFILE --------------------

export const getProfile = async (token) => {
  try {
    return await apiRequest("/users/profile", {
      method: "GET",
      token: getToken(token),
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return {
      success: false,
      user: null,
      message: "Unable to load profile.",
    };
  }
};

export const updateProfile = async (data, token) => {
  try {
    return await apiRequest("/users/profile", {
      method: "PUT",
      token: getToken(token),
      body: data,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return {
      success: false,
      message: "Unable to update profile.",
    };
  }
};

export const changePassword = async (data, token) => {
  try {
    return await apiRequest("/users/change-password", {
      method: "PUT",
      token: getToken(token),
      body: data,
    });
  } catch (error) {
    console.error("Change password error:", error);
    return {
      success: false,
      message: "Unable to change password.",
    };
  }
};

// -------------------- WISHLIST --------------------

export const getWishlist = async (token) => {
  try {
    return await apiRequest("/wishlist", {
      method: "GET",
      token: getToken(token),
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    return {
      success: false,
      products: [],
      message: "Unable to load wishlist.",
    };
  }
};

export const addToWishlist = async (productId, token) => {
  try {
    return await apiRequest("/wishlist", {
      method: "POST",
      token: getToken(token),
      body: { productId },
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    return {
      success: false,
      message: "Unable to add product to wishlist.",
    };
  }
};

export const removeFromWishlist = async (productId, token) => {
  try {
    return await apiRequest(
      `/wishlist/${encodeURIComponent(productId)}`,
      {
        method: "DELETE",
        token: getToken(token),
      }
    );
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return {
      success: false,
      message: "Unable to remove product from wishlist.",
    };
  }
};

// -------------------- AI ASSISTANT --------------------

export const askAI = async (prompt) => {
  try {
    return await apiRequest("/ai/ask", {
      method: "POST",
      body: { prompt },
    });
  } catch (error) {
    console.error("AI request error:", error);
    return {
      success: false,
      message: "Unable to connect to the AI service.",
    };
  }
};

// -------------------- SHOPPING CART --------------------

export const getCart = async () => {
  const token = getToken();

  if (!token) {
    return {
      success: false,
      items: [],
      message: "Please log in first.",
    };
  }

  try {
    return await apiRequest("/cart", {
      method: "GET",
      token,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return {
      success: false,
      items: [],
      message: "Unable to load cart.",
    };
  }
};

export const addToCart = async (productId, quantity = 1) => {
  const token = getToken();

  if (!token) {
    return {
      success: false,
      message: "Please log in to add products to your cart.",
    };
  }

  try {
    return await apiRequest("/cart", {
      method: "POST",
      token,
      body: { productId, quantity },
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return {
      success: false,
      message: "Unable to add product to cart.",
    };
  }
};

export const updateCartQuantity = async (productId, quantity) => {
  const token = getToken();

  if (!token) {
    return {
      success: false,
      message: "Please log in first.",
    };
  }

  try {
    return await apiRequest(
      `/cart/${encodeURIComponent(productId)}`,
      {
        method: "PUT",
        token,
        body: { quantity },
      }
    );
  } catch (error) {
    console.error("Update cart error:", error);
    return {
      success: false,
      message: "Unable to update cart quantity.",
    };
  }
};

export const removeFromCart = async (productId) => {
  const token = getToken();

  if (!token) {
    return {
      success: false,
      message: "Please log in first.",
    };
  }

  try {
    return await apiRequest(
      `/cart/${encodeURIComponent(productId)}`,
      {
        method: "DELETE",
        token,
      }
    );
  } catch (error) {
    console.error("Remove from cart error:", error);
    return {
      success: false,
      message: "Unable to remove product from cart.",
    };
  }
};
