import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; 

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

    const navigate = useNavigate(); 

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = () => {
    if (!form.username || !form.password) {
      setError("Username and password are required");
      return;
    }

    if (form.username === "cashier" && form.password === "1234") {
        navigate("/dashboard");  
      alert("Login successful (Dashboard coming soon)");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="background.default"
    >
      <Paper
        elevation={4}
        sx={{
          width: 420,
          minHeight: 500,               // ✅ Taller card
          padding: "48px 36px",
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",

          // ✅ Safe animation (LOCAL only)
          animation: "fadeInUp 0.6s ease",
          "@keyframes fadeInUp": {
            from: {
              opacity: 0,
              transform: "translateY(25px)",
            },
            to: {
              opacity: 1,
              transform: "translateY(0)",
            },
          },
        }}
      >
        <Typography
  variant="h4"
  align="center"
  mb={4}
  sx={{
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 700,
    letterSpacing: "0.5px",
  }}
>
  Login
</Typography>


        <TextField
          label="Username"
          name="username"
          fullWidth
          margin="normal"
          value={form.username}
          onChange={handleChange}
        />

        <TextField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={form.password}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {error && (
          <Typography color="error" mt={1}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 5, py: 1.4 }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;