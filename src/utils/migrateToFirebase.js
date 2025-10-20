// Migration script to move data from localStorage to Firebase
// This script runs automatically when the page loads to make functions available globally

// Global migration function
window.migrateDataToFirebase = async function() {
  console.log('🚀 Starting data migration to Firebase...');

  try {
    // Dynamic import to work in browser console
    const { userService, orderService, reviewService, productService } = await import('../services/firestore.js');

    // 1. Migrate users
    console.log('📝 Migrating users...');
    const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
    for (const user of localUsers) {
      const result = await userService.createUser(user.id, user);
      if (result.success) {
        console.log(`✅ Migrated user: ${user.email}`);
      } else {
        console.log(`❌ Failed to migrate user: ${user.email} - ${result.error}`);
      }
    }

    // 2. Migrate orders
    console.log('📦 Migrating orders...');
    const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    for (const order of localOrders) {
      const result = await orderService.createOrder(order);
      if (result.success) {
        console.log(`✅ Migrated order: ${order.id}`);
      } else {
        console.log(`❌ Failed to migrate order: ${order.id} - ${result.error}`);
      }
    }

    // 3. Migrate reviews
    console.log('⭐ Migrating reviews...');
    const localReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    for (const review of localReviews) {
      const result = await reviewService.createReview(review);
      if (result.success) {
        console.log(`✅ Migrated review: ${review.id}`);
      } else {
        console.log(`❌ Failed to migrate review: ${review.id} - ${result.error}`);
      }
    }

    // 4. Migrate product data
    console.log('🛍️ Migrating product data...');
    const localProduct = JSON.parse(localStorage.getItem('productData') || '{}');
    if (Object.keys(localProduct).length > 0) {
      const result = await productService.updateProduct(localProduct);
      if (result.success) {
        console.log('✅ Migrated product data');
      } else {
        console.log(`❌ Failed to migrate product data: ${result.error}`);
      }
    }

    console.log('🎉 Migration completed!');
    console.log('📊 Migration Summary:');
    console.log(`   Users: ${localUsers.length}`);
    console.log(`   Orders: ${localOrders.length}`);
    console.log(`   Reviews: ${localReviews.length}`);
    console.log(`   Product data: ${Object.keys(localProduct).length > 0 ? 1 : 0}`);

  } catch (error) {
    console.error('💥 Migration failed:', error);
    throw error;
  }
};

// Also create synchronous versions for console use
window.migrateDataToFirebaseSync = function() {
  window.migrateDataToFirebase().catch(console.error);
};

window.checkMigrationStatusSync = function() {
  window.checkMigrationStatus().catch(console.error);
};

// Global status check function
window.checkMigrationStatus = async function() {
  console.log('🔍 Checking migration status...');

  try {
    const { userService, orderService, reviewService, productService } = await import('../services/firestore.js');

    const results = {
      users: 0,
      orders: 0,
      reviews: 0,
      product: false
    };

    // Check Firebase data counts
    const usersResult = await userService.getAllUsers();
    if (usersResult.success) results.users = usersResult.data.length;

    const ordersResult = await orderService.getAllOrders();
    if (ordersResult.success) results.orders = ordersResult.data.length;

    const reviewsResult = await reviewService.getAllReviews();
    if (reviewsResult.success) results.reviews = reviewsResult.data.length;

    const productResult = await productService.getProduct();
    if (productResult.success && productResult.data.name) results.product = true;

    // Check localStorage counts
    const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const localReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const localProduct = JSON.parse(localStorage.getItem('productData') || '{}');

    console.log('📊 Migration Status:');
    console.log('Firebase Data:');
    console.log(`   Users: ${results.users}`);
    console.log(`   Orders: ${results.orders}`);
    console.log(`   Reviews: ${results.reviews}`);
    console.log(`   Product: ${results.product ? 'Yes' : 'No'}`);

    console.log('localStorage Data:');
    console.log(`   Users: ${localUsers.length}`);
    console.log(`   Orders: ${localOrders.length}`);
    console.log(`   Reviews: ${localReviews.length}`);
    console.log(`   Product: ${Object.keys(localProduct).length > 0 ? 'Yes' : 'No'}`);

    return {
      firebase: results,
      localStorage: {
        users: localUsers.length,
        orders: localOrders.length,
        reviews: localReviews.length,
        product: Object.keys(localProduct).length > 0
      }
    };
  } catch (error) {
    console.error('❌ Status check failed:', error);
  }
};

// Auto-initialize functions when script loads
setTimeout(() => {
  console.log('🔧 Migration functions loaded! Available commands:');
  console.log('  await migrateDataToFirebase() - Migrate all data');
  console.log('  await checkMigrationStatus() - Check migration status');
  console.log('  migrateDataToFirebaseSync() - Migrate all data (synchronous)');
  console.log('  checkMigrationStatusSync() - Check migration status (synchronous)');
}, 2000);

// Export for module use (when not in console)
export const migrateDataToFirebase = window.migrateDataToFirebase;
export const checkMigrationStatus = window.checkMigrationStatus;