const API_URL = "http://localhost:5000/api";

const DEMO_USERS_KEY = "shopEase_demo_users";
const DEMO_PRODUCTS_KEY = "shopEase_demo_products";
const DEMO_OTP_KEY = "shopEase_demo_otp";
const DEMO_JWT_SECRET = "mysecretkey@@1234";
const PRODUCT_CACHE_KEY = "shopEase_products_cache";
const PRODUCT_CACHE_TTL = 5 * 60 * 1000;

const defaultProducts = [
  {
    _id: "64d8ef1b7c9a2b4d5e6f7a8b",
    name: "Premium Wireless Earbuds",
    description: "Noise-canceling earbuds with long battery life and crisp sound.",
    price: 2499,
    originalPrice: 3499,
    category: "Electronics",
    stock: 12,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
  },
  {
    _id: "7a1d3c5e9f2b4d6a8c0e1f3b",
    name: "Urban Leather Backpack",
    description: "Minimal style backpack designed for daily commuting and travel.",
    price: 1799,
    originalPrice: 2399,
    category: "Accessories",
    stock: 20,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
  },
  {
    _id: "8c2f4a6d1e3b5d7f9a1c3e5b",
    name: "Smart Fitness Watch",
    description: "Track your activity, sleep and workouts in one sleek device.",
    price: 3299,
    originalPrice: 4299,
    category: "Wearables",
    stock: 9,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
  },
];

const ensureDemoData = () => {
  if (typeof window === "undefined") return;

  const existingUsers = JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || "[]");
  if (!existingUsers.length) {
    localStorage.setItem(
      DEMO_USERS_KEY,
      JSON.stringify([
        {
          _id: "67b6b9a74e1c2c0d9f6a1b23",
          name: "Admin User",
          email: "admin@shop.com",
          password: "admin123",
          phone: "9876543210",
          role: "admin",
          isVerified: true,
        },
      ])
    );
  }

  if (!localStorage.getItem(DEMO_PRODUCTS_KEY)) {
    localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(defaultProducts));
  }
};

const getDemoUsers = () => {
  ensureDemoData();
  return JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || "[]");
};

const getDemoProducts = () => {
  ensureDemoData();
  return JSON.parse(localStorage.getItem(DEMO_PRODUCTS_KEY) || "[]");
};

const saveDemoProducts = (products) => {
  localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(products));
};

const getCachedProducts = () => {
  try {
    const cache = JSON.parse(localStorage.getItem(PRODUCT_CACHE_KEY) || "null");

    if (!cache || !Array.isArray(cache.products)) return null;

    const isFresh = Date.now() - (cache.timestamp || 0) < PRODUCT_CACHE_TTL;
    if (!isFresh) return null;

    return cache.products;
  } catch (error) {
    return null;
  }
};

