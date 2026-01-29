import { Card, CardContent, Typography, Box, Stack } from "@mui/material";

export default function SummaryCard({ 
  label, 
  value, 
  icon, 
  color = "primary", 
  trend,
  variant = "standard",
  prefix = ""
}) {
  const colors = {
    primary: { bg: "#667eea", text: "#fff" },
    success: { bg: "#4CAF50", text: "#fff" },
    warning: { bg: "#FF9800", text: "#fff" },
    info: { bg: "#2196F3", text: "#fff" },
  };

  const selectedColor = colors[color] || colors.primary;

  /* ---------------- MODERN VARIANT ---------------- */
  if (variant === "modern") {
    return (
      <Card
        sx={{
          width: "320px",
          height: "100%",
          minWidth: {
            xs: "100%",   // mobile
            sm: 260,      // tablet
            md: 280,      // laptop
            lg: 300       // desktop
          },
          borderRadius: 3,
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.1)"
          }
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
              md: 3
            }
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {label}
              </Typography>

              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: {
                    xs: "1.5rem",
                    sm: "1.8rem",
                    md: "2rem"
                  }
                }}
              >
                {prefix}{value.toLocaleString()}
              </Typography>

              {trend && (
                <Typography variant="caption" color="text.secondary">
                  {trend}
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                p: {
                  xs: 1,
                  sm: 1.5
                },
                borderRadius: 2,
                bgcolor: `${selectedColor.bg}15`,
                color: selectedColor.bg
              }}
            >
              {icon}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  /* ---------------- STANDARD VARIANT ---------------- */
  return (
    <Card
      sx={{
        width: "100%",
        minWidth: {
          xs: "100%",
          sm: 260,
          md: 280
        }
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              bgcolor: `${selectedColor.bg}20`,
              color: selectedColor.bg
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
