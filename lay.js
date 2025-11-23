/*
    Version: 3.0.1 (V3 Full Code)
    Framework: User Configuration (Tier 3)
    Last Modified: 2025-11-23
*/

const siteConfig = {
    // [기본 설정]
    language: 'ko',
    
    // [캔버스 헤더 설정]
    canvas_effect: 'starsEffect',
    canvas_overlay: 'dotted',
    canvas_image_type: 'cover',
    canvas_image_count: 2,
    canvas_image_slide: 10,
    canvas_image_path: './section/home/',
    canvas_image_format: 'jpg',
    canvas_indicators: true,

    // [아이콘 버튼]
    icon_buttons: [
        { name: 'Location', icon: 'location_on', url: '#location' }
    ]
};

const starsEffect = {
    init: (headerElement) => {
        try {
            // 캔버스 생성
            const canvas = document.createElement('canvas');
            canvas.id = 'ce-bg-canvas';
            headerElement.prepend(canvas);

            const ctx = canvas.getContext('2d');
            let animationFrameId;
            let stars = [];

            // 리사이징 핸들러
            const resizeCanvas = () => {
                const dpr = window.devicePixelRatio || 1;
                const rect = headerElement.getBoundingClientRect();
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                ctx.scale(dpr, dpr);
            };

            // 별 초기화
            const initStars = () => {
                stars = [];
                const w = canvas.width / (window.devicePixelRatio || 1);
                const h = canvas.height / (window.devicePixelRatio || 1);
                const starCount = Math.floor((w * h) / 10000); // 밀도 조절
                
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

            // 애니메이션 루프
            const animateStars = () => {
                const w = canvas.width / (window.devicePixelRatio || 1);
                const h = canvas.height / (window.devicePixelRatio || 1);
                
                ctx.clearRect(0, 0, w, h);
                
                stars.forEach(star => {
                    star.y -= star.speed;
                    // 화면 아래로 내려가면 위로 재배치
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

            // 이벤트 리스너 등록
            const handleResize = () => {
                cancelAnimationFrame(animationFrameId);
                resizeCanvas();
                initStars();
                animateStars();
            };

            // 실행
            resizeCanvas();
            initStars();
            animateStars();
            window.addEventListener('resize', handleResize);
            
        } catch(e) {
            console.warn('Canvas Effect Error:', e);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (typeof PE_V3 !== 'undefined') {
        try {
            PE_V3.registerEffect('starsEffect', starsEffect);
            PE_V3.init(siteConfig);
        } catch (e) {
            console.error('PE_V3 Init Error:', e);
            forceShowContent();
        }
    } else {
        console.error('Page Express V3 (page-v3.js) failed to load.');
        forceShowContent();
    }
    setTimeout(forceShowContent, 1000);
});

function forceShowContent() {
    document.querySelectorAll('.js-fade-in').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.classList.add('is-visible');
    });
}