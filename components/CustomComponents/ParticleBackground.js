import React, { useEffect, useRef, useState } from 'react';
import styles from './ParticleBackground.module.css';

/**
 * ParticleBackground Component
 * 
 * A subtle animated particle background effect that works well with both light and dark themes
 * 
 * @param {Object} props
 * @param {number} props.particleCount - Number of particles to display (default: 40)
 * @param {string} props.lightThemeColor - Color for particles in light theme (default: 'rgba(255, 0, 0, 0.4)')
 * @param {string} props.darkThemeColor - Color for particles in dark theme (default: 'rgba(255, 50, 50, 0.5)')
 * @param {boolean} props.interactive - Whether particles react to mouse movement (default: true)
 * @param {number} props.speed - Animation speed factor (default: 0.7)
 * @param {number} props.maxOpacity - Maximum opacity of particles (default: 0.7)
 * @param {string} props.className - Additional CSS class
 * @returns {JSX.Element}
 */
const ParticleBackground = ({
    particleCount = 40,
    lightThemeColor = 'rgba(255, 0, 0, 0.4)',
    darkThemeColor = 'rgba(255, 50, 50, 0.5)',
    interactive = true,
    speed = 0.7,
    maxOpacity = 0.7,
    className = '',
}) =>
{
    const canvasRef = useRef(null);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [mousePosition, setMousePosition] = useState({ x: null, y: null });
    const particlesRef = useRef([]);
    const animationFrameRef = useRef(null);
    const containerRef = useRef(null);

    // Check if dark theme is active
    useEffect(() =>
    {
        const checkTheme = () =>
        {
            // Check if prefers-color-scheme is dark or if there's a .dark class on document.body
            const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ||
                document.body.classList.contains('dark');
            setIsDarkTheme(isDark);
        };

        checkTheme();

        // Listen for changes to color scheme preference
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => checkTheme();
        mediaQuery.addEventListener('change', handleChange);

        // Also set up a mutation observer to check for class changes on body
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        return () =>
        {
            mediaQuery.removeEventListener('change', handleChange);
            observer.disconnect();
        };
    }, []);

    // Initialize dimensions and event listeners
    useEffect(() =>
    {
        const updateDimensions = () =>
        {
            if (containerRef.current)
            {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({ width, height });
            }
        };

        const handleMouseMove = (e) =>
        {
            if (!interactive) return;

            const { left, top } = containerRef.current.getBoundingClientRect();
            setMousePosition({
                x: e.clientX - left,
                y: e.clientY - top
            });
        };

        const handleMouseLeave = () =>
        {
            setMousePosition({ x: null, y: null });
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        if (interactive)
        {
            containerRef.current.addEventListener('mousemove', handleMouseMove);
            containerRef.current.addEventListener('mouseleave', handleMouseLeave);
        }

        return () =>
        {
            window.removeEventListener('resize', updateDimensions);
            if (interactive && containerRef.current)
            {
                containerRef.current.removeEventListener('mousemove', handleMouseMove);
                containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [interactive]);

    // Initialize particles
    useEffect(() =>
    {
        if (dimensions.width === 0 || dimensions.height === 0) return;

        const initializeParticles = () =>
        {
            const particles = [];
            for (let i = 0; i < particleCount; i++)
            {
                particles.push({
                    x: Math.random() * dimensions.width,
                    y: Math.random() * dimensions.height,
                    radius: Math.random() * 2.5 + 0.5, // Random size between 0.5 and 3
                    speed: {
                        x: (Math.random() - 0.5) * speed,
                        y: (Math.random() - 0.5) * speed
                    },
                    opacity: Math.random() * maxOpacity + 0.1, // Random opacity
                    growing: Math.random() > 0.5 // Whether the particle is growing or shrinking
                });
            }
            particlesRef.current = particles;
        };

        initializeParticles();
    }, [dimensions, particleCount, speed, maxOpacity]);

    // Draw and animate particles
    useEffect(() =>
    {
        if (!canvasRef.current || dimensions.width === 0 || dimensions.height === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas size
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        const animate = () =>
        {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const particleColor = isDarkTheme ? darkThemeColor : lightThemeColor;
            const particles = particlesRef.current;

            // Draw particles
            particles.forEach((particle, i) =>
            {
                // Update position
                particle.x += particle.speed.x;
                particle.y += particle.speed.y;

                // Bounce off edges
                if (particle.x < 0 || particle.x > dimensions.width)
                {
                    particle.speed.x *= -1;
                }
                if (particle.y < 0 || particle.y > dimensions.height)
                {
                    particle.speed.y *= -1;
                }

                // "Breathe" effect (grow and shrink)
                if (particle.growing)
                {
                    particle.radius += 0.01;
                    if (particle.radius > 2.5)
                    {
                        particle.growing = false;
                    }
                } else
                {
                    particle.radius -= 0.01;
                    if (particle.radius < 0.5)
                    {
                        particle.growing = true;
                    }
                }

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particleColor.replace(/[\d.]+\)$/, `${particle.opacity})`);
                ctx.fill();

                // Draw connections to nearby particles
                for (let j = i + 1; j < particles.length; j++)
                {
                    const dx = particles[j].x - particle.x;
                    const dy = particles[j].y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Only connect particles that are close enough
                    if (distance < 100)
                    {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(particles[j].x, particles[j].y);

                        // Line opacity decreases with distance
                        const opacity = (1 - distance / 100) * 0.2 * particle.opacity;
                        ctx.strokeStyle = particleColor.replace(/[\d.]+\)$/, `${opacity})`);
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }

                // Draw connections to mouse position
                if (mousePosition.x !== null && mousePosition.y !== null)
                {
                    const dx = mousePosition.x - particle.x;
                    const dy = mousePosition.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150)
                    {
                        // Apply small attraction to mouse
                        particle.x += dx * 0.01 * speed;
                        particle.y += dy * 0.01 * speed;

                        // Draw connection line
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(mousePosition.x, mousePosition.y);
                        const opacity = (1 - distance / 150) * 0.3 * particle.opacity;
                        ctx.strokeStyle = particleColor.replace(/[\d.]+\)$/, `${opacity})`);
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () =>
        {
            if (animationFrameRef.current)
            {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [dimensions, isDarkTheme, darkThemeColor, lightThemeColor, interactive, mousePosition, speed]);

    return (
        <div ref={containerRef} className={`${styles.particleContainer} ${className}`}>
            <canvas ref={canvasRef} className={styles.particleCanvas} />
        </div>
    );
};

export default ParticleBackground; 