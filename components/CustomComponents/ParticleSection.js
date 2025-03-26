import React from 'react';
import ParticleBackground from './ParticleBackground';
import styles from './ParticleSection.module.css';

/**
 * ParticleSection Component
 * 
 * A wrapper component that adds particle background to any section
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - Content to display inside the section
 * @param {number} props.particleCount - Number of particles (default: 30)
 * @param {string} props.lightThemeColor - Particle color in light theme
 * @param {string} props.darkThemeColor - Particle color in dark theme
 * @param {boolean} props.interactive - Whether particles react to mouse
 * @param {number} props.speed - Animation speed
 * @param {number} props.maxOpacity - Maximum opacity of particles
 * @param {string} props.className - Additional CSS class
 * @returns {JSX.Element}
 */
const ParticleSection = ({
    children,
    particleCount = 30,
    lightThemeColor = 'rgba(255, 0, 0, 0.3)',
    darkThemeColor = 'rgba(255, 50, 50, 0.4)',
    interactive = true,
    speed = 0.5,
    maxOpacity = 0.5,
    className = '',
}) =>
{
    return (
        <div className={`${styles.particleSection} ${className}`}>
            <ParticleBackground
                particleCount={particleCount}
                lightThemeColor={lightThemeColor}
                darkThemeColor={darkThemeColor}
                interactive={interactive}
                speed={speed}
                maxOpacity={maxOpacity}
            />
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};

export default ParticleSection; 