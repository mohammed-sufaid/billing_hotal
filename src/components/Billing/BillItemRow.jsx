import { Box, Typography } from "@mui/material";

const BillItemRow = ({ name, qty, price }) => {
  return (
    <Box display="flex" justifyContent="space-between" py={1}>
      <Typography>{name} x {qty}</Typography>
      <Typography>₹{price * qty}</Typography>
    </Box>
  );
};

export default BillItemRow;
