import type React from "react";

const CurvedSection: React.FC = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
        <path d="M0,120 C300,60 900,60 1200,120 L1200,120 L0,120 Z" fill="white" />
      </svg>
    </div>
  );
};

export default CurvedSection;
