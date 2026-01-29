import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

import { useState, useEffect } from "react";
import { showError } from "../utils/toast";

const PaymentPopup = ({ open, onClose, onSelect }) => {
  const [method, setMethod] = useState("");

  useEffect(() => {
    if (!open) setMethod("");
  }, [open]);

  const handleConfirm = () => {
    if (!method) {
      showError("Select payment method");
      return;
    }

    onSelect(method);   // send to cashier screen
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Payment Method</DialogTitle>

      <DialogContent>

        <RadioGroup
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <FormControlLabel value="Cash" control={<Radio />} label="Cash" />
          <FormControlLabel value="Card" control={<Radio />} label="Card" />
          <FormControlLabel value="UPI" control={<Radio />} label="UPI" />
          <FormControlLabel value="Online" control={<Radio />} label="Online" />
        </RadioGroup>

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button onClick={onClose}>Close</Button>

          <Button variant="contained" onClick={handleConfirm}>
            Continue
          </Button>
        </Box>

      </DialogContent>
    </Dialog>
  );
};

export default PaymentPopup;
