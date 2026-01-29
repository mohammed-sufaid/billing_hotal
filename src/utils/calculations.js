export const calculateSubtotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.qty, 0);

export const GST_RATE = 0.05;
export const SERVICE_RATE = 0.1;
