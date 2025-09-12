/**
 * Utility functions for consistent date formatting across server and client
 */

export const formatDate = (date: string | Date | undefined | null): string => {
  // Handle undefined, null, or empty string
  if (!date) return "N/A";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) return "N/A";

  // Use a consistent format that works the same on server and client
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const day = dateObj.getDate();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${monthNames[month]} ${day}, ${year}`;
};

export const formatDateShort = (date: string | Date | undefined | null): string => {
  // Handle undefined, null, or empty string
  if (!date) return "N/A";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) return "N/A";

  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const day = dateObj.getDate();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${monthNames[month]} ${day}`;
};

export const formatDateLong = (date: string | Date | undefined | null): string => {
  // Handle undefined, null, or empty string
  if (!date) return "N/A";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) return "N/A";

  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const day = dateObj.getDate();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${monthNames[month]} ${day}, ${year}`;
};
