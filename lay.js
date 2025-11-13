/*
    Version: 2.0.0
    Last Modified: 2025-11-13
    Author: Maxim
    License: © 2025 Maxim. All Rights Reserved.
    Description: siteConfig for UBHOLIC (PE V2)
*/

const siteConfig = {
    // 1. Canvas Express Header Settings (Ported from V1)
    canvas_effect: 'starsEffect',
    canvas_image_type: 'cover',
    canvas_image_count: 2,
    canvas_image_path: './section/home/',
    canvas_image_format: 'jpg',
    canvas_image_slide: 5,
    canvas_indicators: true,

    // 2. Header Icon Buttons (Ported from V1)
    icon_buttons: [
        { name: 'Location', icon: 'location_on', url: '#branches' }
    ],

    // 3. API & Turnstile Settings (V2 Requirement)
    TURNSTILE_SITE_KEY: '0x4AAAAAA...YOUR_KEY' // TODO: Add actual key
};


/*
 * Ported 'starsEffect' from Page Express V1
 * This is required for canvas_effect: 'starsEffect'
 */
const starsEffect = {
    init() {
        this.canvas = document.getElementById('ce-bg-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.animationFrameId = null;
        this.stars = [];

        window.addEventListener('resize', () => this.handleResize(), false);
        this.handleResize(); // Initial setup
    },
    
    handleResize() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        this.w = rect.width;
        this.h = rect.height;

        this.stars = [];
        const starCount = Math.floor((this.w * this.h) / 10000);
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.w,
                y: Math.random() * this.h,
                radius: Math.random() * 2 + 0.5,
                alpha: 0.5 + Math.random() * 0.4,
                speed: Math.random() * 0.2 + 0.05
            });
        }
        
        this.animate();
    },

    animate() {
        this.ctx.clearRect(0, 0, this.w, this.h);
        
        this.stars.forEach(star => {
            star.y -= star.speed;
            if (star.y < 0) {
                star.y = this.h;
                star.x = Math.random() * this.w;
            }
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            this.ctx.fill();
        });
        
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
};

// Register the effect with Page Express V2's global registry
if (window.PE_Effects) {
    window.PE_Effects.starsEffect = starsEffect;
} else {
    // Fallback if script loads out of order (though defer should prevent this)
    window.addEventListener('load', () => {
        if (window.PE_Effects) {
            window.PE_Effects.starsEffect = starsEffect;
        }
    });
}