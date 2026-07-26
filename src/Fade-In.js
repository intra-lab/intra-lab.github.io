const fadeInobserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeInobserver.unobserve(entry.target); // Stop observing once visible
    }
  });
});

// Observe all elements with the fade-in class
document.querySelectorAll('.fade-in').forEach((el) => {
  fadeInobserver.observe(el);
});


const shineobserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('shining');
      shineobserver.unobserve(entry.target); // Trigger only once
    }
  });
});

document.querySelectorAll('.shine-text').forEach((el) => {
  shineobserver.observe(el);
});



const fadeInSlowobserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeInSlowobserver.unobserve(entry.target); // Stop observing once visible
    }
  });
});

// Observe all elements with the fade-in class
document.querySelectorAll('.fade-in-slow').forEach((el) => {
  fadeInSlowobserver.observe(el);
});

