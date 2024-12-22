export const getExpiryStatus = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) {
    return { status: 'expired', color: '#FF3B30' };
  } else if (daysUntilExpiry <= 3) {
    return { status: 'warning', color: '#FF9500' };
  } else {
    return { status: 'fresh', color: '#34C759' };
  }
};

export const formatExpiryDate = (date) => {
  const today = new Date();
  const expiry = new Date(date);
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) {
    return 'Expired';
  } else if (daysUntilExpiry === 0) {
    return 'Expires today';
  } else if (daysUntilExpiry === 1) {
    return 'Expires tomorrow';
  } else {
    return `Expires in ${daysUntilExpiry} days`;
  }
};
