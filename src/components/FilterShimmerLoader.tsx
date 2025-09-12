import React from "react";
import {
  Box,
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

const FilterShimmerLoader: React.FC = () => {
  return (
    <Box sx={{ p: 0 }}>
      {/* Category Filter Shimmer */}
      <Accordion
        defaultExpanded
        sx={{
          boxShadow: "none",
          "&:before": { display: "none" },
          backgroundColor: "rgba(217, 217, 217, 0.21)",
          marginBottom: "5px",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: "#666" }} />}
          sx={{
            minHeight: 48,
            px: 2,
            py: 1,
            "&.Mui-expanded": {
              minHeight: 48,
            },
            "& .MuiAccordionSummary-content": {
              margin: "8px 0",
              "&.Mui-expanded": {
                margin: "8px 0",
              },
            },
          }}
        >
          <Skeleton
            variant="text"
            width={80}
            height={20}
            sx={{ backgroundColor: "#f0f0f0" }}
          />
        </AccordionSummary>
        <AccordionDetails sx={{ px: 2, py: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Skeleton
                  variant="rectangular"
                  width={16}
                  height={16}
                  sx={{ backgroundColor: "#f0f0f0" }}
                />
                <Skeleton
                  variant="text"
                  width="75%"
                  height={16}
                  sx={{ backgroundColor: "#f0f0f0" }}
                />
              </Box>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Country Filter Shimmer */}
      <Accordion
        defaultExpanded
        sx={{
          boxShadow: "none",
          "&:before": { display: "none" },
          backgroundColor: "rgba(217, 217, 217, 0.21)",
          marginBottom: "5px",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: "#666" }} />}
          sx={{
            minHeight: 48,
            px: 2,
            py: 1,
            "&.Mui-expanded": {
              minHeight: 48,
            },
            "& .MuiAccordionSummary-content": {
              margin: "8px 0",
              "&.Mui-expanded": {
                margin: "8px 0",
              },
            },
          }}
        >
          <Skeleton
            variant="text"
            width={120}
            height={20}
            sx={{ backgroundColor: "#f0f0f0" }}
          />
        </AccordionSummary>
        <AccordionDetails sx={{ px: 2, py: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Skeleton
                  variant="rectangular"
                  width={16}
                  height={16}
                  sx={{ backgroundColor: "#f0f0f0" }}
                />
                <Skeleton
                  variant="text"
                  width="85%"
                  height={16}
                  sx={{ backgroundColor: "#f0f0f0" }}
                />
              </Box>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FilterShimmerLoader;
