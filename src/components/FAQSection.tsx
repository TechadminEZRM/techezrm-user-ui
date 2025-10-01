import React, { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton,
  Alert,
  styled,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { FAQ } from "../api/services/faqs";

interface FAQSectionProps {
  faqs: FAQ[];
  isLoading: boolean;
  error: any;
}

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
  border: "1px solid rgba(255, 107, 53, 0.1)",
  borderRadius: "12px",
  marginBottom: "16px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  transition: "all 0.3s ease",
  overflow: "hidden",

  "&:before": {
    display: "none",
  },

  "&:hover": {
    borderColor: "rgba(255, 107, 53, 0.3)",
    boxShadow: "0 8px 24px rgba(255, 107, 53, 0.12)",
    transform: "translateY(-2px)",
  },

  "&.Mui-expanded": {
    background: "linear-gradient(135deg, #fff8f6 0%, #fff5f2 100%)",
    borderColor: "rgba(255, 107, 53, 0.4)",
    boxShadow: "0 12px 32px rgba(255, 107, 53, 0.15)",
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: "20px 24px",
  minHeight: "64px",

  "& .MuiAccordionSummary-content": {
    margin: "0",
    alignItems: "center",
  },

  "& .MuiAccordionSummary-expandIconWrapper": {
    color: "#ff6b35",
    transition: "all 0.3s ease",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255, 107, 53, 0.1)",

    "&:hover": {
      background: "rgba(255, 107, 53, 0.2)",
      transform: "scale(1.1)",
    },
  },

  "&.Mui-expanded .MuiAccordionSummary-expandIconWrapper": {
    background: "rgba(255, 107, 53, 0.2)",
    transform: "rotate(180deg)",
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: "0 24px 24px",
  background: "rgba(255, 107, 53, 0.02)",
  borderTop: "1px solid rgba(255, 107, 53, 0.08)",
}));

const FAQSection: React.FC<FAQSectionProps> = ({ faqs, isLoading, error }) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  if (isLoading) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h5"
          fontWeight={600}
          color="primary"
          sx={{ mb: 3, textAlign: "center" }}
        >
          Frequently Asked Questions
        </Typography>
        {[...Array(4)].map((_, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Skeleton
              variant="rectangular"
              height={64}
              sx={{ borderRadius: 2, mb: 1 }}
            />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="70%" />
          </Box>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          Failed to load FAQs. Please try again later.
        </Alert>
      </Box>
    );
  }

  if (!faqs || faqs.length === 0) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography
          variant="h5"
          fontWeight={600}
          color="primary"
          sx={{ mb: 2 }}
        >
          Frequently Asked Questions
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontStyle: "italic" }}
        >
          No FAQs available for this product yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h5"
        fontWeight={600}
        color="primary"
        sx={{
          mb: 3,
          // textAlign: "center",
          background: "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: { xs: "1.5rem", md: "1.75rem" },
        }}
      >
        Frequently Asked Questions
      </Typography>

      <Box sx={{ maxWidth: 800}}>
        {faqs.map((faq, index) => (
          <StyledAccordion
            key={faq._id}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            sx={{
              "&:first-of-type": {
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
              },
              "&:last-of-type": {
                borderBottomLeftRadius: "12px",
                borderBottomRightRadius: "12px",
              },
            }}
          >
            <StyledAccordionSummary
              expandIcon={
                expanded === `panel${index}` ? (
                  <Remove sx={{ fontSize: 20, color: "#ff6b35" }} />
                ) : (
                  <Add sx={{ fontSize: 20, color: "#ff6b35" }} />
                )
              }
              aria-controls={`panel${index}bh-content`}
              id={`panel${index}bh-header`}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  color: expanded === `panel${index}` ? "#ff6b35" : "#333",
                  transition: "color 0.3s ease",
                  lineHeight: 1.4,
                }}
              >
                {faq.question}
              </Typography>
            </StyledAccordionSummary>

            <StyledAccordionDetails>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.7,
                  color: "#555",
                  fontSize: "0.95rem",
                  fontWeight: 400,
                  "& p": {
                    marginBottom: "12px",
                    "&:last-child": {
                      marginBottom: 0,
                    },
                  },
                }}
              >
                {faq.answer}
              </Typography>
            </StyledAccordionDetails>
          </StyledAccordion>
        ))}
      </Box>
    </Box>
  );
};

export default FAQSection;
