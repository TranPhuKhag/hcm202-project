import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";
import { BookOpen } from "lucide-react";

const Navigation: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="icon-container">
          <BookOpen className="book-icon" />
        </div>
        <h1 className="nav-title">Tư Tưởng Hồ Chí Minh</h1>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Navigation Menu */}
        <ul className={`nav-menu ${isMobileMenuOpen ? "mobile-open" : ""}`}>
          <li>
            <Link
              to="/lesson"
              className={
                location.pathname === "/lesson" || location.pathname === "/"
                  ? "nav-link active"
                  : "nav-link"
              }
              onClick={closeMobileMenu}
            >
              Giới Thiệu Bài Học
            </Link>
          </li>
          <li>
            <Link
              to="/quiz"
              className={
                location.pathname === "/quiz" ? "nav-link active" : "nav-link"
              }
              onClick={closeMobileMenu}
            >
              Kiểm Tra Kiến Thức
            </Link>
          </li>
          <li>
            <Link
              to="/leaderboard"
              className={
                location.pathname === "/leaderboard"
                  ? "nav-link active"
                  : "nav-link"
              }
              onClick={closeMobileMenu}
            >
              Bảng Xếp Hạng
            </Link>
          </li>
          <li>
            <Link
              to="/chatbot"
              className={
                location.pathname === "/chatbot"
                  ? "nav-link active"
                  : "nav-link"
              }
              onClick={closeMobileMenu}
            >
              Hỏi Đáp AI
            </Link>
          </li>
        </ul>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-overlay show" onClick={closeMobileMenu}></div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
