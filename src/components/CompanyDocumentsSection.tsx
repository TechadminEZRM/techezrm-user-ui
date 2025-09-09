import React, { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  styled,
} from "@mui/material";
import { ExpandMore, Lock, Download } from "@mui/icons-material";

interface Document {
  id: string;
  name: string;
  expiryDate: string;
  isLocked: boolean;
}

interface DocumentCategory {
  id: string;
  title: string;
  description: string;
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
  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.04)",
  transition: "all 0.3s ease",
  overflow: "hidden",

  "&:before": {
    display: "none",
  },

  "&:hover": {
    borderColor: "rgba(255, 107, 53, 0.3)",
    boxShadow: "0 4px 12px rgba(255, 107, 53, 0.12)",
    transform: "translateY(-1px)",
  },

  "&.Mui-expanded": {
    background: "linear-gradient(135deg, #fff8f6 0%, #fff5f2 100%)",
    borderColor: "rgba(255, 107, 53, 0.4)",
    boxShadow: "0 6px 16px rgba(255, 107, 53, 0.15)",
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
    width: "24px",
    height: "24px",
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
  padding: "0",
  background: "rgba(255, 107, 53, 0.02)",
  borderTop: "1px solid rgba(255, 107, 53, 0.08)",
}));

const DocumentRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 16px",
  backgroundColor: "#f8f9fa",
  borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
  "&:last-child": {
    borderBottom: "none",
  },
}));

const DocumentInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
}));

const DocumentText = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
}));

const DocumentName = styled(Typography)(({ theme }) => ({
  fontSize: "13px",
  fontWeight: 600,
  color: "#333",
  margin: 0,
  lineHeight: 1.3,
}));

const DocumentExpiry = styled(Typography)(({ theme }) => ({
  fontSize: "11px",
  color: "#666",
  margin: 0,
  lineHeight: 1.2,
}));

const DownloadButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#4caf50",
  color: "white",
  fontSize: "11px",
  fontWeight: 600,
  textTransform: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  minWidth: "80px",
  height: "28px",
  "&:hover": {
    backgroundColor: "#45a049",
  },
  "& .MuiButton-startIcon": {
    marginRight: "3px",
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
  const [expanded, setExpanded] = useState<string | false>("panel0");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleDownload = (documentId: string, documentName: string) => {
    // Handle document download
    console.log(`Downloading document: ${documentName} (${documentId})`);
    // You can implement actual download logic here
  };

  const documentCategories: DocumentCategory[] = [
    {
      id: "company",
      title: "Company Specific Documents",
      description:
        "Corporate documents, certifications, and company-wide policies",
      documents: [
        {
          id: "business-license",
          name: "Business License",
          expiryDate: "14-08-2026",
          isLocked: true,
        },
        {
          id: "certificate-registration",
          name: "Certificate of Registration",
          expiryDate: "04-12-2050",
          isLocked: true,
        },
        {
          id: "fair-trade-cert",
          name: "Fair Trade Certificate",
          expiryDate: "11-09-2027",
          isLocked: true,
        },
      ],
    },
    {
      id: "facility",
      title: "Facility Specific Documents",
      description:
        "Manufacturing facility certifications and operational documents",
      documents: [
        {
          id: "fda-registration",
          name: "FDA Registration",
          expiryDate: "31-12-2026",
          isLocked: true,
        },
      ],
    },
    {
      id: "product",
      title: "Product Specific Documents",
      description:
        "Product specifications, test reports, and quality certificates",
      documents: [
        {
          id: "bse-tse-statement",
          name: "BSE-TSE Statement",
          expiryDate: "24-12-2026",
          isLocked: true,
        },
        {
          id: "non-gmo-statement",
          name: "Non GMO Statement/Certificate",
          expiryDate: "24-12-2026",
          isLocked: true,
        },
        {
          id: "pesticide-statement",
          name: "Pesticide Statement/Report",
          expiryDate: "24-12-2026",
          isLocked: true,
        },
        {
          id: "vegan-vegetarian-statement",
          name: "Vegan/Vegetarian Statement",
          expiryDate: "24-12-2026",
          isLocked: true,
        },
      ],
    },
    {
      id: "batch",
      title: "Batch Specific Documents",
      description:
        "Batch-specific certificates, test results, and traceability documents",
      documents: [
        {
          id: "coa",
          name: "Certificate of Analysis (COA)",
          expiryDate: "",
          isLocked: true,
        },
        {
          id: "specification-sheet",
          name: "Specification Sheet",
          expiryDate: "",
          isLocked: true,
        },
        {
          id: "composition-statement",
          name: "Composition Statement",
          expiryDate: "",
          isLocked: true,
        },
        {
          id: "msds-statement",
          name: "MSDS Statement",
          expiryDate: "",
          isLocked: true,
        },
        {
          id: "coo-statement",
          name: "COO Statement",
          expiryDate: "",
          isLocked: true,
        },
      ],
    },
  ];

  return (
    <Box sx={{ mt: 6, mb: 4 }}>
      <Typography
        variant="h6"
        fontWeight={600}
        color="primary"
        sx={{
          mb: 4,
          textAlign: "center",
          background: "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: { xs: "1.2rem", md: "1.3rem" },
        }}
      >
        {/* All Product Documents */}
      </Typography>

      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        {documentCategories.map((category, index) => (
          <StyledAccordion
            key={category.id}
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
                <ExpandMore sx={{ fontSize: 16, color: "#ff6b35" }} />
              }
              aria-controls={`panel${index}bh-content`}
              id={`panel${index}bh-header`}
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    color: expanded === `panel${index}` ? "#ff6b35" : "#333",
                    transition: "color 0.3s ease",
                    lineHeight: 1.3,
                    mb: 0.3,
                  }}
                >
                  {category.title} ({category.documents.length})
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    fontSize: "0.75rem",
                    lineHeight: 1.2,
                  }}
                >
                  {category.description}
                </Typography>
              </Box>
            </StyledAccordionSummary>

            <StyledAccordionDetails>
              {category.documents.map((document) => (
                <DocumentRow key={document.id}>
                  <DocumentInfo>
                    {document.isLocked && (
                      <Lock sx={{ fontSize: 14, color: "#4caf50" }} />
                    )}
                    <DocumentText>
                      <DocumentName>{document.name}</DocumentName>
                      {document.expiryDate && (
                        <DocumentExpiry>
                          Expires: {document.expiryDate}
                        </DocumentExpiry>
                      )}
                    </DocumentText>
                  </DocumentInfo>
                  <DownloadButton
                    startIcon={<Download sx={{ fontSize: 14 }} />}
                    onClick={() => handleDownload(document.id, document.name)}
                  >
                    Download
                  </DownloadButton>
                </DocumentRow>
              ))}
            </StyledAccordionDetails>
          </StyledAccordion>
        ))}
      </Box>
    </Box>
  );
};

export default CompanyDocumentsSection;
