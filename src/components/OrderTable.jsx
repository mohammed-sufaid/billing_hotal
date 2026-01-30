import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Stack
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

export default function OrderTable({ title, data, allowEdit, orderType }) {
  const [page, setPage] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);

  const rowsPerPage = 10;
  const GST_RATE = 0.05;

  /* ✅ LOCAL STATE FOR ORDER STATUS */
  const [rows, setRows] = useState(
    data.map((row) => ({
      ...row,
      orderStatus: row.orderStatus || "PENDING"
    }))
  );

  const paginatedData = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleMenuOpen = (e, billNo) => {
    setAnchorEl(e.currentTarget);
    setSelectedBill(billNo);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBill(null);
  };

  /* ✅ UPDATE ORDER STATUS */
  const updateOrderStatus = (status) => {
    setRows((prev) =>
      prev.map((row) =>
        row.billNo === selectedBill
          ? { ...row, orderStatus: status }
          : row
      )
    );
    handleMenuClose();
  };

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={700} mb={2}>
        {title}
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#fafafa" }}>
            <TableRow>
              <TableCell align="center"><b>BILL NO</b></TableCell>
              <TableCell align="center"><b>STATUS</b></TableCell>

              {orderType === "PARCEL" && (
                <TableCell align="center"><b>ORDER STATUS</b></TableCell>
              )}

              <TableCell align="center"><b>AMOUNT</b></TableCell>

              {orderType === "PARCEL" ? (
                <TableCell align="center"><b>PARCEL COST</b></TableCell>
              ) : (
                <TableCell align="center"><b>SERVICE COST</b></TableCell>
              )}

              <TableCell align="center"><b>GST</b></TableCell>
              <TableCell align="center"><b>TOTAL AMOUNT</b></TableCell>

              {orderType === "PARCEL" && (
                <TableCell align="center"><b>ACTIONS</b></TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((row) => {
              const extraCost = orderType === "PARCEL" ? 40 : 60;
              const gst = Math.round((row.amount + extraCost) * GST_RATE);
              const total = row.amount + extraCost + gst;

              return (
                <TableRow key={row.billNo} hover>
                  <TableCell align="center">{row.billNo}</TableCell>

                  <TableCell align="center">
                    <Chip
                      label={row.status}
                      size="small"
                      color={row.status === "PENDING" ? "warning" : "success"}
                    />
                  </TableCell>

                  {/* ✅ ORDER STATUS COLUMN */}
                  {orderType === "PARCEL" && (
                    <TableCell align="center">
                      <Chip
                        label={row.orderStatus}
                        size="small"
                        color={
                          row.orderStatus === "DELIVERED"
                            ? "success"
                            : "warning"
                        }
                      />
                    </TableCell>
                  )}

                  <TableCell align="center">₹{row.amount}</TableCell>
                  <TableCell align="center">₹{extraCost}</TableCell>
                  <TableCell align="center">₹{gst}</TableCell>
                  <TableCell align="center" fontWeight={700}>₹{total}</TableCell>

                  {/* ✅ ACTIONS */}
                  {orderType === "PARCEL" && (
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: "#e8f5e9",
                            color: "#2e7d32",
                            "&:hover": { bgcolor: "#c8e6c9" }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: "#fdecea",
                            color: "#d32f2f",
                            "&:hover": { bgcolor: "#f9d6d3" }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, row.billNo)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}

            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={orderType === "PARCEL" ? 8 : 6}
                  align="center"
                  sx={{ py: 4 }}
                >
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]}
        />
      </TableContainer>

      {/* ✅ DROPDOWN WITH ORDER STATUS OPTIONS */}
<Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleMenuClose}
  anchorOrigin={{
    vertical: "bottom",
    horizontal: "right",
  }}
  transformOrigin={{
    vertical: "top",
    horizontal: "right",
  }}
  PaperProps={{
    sx: {
      maxHeight: 200,
    },
  }}
>
  <MenuItem onClick={() => updateOrderStatus("DELIVERED")}>
    Delivered
  </MenuItem>
  <MenuItem onClick={() => updateOrderStatus("PENDING")}>
    Pending
  </MenuItem>
</Menu>

    </Box>
  );
}
