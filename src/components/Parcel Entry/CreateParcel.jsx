import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  IconButton,
  Paper,
  Grid,
  Card,
  CardContent,
  Stack,
  Badge,
  Divider,
  useTheme,
  useMediaQuery,
  Container,
  Avatar,
  InputAdornment,
  alpha,
  Tooltip,
  Fab,
  Drawer,
  InputBase,
  MenuItem,
  Select,
  FormControl,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Restaurant as RestaurantIcon,
  LocalDining as DiningIcon,
  Star as StarIcon,
  ShoppingCart as CartIcon,
  Receipt as ReceiptIcon,
  Timer as TimerIcon,
  FilterList as FilterIcon,
  Keyboard as KeyboardIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
  Tag as TagIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

/* ================= ENHANCED FOOD DATA ================= */
const foodItems = [
  {
    id: 1,
    name: "Choco Truffle Cake",
    price: 529,
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484d5?w=800&auto=format&fit=crop",
    rating: 4.8,
    category: "veg",
    description: "Rich dark chocolate with truffle cream",
    prepTime: "15 min",
    popular: true,
    tags: ["Dessert", "Sweet"],
  },
  {
    id: 2,
    name: "Biscoff Cheesecake Jar",
    price: 249,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&auto=format&fit=crop",
    rating: 4.7,
    category: "veg",
    description: "Creamy cheesecake with Biscoff crumble",
    prepTime: "10 min",
    popular: true,
    tags: ["Dessert", "Jar"],
  },
  {
    id: 3,
    name: "Chicken Biryani",
    price: 380,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop",
    rating: 4.5,
    category: "nonveg",
    description: "Aromatic basmati rice with spicy chicken",
    prepTime: "25 min",
    popular: true,
    tags: ["Main Course", "Spicy"],
  },
  {
    id: 4,
    name: "Opera Pastry",
    price: 329,
    image: "https://images.unsplash.com/photo-1541781286675-4c05fa8d1f4a?w=800&auto=format&fit=crop",
    rating: 4.8,
    category: "veg",
    description: "Layered almond cake with coffee buttercream",
    prepTime: "5 min",
    popular: false,
    tags: ["Pastry", "French"],
  },
  {
    id: 5,
    name: "Blueberry Jar Cake",
    price: 229,
    image: "https://images.unsplash.com/photo-1567016554920-1fa3f9c9f5e0?w=800&auto=format&fit=crop",
    rating: 4.4,
    category: "veg",
    description: "Moist cake with fresh blueberry compote",
    prepTime: "8 min",
    popular: false,
    tags: ["Cake", "Fruit"],
  },
  {
    id: 6,
    name: "Chicken Roll",
    price: 199,
    image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&auto=format&fit=crop",
    rating: 4.1,
    category: "nonveg",
    description: "Crispy wrap with spicy chicken filling",
    prepTime: "12 min",
    popular: true,
    tags: ["Snack", "Spicy"],
  },
  {
    id: 7,
    name: "Paneer Tikka",
    price: 299,
    image: "https://images.unsplash.com/photo-1563379091339-03246963d9d6?w=800&auto=format&fit=crop",
    rating: 4.6,
    category: "veg",
    description: "Grilled cottage cheese with Indian spices",
    prepTime: "20 min",
    popular: true,
    tags: ["Starter", "Grilled"],
  },
  {
    id: 8,
    name: "Fish Fry",
    price: 349,
    image: "https://images.unsplash.com/photo-1559444461-ef0d20c4d8f6?w=800&auto=format&fit=crop",
    rating: 4.3,
    category: "nonveg",
    description: "Crispy fried fish with lemon wedges",
    prepTime: "18 min",
    popular: false,
    tags: ["Seafood", "Crispy"],
  },
];