const setCachedProducts = (products) => {
  try {
    localStorage.setItem(
      PRODUCT_CACHE_KEY,
      JSON.stringify({
        products,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.warn("Could not save product cache:", error);
  }
};

const generateDemoOTP = () => String(Math.floor(100000 + Math.random() * 900000));

const generateDemoObjectId = () =>
  Array.from({ length: 24 }, () =>
    Math.floor(Math.random() * 16)
      .toString(16)
  ).join("");

const base64UrlEncode = (value) => {
  const encoded = btoa(unescape(encodeURIComponent(value)));
  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const createDemoToken = async (user) => {
  const header = { alg: "HS256", typ: "JWT" };
  const payload = { userId: user._id, role: user.role, email: user.email };

  const encode = (value) => base64UrlEncode(JSON.stringify(value));
  const signingInput = `${encode(header)}.${encode(payload)}`;

  if (!window || !window.crypto || !window.crypto.subtle) {
    return "demo-token";
  }

  const key = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(DEMO_JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await window.crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(signingInput)
  );

  const signatureBase64 = base64UrlEncode(
    String.fromCharCode(...new Uint8Array(signature))
  );

  return `${signingInput}.${signatureBase64}`;
};

const parseFormData = (formData) => {
  if (formData instanceof FormData) {
    return {
      name: formData.get("name") || "",
      description: formData.get("description") || "",
      price: Number(formData.get("price") || 0),
      category: formData.get("category") || "General",
      stock: Number(formData.get("stock") || 0),
      image: formData.get("image") || "",
    };
  }

  return formData || {};
};

// ==================== AUTH ====================

export const registerUser = async (data) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  } catch (error) {
    ensureDemoData();

    const users = getDemoUsers();
    const existingUser = users.find((user) => user.email === data.email);

    if (existingUser && existingUser.isVerified) {
      return {
        success: false,
        message: "User already exists. Please login.",
      };
    }

    const otp = generateDemoOTP();
    localStorage.setItem(DEMO_OTP_KEY, JSON.stringify({ email: data.email, otp }));

    if (!existingUser) {
      users.push({
        _id: generateDemoObjectId(),
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || "",
        role: "user",
        isVerified: false,
      });
      localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
    }

    return {
      success: true,
      message: "Registration successful. OTP sent to your email.",
      demoOtp: otp,
    };
  }
};

export const verifyOTP = async (data) => {
  try {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  } catch (error) {
    ensureDemoData();

    const otpData = JSON.parse(localStorage.getItem(DEMO_OTP_KEY) || "null");
    const users = getDemoUsers();
    const user = users.find((item) => item.email === data.email);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (!otpData || otpData.email !== data.email || otpData.otp !== String(data.otp)) {
      return { success: false, message: "Invalid OTP" };
    }

    user.isVerified = true;
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
    localStorage.removeItem(DEMO_OTP_KEY);

    return {
      success: true,
      message: "Email verified successfully",
    };
  }
};

export const resendOTP = async (email) => {
  try {
    const response = await fetch(`${API_URL}/auth/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    return response.json();
  } catch (error) {
    ensureDemoData();
    const otp = generateDemoOTP();
    localStorage.setItem(DEMO_OTP_KEY, JSON.stringify({ email, otp }));

    return {
      success: true,
      message: "OTP sent again. Please verify your email.",
      demoOtp: otp,
    };
  }
};

export const loginUser = async (data) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  } catch (error) {
    ensureDemoData();

    const users = getDemoUsers();
    const user = users.find(
      (item) => item.email === data.email && item.password === data.password
    );

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    if (!user.isVerified) {
      return {
        success: false,
        message: "Please verify your email first",
      };
    }

    const loggedInUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
    };

    const demoToken = await createDemoToken(loggedInUser);

    return {
      success: true,
      message: "Login successful",
      token: demoToken,
      user: loggedInUser,
    };
  }
};

export const logoutUser = async (token) => {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  } catch (error) {
    return {
      success: true,
      message: "Logged out successfully",
    };
  }
};

// ==================== PRODUCTS ====================

export const getProducts = async (forceRefresh = false) => {
  if (!forceRefresh) {
    const cachedProducts = getCachedProducts();
    if (cachedProducts) {
      return { success: true, products: cachedProducts };
    }
  }

  try {
    const response = await fetch(`${API_URL}/products`);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const result = await response.json();
    const products = result?.products || [];

    setCachedProducts(products);

    return result;
  } catch (error) {
    console.error("Get products error:", error);

    const cachedProducts = getCachedProducts();

    if (cachedProducts) {
      return {
        success: true,
        products: cachedProducts,
        message: "Loaded cached products",
      };
    }

    return {
      success: false,
      products: [],
      message: "Failed to fetch products from server",
    };
  }
};


export const getProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    return response.json();
  } catch (error) {
    const product = getDemoProducts().find((item) => item._id === id);
    return {
      success: true,
      product: product || null,
    };
  }
};
// ========================================
// GET BEST SELLERS
// ========================================

export const getBestSellers = async () => {
  try {
    const response = await fetch(
      `${API_URL}/products/best-sellers`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch best sellers");
    }

    return await response.json();
  } catch (error) {
    console.error("Get best sellers error:", error);

    return {
      success: false,
      products: [],
      message: "Failed to fetch best sellers",
    };
  }
};

export const createProduct = async (formData, token) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return response.json();
  } catch (error) {
    const products = getDemoProducts();
    const payload = parseFormData(formData);

    const newProduct = {
      _id: generateDemoObjectId(),
      name: payload.name || "New Demo Product",
      description: payload.description || "Product added from demo mode.",
      price: Number(payload.price || 0),
      originalPrice: Number(payload.price || 0) + 500,
      category: payload.category || "General",
      stock: Number(payload.stock || 0),
      rating: 4.6,
      image:
        payload.image && typeof payload.image === "string"
          ? payload.image
          : "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    };

    products.unshift(newProduct);
    saveDemoProducts(products);

    return {
      success: true,
      message: "Product added successfully",
      product: newProduct,
    };
  }
};

export const updateProduct = async (id, data, token) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(data),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Update product error:", error);

    return {
      success: false,
      message: "Failed to update product",
    };
  }
};

export const deleteProduct = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  } catch (error) {
    const products = getDemoProducts().filter((product) => product._id !== id);
    saveDemoProducts(products);

    return {
      success: true,
      message: "Product deleted successfully",
    };
  }
};

// ==================== USER ====================

export const getProfile = async (token) => {
  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  } catch (error) {
    const users = getDemoUsers();
    const user = users.find((item) => item.email === JSON.parse(localStorage.getItem("user") || "null")?.email);

    return {
      success: true,
      user: user || null,
    };
  }
};

export const updateProfile = async (data, token) => {
  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return response.json();
  } catch (error) {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    const users = getDemoUsers();
    const existingUser = users.find((user) => user.email === savedUser?.email);

    if (!existingUser) {
      return { success: false, message: "User not found" };
    }

    Object.assign(existingUser, data, {
      name: data.name || existingUser.name,
      phone: data.phone || existingUser.phone,
    });

    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
    localStorage.setItem("user", JSON.stringify({ ...savedUser, ...existingUser }));

    return {
      success: true,
      message: "Profile updated successfully",
    };
  }
};

export const changePassword = async (data, token) => {
  try {
    const response = await fetch(`${API_URL}/users/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return response.json();
  } catch (error) {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    const users = getDemoUsers();
    const existingUser = users.find((user) => user.email === savedUser?.email);

    if (!existingUser) {
      return { success: false, message: "User not found" };
    }

    if (existingUser.password !== data.currentPassword) {
      return { success: false, message: "Current password is incorrect" };
    }

    existingUser.password = data.newPassword;
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));

    return {
      success: true,
      message: "Password updated successfully",
    };
  }
};


// ========================================
// GET WISHLIST
// ========================================

export const getWishlist = async (token) => {
  try {
    const response = await fetch(
      `${API_URL}/wishlist`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Get wishlist error:", error);

    return {
      success: false,
      products: [],
      message: "Failed to fetch wishlist",
    };
  }
};

// ========================================
// ADD TO WISHLIST
// ========================================

export const addToWishlist = async (
  productId,
  token
) => {
  try {
    const response = await fetch(
      `${API_URL}/wishlist`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
        }),
      }
    );

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Add wishlist error:", error);

    return {
      success: false,
      message: "Failed to add product to wishlist",
    };
  }
};

