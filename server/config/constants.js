module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRE: '30d',
    ORDER_STATUS: {
      PENDING: 'pending',
      CONFIRMED: 'confirmed',
      READY: 'ready',
      CANCELLED: 'cancelled'
    },
    USER_ROLES: {
      CUSTOMER: 'customer',
      SHOP_OWNER: 'shop_owner'
    }
  };