import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import styles from './ZoomableImage.module.css';

/**
 * A component that displays an image with zoom functionality
 * @param {string} src - The image source URL
 * @param {string} alt - The alt text for the image
 * @param {string} className - Additional CSS classes
 * @param {number} width - The width of the image
 * @param {number} height - The height of the image
 * @param {number} quality - The quality of the image
 * @param {boolean} priority - Whether the image is a priority image
 * @param {string} objectFit - The object-fit property for the image
 */
const ZoomableImage = ({
    src,
    alt,
    width,
    height,
    className = '',
    quality = 85,
    priority = false,
    objectFit = "cover"
}) =>
{
    const [isZoomed, setIsZoomed] = useState(false);

    // Toggle zoom state
    const toggleZoom = useCallback(() =>
    {
        setIsZoomed(prev => !prev);
    }, []);

    // Close on escape key
    useEffect(() =>
    {
        const handleKeyDown = (e) =>
        {
            if (e.key === 'Escape' && isZoomed)
            {
                setIsZoomed(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () =>
        {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isZoomed]);

    // Lock body scroll when zoomed
    useEffect(() =>
    {
        if (isZoomed)
        {
            document.body.style.overflow = 'hidden';
        } else
        {
            document.body.style.overflow = '';
        }

        return () =>
        {
            document.body.style.overflow = '';
        };
    }, [isZoomed]);

    return (
        <>
            {/* Thumbnail image */}
            <div
                className={`${styles.zoomable} ${className}`}
                onClick={toggleZoom}
                onKeyDown={(e) =>
                {
                    if (e.key === 'Enter' || e.key === ' ')
                    {
                        e.preventDefault();
                        toggleZoom();
                    }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View ${alt || 'image'} in full size`}
            >
                <Image
                    src={src}
                    alt={alt || 'Image'}
                    width={width}
                    height={height}
                    quality={quality}
                    priority={priority}
                    objectFit={objectFit}
                />
            </div>

            {/* Zoomed view */}
            {isZoomed && (
                <div
                    className={styles.overlay}
                    onClick={toggleZoom}
                    role="dialog"
                    aria-label={`Zoomed view of ${alt || 'image'}`}
                    aria-modal="true"
                >
                    <div className={styles.zoomedImage}>
                        <Image
                            src={src}
                            alt={alt || 'Image'}
                            layout="fill"
                            objectFit="contain"
                            quality={100}
                        />
                    </div>

                    <button
                        className={styles.closeButton}
                        onClick={toggleZoom}
                        aria-label="Close zoomed view"
                    >
                        ×
                    </button>
                </div>
            )}
        </>
    );
};

export default ZoomableImage; 