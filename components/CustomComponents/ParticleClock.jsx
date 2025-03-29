import React, { useEffect, useRef } from 'react';
import styles from './ParticleClock.module.css';
const ParticleClock = () => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const digitParticlesRef = useRef([[], [], [], [], [], [], [], []]);
    const prevTimeDigitsRef = useRef(['', '', ':', '', '', ':', '', '']);
    const requestIdRef = useRef(null);
    const ctxRef = useRef(null);

    const getRandom = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const getRandomFloat = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    const createParticle = (canvas) => {
        const devicePixelRatio = window.devicePixelRatio || 1;
        const size = getRandomFloat(1.5 * devicePixelRatio, 3 * devicePixelRatio);
        const r = Math.min(canvas.width, canvas.height) / 2;
        const rad = (getRandom(0, 360) * Math.PI) / 180;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        return {
            size,
            x: cx + r * Math.cos(rad),
            y: cy + r * Math.sin(rad),
            alpha: getRandomFloat(0.3, 0.7),
            originalSize: size,
            targetX: 0,
            targetY: 0,
            velocityX: 0,
            velocityY: 0,
            digitPosition: -1,

            draw(ctx) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                const opacity = this.alpha.toFixed(2);
                ctx.fillStyle = `rgba(40, 40, 45, ${opacity})`;
                ctx.fill();
            },

            update() {
                if (Math.abs(this.x - this.targetX) < 1 && Math.abs(this.y - this.targetY) < 1) {
                    this.x += getRandomFloat(-0.5, 0.5);
                    this.y += getRandomFloat(-0.5, 0.5);
                    if (Math.random() < 0.05) {
                        this.size = this.originalSize * getRandomFloat(0.85, 1.15);
                    }
                }
            },

            moveTo(tx, ty) {
                const duration = 600;
                const sx = this.x;
                const sy = this.y;
                const xSpeed = (tx - sx) / duration;
                const ySpeed = (ty - sy) / duration;
                this.targetX = tx;
                this.targetY = ty;

                const startTime = Date.now();
                const move = () => {
                    const t = Date.now() - startTime;
                    const x = sx + xSpeed * t;
                    const y = sy + ySpeed * t;
                    this.x = x;
                    this.y = y;
                    if (t >= duration) {
                        this.x = tx;
                        this.y = ty;
                        return;
                    }
                    requestAnimationFrame(move);
                };
                move();
            }
        };
    };

    const initCanvasSize = (canvas) => {
        const devicePixelRatio = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * devicePixelRatio;
        canvas.height = rect.height * devicePixelRatio;
    };

    const clear = (ctx, canvas) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const getText = () => {
        return new Date().toLocaleTimeString().substring(0, 8);
    };

    const getTimeDigits = (timeStr) => {
        const digits = [];
        for (let i = 0; i < timeStr.length; i++) {
            digits.push(timeStr.charAt(i));
        }
        return digits;
    };

    const getPoints = (ctx, canvas) => {
        const points = [];
        const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const gap = 1;
        for (let i = 0; i < canvas.width; i += gap) {
            for (let j = 0; j < canvas.height; j += gap) {
                const index = (j * canvas.width + i) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                const a = data[index + 3];
                if (r === 0 && g === 0 && b === 0 && a === 255) {
                    points.push([i, j]);
                }
            }
        }
        return points;
    };

    // Updated update function using off-screen canvas for digit sampling
    const update = (forceUpdate = false) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;

        const timeStr = getText();
        const currentTimeDigits = getTimeDigits(timeStr);
        const prevTimeDigits = prevTimeDigitsRef.current;

        let hasChanged = forceUpdate;
        const changedPositions = [];

        for (let i = 0; i < currentTimeDigits.length; i++) {
            if (currentTimeDigits[i] !== prevTimeDigits[i]) {
                hasChanged = true;
                changedPositions.push(i);
            }
        }

        if (!hasChanged) {
            return;
        }

        const { width, height } = canvas;
        const devicePixelRatio = window.devicePixelRatio || 1;
        const digitParticlesArray = digitParticlesRef.current;
        let particlesArray = [...particlesRef.current];

        // For each changed digit position, update particles using an off-screen canvas
        for (let pos of changedPositions) {
            // Create off-screen canvas for sampling
            const offscreenCanvas = document.createElement("canvas");
            offscreenCanvas.width = canvas.width;
            offscreenCanvas.height = canvas.height;
            const offCtx = offscreenCanvas.getContext("2d", { willReadFrequently: true });

            // Calculate digit position for sampling
            const digitWidth = 70 * devicePixelRatio;
            const startX = width / 2 - (digitWidth * 3.5);
            const x = startX + pos * digitWidth;

            offCtx.fillStyle = '#000';
            offCtx.textBaseline = 'middle';
            offCtx.font = `${140 * devicePixelRatio}px Roboto`;
            offCtx.textAlign = 'center';

            // Draw digit on off-screen canvas only (avoiding visible flicker)
            offCtx.fillText(currentTimeDigits[pos], x, height / 2);

            // Get sampling points from the off-screen canvas
            const points = getPoints(offCtx, offscreenCanvas);

            if (points.length === 0) {
                continue;
            }

            const maxParticlesPerDigit = 600;
            const pointsNeeded = Math.min(points.length, maxParticlesPerDigit);

            while (digitParticlesArray[pos].length < pointsNeeded) {
                const newParticle = createParticle(canvas);
                newParticle.digitPosition = pos;
                digitParticlesArray[pos].push(newParticle);
                particlesArray.push(newParticle);
            }

            for (let i = 0; i < pointsNeeded; i++) {
                const [pointX, pointY] = points[getRandom(0, points.length - 1)];
                const p = digitParticlesArray[pos][i];
                p.moveTo(pointX, pointY);
            }

            if (pointsNeeded < digitParticlesArray[pos].length) {
                const toRemove = digitParticlesArray[pos].splice(pointsNeeded);
                for (const p of toRemove) {
                    const index = particlesArray.indexOf(p);
                    if (index !== -1) {
                        particlesArray.splice(index, 1);
                    }
                }
            }
        }

        particlesRef.current = particlesArray;
        prevTimeDigitsRef.current = [...currentTimeDigits];
    };

    const draw = () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;

        clear(ctx, canvas);
        update();

        const sortedParticles = [...particlesRef.current].sort((a, b) => a.size - b.size);
        for (const p of sortedParticles) {
            p.update();
            p.draw(ctx);
        }

        requestIdRef.current = requestAnimationFrame(draw);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        initCanvasSize(canvas);
        ctxRef.current = canvas.getContext('2d', { willReadFrequently: true });

        update(true);
        requestIdRef.current = requestAnimationFrame(draw);

        const handleResize = () => {
            initCanvasSize(canvas);
            update(true);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (requestIdRef.current) {
                cancelAnimationFrame(requestIdRef.current);
            }
        };
    }, []);

    return (
        <div className={styles.canvas_container}>
            <canvas
                ref={canvasRef}
                className={styles.canvas}
            />
        </div>
    );
};

export default ParticleClock;