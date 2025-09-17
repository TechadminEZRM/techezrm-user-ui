import React, { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
  IconButton,
} from "@mui/material";
import { ExpandMore, Download, Lock } from "@mui/icons-material";

interface Document {
  name: string;
  expiryDate?: string;
  isLocked?: boolean;
}

interface DocumentCategory {
  title: string;
  count: number;
  documents: Document[];
}

interface CompanyDocumentsSectionProps {
  companySpecific: string;
  facilitySpecific: string;
  productSpecific: string;
  batchSpecific: string;
  onCompanySpecificChange: (value: string) => void;
  onFacilitySpecificChange: (value: string) => void;
  onProductSpecificChange: (value: string) => void;
  onBatchSpecificChange: (value: string) => void;
}

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
  border: "1px solid rgba(255, 107, 53, 0.1)",
  borderRadius: "8px",
  marginBottom: "12px",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.04)",
  transition: "all 0.3s ease",
  overflow: "hidden",

  "&:before": {
    display: "none",
  },

  "&:hover": {
    borderColor: "rgba(255, 107, 53, 0.25)",
    boxShadow: "0 6px 20px rgba(255, 107, 53, 0.1)",
    transform: "translateY(-1px)",
  },

  "&.Mui-expanded": {
    background: "linear-gradient(135deg, #fff8f6 0%, #fff5f2 100%)",
    borderColor: "rgba(255, 107, 53, 0.3)",
    boxShadow: "0 8px 24px rgba(255, 107, 53, 0.12)",
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: "12px 16px",
  minHeight: "48px",

  "& .MuiAccordionSummary-content": {
    margin: "0",
    alignItems: "center",
  },

  "& .MuiAccordionSummary-expandIconWrapper": {
    color: "#ff6b35",
    transition: "all 0.3s ease",
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255, 107, 53, 0.1)",
    fontSize: "16px",

    "&:hover": {
      background: "rgba(255, 107, 53, 0.2)",
      transform: "scale(1.05)",
    },
  },

  "&.Mui-expanded .MuiAccordionSummary-expandIconWrapper": {
    background: "rgba(255, 107, 53, 0.2)",
    transform: "rotate(180deg)",
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: "0 16px 16px",
  background: "rgba(255, 107, 53, 0.02)",
  borderTop: "1px solid rgba(255, 107, 53, 0.08)",
}));

const DocumentRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 12px",
  marginBottom: "6px",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  borderRadius: "6px",
  border: "1px solid rgba(255, 107, 53, 0.05)",
  transition: "all 0.2s ease",

  "&:hover": {
    backgroundColor: "rgba(255, 107, 53, 0.05)",
    borderColor: "rgba(255, 107, 53, 0.1)",
    transform: "translateX(4px)",
  },

  "&:last-child": {
    marginBottom: 0,
  },
}));

const DocumentInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flex: 1,
}));

const DocumentName = styled(Typography)(({ theme }) => ({
  fontSize: "12px",
  fontWeight: 500,
  color: "#333",
  lineHeight: 1.4,
}));

const DocumentExpiry = styled(Typography)(({ theme }) => ({
  fontSize: "10px",
  color: "#666",
  fontStyle: "italic",
}));

const DownloadButton = styled(IconButton)(({ theme }) => ({
  fontSize: "12px",
  padding: "4px 8px",
  minWidth: "70px",
  height: "24px",
  backgroundColor: "rgba(255, 107, 53, 0.1)",
  color: "#ff6b35",
  borderRadius: "4px",
  transition: "all 0.2s ease",

  "&:hover": {
    backgroundColor: "rgba(255, 107, 53, 0.2)",
    transform: "scale(1.05)",
  },

  "& .MuiSvgIcon-root": {
    fontSize: "12px",
  },
}));

const CompanyDocumentsSection: React.FC<CompanyDocumentsSectionProps> = ({
  companySpecific,
  facilitySpecific,
  productSpecific,
  batchSpecific,
  onCompanySpecificChange,
  onFacilitySpecificChange,
  onProductSpecificChange,
  onBatchSpecificChange,
}) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const documentCategories: DocumentCategory[] = [
    {
      title: "Company Specific Documents",
      count: 3,
      documents: [
        { name: "Business License", expiryDate: "14-08-2026" },
        { name: "Certificate of Registration", expiryDate: "04-12-2050" },
        { name: "Fair Trade Certificate", expiryDate: "11-09-2027" },
      ],
    },
    {
      title: "Facility Specific Documents",
      count: 1,
      documents: [{ name: "FDA Registration", expiryDate: "31-12-2026" }],
    },
    {
      title: "Product Specific Documents",
      count: 4,
      documents: [
        { name: "BSE-TSE Statement", expiryDate: "24-12-2026" },
        { name: "Non GMO Statement/Certificate", expiryDate: "24-12-2026" },
        { name: "Pesticide Statement/Report", expiryDate: "24-12-2026" },
        { name: "Vegan/Vegetarian Statement", expiryDate: "24-12-2026" },
      ],
    },
    {
      title: "Batch Specific Documents",
      count: 5,
      documents: [
        { name: "Certificate of Analysis (COA)", isLocked: true },
        { name: "Specification Sheet", isLocked: true },
        { name: "Composition Statement", isLocked: true },
        { name: "MSDS Statement", isLocked: true },
        { name: "COO Statement", isLocked: true },
      ],
    },
  ];

  return (
    <Box sx={{ mt: 4, mb: 3 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 3,
          fontSize: { xs: "1.1rem", md: "1.2rem" },
          color: "#333",
          textAlign: "left",
        }}
      >
        Company Specific Documents
      </Typography>

      {documentCategories.map((category, index) => (
        <StyledAccordion
          key={index}
          expanded={expanded === `panel${index}`}
          onChange={handleChange(`panel${index}`)}
        >
          <StyledAccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls={`panel${index}bh-content`}
            id={`panel${index}bh-header`}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#333",
                }}
              >
                {category.title}
              </Typography>
              <Box
                sx={{
                  backgroundColor: "rgba(255, 107, 53, 0.1)",
                  color: "#ff6b35",
                  px: 1,
                  py: 0.5,
                  borderRadius: "12px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  minWidth: "24px",
                  textAlign: "center",
                }}
              >
                {category.count}
              </Box>
            </Box>
          </StyledAccordionSummary>

          <StyledAccordionDetails>
            <Box sx={{ pt: 1 }}>
              {category.documents.map((document, docIndex) => (
                <DocumentRow key={docIndex}>
                  <DocumentInfo>
                    {document.isLocked && (
                      <Lock sx={{ fontSize: "12px", color: "#ff6b35" }} />
                    )}
                    <Box>
                      <DocumentName>{document.name}</DocumentName>
                      {document.expiryDate && (
                        <DocumentExpiry>
                          Expires: {document.expiryDate}
                        </DocumentExpiry>
                      )}
                    </Box>
                  </DocumentInfo>
                  <DownloadButton size="small">
                    <Download sx={{ fontSize: "12px" }} />
                  </DownloadButton>
                </DocumentRow>
              ))}
            </Box>
          </StyledAccordionDetails>
        </StyledAccordion>
      ))}
    </Box>
  );
};

export default CompanyDocumentsSection;
