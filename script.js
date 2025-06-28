document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;
  const navLinks = document.querySelector('.nav-links');
  const hamburger = document.querySelector('.hamburger');

  // Load theme from localStorage
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark');
    themeToggleBtn.textContent = '☀️';
  }

  // Theme toggle button click
  themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    if (body.classList.contains('dark')) {
      themeToggleBtn.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    } else {
      themeToggleBtn.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    }
  });

  // Hamburger menu toggle
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // Smooth scroll for nav links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
          navLinks.classList.remove('active');
        }
      } else {
        // For links to other pages, navigate normally
        window.location.href = href;
      }
    });
  });

  // Contact form validation (basic)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();
      if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
      }
      if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      // Send form data to backend
      fetch('http://localhost:3001/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        alert('Thank you for your message!');
        contactForm.reset();
      })
      .catch(error => {
        alert('There was a problem submitting your message. Please try again later.');
        console.error('Error:', error);
      });
    });
  }

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('section, .hero-section').forEach(section => {
    observer.observe(section);
  });

  // Animated counters (example for skills or stats)
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const updateCount = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const increment = target / 100;
      const ease = 1.1;

      if (count < target) {
        counter.innerText = Math.ceil(count + increment * ease);
        setTimeout(updateCount, 15);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  });

  function validateEmail(email) {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});
