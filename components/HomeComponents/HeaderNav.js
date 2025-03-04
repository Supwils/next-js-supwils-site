import { useState } from "react";
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
  
  // Add state for the admin login modal
  const [showAdminModal, setShowAdminModal] = useState(false);

  const toggleMenu = () =>
  {
    setIsOpen(!isOpen);
  };

  // Function to handle opening/closing the admin modal
  const toggleAdminModal = () => {
    setShowAdminModal(!showAdminModal);
  };

  // 定义需要启用 Translate 的页面路径
  const pagesWithTranslate = ["/", "/#home"]; // 在这些页面显示 Translate

  return (
    <>
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
              <button className={styles.adminBtn} onClick={toggleAdminModal}>Admin Login</button>
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
              <Link href="/BlogTest">BlogTest</Link>
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