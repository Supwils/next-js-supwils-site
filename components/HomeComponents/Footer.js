import styles from './Footer.module.css'; // Make sure to create and import the CSS file for styling

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footer_text}>
                <p>Copyright &copy; 2024 by Supwils | All Rights Reserved.</p>
            </div>
            <div className={styles.footer_iconTop}>
                <a href="#home"><i className='bx bx-up-arrow-alt'></i></a>
            </div>
        </footer>
    );
};

export default Footer;