"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  Collapse,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  FavoriteBorder as HeartIcon,
  ShoppingCartOutlined as CartIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/use-app-store";
import { useCustomerLogout } from "@/api/handlers";
import { useCartSummary } from "@/api/handlers/cartHandler";
import { useWishlist } from "@/api/handlers/wishlistHandler";
import { useCompanyDetails } from "@/hooks/use-company-details";
import { searchSuggestionService } from "@/api/services/searchSuggestionService";

interface SearchResult {
  id: string;
  title: string;
  type:string;
}

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const { customer, isAuthenticated } = useAppStore();
  const logoutMutation = useCustomerLogout();
  const { companyDetails } = useCompanyDetails();

  // Search expansion state
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  interface SuggestionItem {
    suggestions: string[];
    type: "product" | "category";
  }
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
  
      try {
        const res = await searchSuggestionService.getSuggestions({ q: searchQuery });
  
        if (res.success && Array.isArray(res.data)) {
          const formatted: SearchResult[] = [];
  
          res.data.forEach((item: any) => {
            if (Array.isArray(item.suggestions) && item.suggestions.length > 0) {
              item.suggestions.forEach((s: any) => {
                formatted.push({
                  id: s.id,            // ✅ now includes ID
                  title: s.title,      // ✅ extract title instead of using the whole string
                  type: item.type,     // ✅ preserve type (product/category/tag)
                });
              });
            }
          });
  
          setSearchResults(formatted);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error(err);
        setSearchResults([]);
      }
    };
  
    fetchSuggestions();
  }, [searchQuery]);
  
  

  // Fetch cart and wishlist counts when authenticated
  const { data: cartSummary } = useCartSummary(customer?.id || "", {
    enabled: isAuthenticated && !!customer?.id,
  });

  const { data: wishlistData } = useWishlist(
    { customerId: customer?.id || "" },
    { enabled: isAuthenticated && !!customer?.id }
  );

  // Extract counts
  const cartCount = cartSummary?.data?.itemCount || 0;
  const wishlistCount = wishlistData?.data?.products?.length || 0;

  const [profileMenuAnchor, setProfileMenuAnchor] =
    useState<null | HTMLElement>(null);
  const isProfileMenuOpen = Boolean(profileMenuAnchor);

  // Tools dropdown state
  const [toolsAnchor, setToolsAnchor] = useState<null | HTMLElement>(null);
  const isToolsOpen = Boolean(toolsAnchor);

  const handleSignInClick = () => {
    router.push("/sign_in");
  };

  const handleFavouriteClick = () => {
    router.push("/favourite");
  };

  const handleCartClick = () => {
    router.push("/cart");
  };

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (isSearchExpanded) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);

    // Simulate search delay
    setTimeout(() => {
      if (query.trim()) {
        const filtered = searchResults.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.type.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
      } else {
        setSearchResults([]);
      }
      setIsSearching(false);
    }, 300);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search logic here
      console.log("Searching for:", searchQuery);
      // You can navigate to search results page or trigger search
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchExpanded(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleResultClick = (result: SearchResult) => {
    console.log("Selected:", result);
    // Handle navigation based on result type
    if (result.type === "product") {
      router.push(`/product/detail/${result.id}`);
    } else {
      router.push(`product?category=${result.title.toLowerCase()}`);
    }
    setIsSearchExpanded(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleToolsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setToolsAnchor(event.currentTarget);
  };

  const handleToolsMenuClose = () => {
    setToolsAnchor(null);
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    router.push("/profile");
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    try {
      await logoutMutation.mutateAsync();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        py: 1,
        background: "linear-gradient(90deg, #F58A4E 0%, #F16A3C 100%)",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: { xs: 2, md: 3 },
          minHeight: { xs: 64, md: 70 },
        }}
      >
        {/* Logo */}
        <Link href="/" passHref>
          <Box
            component="img"
            src="/ezrm-logo.png"
            alt={`${
              companyDetails?.fullName || "EZRM"
            } - Raw Materials Simplified`}
            sx={{
              height: { xs: 32, md: 40 },
              width: "auto",
              filter: "brightness(0) invert(1)", // Makes the logo white
              cursor: "pointer",
            }}
          />
        </Link>

        <Box display={"flex"} alignItems={"center"} gap={4}>
          {/* Navigation Links - Hidden on mobile */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                gap: 3,
                alignItems: "center",
                position: "relative",
              }}
            >
              {/* About */}
              <Link href="/about" passHref>
                <Typography
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    fontSize: "16px",
                    fontWeight: 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      fontWeight: 700,
                      transform: "translateY(-1px)",
                      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  About
                </Typography>
              </Link>

              {/* Product */}
              <Link href="/product" passHref>
                <Typography
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    fontSize: "16px",
                    fontWeight: 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      fontWeight: 700,
                      transform: "translateY(-1px)",
                      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  Product
                </Typography>
              </Link>

              {/* Tools with Dropdown */}
              <Box
                onMouseEnter={handleToolsMenuOpen}
                onMouseLeave={handleToolsMenuClose}
                sx={{ position: "relative" }}
              >
                <Typography
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    fontSize: "16px",
                    fontWeight: 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      fontWeight: 700,
                      transform: "translateY(-1px)",
                      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  Tools
                  <ArrowDownIcon sx={{ fontSize: 16 }} />
                </Typography>

                {/* Tools Dropdown Menu */}
                <Menu
                  anchorEl={toolsAnchor}
                  open={isToolsOpen}
                  onClose={handleToolsMenuClose}
                  MenuListProps={{
                    onMouseLeave: handleToolsMenuClose,
                  }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      borderRadius: "12px",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                      border: "1px solid #e0e0e0",
                      minWidth: 280,
                      py: 1,
                    },
                  }}
                  transformOrigin={{ horizontal: "left", vertical: "top" }}
                  anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                >
                  <MenuItem
                    onClick={() => {
                      handleToolsMenuClose();
                      router.push("/tools/e-numbers");
                    }}
                    sx={{
                      py: 1.5,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                      E Numbers
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleToolsMenuClose();
                      router.push("/tools/capsule-sizes");
                    }}
                    sx={{
                      py: 1.5,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                      Capsule Sizes
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleToolsMenuClose();
                      router.push("/tools/dietary-reference-values");
                    }}
                    sx={{
                      py: 1.5,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                      Dietary Reference Values (NRV RDA)
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleToolsMenuClose();
                      router.push("/tools/enzyme-applications");
                    }}
                    sx={{
                      py: 1.5,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                      Enzyme Applications, Units and Info
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleToolsMenuClose();
                      router.push("/tools/health-claims");
                    }}
                    sx={{
                      py: 1.5,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                      Health Claims - EFSA
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleToolsMenuClose();
                      router.push("/tools/mineral-activity");
                    }}
                    sx={{
                      py: 1.5,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                      Mineral Activity and Solubility in Water
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleToolsMenuClose();
                      router.push("/tools/scoville-heat-units");
                    }}
                    sx={{
                      py: 1.5,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                      Scoville Heat Units
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleToolsMenuClose();
                      router.push("/tools/vitamin-activity");
                    }}
                    sx={{
                      py: 1.5,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                      Vitamin Activity
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>

              {/* Certifications */}
              <Link href="/certifications" passHref>
                <Typography
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    fontSize: "16px",
                    fontWeight: 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      fontWeight: 700,
                      transform: "translateY(-1px)",
                      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  Certifications
                </Typography>
              </Link>

              {/* Inline Search Bar */}
              <Collapse
                in={isSearchExpanded}
                orientation="horizontal"
                timeout={300}
              >
                <Box
                  sx={{
                    ml: 3,
                    position: "relative",
                  }}
                >
                  <Box component="form" onSubmit={handleSearchSubmit}>
                    <TextField
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search for products, categories..."
                      variant="outlined"
                      size="small"
                      autoFocus
                      sx={{
                        width: 320,
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          borderRadius: "12px",
                          fontSize: "14px",
                          height: "36px",
                          "& fieldset": {
                            borderColor: "#e0e0e0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#ff6b35",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#ff6b35",
                            borderWidth: "2px",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          padding: "8px 14px",
                          color: "#333",
                          "&::placeholder": {
                            color: "#666",
                            opacity: 1,
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: "#666", fontSize: 18 }} />
                          </InputAdornment>
                        ),
                        endAdornment: searchQuery && (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleSearchClear}
                              size="small"
                              sx={{
                                color: "#666",
                                "&:hover": {
                                  backgroundColor: "rgba(0,0,0,0.04)",
                                },
                              }}
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  {/* Search Results Dropdown */}
                  {(searchResults.length > 0 || isSearching) && (
                    <Paper
                      elevation={8}
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        mt: 1,
                        borderRadius: "12px",
                        maxHeight: "300px",
                        overflow: "auto",
                        zIndex: 1000,
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      {isSearching ? (
                        <Box sx={{ p: 2, textAlign: "center" }}>
                          <Typography variant="body2" color="text.secondary">
                            Searching...
                          </Typography>
                        </Box>
                      ) : (
                        <List sx={{ py: 0 }}>
                          {searchResults.map((result) => (
                            <ListItem
                              key={result.id}
                              // button
                              onClick={() => handleResultClick(result)}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "#f5f5f5",
                                  cursor:"pointer"
                                },
                                
                                borderBottom: "1px solid #f0f0f0",
                                "&:last-child": {
                                  borderBottom: "none",
                                },
                              }}
                            >
                              <ListItemText
                                primary={
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="body1"
                                      sx={{ fontWeight: 500 }}
                                    >
                                      {result.title}
                                    </Typography>
                                    <Chip
                                      label={result.type}
                                      size="small"
                                      variant="outlined"
                                      sx={{
                                        fontSize: "10px",
                                        height: "20px",
                                        color:
                                          result.type === "product"
                                            ? "#ff6b35"
                                            : "#4a90e2",
                                        borderColor:
                                          result.type === "product"
                                            ? "#ff6b35"
                                            : "#4a90e2",
                                      }}
                                    />
                                  </Box>
                                }
                                secondary={result.category}
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Paper>
                  )}
                </Box>
              </Collapse>
            </Box>
          )}

          {/* Right Side Icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <IconButton
              onClick={handleSearchToggle}
              sx={{
                bgcolor: "white",
                width: 40,
                height: 40,
                "&:hover": {
                  bgcolor: "#f5f5f5",
                },
              }}
            >
              <SearchIcon sx={{ color: "#666", fontSize: 20 }} />
            </IconButton>

            <Box sx={{ position: "relative" }}>
              <IconButton
                onClick={handleFavouriteClick}
                sx={{
                  bgcolor: "white",
                  width: 40,
                  height: 40,
                  "&:hover": {
                    bgcolor: "#f5f5f5",
                  },
                }}
              >
                <HeartIcon sx={{ color: "#666", fontSize: 20 }} />
              </IconButton>

              {/* Custom Wishlist Badge */}
              {isAuthenticated && wishlistCount > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "15%",
                    right: "15%",
                    transform: "translate(50%, -50%)",
                    backgroundColor: "#d14d20",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 700,
                    minWidth: "18px",
                    height: "18px",
                    borderRadius: "9px",
                    border: "2px solid white",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    background:
                      "linear-gradient(135deg, #d14d20 0%, #b8431c 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translate(50%, -50%) scale(1.1)",
                    },
                    zIndex: 1,
                  }}
                >
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </Box>
              )}
            </Box>

            <Box sx={{ position: "relative" }}>
              <IconButton
                onClick={handleCartClick}
                sx={{
                  bgcolor: "white",
                  width: 40,
                  height: 40,
                  "&:hover": {
                    bgcolor: "#f5f5f5",
                  },
                }}
              >
                <CartIcon sx={{ color: "#666", fontSize: 20 }} />
              </IconButton>

              {/* Custom Cart Badge */}
              {isAuthenticated && cartCount > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "15%",
                    right: "15%",
                    transform: "translate(50%, -50%)",
                    backgroundColor: "#e55a2b",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 700,
                    minWidth: "18px",
                    height: "18px",
                    borderRadius: "9px",
                    border: "2px solid white",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    background:
                      "linear-gradient(135deg, #e55a2b 0%, #d14d20 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translate(50%, -50%) scale(1.1)",
                    },
                    zIndex: 1,
                  }}
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </Box>
              )}
            </Box>

            {/* Conditional Rendering: Profile Dropdown or Sign In Button */}
            {isAuthenticated && customer ? (
              <>
                {/* Profile Dropdown Button */}
                <Box
                  onClick={handleProfileMenuOpen}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "white",
                    color: "#ff7849",
                    fontWeight: 600,
                    fontSize: "14px",
                    px: 2,
                    py: 1,
                    ml: 1,
                    cursor: "pointer",
                    borderRadius: "8px",
                    minWidth: "120px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "#f5f5f5",
                      transform: "scale(1.02)",
                    },
                    "&:active": {
                      transform: "scale(0.98)",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: "#ff7849",
                      color: "white",
                      fontSize: "10px",
                      fontWeight: 600,
                    }}
                  >
                    {getInitials(customer.name)}
                  </Avatar>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#ff7849",
                      maxWidth: "80px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {customer.name.split(" ")[0]}
                  </Typography>
                  <ArrowDownIcon
                    sx={{
                      fontSize: 16,
                      color: "#ff7849",
                      transform: isProfileMenuOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </Box>

                {/* Profile Dropdown Menu */}
                <Menu
                  anchorEl={profileMenuAnchor}
                  open={isProfileMenuOpen}
                  onClose={handleProfileMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                      border: "1px solid #f0f0f0",
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  {/* User Info Header */}
                  <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #f0f0f0" }}>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#333",
                        mb: 0.5,
                      }}
                    >
                      {customer.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#666",
                      }}
                    >
                      {customer.email}
                    </Typography>
                  </Box>

                  {/* Menu Items */}
                  <MenuItem
                    onClick={handleProfileClick}
                    sx={{
                      px: 3,
                      py: 1.5,
                      "&:hover": {
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 18, color: "#666", mr: 2 }} />
                    <Typography sx={{ fontSize: "14px", color: "#333" }}>
                      My Profile
                    </Typography>
                  </MenuItem>

                  <Divider sx={{ my: 1 }} />

                  <MenuItem
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    sx={{
                      px: 3,
                      py: 1.5,
                      "&:hover": {
                        backgroundColor: "#ffeaea",
                      },
                    }}
                  >
                    <LogoutIcon
                      sx={{ fontSize: 18, color: "#d32f2f", mr: 2 }}
                    />
                    <Typography sx={{ fontSize: "14px", color: "#d32f2f" }}>
                      {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              /* Sign In Button */
              <Box
                onClick={handleSignInClick}
                sx={{
                  position: "relative",
                  bgcolor: "white",
                  color: "#ff7849",
                  fontWeight: 700,
                  fontSize: "14px",
                  px: 3,
                  py: 1.2,
                  ml: 1,
                  cursor: "pointer",
                  clipPath:
                    "polygon(0% 0%, calc(100% - 15px) 0%, 100% 50%, calc(100% - 15px) 100%, 0% 100%, 15px 50%)",
                  minWidth: "90px",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "#f5f5f5",
                    transform: "scale(1.02)",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                }}
              >
                SIGN IN
              </Box>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
