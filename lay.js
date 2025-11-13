/*
    Version: 2.1.0 (V2 Refactored)
    Last Modified: 2025-11-14
    Author: Maxim
    License: © 2025 Maxim. All Rights Reserved.
*/

// --- V2 siteConfig Object ---
const siteConfig = {
    // Canvas Effect (from V1 <canvas class="canvas-stars">)
    canvas_effect: 'starsEffect',
    
    // Image Slider (from V1 .slides-container)
    canvas_image_type: 'cover',
    canvas_image_count: 2,
    canvas_image_path: './section/home/',
    canvas_image_slide: 5, // V1 default was 5 seconds
    canvas_indicators: true, // from V1 .slide-indicators

    // Icon Buttons (from V1 .nav-icon-button)
    icon_buttons: [
        { name: 'Location', icon: 'location_on', url: '#location' }
    ],
    
    // API Keys (Not used by UBHOLIC, but part of V2 spec)
    // TURNSTILE_SITE_KEY: '0x4...'
};

// --- starsEffect Function (Extracted from V1 page-v1.js) ---
const starsEffect = {
    init: (headerElement) => {
        const canvas = document.createElement('canvas');
        canvas.id = 'ce-bg-canvas'; // V2 ID
        headerElement.prepend(canvas);

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let stars;

        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = headerElement.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        };

        const initStars = () => {
            stars = [];
            const w = canvas.width / (window.devicePixelRatio || 1);
            const h = canvas.height / (window.devicePixelRatio || 1);
            const starCount = Math.floor((w * h) / 10000);
            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    radius: Math.random() * 2 + 0.5,
                    alpha: 0.5 + Math.random() * 0.4,
                    speed: Math.random() * 0.2 + 0.05
                });
            }
        };

        const animateStars = () => {
            if (!stars) return;
            const w = canvas.width / (window.devicePixelRatio || 1);
            const h = canvas.height / (window.devicePixelRatio || 1);
            ctx.clearRect(0, 0, w, h);
            stars.forEach(star => {
                star.y -= star.speed;
                if (star.y < 0) {
                    star.y = h;
                    star.x = Math.random() * w;
                }
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(animateStars);
        };

        const handleResize = () => {
            cancelAnimationFrame(animationFrameId);
            resizeCanvas();
            initStars();
            animateStars();
        };

        resizeCanvas();
        initStars();
        animateStars();
        window.addEventListener('resize', handleResize);
    }
};

// --- Initialize Page Express V2 ---
document.addEventListener('DOMContentLoaded', () => {
    // Register the custom effect before initializing
    if (typeof PE_V2 !== 'undefined') {
        PE_V2.registerEffect('starsEffect', starsEffect);
        PE_V2.init(siteConfig);
    } else {
        console.error('Page Express V2 (page-v2.js) failed to load.');
    }
});