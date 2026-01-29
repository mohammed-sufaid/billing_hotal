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
  Chip,
  Avatar,
  alpha,
  InputAdornment,
  Card,
  CardContent,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";

// Professional color theme
const themeColors = {
  primary: "#1976d2", // Blue
  secondary: "#2E7D32", // Green
  background: "#f8fafc",
  surface: "#ffffff",
  textPrimary: "#1a237e",
  textSecondary: "#5a5a5a",
  success: "#4caf50",
  error: "#d32f2f",
  warning: "#ff9800",
};

const ParcelDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [parcels, setParcels] = useState([
    { id: 1, billNo: "P-1001", amount: 354, status: "Delivered", date: "2024-01-15" },
    { id: 2, billNo: "P-1002", amount: 885, status: "In Transit", date: "2024-01-16" },
    { id: 3, billNo: "P-1003", amount: 118, status: "Pending", date: "2024-01-14" },
    { id: 4, billNo: "P-1004", amount: 1250, status: "Delivered", date: "2024-01-13" },
    { id: 5, billNo: "P-1005", amount: 560, status: "In Transit", date: "2024-01-17" },
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return themeColors.success;
      case "In Transit": return themeColors.primary;
      case "Pending": return themeColors.warning;
      default: return themeColors.textSecondary;
    }
  };

  // Calculate totals
  const totalParcels = parcels.length;
  const totalAmount = parcels.reduce((sum, parcel) => sum + parcel.amount, 0);
  const deliveredCount = parcels.filter(p => p.status === "Delivered").length;

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: themeColors.background,
        minHeight: "100vh",
      }}
    >
      {/* HEADER SECTION */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: themeColors.textPrimary,
            mb: 1,
          }}
        >
          Parcel Management
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: themeColors.textSecondary }}
        >
          Manage and track all parcel shipments in one place
        </Typography>
      </Box>

      {/* SUMMARY CARDS */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 3,
          mb: 4,
        }}
      >
        <Card
          sx={{
            backgroundColor: themeColors.surface,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Avatar
                sx={{
                  backgroundColor: alpha(themeColors.primary, 0.1),
                  color: themeColors.primary,
                  mr: 2,
                }}
              >
                <ReceiptIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {totalParcels}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: themeColors.textSecondary }}>
              Total Parcels
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            backgroundColor: themeColors.surface,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Avatar
                sx={{
                  backgroundColor: alpha(themeColors.secondary, 0.1),
                  color: themeColors.secondary,
                  mr: 2,
                }}
              >
                <AttachMoneyIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                ₹{totalAmount.toLocaleString()}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: themeColors.textSecondary }}>
              Total Amount
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            backgroundColor: themeColors.surface,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Avatar
                sx={{
                  backgroundColor: alpha(themeColors.success, 0.1),
                  color: themeColors.success,
                  mr: 2,
                }}
              >
                <ReceiptIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {deliveredCount}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: themeColors.textSecondary }}>
              Delivered
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* TOOLBAR */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          backgroundColor: themeColors.surface,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
            <TextField
              placeholder="Search by bill number..."
              variant="outlined"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: themeColors.textSecondary }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 1,
                  backgroundColor: alpha(themeColors.background, 0.8),
                }
              }}
            />
            <Button
              startIcon={<FilterListIcon />}
              variant="outlined"
              sx={{
                borderColor: alpha(themeColors.primary, 0.3),
                color: themeColors.primary,
                whiteSpace: 'nowrap',
                minWidth: 'auto',
              }}
            >
              Filter
            </Button>
            <Button
              startIcon={<DownloadIcon />}
              variant="outlined"
              sx={{
                borderColor: alpha(themeColors.primary, 0.3),
                color: themeColors.primary,
                whiteSpace: 'nowrap',
                minWidth: 'auto',
              }}
            >
              Export
            </Button>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/parcel/create")}
            sx={{
              backgroundColor: themeColors.primary,
              "&:hover": {
                backgroundColor: alpha(themeColors.primary, 0.9),
              },
              px: 3,
              py: 1,
              borderRadius: 1,
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            Create Parcel
          </Button>
        </Box>
      </Paper>

      {/* TABLE SECTION */}
      <Paper
        sx={{
          backgroundColor: themeColors.surface,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 3,
            borderBottom: `1px solid ${alpha(themeColors.primary, 0.1)}`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: themeColors.textPrimary,
            }}
          >
            Parcel List
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: alpha(themeColors.primary, 0.04),
                }}
              >
                <TableCell sx={{ fontWeight: 600, color: themeColors.textPrimary }}>
                  Bill No
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: themeColors.textPrimary }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: themeColors.textPrimary }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: themeColors.textPrimary }}>
                  Total Amount
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: themeColors.textPrimary }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredParcels.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: alpha(themeColors.primary, 0.02),
                    },
                    transition: "background-color 0.2s",
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <ReceiptIcon sx={{ color: themeColors.primary, fontSize: 20 }} />
                      <Typography sx={{ fontWeight: 500, color: themeColors.textPrimary }}>
                        {row.billNo}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getStatusColor(row.status), 0.1),
                        color: getStatusColor(row.status),
                        fontWeight: 500,
                        border: `1px solid ${alpha(getStatusColor(row.status), 0.2)}`,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: themeColors.textSecondary }}>
                      {row.date}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: themeColors.textPrimary,
                      }}
                    >
                      ₹{row.amount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: alpha(themeColors.primary, 0.1),
                          color: themeColors.primary,
                          "&:hover": {
                            backgroundColor: alpha(themeColors.primary, 0.2),
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: alpha(themeColors.error, 0.1),
                          color: themeColors.error,
                          "&:hover": {
                            backgroundColor: alpha(themeColors.error, 0.2),
                          },
                        }}
                        onClick={() => handleCancel(row.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}

              {filteredParcels.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 6 }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <SearchIcon
                        sx={{
                          fontSize: 60,
                          color: alpha(themeColors.textSecondary, 0.3),
                          mb: 2,
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{ color: themeColors.textSecondary, mb: 1 }}
                      >
                        No parcels found
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: alpha(themeColors.textSecondary, 0.7) }}
                      >
                        Try adjusting your search or create a new parcel
                      </Typography>
                    </Box>
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