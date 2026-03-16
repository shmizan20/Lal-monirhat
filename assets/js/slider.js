// Hero Slider Functionality
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    if (slides.length === 0) return;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Auto slide
    let timer = setInterval(nextSlide, slideInterval);

    // Initial state
    showSlide(0);

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            // Reset timer
            clearInterval(timer);
            timer = setInterval(nextSlide, slideInterval);
        });
    });
});
