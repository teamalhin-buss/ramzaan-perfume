// Data initialization utilities
// This file is no longer auto-initializing demo data
// All data is now user-generated through actual usage

export const clearAllData = () => {
  // Utility function to clear all stored data (use with caution)
  const keysToKeep = ['user']; // Keep user session
  const allKeys = Object.keys(localStorage);
  
  allKeys.forEach(key => {
    if (!keysToKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  });
  
  console.log('✅ All data cleared (except user session)');
};

export const getStorageStats = () => {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
  
  console.log('📊 Storage Stats:');
  console.log('Orders:', orders.length);
  console.log('Users:', users.length);
  console.log('Reviews:', reviews.length);
  
  return { orders: orders.length, users: users.length, reviews: reviews.length };
};

// No auto-initialization - all data comes from actual user actions