// ========================================
// REMOVE FROM WISHLIST
// ========================================

export const removeFromWishlist = async (
  productId,
  token
) => {
  try {
    const response = await fetch(
      `${API_URL}/wishlist/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Remove wishlist error:", error);

    return {
      success: false,
      message: "Failed to remove product",
    };
  }
};


export const askAI = async (prompt) => {
  try {
    const response = await fetch(`${API_URL}/ai/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("AI request error:", error);

    return {
      success: false,
      message: "Failed to connect to AI",
    };
  }
};


/* ==================== CART ==================== */

// GET CART
export const getCart = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return { success: false, items: [], message: "Please log in first." };
    }

    const response = await fetch(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        items: [],
        message: result.message || "Failed to fetch cart.",
      };
    }

    return result;
  } catch (error) {
    console.error("Get cart error:", error);
    return { success: false, items: [], message: "Could not connect to server." };
  }
};

// ADD PRODUCT TO CART
export const addToCart = async (productId, quantity = 1) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return { success: false, message: "Please log in to add products to cart." };
    }

    const response = await fetch(`${API_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to add product to cart.",
      };
    }

    return result;
  } catch (error) {
    console.error("Add to cart error:", error);
    return { success: false, message: "Could not connect to server." };
  }
};

// UPDATE CART QUANTITY
export const updateCartQuantity = async (productId, quantity) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return { success: false, message: "Please log in first." };
    }

    const response = await fetch(
      `${API_URL}/cart/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to update quantity.",
      };
    }

    return result;
  } catch (error) {
    console.error("Update cart error:", error);
    return { success: false, message: "Could not connect to server." };
  }
};

// REMOVE PRODUCT FROM CART
export const removeFromCart = async (productId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return { success: false, message: "Please log in first." };
    }

    const response = await fetch(
      `${API_URL}/cart/${productId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to remove product.",
      };
    }

    return result;
  } catch (error) {
    console.error("Remove cart error:", error);
    return { success: false, message: "Could not connect to server." };
  }
};
