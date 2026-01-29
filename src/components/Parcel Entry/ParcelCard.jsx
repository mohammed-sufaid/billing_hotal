import { Box, Typography, Button } from "@mui/material";

const ParcelCard = ({ billNo, amount }) => {
  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* TOP */}
      <Box>
        <Typography
          sx={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
          }}
        >
          Bill No: {billNo}
        </Typography>

        <Typography mt={1} fontWeight={600}>
          ₹{amount}
        </Typography>
      </Box>

      {/* ACTIONS */}
      <Box mt={2} display="flex" gap={1}>
        <Button size="small" variant="outlined" fullWidth>
          View
        </Button>
        <Button size="small" variant="contained" fullWidth>
          Collect
        </Button>
      </Box>
    </Box>
  );
};

export default ParcelCard;
