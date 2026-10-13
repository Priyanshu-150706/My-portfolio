/**
 * PRIYANSHU PATEL - PORTFOLIO INTERACTIVITY SCRIPT
 * Vanilla JavaScript (ES6+) for:
 * 1. Dark/Light Theme Switching with localStorage persistence
 * 2. Mobile Hamburger Navigation Menu
 * 3. Dynamic Typing Effect (Web Developer, Programmer, CSE Student)
 * 4. Header scroll styling & Active navigation link spy
 * 5. Scroll entrance reveal animations (IntersectionObserver)
 * 6. Client-side Contact Form Validation with user feedback
 * 7. Configurable placeholder link handling for projects & email
 * 8. Back to top button & current year generation
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initTypingEffect();
  initScrollHeaderAndNavSpy();
  initScrollReveal();
  initContactForm();
  initPlaceholderLinks();
  initBackToTopAndYear();
});

/* --------------------------------------------------------------------------
   1. DARK / LIGHT THEME TOGGLE
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  // Check saved user preference or system preference
  const savedTheme = localStorage.getItem('priyanshu_portfolio_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const currentTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'dark'); // Default to dark futuristic
  document.body.setAttribute('data-theme', currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('priyanshu_portfolio_theme', newTheme);
  });
}

/* --------------------------------------------------------------------------
   2. MOBILE NAVIGATION MENU
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggleBtn || !navMenu) return;

  const toggleMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    mobileToggleBtn.classList.toggle('active', isOpen);
    mobileToggleBtn.setAttribute('aria-expanded', isOpen.toString());
  };

  const closeMenu = () => {
    navMenu.classList.remove('open');
    mobileToggleBtn.classList.remove('active');
    mobileToggleBtn.setAttribute('aria-expanded', 'false');
  };

  mobileToggleBtn.addEventListener('click', toggleMenu);

  // Close mobile menu when any nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on click outside
  document.addEventListener('click', (event) => {
    if (!navMenu.contains(event.target) && !mobileToggleBtn.contains(event.target) && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   3. HERO TYPING EFFECT
   Cycles through: "Web Developer", "Programmer", "CSE Student"
   -------------------------------------------------------------------------- */
function initTypingEffect() {
  const typedRoleElement = document.getElementById('typed-role');
  if (!typedRoleElement) return;

  const roles = [
    'Web Developer',
    'Programmer',
    'CSE Student'
  ];

  let currentRoleIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 60;
  const pauseEnd = 1800; // Pause when word is completely typed
  const pauseStart = 400; // Pause before typing new word

  function type() {
    const currentWord = roles[currentRoleIndex];

    if (isDeleting) {
      typedRoleElement.textContent = currentWord.substring(0, currentCharIndex - 1);
      currentCharIndex--;
    } else {
      typedRoleElement.textContent = currentWord.substring(0, currentCharIndex + 1);
      currentCharIndex++;
    }

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && currentCharIndex === currentWord.length) {
      delay = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
      isDeleting = false;
      currentRoleIndex = (currentRoleIndex + 1) % roles.length;
      delay = pauseStart;
    }

    setTimeout(type, delay);
  }

  // Start animation
  type();
}

/* --------------------------------------------------------------------------
   4. SCROLLED HEADER & ACTIVE NAV LINK HIGHLIGHT
   -------------------------------------------------------------------------- */
function initScrollHeaderAndNavSpy() {
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header blurred background when scrolled
    if (scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Active Section Spy
    const scrollPosition = scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run on init
}

/* --------------------------------------------------------------------------
   5. SCROLL ENTRANCE ANIMATIONS (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  if (!reveals.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Once animated, unobserve to save performance
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers without IntersectionObserver
    reveals.forEach(el => el.classList.add('is-visible'));
  }
}

/* --------------------------------------------------------------------------
   6. CONTACT FORM VALIDATION & FRONTEND DEMO HANDLING
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusElement = document.getElementById('form-status');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (input, condition) => {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return condition;

    if (!condition) {
      formGroup.classList.add('has-error');
      return false;
    } else {
      formGroup.classList.remove('has-error');
      return true;
    }
  };

  // Real-time error clearing when user types
  [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      input.closest('.form-group')?.classList.remove('has-error');
      if (statusElement) statusElement.style.display = 'none';
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, nameInput.value.trim().length >= 2);
    const isEmailValid = validateField(emailInput, emailRegex.test(emailInput.value.trim()));
    const isSubjectValid = validateField(subjectInput, subjectInput.value.trim().length >= 3);
    const isMessageValid = validateField(messageInput, messageInput.value.trim().length >= 10);

    const isFormValid = isNameValid && isEmailValid && isSubjectValid && isMessageValid;

    if (!isFormValid) {
      if (statusElement) {
        statusElement.className = 'form-status error';
        statusElement.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Please correct the highlighted errors before submitting.';
        statusElement.style.display = 'block';
      }
      return;
    }

    // Successful client-side validation
    // Since no backend service is configured, inform the user clearly
    const senderName = nameInput.value.trim();
    const senderSubject = subjectInput.value.trim();
    const senderMessage = messageInput.value.trim();

    if (statusElement) {
      statusElement.className = 'form-status success';
      statusElement.innerHTML = `
        <div style="font-weight: 700; margin-bottom: 0.35rem;">
          <i class="fa-solid fa-circle-check"></i> Form Validated Successfully!
        </div>
        <p style="margin-bottom: 0.5rem; font-size: 0.88rem;">
          Thank you, <strong>${escapeHTML(senderName)}</strong>! This is a client-side frontend demo.
        </p>
        <p style="font-size: 0.84rem; margin-bottom: 0.75rem;">
          To send this message directly via your email client, click the button below:
        </p>
        <a href="mailto:?subject=${encodeURIComponent(senderSubject)}&body=${encodeURIComponent('From: ' + senderName + '\n\n' + senderMessage)}" class="btn btn-sm btn-primary" style="display: inline-flex;">
          <i class="fa-solid fa-paper-plane"></i> Open in Email Client
        </a>
      `;
      statusElement.style.display = 'block';
    }

    // Reset fields
    form.reset();
  });
}

// Utility function to prevent XSS when reflecting input back in status message
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/* --------------------------------------------------------------------------
   7. PLACEHOLDER LINK NOTIFICATION
   For project cards where URLs are placeholder '#'
   -------------------------------------------------------------------------- */
function initPlaceholderLinks() {
  const placeholderLinks = document.querySelectorAll('.placeholder-link');
  const toast = document.getElementById('placeholder-toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  placeholderLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      // If href is placeholder '#' or empty
      if (href === '#' || !href) {
        e.preventDefault();
        const linkType = link.getAttribute('data-link-type') || 'URL';
        const projectTitle = link.closest('.project-card')?.querySelector('.project-title')?.textContent || 'this project';
        
        if (toast && toastMessage) {
          toastMessage.innerHTML = `<strong>${linkType} placeholder:</strong> Replace <code>href="#"</code> in <code>index.html</code> with your actual link for ${projectTitle}.`;
          toast.classList.add('show');

          if (toastTimer) clearTimeout(toastTimer);
          toastTimer = setTimeout(() => {
            toast.classList.remove('show');
          }, 4500);
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. BACK TO TOP BUTTON & CURRENT YEAR
   -------------------------------------------------------------------------- */
function initBackToTopAndYear() {
  // Update year
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Back to Top button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}
