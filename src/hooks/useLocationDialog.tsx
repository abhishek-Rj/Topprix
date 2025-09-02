import { useState, useEffect } from "react";
import useAuthenticate from "./authenticationt";

export default function useLocationDialog() {
  const { user, userRole, userLatitude, userLongitude, loading } =
    useAuthenticate();
  const [showLocationDialog, setShowLocationDialog] = useState(false);

  useEffect(() => {
    if (loading) return;

    // Check if we've already shown the dialog for this session
    const hasShownDialog = localStorage.getItem("locationDialogShown");
    if (hasShownDialog === "true") {
      return;
    }

    // Check if location dialog should be shown
    const shouldShowDialog = () => {
      // Only for logged in USER role
      if (user && userRole === "USER") {
        // Check if user has explicitly skipped location
        const hasSkippedLocation = localStorage.getItem("userSkippedLocation");
        if (hasSkippedLocation === "true") {
          return false;
        }

        // Check if user latitude and longitude are null or empty
        if (!userLatitude || !userLongitude) {
          return true;
        }
      }

      return false;
    };

    if (shouldShowDialog()) {
      setShowLocationDialog(true);
      // Mark that we've shown the dialog for this session
      localStorage.setItem("locationDialogShown", "true");
    }
  }, [user, userRole, userLatitude, userLongitude, loading]);

  const handleLocationSet = () => {
    setShowLocationDialog(false);
  };

  const handleCloseDialog = () => {
    setShowLocationDialog(false);
  };

  return {
    showLocationDialog,
    handleLocationSet,
    handleCloseDialog,
  };
}
