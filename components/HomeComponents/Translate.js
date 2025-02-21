import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Translate = () => {
    const { t, i18n } = useTranslation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleClick = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleClose = () => {
        setIsMenuOpen(false);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        handleClose();
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                className="translate-button"
                onClick={handleClick}
            >
                {t('translate')}
            </button>
            {isMenuOpen && ( 
                <div className="menu">
                    <div className="menu-item" onClick={() => changeLanguage('en')}>
                        ENG
                    </div>
                    <div className="menu-item" onClick={() => changeLanguage('zh')}>
                        CN
                    </div>
                </div>
            )}
        </div>
    );
};

export default Translate;