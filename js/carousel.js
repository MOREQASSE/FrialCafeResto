document.addEventListener('DOMContentLoaded', function() {
  // Carousel setup
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const nextButton = document.querySelector('.carousel-button.next');
  const prevButton = document.querySelector('.carousel-button.prev');
  const dotsNav = document.querySelector('.carousel-nav');
  
  // Store the original number of slides (without clones)
  const originalSlideCount = slides.length;
  let currentSlide = 1; // Start at 1 because of the cloned first slide
  let isTransitioning = false;
  
  // Initialize carousel with existing slides
  function initCarousel() {
    if (slides.length < 1) return;
    
    // Clone first and last slides for infinite effect
    const firstSlide = slides[0].cloneNode(true);
    const lastSlide = slides[slides.length - 1].cloneNode(true);
    
    // Add cloned slides to the DOM
    track.insertBefore(lastSlide, slides[0]);
    track.appendChild(firstSlide);
    
    // Update slides array with cloned slides
    slides.unshift(lastSlide);
    slides.push(firstSlide);
    
    // Create navigation dots based on original slides
    createDots(originalSlideCount);
    
    // Set initial position
    track.style.transform = `translateX(${-100}%)`;
    updateDots();
  }
  
  // Create navigation dots
  function createDots(slideCount) {
    dotsNav.innerHTML = '';
    
    for (let i = 0; i < slideCount; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-indicator';
      dot.setAttribute('data-slide', i);
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.classList.toggle('active', i === 0);
      dot.addEventListener('click', () => goToSlide(i + 1));
      dotsNav.appendChild(dot);
    }
  }
  
  // Navigation functions
  function goToSlide(slideIndex) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    track.style.transition = 'transform 0.5s ease';
    track.style.transform = `translateX(${-slideIndex * 100}%)`;
    currentSlide = slideIndex;
    updateDots();
    
    // Reset position for infinite effect
    setTimeout(() => {
      if (currentSlide === 0) {
        // If we're at the first clone, jump to the last real slide
        currentSlide = slides.length - 2;
        track.style.transition = 'none';
        track.style.transform = `translateX(${-currentSlide * 100}%)`;
        // Force reflow
        void track.offsetWidth;
      } else if (currentSlide === slides.length - 1) {
        // If we're at the last clone, jump to the first real slide
        currentSlide = 1;
        track.style.transition = 'none';
        track.style.transform = `translateX(${-currentSlide * 100}%)`;
        // Force reflow
        void track.offsetWidth;
      }
      isTransitioning = false;
    }, 500);
  }
  
  function nextSlide() {
    goToSlide(currentSlide + 1);
  }
  
  function prevSlide() {
    goToSlide(currentSlide - 1);
  }
  
  function updateDots() {
    const dots = document.querySelectorAll('.carousel-indicator');
    if (!dots.length) return;
    
    // Calculate the active dot index based on current slide
    let activeIndex;
    if (currentSlide === 0) {
      activeIndex = dots.length - 1; // Last dot when at first clone
    } else if (currentSlide === slides.length - 1) {
      activeIndex = 0; // First dot when at last clone
    } else {
      activeIndex = currentSlide - 1; // -1 because of the cloned first slide
    }
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
      dot.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
    });
  }
  
  // Event listeners
  nextButton.addEventListener('click', nextSlide);
  prevButton.addEventListener('click', prevSlide);
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  });
  
  // Touch events for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for a swipe
    const swipeDistance = touchStartX - touchEndX;
    
    if (Math.abs(swipeDistance) < swipeThreshold) return;
    
    if (swipeDistance > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }
  
  // Auto-advance slides
  let slideInterval = setInterval(nextSlide, 5000);
  
  // Pause auto-advance on hover
  const carousel = document.querySelector('.carousel-container');
  carousel.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
  });
  
  carousel.addEventListener('mouseleave', () => {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
  });
  
  // Initialize carousel
  initCarousel();
});
