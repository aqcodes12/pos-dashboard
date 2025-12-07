import { useEffect } from "react";
import { useLocation } from "react-router-dom";
const ScrollToTop = () => {
  const { pathname } = useLocation(); // Get the current path
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll effect
    });
  }, [pathname]); // Trigger effect when the path changes
  return null; // This component doesn't render anything
};
export default ScrollToTop;