const CreateParcel = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState({ menu: 0, cart: -1 });
  const [keyboardMode, setKeyboardMode] = useState(true);
  const [showKeyboardGuide, setShowKeyboardGuide] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popular");

  // Store scroll positions
  const menuScrollRef = useRef(null);
  const cartScrollRef = useRef(null);
  const menuScrollPosition = useRef(0);
  const cartScrollPosition = useRef(0);

  /* ========= FILTERED AND SORTED DATA ========= */
  const filteredData = useMemo(() => {
    let filtered = [...foodItems];

    if (category !== "all") {
      filtered = filtered.filter((item) => item.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "popular":
          return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [category, search, sortBy]);

  /* ========= REFS ========= */
  const menuItemsRef = useRef([]);
  const cartItemsRef = useRef([]);
  const generateBillRef = useRef(null);
  const searchRef = useRef(null);

  /* ========= SAVE SCROLL POSITIONS ========= */
  const saveMenuScrollPosition = () => {
    if (menuScrollRef.current) {
      menuScrollPosition.current = menuScrollRef.current.scrollTop;
    }
  };

  const saveCartScrollPosition = () => {
    if (cartScrollRef.current) {
      cartScrollPosition.current = cartScrollRef.current.scrollTop;
    }
  };

  /* ========= RESTORE SCROLL POSITIONS ========= */
  const restoreMenuScrollPosition = () => {
    if (menuScrollRef.current) {
      requestAnimationFrame(() => {
        menuScrollRef.current.scrollTop = menuScrollPosition.current;
      });
    }
  };

  const restoreCartScrollPosition = () => {
    if (cartScrollRef.current) {
      requestAnimationFrame(() => {
        cartScrollRef.current.scrollTop = cartScrollPosition.current;
      });
    }
  };

  /* ========= PREVENT DEFAULT SCROLL BEHAVIOR ========= */
  useEffect(() => {
    const preventScroll = (e) => {
      if (keyboardMode && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", preventScroll);
    return () => window.removeEventListener("keydown", preventScroll);
  }, [keyboardMode]);

  /* ========= UPDATED KEYBOARD NAVIGATION ========= */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }

      switch (e.key) {
        case "c":
        case "C":
          e.preventDefault();
          searchRef.current?.focus();
          break;

        case "+":
          if (focusedIndex.cart >= 0 && selected[focusedIndex.cart]) {
            e.preventDefault();
            saveCartScrollPosition();
            updateSelectedQuantity(selected[focusedIndex.cart].id, 1);
          }
          break;

        case "-":
          if (focusedIndex.cart >= 0 && selected[focusedIndex.cart]) {
            e.preventDefault();
            saveCartScrollPosition();
            updateSelectedQuantity(selected[focusedIndex.cart].id, -1);
          }
          break;

        case " ":
          e.preventDefault();
          handleSpace();
          break;

        case "Enter":
          e.preventDefault();
          handleEnter();
          break;

        case "Escape":
          setShowKeyboardGuide(false);
          if (cartDrawerOpen && isMobile) setCartDrawerOpen(false);
          break;

        case "Tab":
          e.preventDefault();
          setKeyboardMode(!keyboardMode);
          break;

        case "F1":
          e.preventDefault();
          setShowKeyboardGuide(!showKeyboardGuide);
          break;

        case "ArrowUp":
          e.preventDefault();
          handleArrowUp();
          break;

        case "ArrowDown":
          e.preventDefault();
          handleArrowDown();
          break;

        case "ArrowLeft":
          e.preventDefault();
          handleArrowLeft();
          break;

        case "ArrowRight":
          e.preventDefault();
          handleArrowRight();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keyboardMode, focusedIndex, filteredData, selected, cartDrawerOpen]);

  /* ========= UPDATED ARROW NAVIGATION ========= */
  const handleArrowUp = () => {
    if (focusedIndex.cart >= 0) {
      const newIndex = Math.max(0, focusedIndex.cart - 1);
      setFocusedIndex({ menu: -1, cart: newIndex });

      requestAnimationFrame(() => {
        const element = cartItemsRef.current[newIndex];
        if (element) {
          element.focus();
          element.scrollIntoView({ block: "nearest" });
        }
      });
    }
    else if (focusedIndex.menu >= 0) {
      const newIndex = Math.max(0, focusedIndex.menu - 1);
      setFocusedIndex({ menu: newIndex, cart: -1 });

      requestAnimationFrame(() => {
        const element = menuItemsRef.current[newIndex];
        if (element) {
          element.focus();
          element.scrollIntoView({ block: "nearest" });
        }
      });
    }
  };


  const handleArrowDown = () => {
    if (focusedIndex.cart >= 0) {
      const newIndex = Math.min(selected.length - 1, focusedIndex.cart + 1);
      setFocusedIndex({ menu: -1, cart: newIndex });

      requestAnimationFrame(() => {
        const element = cartItemsRef.current[newIndex];
        if (element) {
          element.focus();
          element.scrollIntoView({ block: "nearest" });
        }
      });
    }
    else {
      const newIndex =
        focusedIndex.menu >= 0
          ? Math.min(filteredData.length - 1, focusedIndex.menu + 1)
          : 0;

      setFocusedIndex({ menu: newIndex, cart: -1 });

      requestAnimationFrame(() => {
        const element = menuItemsRef.current[newIndex];
        if (element) {
          element.focus();
          element.scrollIntoView({ block: "nearest" });
        }
      });
    }
  };


  const handleArrowRight = () => {
    if (focusedIndex.menu >= 0 && selected.length > 0) {
      const newIndex = Math.min(focusedIndex.menu, selected.length - 1);
      setFocusedIndex({ menu: -1, cart: newIndex });

      requestAnimationFrame(() => {
        const element = cartItemsRef.current[newIndex];
        if (element) {
          element.focus();
          element.scrollIntoView({ block: "nearest" });
        }
      });
    }
  };


  const handleArrowLeft = () => {
    if (focusedIndex.cart >= 0 && filteredData.length > 0) {
      const newIndex = Math.min(focusedIndex.cart, filteredData.length - 1);
      setFocusedIndex({ menu: newIndex, cart: -1 });

      requestAnimationFrame(() => {
        const element = menuItemsRef.current[newIndex];
        if (element) {
          element.focus();
          element.scrollIntoView({ block: "nearest" });
        }
      });
    }
  };


  const handleEnter = () => {
    if (selected.length > 0) {
      generateBill();
    }
  };

  const handleSpace = () => {
    if (focusedIndex.menu >= 0 && focusedIndex.menu < filteredData.length) {
      // Add item from menu
      saveMenuScrollPosition();
      const item = filteredData[focusedIndex.menu];
      handleAdd(item);
      setTimeout(() => {
        restoreMenuScrollPosition();
      }, 10);
    } else if (focusedIndex.cart >= 0 && focusedIndex.cart < selected.length) {
      // Remove item from cart
      saveCartScrollPosition();
      const item = selected[focusedIndex.cart];
      handleDelete(item.id);
      setTimeout(() => {
        restoreCartScrollPosition();
      }, 10);
    }
  };

  /* ========= ADD ITEM ========= */
  const handleAdd = (item) => {
    const existingIndex = selected.findIndex((sel) => sel.id === item.id);

    if (existingIndex >= 0) {
      const updated = [...selected];
      updated[existingIndex].quantity = (updated[existingIndex].quantity || 1) + 1;
      setSelected(updated);
    } else {
      setSelected([...selected, { ...item, quantity: 1 }]);
    }

    if (isMobile) setCartDrawerOpen(true);
  };

  const updateSelectedQuantity = (id, delta) => {
    saveCartScrollPosition();
    setSelected((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, (item.quantity || 1) + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );

    // Restore scroll position after state update
    setTimeout(() => {
      restoreCartScrollPosition();
      // Keep focus on the same item
      if (focusedIndex.cart >= 0 && cartItemsRef.current[focusedIndex.cart]) {
        cartItemsRef.current[focusedIndex.cart].focus();
      }
    }, 10);
  };

  /* ========= DELETE ITEM ========= */
  const handleDelete = (id) => {
    saveCartScrollPosition();
    const deletedIndex = selected.findIndex(item => item.id === id);
    const newSelected = selected.filter((i) => i.id !== id);
    setSelected(newSelected);

    // Adjust focus after deletion
    if (newSelected.length === 0) {
      setFocusedIndex({ menu: 0, cart: -1 });
      setTimeout(() => {
        menuItemsRef.current[0]?.focus();
        restoreMenuScrollPosition();
      }, 10);
    } else if (focusedIndex.cart === deletedIndex) {
      const newIndex = Math.min(deletedIndex, newSelected.length - 1);
      setFocusedIndex({ menu: -1, cart: newIndex });
      setTimeout(() => {
        cartItemsRef.current[newIndex]?.focus();
        restoreCartScrollPosition();
      }, 10);
    } else {
      setTimeout(() => {
        restoreCartScrollPosition();
      }, 10);
    }
  };

  /* ========= CALCULATE TOTALS ========= */
  const calculateSubtotal = () => {
    return selected.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
  };

  const calculateTotalItems = () => {
    return selected.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  /* ========= GENERATE BILL ========= */
  const generateBill = () => {
    const billNo = "P-" + Date.now().toString().slice(-6);
    navigate("/billing", {
      state: {
        billNo,
        items: selected,
        amount: calculateSubtotal(),
        timestamp: new Date().toISOString(),
      },
    });
  };

  /* ========= CART COMPONENT ========= */
  const CartContent = ({ isDrawer = false }) => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* CART HEADER */}
      <Box
        sx={{
          p: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: "white",
          borderRadius: isDrawer ? 0 : "12px 12px 0 0",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Badge
            badgeContent={calculateTotalItems()}
            color="warning"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "0.7rem",
                height: 20,
                minWidth: 20,
                border: "2px solid white",
              },
            }}
          >
            <CartIcon sx={{ fontSize: 28 }} />
          </Badge>
          <Box flex={1}>
            <Typography variant="h6" fontWeight={700}>
              Order Summary
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {selected.length} item{selected.length !== 1 ? "s" : ""} • ₹{calculateSubtotal()}
            </Typography>
          </Box>
          {isDrawer && (
            <IconButton onClick={() => setCartDrawerOpen(false)} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          )}
        </Stack>
      </Box>

      {/* CART ITEMS */}
      <Box
        ref={cartScrollRef}
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          scrollbarWidth: "none",       // Firefox
          msOverflowStyle: "none",      // IE & Edge
          "&::-webkit-scrollbar": {
            display: "none",            // Chrome, Safari
          },
        }}
      >
        {selected.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              py: 6,
              color: "text.secondary",
            }}
          >
            <DiningIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
            <Typography variant="h6" gutterBottom>
              Cart is empty
            </Typography>
            <Typography variant="body2" align="center">
              Use ← → arrow keys to switch between menu and cart
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {selected.map((item, index) => (
              <Paper
                key={item.id}
                ref={(el) => (cartItemsRef.current[index] = el)}
                tabIndex={0}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: focusedIndex.cart === index
                    ? `2px solid ${theme.palette.success.main}`
                    : "1px solid",
                  borderColor: focusedIndex.cart === index
                    ? theme.palette.success.main
                    : alpha(theme.palette.divider, 0.5),
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.2s",
                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.light, 0.05),
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setFocusedIndex({ menu: -1, cart: index });
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  {/* ITEM IMAGE */}
                  <Avatar
                    src={item.image}
                    variant="rounded"
                    sx={{
                      width: 60,
                      height: 60,
                      border: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                    }}
                  />

                  {/* ITEM DETAILS */}
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ₹{item.price} each
                        </Typography>
                      </Box>
                      <Typography
                        variant="h6"
                        color="primary"
                        fontWeight={700}
                      >
                        ₹{item.price * (item.quantity || 1)}
                      </Typography>
                    </Stack>

                    {/* QUANTITY CONTROLS */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ mt: 1.5 }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateSelectedQuantity(item.id, -1);
                          }}
                          sx={{
                            backgroundColor: alpha(theme.palette.grey[300], 0.5),
                            borderRadius: 1,
                            width: 28,
                            height: 28,
                          }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          sx={{
                            minWidth: 36,
                            textAlign: "center",
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            borderRadius: 1,
                            py: 0.5,
                          }}
                        >
                          {item.quantity || 1}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateSelectedQuantity(item.id, 1);
                          }}
                          sx={{
                            backgroundColor: alpha(theme.palette.grey[300], 0.5),
                            borderRadius: 1,
                            width: 28,
                            height: 28,
                          }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>

                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        sx={{
                          backgroundColor: alpha(theme.palette.error.main, 0.1),
                          "&:hover": {
                            backgroundColor: alpha(theme.palette.error.main, 0.2),
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                </Stack>

                {/* KEYBOARD HINTS FOR CART ITEMS */}
                {focusedIndex.cart === index && (
                  <Box
                    sx={{
                      mt: 1.5,
                      pt: 1,
                      borderTop: `1px dashed ${alpha(theme.palette.divider, 0.5)}`,
                    }}
                  >
                    <Typography variant="caption" color="primary" fontWeight={500}>
                      Space: Remove • +/-: Quantity • ← →: Switch Lists • ↑↓: Navigate
                    </Typography>
                  </Box>
                )}
              </Paper>
            ))}
          </Stack>
        )}
      </Box>

      {/* CART FOOTER */}
      {selected.length > 0 && (
        <Box
          sx={{
            p: 3,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: alpha(theme.palette.primary.light, 0.03),
          }}
        >
          <Stack spacing={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body1" color="text.secondary">
                Subtotal
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                ₹{calculateSubtotal()}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body1" color="text.secondary">
                Items Total
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {calculateTotalItems()} items
              </Typography>
            </Stack>

            <Divider />

            <Button
              ref={generateBillRef}
              variant="contained"
              size="large"
              fullWidth
              startIcon={<ReceiptIcon />}
              onClick={generateBill}
              sx={{
                borderRadius: 2,
                py: 1.5,
                fontWeight: 700,
                fontSize: "1rem",
                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
              }}
            >
              Generate Bill - ₹{calculateSubtotal()}
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );

  return (
    <Container maxWidth="xl" disableGutters sx={{ height: "87vh", overflow: "hidden" }}>
      {/* MAIN LAYOUT */}
      <Box sx={{ display: "flex", height: "100%", overflow: "hidden" }}>
        {/* LEFT PANEL - MENU (72%) */}
        <Box
          sx={{
            width: { xs: "100%", md: "72%" },
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* HEADER */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              borderBottom: `1px solid ${theme.palette.divider}`,
              borderRadius: 0,
              backgroundColor: "background.paper",
            }}
          >
            <Stack spacing={2}>
              {/* TITLE */}
              <Box>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  gutterBottom
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <RestaurantIcon />
                  Create Parcel Order
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Select items and create a parcel bill for takeaway
                </Typography>
              </Box>

              {/* SEARCH AND FILTERS */}
              <Grid container spacing={2} alignItems="center">
                {/* SEARCH BAR */}
                <Grid item xs={12} md={6}>
                  <TextField
                    inputRef={searchRef}
                    fullWidth
                    variant="outlined"
                    placeholder="Search dishes, ingredients, or categories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      },
                    }}
                    size="medium"
                  />
                </Grid>

                {/* SORT FILTER */}
                <Grid item xs={6} md={3}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      displayEmpty
                      sx={{
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      }}
                      startAdornment={
                        <InputAdornment position="start" sx={{ ml: 1 }}>
                          <FilterIcon fontSize="small" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="popular">Most Popular</MenuItem>
                      <MenuItem value="price-low">Price: Low to High</MenuItem>
                      <MenuItem value="price-high">Price: High to Low</MenuItem>
                      <MenuItem value="rating">Highest Rated</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* CATEGORY FILTERS */}
                <Grid item xs={6} md={3}>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label="All"
                      clickable
                      color={category === "all" ? "primary" : "default"}
                      onClick={() => setCategory("all")}
                      variant={category === "all" ? "filled" : "outlined"}
                    />
                    <Chip
                      label="Veg"
                      clickable
                      color={category === "veg" ? "success" : "default"}
                      onClick={() => setCategory("veg")}
                      variant={category === "veg" ? "filled" : "outlined"}
                    />
                    <Chip
                      label="Non-Veg"
                      clickable
                      color={category === "nonveg" ? "error" : "default"}
                      onClick={() => setCategory("nonveg")}
                      variant={category === "nonveg" ? "filled" : "outlined"}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Paper>

          {/* DISHES LIST - WITH SCROLL REF */}
          <Box
            ref={menuScrollRef}
            sx={{
              flex: 1,
              overflow: "auto",
              p: { xs: 1, md: 2 },
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
            onScroll={(e) => {
              menuScrollPosition.current = e.target.scrollTop;
            }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                backgroundColor: "background.paper",
              }}
            >
              {/* LIST HEADER */}
              <Box
                sx={{
                  p: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  backgroundColor: alpha(theme.palette.primary.light, 0.05),
                  display: { xs: "none", sm: "grid" },
                  gridTemplateColumns: "2fr 1fr 1fr 1fr",
                  gap: 2,
                  alignItems: "center",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                  Food Item
                </Typography>
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" align="center">
                  Category
                </Typography>
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" align="center">
                  Price
                </Typography>
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" align="center">
                  Action
                </Typography>
              </Box>

              {/* LIST ITEMS */}
              {filteredData.map((item, index) => (
                <Paper
                  key={item.id}
                  ref={(el) => (menuItemsRef.current[index] = el)}
                  tabIndex={0}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    backgroundColor: focusedIndex.menu === index
                      ? alpha(theme.palette.primary.main, 0.05)
                      : "transparent",
                    borderLeft: focusedIndex.menu === index
                      ? `4px solid ${theme.palette.primary.main}`
                      : "4px solid transparent",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.03),
                    },
                    "&:last-child": {
                      borderBottom: "none",
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFocusedIndex({ menu: index, cart: -1 });
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "2fr 1fr 1fr 1fr",
                      },
                      gap: { xs: 1, sm: 2 },
                      alignItems: "center",
                    }}
                  >
                    {/* FOOD NAME WITH IMAGE THUMBNAIL */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        src={item.image}
                        variant="rounded"
                        sx={{
                          width: 50,
                          height: 50,
                          border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                        }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.description}
                        </Typography>
                      </Box>
                    </Box>

                    {/* CATEGORY */}
                    <Box sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "center" } }}>
                      <Chip
                        label={item.category === "veg" ? "🌱 Veg" : "🍗 Non-Veg"}
                        size="small"
                        color={item.category === "veg" ? "success" : "error"}
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>

                    {/* PRICE */}
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "flex-start", sm: "center" } }}>
                      <Typography
                        variant="h6"
                        fontWeight={800}
                        color="primary"
                      >
                        ₹{item.price}
                      </Typography>
                    </Box>

                    {/* ADD BUTTON */}
                    <Box sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "center" } }}>
                      <Button
                        variant="contained"
                        size={isMobile ? "small" : "medium"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdd(item);
                        }}
                        sx={{
                          borderRadius: 2,
                          px: { xs: 2, sm: 3 },
                          fontWeight: 600,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                          minWidth: { xs: 80, sm: 120 },
                        }}
                        startIcon={<AddIcon />}
                      >
                        Add
                      </Button>
                    </Box>
                  </Box>

                  {/* KEYBOARD SHORTCUT HINT */}
                  {focusedIndex.menu === index && (
                    <Box
                      sx={{
                        mt: 1,
                        pt: 1,
                        borderTop: `1px dashed ${alpha(theme.palette.divider, 0.5)}`,
                      }}
                    >
                      <Typography variant="caption" color="primary" fontWeight={500}>
                        Space: Add • ← →: Switch Lists • ↑↓: Navigate
                      </Typography>
                    </Box>
                  )}
                </Paper>
              ))}

              {/* EMPTY STATE */}
              {filteredData.length === 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 8,
                    color: "text.secondary",
                  }}
                >
                  <RestaurantIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                  <Typography variant="h6" gutterBottom>
                    No dishes found
                  </Typography>
                  <Typography variant="body2">
                    Try adjusting your search or filters
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>

        {/* RIGHT PANEL - CART (25%) - Desktop Only */}
        {!isMobile && !isTablet && (
          <Box
            sx={{
              width: "25%",
              minWidth: 400,
              height: "100%",
              borderLeft: `1px solid ${theme.palette.divider}`,
              backgroundColor: "background.paper",
            }}
          >
            <CartContent />
          </Box>
        )}
      </Box>

      {/* KEYBOARD GUIDE MODAL */}
      {showKeyboardGuide && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
          onClick={() => setShowKeyboardGuide(false)}
        >
          <Paper
            elevation={24}
            sx={{
              width: "100%",
              maxWidth: 600,
              borderRadius: 4,
              overflow: "hidden",
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: "blur(20px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box
              sx={{
                p: 4,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h4" fontWeight={800}>
                  <KeyboardIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Keyboard Navigation
                </Typography>
                <IconButton onClick={() => setShowKeyboardGuide(false)}>
                  <CloseIcon />
                </IconButton>
              </Stack>
            </Box>

            <Box sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                    Navigation
                  </Typography>
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        ↑ / ↓ Arrow Keys
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Move up/down within current list (Menu or Cart)
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        ← / → Arrow Keys
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Switch between Menu list and Cart list
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        C
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Focus search box
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                    Actions
                  </Typography>
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        Space
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Add item (in Menu) or Remove item (in Cart)
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        Enter
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Generate bill (when in Cart)
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        + / -
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Adjust item quantity in cart
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  onClick={() => setShowKeyboardGuide(false)}
                  sx={{ px: 4 }}
                >
                  Got it!
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setKeyboardMode(!keyboardMode)}
                  endIcon={keyboardMode ? <ArrowDownIcon /> : <ArrowUpIcon />}
                >
                  {keyboardMode ? "Disable" : "Enable"} Keyboard Mode
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default CreateParcel;