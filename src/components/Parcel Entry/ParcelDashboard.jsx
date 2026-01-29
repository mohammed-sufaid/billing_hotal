import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ParcelDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");

  const [parcels, setParcels] = useState([
    { id: 1, billNo: "P-1001", amount: 354 },
    { id: 2, billNo: "P-1002", amount: 885 },
    { id: 3, billNo: "P-1003", amount: 118 },
  ]);

  // ✅ Add newly created parcel
  useEffect(() => {
    if (location.state?.newParcel) {
      setParcels((prev) => [
        location.state.newParcel,
        ...prev,
      ]);
    }
  }, [location.state]);

  const handleCancel = (id) => {
    setParcels((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredParcels = parcels.filter((p) =>
    p.billNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box p={3}>
      {/* SEARCH + CREATE */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display="flex" alignItems="center" gap={2} width="60%">
          <SearchIcon color="action" />
          <TextField
            placeholder="Search by bill number..."
            variant="standard"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ disableUnderline: true }}
          />
        </Box>

        <Button
          variant="contained"
          onClick={() => navigate("/parcel/create")}
        >
          Create Parcel
        </Button>
      </Paper>

      {/* TABLE */}
      <Paper sx={{ p: 2 }}>
        <Typography
          variant="h6"
          mb={2}
          sx={{ fontWeight: 600 }}
        >
          Parcel List
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Bill No</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredParcels.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.billNo}</TableCell>
                  <TableCell>₹{row.amount}</TableCell>

                  <TableCell align="center">
                    <IconButton color="primary">
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleCancel(row.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {filteredParcels.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                  >
                    No parcel records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ParcelDashboard;
