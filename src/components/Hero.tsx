import type React from "react";
import { Box, Typography, Container } from "@mui/material";
import { useAppStore } from "@/store/use-app-store";
import SearchBox from "./SearchBox";

const Hero: React.FC = () => {
  const { isAuthenticated } = useAppStore();

  return (
    <Box
      sx={{
        backgroundImage: "url(/bgImage.png)",
        // backdropFilter:'',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100vw",
      //  height: "28.75rem", // 572px converted to rem (572/16 = 35.75rem)
      height: {
        xs: "28.75rem",  // phones / small devices
        md: "31.75rem",  // tablets / medium screens
        xl: "40rem",     // desktops / large screens
      },
        position: "relative",
        marginLeft: "50%",
        transform: "translateX(-50%)", // Centers the full-width element
        // background:"transparent"
      }}
    >
      <Container maxWidth="lg" sx={{ height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            textAlign: "center",
            py: { xs: 4, md: 8 },
          }}
        >
          {/* Main Logo */}
          <Box
            component="img"
            src="/ezrm-logo.png"
            alt="EZRM - Raw Materials Simplified"
            sx={{
              height: { xs: 50, sm: 80, md: 90 },
              width: "280px",
              mb: 2,
              filter: "brightness(0) invert(1)", // Makes the logo white
            }}
          />

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              mb: 5,
              mt: 1,
              maxWidth: "48rem",
            }}
          >
            Discover premium raw materials and ingredients for your business.
            From BCAA to specialty compounds, we simplify sourcing with quality
            assurance and competitive pricing.
          </Typography>

          {/* Enhanced Search Box */}
          <Box
            sx={{
              width: "100%",
              maxWidth: "48rem",
              marginBottom:"20px"
            }}
          >
            <SearchBox
              fullWidth
              placeholder="Search for raw materials, supplements, ingredients..."
              showDropdown={true}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
