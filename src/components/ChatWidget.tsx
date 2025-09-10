"use client";

import { useEffect, useState } from "react";
import { useCompanyDetails } from "@/hooks/use-company-details";
import { useAppStore } from "@/store/use-app-store";

declare global {
  interface Window {
    initNoupeWidget: (config: any) => void;
  }
}

const ChatWidget: React.FC = () => {
  const { companyDetails, loading: companyLoading } = useCompanyDetails();
  const { customer, isAuthenticated } = useAppStore();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [widgetInitialized, setWidgetInitialized] = useState(false);

  useEffect(() => {
    console.log("ChatWidget: Component mounted", {
      companyDetails: !!companyDetails,
      customer: !!customer,
      isAuthenticated,
      companyLoading,
    });

    // Check if script is already loaded
    if (typeof window.initNoupeWidget === "function") {
      console.log("ChatWidget: Script already available");
      setScriptLoaded(true);
      initializeWidget();
      return;
    }

    // Load the noupe.com chat widget script
    const loadScript = () => {
      // Create script element for noupe.com chat widget
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "https://www.noupe.com/embed/01990a23106070eda6a2a9924c06b4f03856.js";
      script.async = true;

      script.onload = () => {
        console.log("ChatWidget: Noupe script loaded successfully");
        setScriptLoaded(true);
        setScriptError(null);

        // Wait a bit for the script to fully initialize
        setTimeout(() => {
          if (typeof window.initNoupeWidget === "function") {
            initializeWidget();
          } else {
            console.error(
              "ChatWidget: Script loaded but initNoupeWidget function not found"
            );
            setScriptError(
              "Script loaded but initialization function not found"
            );
          }
        }, 500);
      };

      script.onerror = () => {
        console.error(
          "ChatWidget: Failed to load noupe.com chat widget script"
        );
        setScriptError("Failed to load noupe.com chat widget script");
      };

      // Add the noupe script to document head
      document.head.appendChild(script);
    };

    loadScript();

    // Cleanup function
    return () => {
      // Note: We don't remove the script as it might be used by other components
    };
  }, []);

  // Re-initialize when dependencies change
  useEffect(() => {
    if (
      scriptLoaded &&
      !widgetInitialized &&
      companyDetails &&
      !companyLoading
    ) {
      console.log("ChatWidget: Dependencies changed, re-initializing");
      initializeWidget();
    }
  }, [
    scriptLoaded,
    widgetInitialized,
    companyDetails,
    companyLoading,
    customer,
    isAuthenticated,
  ]);

  const initializeWidget = () => {
    try {
      if (typeof window.initNoupeWidget !== "function") {
        console.error("ChatWidget: initNoupeWidget function not available");
        return;
      }

      const noupeConfig = {
        // Basic configuration for noupe widget
        enabled: true,
        position: "bottom-right",
        theme: "light",
        // Add any other configuration options that noupe widget supports
      };

      console.log(
        "ChatWidget: Initializing noupe widget with config",
        noupeConfig
      );

      // Initialize the noupe widget
      window.initNoupeWidget(noupeConfig);
      setWidgetInitialized(true);
      console.log("ChatWidget: Noupe widget initialized successfully");
    } catch (error) {
      console.error("ChatWidget: Error initializing noupe chat widget:", error);
      setScriptError(`Initialization error: ${error}`);
    }
  };

  // Debug information in development
  if (process.env.NODE_ENV === "development") {
    console.log("ChatWidget: Render state", {
      scriptLoaded,
      scriptError,
      widgetInitialized,
      companyDetails: !!companyDetails,
      customer: !!customer,
      isAuthenticated,
      companyLoading,
    });
  }

  // Show debug info in development mode
  // if (process.env.NODE_ENV === "development") {
  //   return (
  //     <div
  //       style={{
  //         position: "fixed",
  //         bottom: "20px",
  //         right: "20px",
  //         background: "#f0f0f0",
  //         border: "1px solid #ccc",
  //         padding: "10px",
  //         borderRadius: "5px",
  //         fontSize: "12px",
  //         zIndex: 9999,
  //         maxWidth: "200px",
  //       }}
  //     >
  //       <strong>Chat Widget Debug:</strong>
  //       <br />
  //       Script: {scriptLoaded ? "✅" : "❌"}
  //       <br />
  //       Widget: {widgetInitialized ? "✅" : "❌"}
  //       <br />
  //       Company: {companyDetails ? "✅" : "❌"}
  //       <br />
  //       Customer: {customer ? "✅" : "❌"}
  //       <br />
  //       {scriptError && (
  //         <span style={{ color: "red" }}>Error: {scriptError}</span>
  //       )}
  //       <br />
  //       <br />
  //       <button
  //         onClick={() => {
  //           console.log("Manual initialization attempt");
  //           if (typeof window.initNoupeWidget === "function") {
  //             initializeWidget();
  //           } else {
  //             console.log("initNoupeWidget not available");
  //           }
  //         }}
  //         style={{
  //           background: "#007bff",
  //           color: "white",
  //           border: "none",
  //           padding: "5px 10px",
  //           borderRadius: "3px",
  //           cursor: "pointer",
  //         }}
  //       >
  //         Test Widget
  //       </button>
  //     </div>
  //   );
  // }

  // This component doesn't render anything visible
  return null;
};

export default ChatWidget;
