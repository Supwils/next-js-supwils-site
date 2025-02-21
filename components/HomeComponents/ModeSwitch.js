// supwils_site/components/HomeComponents/ModeSwitch.js

import { useEffect, useState } from 'react';
import styles from './ModeSwitch.module.css';
import {Icon} from '@iconify/react';
const ModeSwitch = () => {
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    const root = window.document.documentElement;
    const initialTheme = localStorage.getItem('theme') || 'system';
    setTheme(initialTheme);
    applyTheme(initialTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const applyTheme = (theme) => {
    const root = window.document.documentElement;
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <div className={styles.dropdown}>
      <button className={styles.dropbtn}>
        <Icon icon="entypo:light-up" className="translate-y-0.5" />
        {/* Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)} */}
      </button>
      <div className={styles.dropdownContent}>
        <button onClick={() => handleThemeChange('light')}>Light</button>
        <button onClick={() => handleThemeChange('dark')}>Dark</button>
        <button onClick={() => handleThemeChange('system')}>System</button>
      </div>
    </div>
  );
};

export default ModeSwitch;