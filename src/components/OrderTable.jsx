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
  IconButton
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

export default function OrderTable({ title, data, allowEdit }) {
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={700} mb={2}>
        {title}
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#fafafa" }}>
            <TableRow>
              <TableCell fontWeight={700}>BILL NO</TableCell>
              <TableCell fontWeight={700}>TABLE NO</TableCell>
              <TableCell fontWeight={700}>STATUS</TableCell>
              <TableCell fontWeight={700}>AMOUNT</TableCell>
              <TableCell align="right" fontWeight={700}>
                ACTIONS
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map(row => (
              <TableRow key={row.billNo} hover>
                <TableCell>{row.billNo}</TableCell>
                <TableCell>{row.tableNo}</TableCell>

                <TableCell>
                  <Typography
                    fontWeight={700}
                    color={
                      row.status === "PENDING"
                        ? "warning.main"
                        : "success.main"
                    }
                  >
                    {row.status}
                  </Typography>
                </TableCell>

                <TableCell fontWeight={700}>₹{row.amount}</TableCell>

                <TableCell align="right">
                  {allowEdit && (
                    <IconButton size="small" color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}

                  {row.status === "PENDING" && (
                    <IconButton size="small" color="error">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  No pending orders
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]}
        />
      </TableContainer>
    </Box>
  );
}