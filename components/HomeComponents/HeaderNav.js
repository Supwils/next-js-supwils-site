import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./HeaderNav.module.css";
import dynamic from "next/dynamic";
import Link from "next/link";
import ModeSwitch from "./ModeSwitch";
import AdminLoginModal from "./AdminLoginModal"; // Import the modal component we'll create

const HeaderNav = () =>
{
  const Translate = dynamic(() => import("./Translate"), { ssr: false });
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Add state for admin authentication status
  const [isAdmin, setIsAdmin] = useState(false);

  // Add state for the admin login modal
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Add notification state
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const toggleMenu = () =>
  {
    setIsOpen(!isOpen);
  };

  // Function to handle opening/closing the admin modal
  const toggleAdminModal = () =>
  {
    setShowAdminModal(!showAdminModal);
  };

  // Function to show notification
  const showNotification = (message, type = 'success') =>
  {
    setNotification({ show: true, message, type });
    // Auto-hide after 3 seconds
    setTimeout(() =>
    {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Check admin authentication
  useEffect(() =>
  {
    const checkAuthStatus = async () =>
    {
      try
      {
        const response = await fetch('/api/auth/check-auth', {
          credentials: 'include', // Sends cookies with the request
        });

        const data = await response.json();
        setIsAdmin(data.isAuthenticated);
      } catch (error)
      {
        console.error('Auth check failed:', error);
        setIsAdmin(false);
      }
    };

    checkAuthStatus();

    // Listen for login success events
    const handleLoginSuccess = () =>
    {
      // Set a short timeout to ensure this runs after auth state is updated
      setTimeout(() =>
      {
        checkAuthStatus(); // Refresh the auth state
        showNotification('Login successful!');
      }, 100);
    };

    // Listen for the custom event from AdminLoginModal
    window.addEventListener('loginSuccess', handleLoginSuccess);

    return () =>
    {
      window.removeEventListener('loginSuccess', handleLoginSuccess);
    };
  }, []);

  // Handle logout
  const handleAdminLogout = async () =>
  {
    try
    {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      setIsAdmin(false);
      showNotification('Logout successful!');
      router.push('/');
    } catch (error)
    {
      console.error('Logout failed:', error);
      showNotification('Logout failed!', 'error');
    }
  };

  // Direct navigation function for BlogAdmin
  const navigateToBlogAdmin = (e) =>
  {
    e.preventDefault();
    console.log("Attempting to navigate to BlogAdmin page");

    // Use window.location for direct navigation
    window.location.href = '/BlogAdmin';
  };

  // 定义需要启用 Translate 的页面路径
  const pagesWithTranslate = ["/", "/#home"]; // 在这些页面显示 Translate

  return (
    <>
      {/* Notification Toast */}
      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          Swil.
        </Link>

        {/* Hamburger Icon */}
        <div
          className={styles.menuIcon}
          onClick={toggleMenu}
        >
          ☰
        </div>

        {/* Navbar Links */}
        <nav className={`${styles.navbar} ${isOpen ? styles.navbarOpen : ""}`}>
          <Link href="/#home" className={styles.active}>
            Home
          </Link>

          <div className={styles.dropdown}>
            <button className={styles.dropbtn}>
              Me <span className={styles.emojiDefault}>🙈</span><span className={styles.emojiHover}>🙉</span>
            </button>
            <div className={styles.dropdownContent}>
              <Link href="/#about">About</Link>
              <Link href="/#experience">Experience</Link>
              <Link href="/#contact">Contact</Link>
              {isAdmin ? (
                <button className={styles.adminBtn} onClick={handleAdminLogout}>Admin Logout</button>
              ) : (
                <button className={styles.adminBtn} onClick={toggleAdminModal}>Admin Login</button>
              )}
            </div>
          </div>

          <div className={styles.dropdown}>
            <button className={styles.dropbtn}>
              Explore <span className={styles.emojiDefault}>🤐</span><span className={styles.emojiHover}>😆</span>
            </button>
            <div className={styles.dropdownContent}>
              <Link href="/Blog">Blogs</Link>
              <Link href="/Project">Projects</Link>
              <Link href="/Resource">Resources</Link>
              {isAdmin && (
                <a href="/BlogAdmin" className={styles.adminLink} onClick={navigateToBlogAdmin}>Blog Admin</a>
              )}
            </div>

          </div>
          <ModeSwitch />
          {/* 仅在特定页面渲染 Translate */}
          {pagesWithTranslate.includes(router.pathname) && <Translate />}
        </nav>
      </header>

      {/* Admin Login Modal */}
      {showAdminModal && <AdminLoginModal onClose={toggleAdminModal} />}
    </>
  );
};

export default HeaderNav;