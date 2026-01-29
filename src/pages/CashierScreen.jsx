import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
} from "@mui/material";

import { useState, useRef, useEffect } from "react";

import {
  calculateSubtotal,
  GST_RATE,
  SERVICE_RATE,
} from "../utils/calculations";

const CashierScreen = () => {

  const billInputRef = useRef(null);

  const [billNo, setBillNo] = useState("");
  const [billData, setBillData] = useState(null);

  const [paidAmount, setPaidAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  /* ================= AUTO FOCUS ================= */
  useEffect(() => {
    billInputRef.current?.focus();
  }, []);

  /* ================= FETCH BILL ================= */
  const fetchBill = () => {
    if (!billNo) return;

    const mock = {
      billNo,
      tableNo: 5,
      items: [
        { name: "Burger", qty: 2, price: 200 },
        { name: "Coffee", qty: 1, price: 98 },
      ],
    };

    setBillData(mock);
    setPaidAmount("");
    setPaymentMethod("");
  };

  /* ================= CALCULATIONS ================= */
  const subtotal = billData ? calculateSubtotal(billData.items) : 0;
  const gst = subtotal * GST_RATE;
  const service = subtotal * SERVICE_RATE;
  const total = subtotal + gst + service;

  const change =
    paidAmount && Number(paidAmount) > total
      ? Number(paidAmount) - total
      : 0;

  const enableActions =
    billData &&
    paidAmount &&
    Number(paidAmount) > 0 &&
    paymentMethod;

  /* ================= PAY ================= */
  const handleCharge = () => {
    alert(`Payment Successful via ${paymentMethod}`);

    setBillData(null);
    setBillNo("");
    setPaidAmount("");
    setPaymentMethod("");

    billInputRef.current?.focus();
  };

  return (
    <Box p={3}>

      <Typography variant="h5" mb={2}>
        Cashier Screen
      </Typography>

      {/* ================= SEARCH ================= */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          inputRef={billInputRef}
          label="Bill Number"
          value={billNo}
          onChange={(e) => setBillNo(e.target.value)}
        />

        <Button variant="contained" onClick={fetchBill}>
          Confirm
        </Button>
      </Box>

      {/* ================= MAIN ================= */}
      <Box display="grid" gridTemplateColumns="2fr 1fr" gap={3}>

        {/* ================= BILL ================= */}
        <Paper sx={{ p: 3 }}>

          <Typography fontWeight="bold" mb={2}>
            {billData
              ? `Bill #${billData.billNo} — Table ${billData.tableNo}`
              : "Enter Bill Number"}
          </Typography>

          {/* HEADER */}
          <Box
            display="grid"
            gridTemplateColumns="3fr 1fr 1fr 1.2fr"
            fontWeight="bold"
          >
            <Typography>Item</Typography>
            <Typography align="center">Qty</Typography>
            <Typography align="right">Price</Typography>
            <Typography align="right">Total</Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* ROWS */}
          {(billData?.items || []).map((item, idx) => (
            <Box
              key={idx}
              display="grid"
              gridTemplateColumns="3fr 1fr 1fr 1.2fr"
              py={0.8}
            >
              <Typography>{item.name}</Typography>
              <Typography align="center">{item.qty}</Typography>
              <Typography align="right">₹{item.price}</Typography>
              <Typography align="right">
                ₹{item.qty * item.price}
              </Typography>
            </Box>
          ))}

          {!billData && (
            <Typography mt={2} color="text.secondary">
              No items loaded
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          {/* TOTALS */}
          {[
            ["Subtotal", subtotal],
            ["GST", gst],
            ["Service", service],
            ["Total", total],
          ].map(([label, val]) => (
            <Box key={label} display="flex" justifyContent="space-between">
              <Typography>{label}</Typography>
              <Typography>₹{val.toFixed(2)}</Typography>
            </Box>
          ))}
        </Paper>

        {/* ================= PAYMENT PANEL ================= */}
        <Paper sx={{ p: 3 }}>

          <Typography fontWeight="bold">
            Payment Panel {paymentMethod && `(${paymentMethod})`}
          </Typography>

          <Divider sx={{ my: 1 }} />

          <Box display="flex" justifyContent="space-between">
            <Typography>Payment Due</Typography>
            <Typography>₹{total.toFixed(2)}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography>Received</Typography>
            <Typography>₹{paidAmount || 0}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" fontWeight="bold">
            <Typography>Change</Typography>
            <Typography>₹{change.toFixed(2)}</Typography>
          </Box>

          {/* INPUT */}
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            label="Enter Amount"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            disabled={!billData}
          />

          {/* PAYMENT TYPES */}
          <Box mt={3} display="grid" gridTemplateColumns="repeat(3,1fr)" gap={1}>
            {["card", "Cash", "UPI"].map((m) => (
              <Button
                key={m}
                variant={paymentMethod === m ? "contained" : "outlined"}
                onClick={() => setPaymentMethod(m)}
                disabled={!billData}
              >
                {m}
              </Button>
            ))}
          </Box>

          {/* ACTIONS */}
          <Box mt={3} display="grid" gridTemplateColumns="repeat(2,1fr)" gap={2}>
            <Button
              color="error"
              disabled={!enableActions}
              onClick={() => {
                setPaidAmount("");
                setPaymentMethod("");
              }}
            >
              Clear
            </Button>

            <Button
              variant="contained"
              disabled={!enableActions}
              onClick={handleCharge}
            >
              Submit
            </Button>
          </Box>

        </Paper>

      </Box>

    </Box>
  );
};

export default CashierScreen;
