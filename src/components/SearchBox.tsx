"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Divider,
  Button,
} from "@mui/material";
import {
  Search,
  Close,
  LocalOffer,
  Category,
  TrendingUp,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { searchHandler } from "@/api/handlers/searchHandler";
import type { SearchProduct, SearchCategory } from "@/api/services/search";

interface SearchBoxProps {
  onSearchResults?: (results: any) => void;
  placeholder?: string;
  fullWidth?: boolean;
  showDropdown?: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  onSearchResults,
  placeholder = "Search products, categories...",
  fullWidth = false,
  showDropdown = true,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    products: SearchProduct[];
    categories: SearchCategory[];
  }>({ products: [], categories: [] });

  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Popular searches (can be made dynamic)
  const popularSearches = [
    "BCAA",
    "Protein",
    "Vitamins",
    "Creatine",
    "Amino Acids",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults({ products: [], categories: [] });
      return;
    }

    setLoading(true);
    try {
      const results = await searchHandler.search(query, 1, 6); // Limit for dropdown
      setSearchResults({
        products: results.products,
        categories: results.categories,
      });

      if (onSearchResults) {
        onSearchResults(results);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults({ products: [], categories: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);

    if (showDropdown) {
      setIsOpen(true);

      // Debounce search
      const timeoutId = setTimeout(() => {
        handleSearch(value);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleProductClick = (productId: string) => {
    setIsOpen(false);
    setSearchQuery("");
    router.push(`/product/detail/${productId}`);
  };

  const handleCategoryClick = (slug: string) => {
    setIsOpen(false);
    setSearchQuery("");
    router.push(`/product?category=${slug}`);
  };

  const handlePopularSearchClick = (term: string) => {
    setSearchQuery(term);
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults({ products: [], categories: [] });
    setIsOpen(false);
  };

  const hasResults =
    searchResults.products.length > 0 || searchResults.categories.length > 0;

  return (
    <Box
      ref={searchRef}
      sx={{ position: "relative", width: fullWidth ? "100%" : "auto" }}
    >
      <form onSubmit={handleSubmit}>
        <TextField
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => showDropdown && setIsOpen(true)}
          placeholder={placeholder}
          variant="outlined"
          size="medium"
          fullWidth={fullWidth}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#666" }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={handleClear} size="small">
                  <Close sx={{ fontSize: 20 }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
              borderRadius: 2,
              "& fieldset": {
                borderColor: "#e0e0e0",
              },
              "&:hover fieldset": {
                borderColor: "#c0c0c0",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#ff6b35",
              },
            },
          }}
        />
      </form>

      {/* Search Dropdown */}
      {showDropdown && isOpen && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1300,
            mt: 1,
            maxHeight: 400,
            overflow: "auto",
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            border: "1px solid #e0e0e0",
          }}
        >
          {loading ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ mt: 1, color: "#666" }}>
                Searching...
              </Typography>
            </Box>
          ) : searchQuery.trim() === "" ? (
            // Popular Searches
            <Box sx={{ p: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, color: "#333" }}
              >
                <TrendingUp
                  sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }}
                />
                Popular Searches
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {popularSearches.map((term) => (
                  <Chip
                    key={term}
                    label={term}
                    onClick={() => handlePopularSearchClick(term)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#ff6b35",
                        color: "white",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          ) : hasResults ? (
            <List sx={{ py: 1 }}>
              {/* Categories */}
              {searchResults.categories.length > 0 && (
                <>
                  <Typography
                    variant="subtitle2"
                    sx={{ px: 2, py: 1, fontWeight: 600, color: "#333" }}
                  >
                    Categories
                  </Typography>
                  {searchResults.categories.map((category: any) => (
                    <ListItem
                      key={category._id}
                      button
                      onClick={() => handleCategoryClick(category.slug)}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(255, 107, 53, 0.04)",
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            backgroundColor: "#ff6b35",
                            width: 32,
                            height: 32,
                          }}
                        >
                          <Category sx={{ fontSize: 18 }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={category.name}
                        secondary={category.description}
                        primaryTypographyProps={{
                          fontWeight: 600,
                          fontSize: "0.9rem",
                        }}
                        secondaryTypographyProps={{
                          fontSize: "0.8rem",
                          color: "#666",
                        }}
                      />
                    </ListItem>
                  ))}
                  {searchResults.products.length > 0 && <Divider />}
                </>
              )}

              {/* Products */}
              {searchResults.products.length > 0 && (
                <>
                  <Typography
                    variant="subtitle2"
                    sx={{ px: 2, py: 1, fontWeight: 600, color: "#333" }}
                  >
                    Products
                  </Typography>
                  {searchResults.products.map((product) => (
                    <ListItem
                      key={product._id}
                      button
                      onClick={() => handleProductClick(product._id)}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(255, 107, 53, 0.04)",
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={product.bannerImage || product.images[0]}
                          sx={{ width: 32, height: 32 }}
                        >
                          <LocalOffer />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={product.name}
                        secondary={`${product.uniqueId} • $${product.price}`}
                        primaryTypographyProps={{
                          fontWeight: 600,
                          fontSize: "0.9rem",
                        }}
                        secondaryTypographyProps={{
                          fontSize: "0.8rem",
                          color: "#666",
                        }}
                      />
                      {product.inStock && (
                        <Chip
                          label="In Stock"
                          size="small"
                          sx={{
                            backgroundColor: "#4caf50",
                            color: "white",
                            fontSize: "0.7rem",
                            height: 20,
                          }}
                        />
                      )}
                    </ListItem>
                  ))}
                </>
              )}

              {/* View All Results */}
              <Divider />
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                  }}
                  sx={{
                    borderColor: "#ff6b35",
                    color: "#ff6b35",
                    "&:hover": {
                      borderColor: "#e55a2b",
                      backgroundColor: "rgba(255, 107, 53, 0.04)",
                    },
                    textTransform: "none",
                  }}
                >
                  View All Results
                </Button>
              </Box>
            </List>
          ) : (
            // No Results
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Search sx={{ fontSize: 48, color: "#c0c0c0", mb: 1 }} />
              <Typography variant="body2" sx={{ color: "#666" }}>
                No results found for "{searchQuery}"
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default SearchBox;
