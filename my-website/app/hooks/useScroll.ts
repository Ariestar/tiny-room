import { useState, useEffect, useCallback } from "react";

export function useScroll() {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // A more robust check for being at the bottom of the page
    // It's "at the bottom" if the scroll position is within a small delta of the max scroll
    const isNowAtBottom = Math.abs(docHeight - (currentScrollY + windowHeight)) < 2;
    setIsAtBottom(isNowAtBottom);

    // Check scroll direction
    if (currentScrollY > lastScrollY) {
      setIsScrollingUp(false);
    } else if (currentScrollY < lastScrollY) {
      setIsScrollingUp(true);
    }
    // No change if currentScrollY === lastScrollY

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return { isAtBottom, isScrollingUp };
} 