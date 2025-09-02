import { useState, useEffect } from "react";
import useAuthenticate from "./authenticationt";

export default function useLocationLoginPrompt() {
  const { user, loading } = useAuthenticate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (loading) return;

    // Check if we've already shown the prompt for this session
    const hasShownPrompt = localStorage.getItem("locationLoginPromptShown");
    if (hasShownPrompt === "true") {
      return;
    }

    // Show prompt for non-logged in users
    if (!user) {
      setShowLoginPrompt(true);
      // Mark that we've shown the prompt for this session
      localStorage.setItem("locationLoginPromptShown", "true");
    }
  }, [user, loading]);

  const handleClosePrompt = () => {
    setShowLoginPrompt(false);
  };

  return {
    showLoginPrompt,
    handleClosePrompt,
  };
}
