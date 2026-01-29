// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Login from "./components/Login";


// Billing & Cashier
import BillingDashboard from "./components/Dashboard/BillingDashboard";
import CashierScreen from "./pages/CashierScreen";

// Parcel Pages
import ParcelDashboard from "./components/Parcel Entry/ParcelDashboard";    // ✔ parcel list page
import CreateParcel from "./components/Parcel Entry/CreateParcel";          // ✔ parcel entry page

// Temporary Dashboard
function Dashboard() {
  return <h2 style={{ padding: "20px" }}>Dashboard Component Loaded</h2>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* MAIN APP */}
        <Route element={<Layout />}>

          {/* Dashboard */}
          <Route path="/dashboard" element={<BillingDashboard />} />

          {/* PARCEL ROUTES */}
          <Route path="/parcel" element={<ParcelDashboard />} />          {/* list */}
          <Route path="/parcel/create" element={<CreateParcel />} />      {/* entry */}

          {/* BILLING ROUTES */}     
       <Route path="/billing" element={<CashierScreen />} />          {/* cashier page */}

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
