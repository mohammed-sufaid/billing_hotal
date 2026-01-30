import {
  Box,
  Typography,
  Grid,
  Stack,
  Chip,
  IconButton,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Badge
} from "@mui/material";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentsIcon from "@mui/icons-material/Payments";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { useState } from "react";
import SummaryCard from "../SummaryCard";
import OrderTable from "../OrderTable";

/* ---------------- DATA ---------------- */
const billsData = [
  { billNo: "B001", type: "TABLE", tableNo: 5, amount: 450, status: "PAID" },
  { billNo: "B006", type: "TABLE", tableNo: 3, amount: 520, status: "PAID" },
  { billNo: "B007", type: "TABLE", tableNo: 6, amount: 610, status: "PAID" },

  { billNo: "B002", type: "TABLE", tableNo: 2, amount: 300, status: "PENDING" },
  { billNo: "B004", type: "TABLE", tableNo: 1, amount: 200, status: "PENDING" },
  { billNo: "B008", type: "TABLE", tableNo: 4, amount: 350, status: "PENDING" },
  { billNo: "B009", type: "TABLE", tableNo: 7, amount: 480, status: "PENDING" },
  { billNo: "B010", type: "TABLE", tableNo: 8, amount: 560, status: "PENDING" },
  { billNo: "B011", type: "TABLE", tableNo: 9, amount: 420, status: "PENDING" },

  { billNo: "B003", type: "PARCEL", tableNo: "-", amount: 620, status: "PAID" },
  { billNo: "B012", type: "PARCEL", tableNo: "-", amount: 280, status: "PAID" },
  { billNo: "B013", type: "PARCEL", tableNo: "-", amount: 390, status: "PAID" },

  { billNo: "B005", type: "PARCEL", tableNo: "-", amount: 150, status: "PENDING" },
  { billNo: "B014", type: "PARCEL", tableNo: "-", amount: 220, status: "PENDING" },
  { billNo: "B015", type: "PARCEL", tableNo: "-", amount: 310, status: "PENDING" },
  { billNo: "B016", type: "PARCEL", tableNo: "-", amount: 180, status: "PENDING" }
];

export default function BillingDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  /* ---------------- CALCULATIONS (UNCHANGED) ---------------- */
  const totalBillCount = billsData.length;
  const pendingBillCount = billsData.filter(b => b.status === "PENDING").length;
  const paidBillCount = billsData.filter(b => b.status === "PAID").length;

  const pendingTableCount = billsData.filter(
    b => b.type === "TABLE" && b.status === "PENDING"
  ).length;

  const pendingParcelCount = billsData.filter(
    b => b.type === "PARCEL" && b.status === "PENDING"
  ).length;

  const totalPaidAmount = billsData
    .filter(b => b.status === "PAID")
    .reduce((s, b) => s + b.amount, 0);

  const totalPendingAmount = billsData
    .filter(b => b.status === "PENDING")
    .reduce((s, b) => s + b.amount, 0);

  /* ---------------- TAB DATA (ONLY PENDING) ---------------- */
  const parcelOrders = billsData.filter(
    b => b.type === "PARCEL" && b.status === "PENDING"
  );

  const tableOrders = billsData.filter(
    b => b.type === "TABLE" && b.status === "PENDING"
  );

  const getOrdersByTab = () => {
    return activeTab === 0 ? parcelOrders : tableOrders;
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: "#ffffff", minHeight: "100vh" }}>

      {/* HEADER */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Billing Dashboard
            </Typography>
          </Box>
{/* 
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<FilterListIcon />}>
              Filter
            </Button>
            <Button variant="outlined" startIcon={<DownloadIcon />}>
              Export
            </Button>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MoreVertIcon />
            </IconButton>
          </Stack> */}
        </Stack>

        {/* QUICK STATS */}
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            Tables: <strong>{pendingTableCount}</strong>
          </Grid>
          <Grid item xs={6} sm={3}>
            Parcels: <strong>{pendingParcelCount}</strong>
          </Grid>
          <Grid item xs={6} sm={3}>
            Pending: <strong>₹{totalPendingAmount}</strong>
          </Grid>
          <Grid item xs={6} sm={3}>
            Collection:{" "}
            <strong>{Math.round((paidBillCount / totalBillCount) * 100)}%</strong>
          </Grid>
        </Grid>
      </Box>

      {/* SUMMARY CARDS */}
      <Grid container spacing={2} mb={4} >
        <Grid item xs={12} sm={6} lg={3} width={"23.6%"}>
          <SummaryCard
            label="Total Bills"
            value={totalBillCount}
            icon={<ReceiptLongIcon />}
            variant="modern"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} width={"23.6%"}>
          <SummaryCard
            label="Pending Bills"
            value={pendingBillCount}
            icon={<AccountBalanceIcon />}
            color="warning"
            variant="modern"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}width={"23.6%"}>
          <SummaryCard
            label="Paid Bills"
            value={paidBillCount}
            icon={<PaymentsIcon />}
            color="success"
            variant="modern"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}width={"23.6%"}>
          <SummaryCard
            label="Total Collected"
            value={totalPaidAmount}
            icon={<TrendingUpIcon />}
            color="success"
            prefix="₹"
            variant="modern"
          />
        </Grid>
      </Grid>

      {/* ONLY TWO TABS */}
      <Tabs
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab
          label={
            <Badge badgeContent={parcelOrders.length} color="error">
              Parcel Orders
            </Badge>
          }
        />
        <Tab
          label={
            <Badge badgeContent={tableOrders.length} color="error">
              Table Orders
            </Badge>
          }
        />
      </Tabs>

      {/* TABLE */}
<OrderTable
  title={activeTab === 0 ? "Parcel Orders" : "Table Orders"}
  data={getOrdersByTab()}
  orderType={activeTab === 0 ? "PARCEL" : "TABLE"}
  allowEdit={true}
/>


      {/* MENU */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem>View Analytics</MenuItem>
        <MenuItem>Print Report</MenuItem>
        <MenuItem>Settings</MenuItem>
      </Menu>
    </Box>
  );
}
