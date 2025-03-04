import { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import styles from './BackgroundPlayer.module.css';

const BackgroundPlayer = () =>
{
    const [url, setUrl] = useState('');
    const [videoId, setVideoId] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const [isVisible, setIsVisible] = useState(false);
    const [videoTitle, setVideoTitle] = useState('');
    const playerRef = useRef(null);
    const containerRef = useRef(null);
    const [recentTracks, setRecentTracks] = useState([]);
    const hideTimerRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const progressInterval = useRef(null);
    const progressBarRef = useRef(null);
    const isDraggingRef = useRef(false);

    // Extract YouTube video ID from URL
    const extractVideoId = (url) =>
    {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Handle URL input change
    const handleUrlChange = (e) =>
    {
        setUrl(e.target.value);
    };

    // Handle form submission
    const handleSubmit = (e) =>
    {
        e.preventDefault();
        const id = extractVideoId(url);
        if (id)
        {
            setVideoId(id);
            setIsPlaying(true);
            // Track updates now handled in fetchVideoTitle after we have the title
        } else
        {
            alert('Please enter a valid YouTube URL');
        }
    };

    // Handle mouse enter for both components
    const handleMouseEnter = () =>
    {
        // Clear any hide timer
        if (hideTimerRef.current)
        {
            clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }
        setIsVisible(true);
    };

    // Handle mouse leave for both components
    const handleMouseLeave = () =>
    {
        // Set a timer to hide the component after a delay
        // This gives the user time to move between the icon and player
        hideTimerRef.current = setTimeout(() =>
        {
            setIsVisible(false);
        }, 300); // 300ms delay gives enough time to move between elements
    };

    // Handle play/pause toggle
    const togglePlay = () =>
    {
        if (playerRef.current)
        {
            if (isPlaying)
            {
                playerRef.current.internalPlayer.pauseVideo();
            } else
            {
                playerRef.current.internalPlayer.playVideo();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Handle volume change
    const handleVolumeChange = (e) =>
    {
        const newVolume = parseInt(e.target.value);
        setVolume(newVolume);
        if (playerRef.current)
        {
            playerRef.current.internalPlayer.setVolume(newVolume);
        }
    };

    // Format time (seconds) to MM:SS format
    const formatTime = (seconds) =>
    {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
    };

    // Handle progress bar click/drag
    const handleProgressBarClick = (e) =>
    {
        if (!playerRef.current || !duration) return;

        const progressBar = progressBarRef.current;
        const rect = progressBar.getBoundingClientRect();
        const clickPosition = (e.clientX - rect.left) / rect.width;
        const newTime = clickPosition * duration;

        // Set new time in player
        playerRef.current.internalPlayer.seekTo(newTime, true);
        setProgress(newTime);
    };

    // Handle progress bar mouse down
    const handleMouseDown = (e) =>
    {
        isDraggingRef.current = true;
        handleProgressBarClick(e);

        // Add event listeners for mouse move and mouse up
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // Handle progress bar mouse move (for dragging)
    const handleMouseMove = (e) =>
    {
        if (isDraggingRef.current)
        {
            handleProgressBarClick(e);
        }
    };

    // Handle progress bar mouse up (end of dragging)
    const handleMouseUp = () =>
    {
        isDraggingRef.current = false;

        // Remove event listeners
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    // YouTube player options
    const opts = {
        height: '0',
        width: '0',
        playerVars: {
            autoplay: 1,
            controls: 0,
        },
    };

    // Handle player ready
    const onReady = (event) =>
    {
        event.target.setVolume(volume);
        if (isPlaying)
        {
            event.target.playVideo();
        }

        // Set video duration
        const getDuration = async () =>
        {
            try
            {
                const duration = await event.target.getDuration();
                setDuration(duration);
            } catch (error)
            {
                console.error('Error getting video duration:', error);
            }
        };
        getDuration();

        // Initialize progress tracking immediately
        startProgressTracking();
    };

    // Function to start progress tracking
    const startProgressTracking = () =>
    {
        // Clear any existing interval first
        if (progressInterval.current)
        {
            clearInterval(progressInterval.current);
        }

        // Set up interval to update progress
        progressInterval.current = setInterval(() =>
        {
            if (playerRef.current && isPlaying)
            {
                try
                {
                    playerRef.current.internalPlayer.getCurrentTime().then(currentTime =>
                    {
                        setProgress(currentTime);
                    }).catch(error =>
                    {
                        console.error('Error getting current time:', error);
                    });
                } catch (error)
                {
                    console.error('Error accessing player:', error);
                }
            }
        }, 250); // Update more frequently for smoother progress (4 times per second)
    };

    // Handle player state change
    const onStateChange = (event) =>
    {
        // Video ended
        if (event.data === 0)
        {
            setIsPlaying(false);
            setProgress(0);
            clearInterval(progressInterval.current);
        }

        // Video is playing
        if (event.data === 1)
        {
            // Start tracking progress
            setIsPlaying(true);
            startProgressTracking();
        }

        // Video is paused
        if (event.data === 2)
        {
            setIsPlaying(false);
            // We don't clear the interval here to continue updating the UI
            // even while paused
        }
    };

    // Get video title when video is loaded
    const fetchVideoTitle = async (videoId) =>
    {
        try
        {
            // Method 1: Using the oEmbed API (no API key needed)
            const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
            const data = await response.json();
            setVideoTitle(data.title);

            // Update recent tracks with proper title information
            setRecentTracks(prev =>
            {
                // First, filter out any existing track with this ID
                const filteredTracks = prev.filter(track => track.id !== videoId);

                // Then add the new track at the beginning and limit to 3
                const trackToAdd = {
                    id: videoId,
                    url: `https://www.youtube.com/watch?v=${videoId}`,
                    title: data.title
                };

                const newTracks = [trackToAdd, ...filteredTracks].slice(0, 3);

                // Save to localStorage
                localStorage.setItem('recentTracks', JSON.stringify(newTracks));

                return newTracks;
            });
        } catch (error)
        {
            console.error('Error fetching video title:', error);
            setVideoTitle(`YouTube Video (${videoId})`);
        }
    };

    // Effect to load saved tracks
    useEffect(() =>
    {
        const savedTracks = localStorage.getItem('recentTracks');
        if (savedTracks)
        {
            setRecentTracks(JSON.parse(savedTracks));
        }
    }, []);

    // Effect to fetch video title when videoId changes
    useEffect(() =>
    {
        if (videoId)
        {
            fetchVideoTitle(videoId);
            // Reset progress and duration
            setProgress(0);
            setDuration(0);
        }
    }, [videoId]);

    // Clean up intervals when component unmounts
    useEffect(() =>
    {
        return () =>
        {
            if (progressInterval.current)
            {
                clearInterval(progressInterval.current);
            }
            if (hideTimerRef.current)
            {
                clearTimeout(hideTimerRef.current);
            }
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    // Restart progress tracking if isPlaying changes
    useEffect(() =>
    {
        if (isPlaying)
        {
            startProgressTracking();
        }
    }, [isPlaying]);

    return (
        <div className={styles.musicPlayerWrapper}>
            {/* Music Icon */}
            <button
                className={styles.musicIcon}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                aria-label="Show music player"
            >
                ♫
            </button>

            {/* Bridge element to help mouse transition between icon and player */}
            <div
                className={`${styles.bridge} ${isVisible ? styles.bridgeVisible : ''}`}
                onMouseEnter={handleMouseEnter}
            ></div>

            {/* Main Player */}
            <div
                ref={containerRef}
                className={`${styles.playerContainer} ${!isVisible ? styles.hidden : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className={styles.playerHeader}>
                    <div className={styles.headerTitle}>
                        <span className={styles.headerIcon}>♫</span>
                        <h3>Chilling...</h3>
                    </div>
                </div>

                <div className={styles.playerContent}>
                    <form onSubmit={handleSubmit} className={styles.urlForm}>
                        <input
                            type="text"
                            value={url}
                            onChange={handleUrlChange}
                            placeholder="Paste YouTube URL here"
                            className={styles.urlInput}
                        />
                        <button type="submit" className={styles.submitButton}>▶</button>
                    </form>

                    <div className={styles.nowPlaying}>
                        {videoTitle && (
                            <div className={styles.currentTrack}>
                                <div className={styles.trackTitle}>
                                    <div className={styles.scrollingContainer}>
                                        <span className={styles.scrollingText}>
                                            {videoTitle}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className={styles.progressContainer}>
                        <div
                            className={styles.progressBar}
                            ref={progressBarRef}
                            onClick={handleProgressBarClick}
                            onMouseDown={handleMouseDown}
                        >
                            <div
                                className={styles.progressFill}
                                style={{ width: `${(progress / duration) * 100 || 0}%` }}
                            ></div>
                        </div>
                        <div className={styles.progressTime}>
                            <span>{formatTime(progress)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    <div className={styles.controls}>
                        <button onClick={togglePlay} className={styles.playButton}>
                            {isPlaying ? "⏸" : "▶"}
                        </button>

                        <div className={styles.volumeControl}>
                            <span className={styles.volumeIcon}>{volume < 10 ? "🔈" : volume < 50 ? "🔉" : "🔊"}</span>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={handleVolumeChange}
                                className={styles.volumeSlider}
                            />
                        </div>
                    </div>

                    {recentTracks.length > 0 && (
                        <div className={styles.recentTracks}>
                            <h4>Recent Tracks</h4>
                            <ul>
                                {recentTracks.map((track) => (
                                    <li key={track.id} onClick={() =>
                                    {
                                        setVideoId(track.id);
                                        setUrl(track.url);
                                        setIsPlaying(true);
                                    }}>
                                        <div className={styles.scrollingContainer}>
                                            <span className={styles.scrollingText}>
                                                {track.title || track.id.substring(0, 6) + '...'}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {videoId && (
                    <YouTube
                        videoId={videoId}
                        opts={opts}
                        onReady={onReady}
                        onStateChange={onStateChange}
                        ref={playerRef}
                        className={styles.hiddenPlayer}
                    />
                )}
            </div>
        </div>
    );
};

export default BackgroundPlayer; 