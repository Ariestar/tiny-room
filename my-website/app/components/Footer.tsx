import { useState, useEffect } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useScroll } from "../hooks/useScroll";

export default function Footer() {
  const year = new Date().getFullYear();
  const { isAtBottom, isScrollingUp } = useScroll();
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    if (isAtBottom) {
      setShowFooter(true);
    } else if (isScrollingUp) {
      setShowFooter(false);
    }
  }, [isAtBottom, isScrollingUp]);

  return (
    <AnimatePresence>
      {showFooter && (
        <motion.footer
          className="site-footer"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        >
          <div className="container">
            <p className="copyright">© {year} My Portfolio. All rights reserved.</p>
            <div className="social-links">
              <a
                href="https://github.com/your-username"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/your-username/"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </motion.footer>
      )}
    </AnimatePresence>
  );
} 