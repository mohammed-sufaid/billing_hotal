// src/components/Layout.js
import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  IconButton,
  useMediaQuery,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptIcon from "@mui/icons-material/Receipt";

import { Link, Outlet, useLocation } from "react-router-dom";

const drawerWidth = 240;

export default function Layout() {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [open, setOpen] = useState(false);

  const sidebarItems = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { label: "Parcel Entry", icon: <LocalShippingIcon />, path: "/parcel" },
    { label: "Billing", icon: <ReceiptIcon />, path: "/billing" },
  ];

  const SidebarContent = (
    <Box sx={{ width: drawerWidth }}>
      <Box sx={{ textAlign: "center", mb: 2, pt: 2 }}>
        <Avatar
          src="/profile.png"
          sx={{
            width: 70,
            height: 70,
            margin: "0 auto",
            border: "2px solid #eee",
          }}
        />
        <Typography
          sx={{ mt: 1, fontWeight: 700, fontSize: "17px", color: "#333" }}
        >
          Hotel Management
        </Typography>
      </Box>

      {/* MENU */}
      <List>
        {sidebarItems.map((item) => {
          const selected = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.label}
              component={Link}
              to={item.path}
              onClick={() => isMobile && setOpen(false)}
              sx={{
                mx: 1,
                borderRadius: "8px",
                mb: 0.5,
                background: selected ? "#e7f1ff" : "transparent",
                color: selected ? "#0052cc" : "#555",
                "&:hover": {
                  background: "#eef4ff",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: selected ? "#0052cc" : "#777",
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: selected ? 600 : 500,
                  fontSize: "15px",
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", background: "#f5f6fa", minHeight: "100vh" }}>
      {/* ⬅️ SIDEBAR HANDLING */}

      {/* Mobile: Temporary Drawer */}
      {isMobile ? (
        <Drawer
          anchor="left"
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
        >
          {SidebarContent}
        </Drawer>
      ) : (
        /* Desktop: Permanent Drawer */
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              background: "#fff",
              borderRight: "1px solid #e5e5e5",
            },
          }}
        >
          {SidebarContent}
        </Drawer>
      )}

      {/* MAIN CONTENT */}
      <Box sx={{ flexGrow: 1 }}>
        {/* TOP NAVBAR */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            background: "#ffffff",
            color: "#333",
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* Hamburger for mobile */}
            {isMobile && (
              <IconButton color="inherit" onClick={() => setOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant="h6"
              sx={{ fontWeight: 600, fontSize: "20px" }}
            >
              Hotel Management System
            </Typography>

            <Button
              variant="outlined"
              sx={{
                borderColor: "#d9534f",
                color: "#d9534f",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "8px",
                px: 3,
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        {/* PAGE CONTENT */}
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
