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
  CardMedia,
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
  Whatshot as HotIcon,
  Timer as TimerIcon,
  FilterList as FilterIcon,
  Keyboard as KeyboardIcon,
  Info as InfoIcon,
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
];

const CreateParcel = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [focusedIndex, setFocusedIndex] = useState({ menu: 0, cart: -1 });
  const [keyboardMode, setKeyboardMode] = useState(true);
  const [showKeyboardGuide, setShowKeyboardGuide] = useState(false);

  /* ========= FILTERED DATA ========= */
  const filteredData = useMemo(() => {
    let filtered = foodItems;

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

    return filtered;
  }, [category, search]);

  // Refs for focusing
  const menuItemsRef = useRef([]);
  const cartItemsRef = useRef([]);
  const generateBillRef = useRef(null);
  const searchRef = useRef(null);

  /* ========= KEYBOARD NAVIGATION ========= */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't interfere with typing in search box
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case "c":
        case "C":
          e.preventDefault();
          if (searchRef.current) {
            searchRef.current.focus();
          }
          break;

        case "+":
          // Increase quantity of focused cart item
          if (focusedIndex.cart >= 0 && selected[focusedIndex.cart]) {
            e.preventDefault();
            updateSelectedQuantity(selected[focusedIndex.cart].id, 1);
          }
          break;

        case "-":
          // Decrease quantity of focused cart item
          if (focusedIndex.cart >= 0 && selected[focusedIndex.cart]) {
            e.preventDefault();
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

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keyboardMode, focusedIndex, filteredData, selected]);

  /* ========= ARROW NAVIGATION HANDLERS ========= */
  const handleArrowUp = () => {
    if (focusedIndex.cart >= 0) {
      // Navigate up in cart
      const newIndex = Math.max(0, focusedIndex.cart - 1);
      setFocusedIndex({ menu: -1, cart: newIndex });
      setTimeout(() => cartItemsRef.current[newIndex]?.focus(), 10);
    } else if (focusedIndex.menu >= 0) {
      // Navigate up in menu based on grid layout
      const cols = isMobile ? 1 : (isTablet ? 2 : 3); // Columns based on screen size
      const newIndex = Math.max(0, focusedIndex.menu - cols);
      setFocusedIndex({ menu: newIndex, cart: -1 });
      setTimeout(() => menuItemsRef.current[newIndex]?.focus(), 10);
    } else if (selected.length > 0) {
      // Move to cart if menu not focused
      setFocusedIndex({ menu: -1, cart: selected.length - 1 });
      setTimeout(() => cartItemsRef.current[selected.length - 1]?.focus(), 10);
    }
  };

  const handleArrowDown = () => {
    if (focusedIndex.cart >= 0) {
      // Navigate down in cart
      const newIndex = Math.min(selected.length - 1, focusedIndex.cart + 1);
      setFocusedIndex({ menu: -1, cart: newIndex });
      setTimeout(() => cartItemsRef.current[newIndex]?.focus(), 10);
    } else if (focusedIndex.menu >= 0) {
      // Navigate down in menu based on grid layout
      const cols = isMobile ? 1 : (isTablet ? 2 : 3); // Columns based on screen size
      const newIndex = Math.min(filteredData.length - 1, focusedIndex.menu + cols);
      setFocusedIndex({ menu: newIndex, cart: -1 });
      setTimeout(() => menuItemsRef.current[newIndex]?.focus(), 10);
    } else if (filteredData.length > 0) {
      // Start from first menu item
      setFocusedIndex({ menu: 0, cart: -1 });
      setTimeout(() => menuItemsRef.current[0]?.focus(), 10);
    }
  };

  const handleArrowLeft = () => {
    if (focusedIndex.cart >= 0) {
      // Move from cart to last menu item
      const newIndex = Math.max(0, filteredData.length - 1);
      setFocusedIndex({ menu: newIndex, cart: -1 });
      setTimeout(() => menuItemsRef.current[newIndex]?.focus(), 10);
    } else if (focusedIndex.menu >= 0) {
      // Move to previous menu item in the same row
      const cols = isMobile ? 1 : (isTablet ? 2 : 3);
      const row = Math.floor(focusedIndex.menu / cols);
      const col = focusedIndex.menu % cols;
      
      if (col > 0) {
        // Move left within same row
        const newIndex = focusedIndex.menu - 1;
        setFocusedIndex({ menu: newIndex, cart: -1 });
        setTimeout(() => menuItemsRef.current[newIndex]?.focus(), 10);
      } else {
        // Wrap to last item in the same row or previous row
        const itemsInRow = Math.min(cols, filteredData.length - row * cols);
        const newIndex = focusedIndex.menu + itemsInRow - 1;
        setFocusedIndex({ menu: newIndex, cart: -1 });
        setTimeout(() => menuItemsRef.current[newIndex]?.focus(), 10);
      }
    }
  };

  const handleArrowRight = () => {
    if (focusedIndex.menu >= 0) {
      // Move to next menu item in the same row
      const cols = isMobile ? 1 : (isTablet ? 2 : 3);
      const row = Math.floor(focusedIndex.menu / cols);
      const col = focusedIndex.menu % cols;
      const itemsInRow = Math.min(cols, filteredData.length - row * cols);
      
      if (col < itemsInRow - 1) {
        // Move right within same row
        const newIndex = focusedIndex.menu + 1;
        setFocusedIndex({ menu: newIndex, cart: -1 });
        setTimeout(() => menuItemsRef.current[newIndex]?.focus(), 10);
      } else {
        // Wrap to first item in the same row or next row
        const newIndex = row * cols;
        setFocusedIndex({ menu: newIndex, cart: -1 });
        setTimeout(() => menuItemsRef.current[newIndex]?.focus(), 10);
      }
    } else if (focusedIndex.cart >= 0) {
      // Move to first menu item from cart
      setFocusedIndex({ menu: 0, cart: -1 });
      setTimeout(() => menuItemsRef.current[0]?.focus(), 10);
    }
  };

  const handleEnter = () => {
    if (selected.length > 0 && generateBillRef.current) {
      generateBill();
    }
  };

  const handleSpace = () => {
    if (focusedIndex.menu >= 0 && focusedIndex.menu < filteredData.length) {
      // Add item from menu
      const item = filteredData[focusedIndex.menu];
      handleAdd(item);
    } else if (focusedIndex.cart >= 0 && focusedIndex.cart < selected.length) {
      // Remove item from cart
      const item = selected[focusedIndex.cart];
      handleDelete(item.id);
    }
  };

  /* ========= QUANTITY HANDLERS ========= */
  const handleQuantityChange = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  /* ========= ADD ITEM ========= */
  const handleAdd = (item) => {
    const quantity = quantities[item.id] || 1;
    const existingIndex = selected.findIndex((sel) => sel.id === item.id);

    if (existingIndex >= 0) {
      const updated = [...selected];
      updated[existingIndex].quantity = (updated[existingIndex].quantity || 1) + quantity;
      setSelected(updated);
      // Focus on the cart item after adding
      setFocusedIndex({ menu: -1, cart: existingIndex });
      setTimeout(() => cartItemsRef.current[existingIndex]?.focus(), 100);
    } else {
      const newSelected = [...selected, { ...item, quantity }];
      setSelected(newSelected);
      // Focus on the new cart item
      const newIndex = newSelected.length - 1;
      setFocusedIndex({ menu: -1, cart: newIndex });
      setTimeout(() => cartItemsRef.current[newIndex]?.focus(), 100);
    }

    // Reset quantity for this item
    setQuantities((prev) => ({ ...prev, [item.id]: 1 }));
  };

  /* ========= UPDATE SELECTED QUANTITY ========= */
  const updateSelectedQuantity = (id, delta) => {
    setSelected((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, (item.quantity || 1) + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  /* ========= DELETE ITEM ========= */
  const handleDelete = (id) => {
    const deletedIndex = selected.findIndex(item => item.id === id);
    const newSelected = selected.filter((i) => i.id !== id);
    setSelected(newSelected);
    
    // Adjust focus after deletion
    if (newSelected.length === 0) {
      setFocusedIndex({ menu: 0, cart: -1 });
      setTimeout(() => menuItemsRef.current[0]?.focus(), 100);
    } else if (focusedIndex.cart === deletedIndex) {
      const newIndex = Math.min(deletedIndex, newSelected.length - 1);
      setFocusedIndex({ menu: -1, cart: newIndex });
      setTimeout(() => cartItemsRef.current[newIndex]?.focus(), 100);
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
    navigate("/cashier/bill", {
      state: {
        billNo,
        items: selected,
        amount: calculateSubtotal(),
        timestamp: new Date().toISOString(),
      },
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 1, sm: 2, md: 3 } }}>
      {/* KEYBOARD GUIDE MODAL */}
      {showKeyboardGuide && (
        <Paper
          elevation={24}
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            p: 3,
            maxWidth: 500,
            width: "90%",
            borderRadius: 3,
            background: alpha(theme.palette.background.paper, 0.97),
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography variant="h5" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <KeyboardIcon /> Keyboard Controls
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" fontWeight={600} color="primary">Navigation</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>↑↓←→</strong> : Move between items</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>C</strong> : Focus search box</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>Tab</strong> : Toggle keyboard/mouse mode</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" fontWeight={600} color="primary">Actions</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>Space</strong> : Add/Remove item</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>Enter</strong> : Generate bill</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>+/-</strong> : Change quantity (in cart)</Typography>
            </Grid>
          </Grid>
          
          <Button
            fullWidth
            variant="contained"
            onClick={() => setShowKeyboardGuide(false)}
            sx={{ mt: 3 }}
            startIcon={<KeyboardIcon />}
          >
            Close (Press ESC)
          </Button>
        </Paper>
      )}

      {/* STATUS BAR */}
      <Paper
        elevation={1}
        sx={{
          mb: 2,
          p: 1.5,
          borderRadius: 2,
          background: keyboardMode 
            ? alpha(theme.palette.success.main, 0.1)
            : alpha(theme.palette.grey[300], 0.5),
          border: `2px solid ${keyboardMode ? theme.palette.success.main : theme.palette.grey[300]}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={keyboardMode ? "🎮 KEYBOARD MODE" : "🖱 MOUSE MODE"}
            color={keyboardMode ? "success" : "default"}
            variant="outlined"
            size="small"
          />
          <Typography variant="caption" color="text.secondary">
            Press <strong>Tab</strong> to toggle • <strong>F1</strong> for help
          </Typography>
        </Stack>
        
        <Tooltip title="Current focus position">
          <Chip
            icon={<InfoIcon />}
            label={`Focus: ${focusedIndex.menu >= 0 ? 'Menu' : 'Cart'}`}
            color="info"
            variant="outlined"
            size="small"
          />
        </Tooltip>
      </Paper>

      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight={800}
          gutterBottom
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          <RestaurantIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Create New Parcel
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Use keyboard shortcuts for faster operation
        </Typography>
      </Box>

      {/* CHANGED: Grid layout for responsive cart positioning */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', lg: 'row' },
        gap: 2 
      }}>
        {/* LEFT COLUMN - MENU */}
        <Box sx={{ 
          flex: 1,
          minWidth: 0, // Prevent overflow
        }}>
          {/* SEARCH AND FILTER BAR */}
          <Paper
            elevation={2}
            sx={{
              p: { xs: 1.5, sm: 2 },
              mb: 2,
              borderRadius: 2,
            }}
          >
            <Stack spacing={2}>
              {/* SEARCH WITH TOOLTIP */}
              <Tooltip title="Press C to focus" placement="top">
                <TextField
                  inputRef={searchRef}
                  fullWidth
                  variant="outlined"
                  placeholder="Search food items... (Press C)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 1.5 },
                  }}
                  size="small"
                />
              </Tooltip>

              {/* FILTER CHIPS */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
              >
                <Tooltip title="Filter items">
                  <Chip
                    icon={<FilterIcon />}
                    label="All"
                    clickable
                    size="small"
                    color={category === "all" ? "primary" : "default"}
                    onClick={() => setCategory("all")}
                  />
                </Tooltip>
                <Chip
                  icon={<span>🌱</span>}
                  label="Veg"
                  clickable
                  size="small"
                  color={category === "veg" ? "success" : "default"}
                  onClick={() => setCategory("veg")}
                />
                <Chip
                  icon={<span>🍗</span>}
                  label="Non-Veg"
                  clickable
                  size="small"
                  color={category === "nonveg" ? "error" : "default"}
                  onClick={() => setCategory("nonveg")}
                />
              </Stack>
            </Stack>
          </Paper>

          {/* FOOD ITEMS GRID - COMPACT CARDS */}
          <Grid container spacing={2}>
            {filteredData.map((item, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={item.id}
              >
                <Card
                  ref={el => menuItemsRef.current[index] = el}
                  tabIndex={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    position: 'relative',
                    border: focusedIndex.menu === index 
                      ? `3px solid ${theme.palette.primary.main}`
                      : '1px solid',
                    borderColor: focusedIndex.menu === index 
                      ? theme.palette.primary.main 
                      : theme.palette.divider,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4,
                    },
                    '&:focus': {
                      outline: 'none',
                      transform: 'translateY(-2px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => {
                    setFocusedIndex({ menu: index, cart: -1 });
                    menuItemsRef.current[index]?.focus();
                  }}
                >
                  {/* IMAGE */}
                  <Box sx={{ position: 'relative', height: 140 }}>
                    <CardMedia
                      component="img"
                      image={item.image}
                      alt={item.name}
                      sx={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    
                    {/* RATING BADGE */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        borderRadius: 1,
                        px: 1,
                        py: 0.3,
                      }}
                    >
                      <StarIcon sx={{ fontSize: 14 }} />
                      <Typography variant="caption" fontWeight={700}>
                        {item.rating}
                      </Typography>
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 2, flexGrow: 1 }}>
                    {/* ITEM NAME AND PRICE */}
                    <Box sx={{ mb: 1 }}>
                      <Typography 
                        variant="subtitle1" 
                        fontWeight={600}
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 1,
                          fontSize: '0.8rem',
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Box>

                    {/* PRICE AND ADD BUTTON */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" fontWeight={800} color="primary">
                        ₹{item.price}
                      </Typography>
                      
                      <Tooltip title="Press Space to add">
                        <Button
                          variant="contained"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdd(item);
                          }}
                          sx={{
                            borderRadius: 1.5,
                            minWidth: 80,
                            fontWeight: 600,
                          }}
                        >
                          Add
                        </Button>
                      </Tooltip>
                    </Box>
                  </CardContent>
                  
                  {/* KEYBOARD SHORTCUT HINT */}
                  {focusedIndex.menu === index && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 4,
                        left: 4,
                        background: theme.palette.primary.main,
                        color: 'white',
                        borderRadius: 1,
                        px: 1,
                        py: 0.2,
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                      }}
                    >
                      Space to add
                    </Box>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* RIGHT COLUMN - CART - FIXED: Always on right except mobile */}
        <Box sx={{ 
          width: { xs: '100%', lg: 400 },
          flexShrink: 0,
          position: { xs: 'static', lg: 'sticky' },
          top: { xs: 0, lg: 80 },
          alignSelf: 'flex-start',
          maxHeight: { xs: 'auto', lg: 'calc(100vh - 180px)' },
        }}>
          <Paper
            elevation={4}
            sx={{
              height: { xs: 'auto', lg: '100%' },
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            {/* CART HEADER */}
            <Box
              sx={{
                p: 2,
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                color: 'white',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Badge
                  badgeContent={calculateTotalItems()}
                  color="warning"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.7rem',
                      height: 20,
                      minWidth: 20,
                    },
                  }}
                >
                  <CartIcon sx={{ fontSize: 28 }} />
                </Badge>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Your Parcel
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    {selected.length} item{selected.length !== 1 ? 's' : ''} • ₹{calculateSubtotal()}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* CART ITEMS */}
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                p: 1.5,
              }}
            >
              {selected.length === 0 ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 6,
                    color: 'text.secondary',
                  }}
                >
                  <DiningIcon sx={{ fontSize: 48, mb: 1.5, opacity: 0.3 }} />
                  <Typography variant="body1" gutterBottom>
                    Your cart is empty
                  </Typography>
                  <Typography variant="caption">
                    Add items using keyboard or mouse
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1.5}>
                  {selected.map((item, index) => (
                    <Paper
                      key={item.id}
                      ref={el => cartItemsRef.current[index] = el}
                      tabIndex={0}
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: 1.5,
                        border: focusedIndex.cart === index 
                          ? `2px solid ${theme.palette.success.main}`
                          : '1px solid',
                        borderColor: focusedIndex.cart === index 
                          ? theme.palette.success.main 
                          : theme.palette.divider,
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.light, 0.05),
                        },
                        '&:focus': {
                          outline: 'none',
                          borderColor: theme.palette.success.main,
                        },
                      }}
                      onClick={() => {
                        setFocusedIndex({ menu: -1, cart: index });
                        cartItemsRef.current[index]?.focus();
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        {/* ITEM IMAGE */}
                        <Avatar
                          src={item.image}
                          variant="rounded"
                          sx={{
                            width: 60,
                            height: 60,
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        />

                        {/* ITEM DETAILS */}
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ₹{item.price} × {item.quantity || 1}
                          </Typography>
                          
                          {/* QUANTITY CONTROLS WITH TOOLTIPS */}
                          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                            <Tooltip title="Press - to decrease">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateSelectedQuantity(item.id, -1);
                                }}
                                sx={{
                                  border: `1px solid ${theme.palette.divider}`,
                                  borderRadius: 1,
                                  width: 24,
                                  height: 24,
                                }}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              sx={{ minWidth: 28, textAlign: 'center' }}
                            >
                              {item.quantity || 1}
                            </Typography>
                            
                            <Tooltip title="Press + to increase">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateSelectedQuantity(item.id, 1);
                                }}
                                sx={{
                                  border: `1px solid ${theme.palette.divider}`,
                                  borderRadius: 1,
                                  width: 24,
                                  height: 24,
                                }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Box>

                        {/* PRICE AND DELETE */}
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography
                            variant="subtitle1"
                            color="primary"
                            fontWeight={700}
                          >
                            ₹{item.price * (item.quantity || 1)}
                          </Typography>
                          <Tooltip title="Press Space to remove">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id);
                              }}
                              sx={{ mt: 0.2 }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Stack>
                      
                      {/* KEYBOARD SHORTCUT HINTS */}
                      {focusedIndex.cart === index && (
                        <Stack 
                          direction="row" 
                          spacing={1} 
                          sx={{ 
                            mt: 1, 
                            pt: 1, 
                            borderTop: `1px dashed ${theme.palette.divider}`,
                            fontSize: '0.7rem',
                          }}
                        >
                          <Chip 
                            size="small" 
                            label="Space: Remove" 
                            variant="outlined" 
                            sx={{ height: 20 }}
                          />
                          <Chip 
                            size="small" 
                            label="+/−: Quantity" 
                            variant="outlined" 
                            sx={{ height: 20 }}
                          />
                        </Stack>
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
                  p: 2,
                  borderTop: `1px solid ${theme.palette.divider}`,
                  background: alpha(theme.palette.primary.light, 0.05),
                }}
              >
                <Stack spacing={1.5}>
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
                      Items
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {calculateTotalItems()}
                    </Typography>
                  </Stack>

                  <Divider />

                  <Tooltip title="Press Enter to generate bill">
                    <Button
                      ref={generateBillRef}
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={<ReceiptIcon />}
                      onClick={generateBill}
                      disabled={selected.length === 0}
                      sx={{
                        borderRadius: 1.5,
                        py: 1.2,
                        fontWeight: 700,
                        background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: theme.shadows[4],
                        },
                      }}
                    >
                      Generate Bill (Enter) - ₹{calculateSubtotal()}
                    </Button>
                  </Tooltip>
                </Stack>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      {/* FLOATING KEYBOARD GUIDE BUTTON */}
      <Tooltip title="Show keyboard shortcuts (F1)">
        <IconButton
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
            boxShadow: 3,
          }}
          onClick={() => setShowKeyboardGuide(true)}
        >
          <KeyboardIcon />
        </IconButton>
      </Tooltip>

      {/* RESPONSIVE KEYBOARD GUIDE FOOTER */}
      <Paper
        elevation={1}
        sx={{
          mt: 2,
          p: 1.5,
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.info.main, 0.05),
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" display="block" fontWeight={600}>
              <strong>↑↓←→</strong> Navigate
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" display="block">
              <strong>Space</strong> Add/Remove
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" display="block">
              <strong>Enter</strong> Generate Bill
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" display="block">
              <strong>C</strong> Focus Search
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" display="block">
              <strong>+/-</strong> Quantity
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" display="block">
              <strong>Tab</strong> Toggle Mode
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" display="block">
              <strong>F1</strong> Help
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" display="block">
              <strong>ESC</strong> Close Help
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* MOBILE KEYBOARD GUIDE */}
      {isMobile && !showKeyboardGuide && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 70,
            right: 20,
            backgroundColor: alpha(theme.palette.primary.main, 0.9),
            color: 'white',
            borderRadius: 2,
            p: 1.5,
            maxWidth: 200,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="caption" fontWeight={600}>
            Press F1 for keyboard shortcuts
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default CreateParcel;