import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useAuthenticate from "./authenticationt";

export default function useLocationLoginPrompt() {
  const { user, loading } = useAuthenticate();
  const location = useLocation();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (loading) return;

    // Clear the flag when user navigates away from home page
    if (location.pathname !== "/") {
      localStorage.removeItem("locationLoginPromptShown");
      setShowLoginPrompt(false);
      return;
    }

    // Check if we've already shown the prompt for this session
    const hasShownPrompt = localStorage.getItem("locationLoginPromptShown");
    if (hasShownPrompt === "true") {
      return;
    }

    // Show prompt for non-logged in users only on home page
    if (!user) {
      setShowLoginPrompt(true);
      // Mark that we've shown the prompt for this session
      localStorage.setItem("locationLoginPromptShown", "true");
    }
  }, [user, loading, location.pathname]);

  const handleClosePrompt = () => {
    setShowLoginPrompt(false);
  };

  return {
    showLoginPrompt,
    handleClosePrompt,
  };
}
