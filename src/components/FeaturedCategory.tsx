"use client";

import React from "react";

import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Alert,
  Skeleton,
} from "@mui/material";
import { useFeaturedCategories } from "@/api/handlers";
import { useRouter } from "next/navigation";
import type { Category } from "@/api/services";

interface CategoryCardProps {
  category: Category;
  isHighlighted?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isHighlighted = false,
}) => {
  const router = useRouter();

  const getImageUrl = (imageUrl: string | undefined | null) => {
    // Check if imageUrl exists and is a string
    if (!imageUrl || typeof imageUrl !== "string") {
      return "./vitIcon.png"; // Return default icon if no image URL
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }
    return `${process.env.NEXT_PUBLIC_API_URL}/${imageUrl}`;
  };

  const handleCategoryClick = () => {
    // Navigate to product page with category filter
    router.push(`/product?category=${category.slug}`);
  };

  return (
    <Card
      onClick={handleCategoryClick}
      sx={{
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        width: "13.6rem", // Dynamic width ~250px
        minWidth: "12.6rem", // Ensure consistent minimum width
        height: "4.5rem", // Dynamic height ~75px
        bgcolor: isHighlighted ? "#ff7849" : "white",
        color: isHighlighted ? "white" : "#333",
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
          transform: "translateY(-2px)",
          bgcolor: isHighlighted ? "#e55a2b" : "#f8f9fa",
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          py: 1.5,
          px: 3,
          height: "100%",
          "&:last-child": {
            pb: 1.5,
          },
        }}
      >
        <Box
          component="img"
          src={getImageUrl(category.image)}
          alt={`${category.name} Icon`}
          onError={(e) => {
            // Fallback to default icon if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = "./vitIcon.png";
          }}
          sx={{
            width: 28,
            height: 28,
            minWidth: 28, // Prevent image from shrinking
            filter: isHighlighted ? "brightness(0) invert(1)" : "none",
            objectFit: "contain",
          }}
        />
        <Typography
          variant="body1"
          title={category.name} // Tooltip on hover
          sx={{
            fontWeight: 500,
            fontSize: "1rem",
            lineHeight: 1.2,
            flex: 1, // Take remaining space
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            cursor: "pointer",
          }}
        >
          {category.name}
        </Typography>
      </CardContent>
    </Card>
  );
};

const CategoryCardSkeleton: React.FC = () => (
  <Card
    sx={{
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      width: "13em",
      bgcolor: "white",
    }}
  >
    <CardContent
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        py: 3,
        px: 3,
        "&:last-child": {
          pb: 3,
        },
      }}
    >
      <Skeleton variant="rectangular" width={28} height={28} />
      <Skeleton variant="text" width={100} height={20} />
    </CardContent>
  </Card>
);

const FeaturedCategory: React.FC = () => {
  const { data: response, isLoading, error, isError } = useFeaturedCategories();

  // Debug logging
  React.useEffect(() => {
    console.log("Featured Categories Loading:", isLoading);
    console.log("Featured Categories Error:", error);
    console.log("Featured Categories Response:", response);
  }, [isLoading, error, response]);

  // Function to organize categories into rows for better visual layout
  const organizeIntoRows = (categories: Category[]) => {
    const rows: Category[][] = [];
    const totalCategories = categories.length;

    if (totalCategories === 0) return rows;

    // For small number of categories, put them in a single row
    if (totalCategories <= 4) {
      rows.push(categories);
      return rows;
    }

    // For larger numbers, distribute across multiple rows
    const itemsPerRow = Math.ceil(totalCategories / 3); // Aim for 3 rows max
    for (let i = 0; i < totalCategories; i += itemsPerRow) {
      rows.push(categories.slice(i, i + itemsPerRow));
    }

    return rows;
  };

  const renderLoadingState = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        alignItems: "center",
      }}
    >
      {[1, 2, 3].map((rowIndex) => (
        <Grid container spacing={2} key={rowIndex} justifyContent="center">
          {Array.from({ length: rowIndex === 2 ? 3 : 4 }).map(
            (_, cardIndex) => (
              <Grid key={cardIndex}>
                <CategoryCardSkeleton />
              </Grid>
            )
          )}
        </Grid>
      ))}
    </Box>
  );

  const renderErrorState = () => (
    <Alert severity="error" sx={{ mb: 2 }}>
      <Typography variant="h6">Error loading categories</Typography>
      <Typography variant="body2">
        {error instanceof Error ? error.message : "Something went wrong"}
      </Typography>
    </Alert>
  );

  const renderEmptyState = () => (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <Typography variant="h6" sx={{ color: "#666", mb: 1 }}>
        No featured categories found
      </Typography>
      <Typography variant="body2" sx={{ color: "#999" }}>
        Featured categories will appear here once they are available.
      </Typography>
    </Box>
  );

  const categories = response?.categories || [];
  const categoryRows = organizeIntoRows(categories);

  return (
    <Box
      sx={{
        bgcolor: "#f8f9fa",
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        {/* Section Title */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: 4,
              height: 32,
              bgcolor: "#ff7849",
              mr: 2,
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: "#333",
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            Featured Category
          </Typography>
          {!isLoading && categories.length > 0 && (
            <Typography
              variant="body2"
              sx={{
                ml: 2,
                color: "#666",
                fontSize: "0.9rem",
              }}
            >
              ({categories.length} categories)
            </Typography>
          )}
        </Box>

        {/* Category Grid */}
        {isLoading && renderLoadingState()}
        {isError && renderErrorState()}
        {!isLoading &&
          !isError &&
          categories.length === 0 &&
          renderEmptyState()}
        {!isLoading && !isError && categories.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: "center",
            }}
          >
            {categoryRows.map((row, rowIndex) => (
              <Grid
                container
                spacing={2}
                key={rowIndex}
                justifyContent="center"
              >
                {row.map((category, cardIndex) => (
                  <Grid key={category._id}>
                    <CategoryCard
                      category={category}
                      isHighlighted={cardIndex === 1 && rowIndex === 0} // Highlight second item in first row
                    />
                  </Grid>
                ))}
              </Grid>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default FeaturedCategory;
