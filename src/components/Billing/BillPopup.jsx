import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Typography,
  Divider
} from "@mui/material";

import BillItemRow from "./BillItemRow";
import {
  calculateSubtotal,
  GST_RATE,
  SERVICE_RATE
} from "../utils/calculations";
import { useState } from "react";
import PaymentPopup from "./PaymentPopup";

const BillPopup = ({ open, onClose, onPaymentComplete }) => {


  const items = [
    { name: "Veg Burger", qty: 2, price: 120 },
    { name: "Cold Coffee", qty: 1, price: 80 },
  ];

  const [openPayment, setOpenPayment] = useState(false);

  const subtotal = calculateSubtotal(items);
  const gst = subtotal * GST_RATE;
  const service = subtotal * SERVICE_RATE;
  const total = subtotal + gst + service;

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Bill #102 | Table 5</DialogTitle>

        <DialogContent>
          {items.map((item, index) => (
            <BillItemRow key={index} {...item} />
          ))}

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between">
            <Typography>Subtotal</Typography>
            <Typography>₹{subtotal}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography>GST (5%)</Typography>
            <Typography>₹{gst.toFixed(2)}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography>Service Charge (10%)</Typography>
            <Typography>₹{service.toFixed(2)}</Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box display="flex" justifyContent="space-between" fontWeight="bold">
            <Typography>Total</Typography>
            <Typography>₹{total.toFixed(2)}</Typography>
          </Box>

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={onClose}>
              Close
            </Button>

            <Button
              variant="contained"
              onClick={() => setOpenPayment(true)}
            >
              Collect Payment
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* SCREEN 4 */}
      <PaymentPopup
  open={openPayment}
  totalAmount={total}
  onClose={() => setOpenPayment(false)}
  onPaymentSuccess={() => {
    onPaymentComplete?.();
    onClose();
  }}
/>


      
    </>
  );
};

export default BillPopup;
