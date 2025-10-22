// Firestore service functions for data operations
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Collections
const COLLECTIONS = {
  USERS: 'users',
  ORDERS: 'orders',
  REVIEWS: 'reviews',
  PRODUCTS: 'products',
  CARTS: 'carts'
};

// User operations
export const userService = {
  // Create user document
  createUser: async (userId, userData) => {
    try {
      await setDoc(doc(db, COLLECTIONS.USERS, userId), {
        ...userData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return { success: true };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user by ID
  getUser: async (userId) => {
    try {
      const docSnap = await getDoc(doc(db, COLLECTIONS.USERS, userId));
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      console.error('Error getting user:', error);
      return { success: false, error: error.message };
    }
  },

  // Update user
  updateUser: async (userId, updates) => {
    try {
      await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
        ...updates,
        updatedAt: Timestamp.now()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: users };
    } catch (error) {
      console.error('Error getting users:', error);
      return { success: false, error: error.message };
    }
  }
};

// Order operations
export const orderService = {
  // Create order
  createOrder: async (orderData) => {
    try {
      // Use the custom order ID as the Firestore document ID
      const orderId = orderData.id;
      await setDoc(doc(db, COLLECTIONS.ORDERS, orderId), {
        ...orderData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return { success: true, id: orderId };
    } catch (error) {
      console.error('Error creating order:', error);
      return { success: false, error: error.message };
    }
  },

  // Get orders by user ID
  getUserOrders: async (userId) => {
    try {
      // First try with compound query (requires index)
      try {
        const q = query(
          collection(db, COLLECTIONS.ORDERS),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const orders = [];
        querySnapshot.forEach((doc) => {
          orders.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: orders };
      } catch (indexError) {
        // If index doesn't exist, fall back to getting all orders and filtering client-side
        console.warn('Index not ready for user orders, falling back to client-side filtering');
        try {
          const q = query(collection(db, COLLECTIONS.ORDERS), orderBy('createdAt', 'desc'));
          const querySnapshot = await getDocs(q);
          const orders = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === userId) {
              orders.push({ id: doc.id, ...data });
            }
          });
          return { success: true, data: orders };
        } catch (fallbackError) {
          console.warn('Fallback query also failed, returning empty orders:', fallbackError.message);
          return { success: true, data: [] };
        }
      }
    } catch (error) {
      console.error('Error getting user orders:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all orders (admin only)
  getAllOrders: async () => {
    try {
      const q = query(collection(db, COLLECTIONS.ORDERS), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: orders };
    } catch (error) {
      console.error('Error getting all orders:', error);
      return { success: false, error: error.message };
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      console.log('Attempting to update order:', orderId, 'with status:', status);

      // Find the document by the id field (since document ID might be auto-generated)
      const q = query(collection(db, COLLECTIONS.ORDERS), where('id', '==', orderId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error('Order document does not exist:', orderId);
        return { success: false, error: `No document to update: ${orderId}` };
      }

      const docRef = querySnapshot.docs[0].ref;
      console.log('Order document found, updating status...');
      await updateDoc(docRef, {
        status,
        updatedAt: Timestamp.now()
      });

      console.log('Order status updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Error updating order status:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete order
  deleteOrder: async (orderId) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.ORDERS, orderId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting order:', error);
      return { success: false, error: error.message };
    }
  }
};

// Review operations
export const reviewService = {
  // Create review
  createReview: async (reviewData) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.REVIEWS), {
        ...reviewData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating review:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all reviews
  getAllReviews: async () => {
    try {
      const q = query(collection(db, COLLECTIONS.REVIEWS), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const reviews = [];
      querySnapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: reviews };
    } catch (error) {
      console.error('Error getting reviews:', error);
      return { success: false, error: error.message };
    }
  },

  // Get approved reviews
  getApprovedReviews: async () => {
    try {
      // First try with compound query (requires index)
      try {
        const q = query(
          collection(db, COLLECTIONS.REVIEWS),
          where('approved', '==', true),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const reviews = [];
        querySnapshot.forEach((doc) => {
          reviews.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: reviews };
      } catch {
        // If index doesn't exist, fall back to getting all and filtering
        console.warn('Index not ready, falling back to client-side filtering');
        const q = query(collection(db, COLLECTIONS.REVIEWS), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const reviews = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.approved === true) {
            reviews.push({ id: doc.id, ...data });
          }
        });
        return { success: true, data: reviews };
      }
    } catch (error) {
      console.error('Error getting approved reviews:', error);
      return { success: false, error: error.message };
    }
  },

  // Approve review
  approveReview: async (reviewId) => {
    try {
      // First check if the review exists
      const docRef = doc(db, COLLECTIONS.REVIEWS, reviewId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.warn('Review not found for approval:', reviewId);
        return { success: false, error: 'Review not found' };
      }

      await updateDoc(docRef, {
        approved: true,
        updatedAt: Timestamp.now()
      });
      console.log('Review approved successfully:', reviewId);
      return { success: true };
    } catch (error) {
      console.error('Error approving review:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete review
  deleteReview: async (reviewId) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.REVIEWS, reviewId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting review:', error);
      return { success: false, error: error.message };
    }
  }
};

// Product operations
export const productService = {
  // Get product data
  getProduct: async () => {
    try {
      const docSnap = await getDoc(doc(db, COLLECTIONS.PRODUCTS, 'main'));
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        // Return default product data if not found
        return {
          success: true,
          data: {
            name: 'Ramzaan',
            price: 1499,
            stock: 50,
            description: 'Experience timeless elegance in every drop',
            notes: 'Oud, Amber, Musk'
          }
        };
      }
    } catch (error) {
      console.error('Error getting product:', error);
      return { success: false, error: error.message };
    }
  },

  // Update product
  updateProduct: async (productData) => {
    try {
      await setDoc(doc(db, COLLECTIONS.PRODUCTS, 'main'), {
        ...productData,
        updatedAt: Timestamp.now()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, error: error.message };
    }
  }
};

// Cart operations (per user)
export const cartService = {
  // Get user cart
  getUserCart: async (userId) => {
    try {
      const docSnap = await getDoc(doc(db, COLLECTIONS.CARTS, userId));
      if (docSnap.exists()) {
        return { success: true, data: docSnap.data().items || [] };
      } else {
        return { success: true, data: [] };
      }
    } catch (error) {
      console.error('Error getting cart:', error);
      return { success: false, error: error.message };
    }
  },

  // Update user cart
  updateUserCart: async (userId, items) => {
    try {
      await setDoc(doc(db, COLLECTIONS.CARTS, userId), {
        items,
        updatedAt: Timestamp.now()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating cart:', error);
      return { success: false, error: error.message };
    }
  },

  // Clear user cart
  clearUserCart: async (userId) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.CARTS, userId));
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, error: error.message };
    }
  }
};