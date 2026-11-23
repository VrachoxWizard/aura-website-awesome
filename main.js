/**
 * AUREN STUDIO — INTERACTION LOGIC
 * High-performance 60fps animations, kinetic typography, custom magnetic cursor
 */

import imgEmma from './assets/images/testimonial-emma.jpg';
import imgJulian from './assets/images/testimonial-julian.jpg';
import imgHenrik from './assets/images/testimonial-henrik.jpg';
import imgClaire from './assets/images/testimonial-claire.jpg';
import imgArthur from './assets/images/testimonial-arthur.jpg';

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initKineticTypography();
  initFoundersScroll();
  initHighlightsAccordion();
  initClientsInteraction();
  initTestimonialsSlider();
  initScrollAnimations();
  initProjectsFilter();
  initCareersAccordion();
  initContactForm();
  initNewsletterForm();
});

/* ---------------- 1. Custom Magnetic Cursor ---------------- */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  if (!cursor) return;

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      cursorX = mouseX;
      cursorY = mouseY;
      isMoving = true;
    }
  }, { passive: true });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Targets that trigger cursor
  const triggers = document.querySelectorAll('.hover-arrow, [data-cursor="arrow"]');
  triggers.forEach((target) => {
    target.addEventListener('mouseenter', () => {
      cursor.classList.add('visible');
    });
    target.addEventListener('mouseleave', () => {
      cursor.classList.remove('visible');
    });
  });
}

/* ---------------- 2. Kinetic Split Typography ---------------- */
function initKineticTypography() {
  const splitElements = document.querySelectorAll('.kinetic-split');

  splitElements.forEach((el) => {
    const nameLines = el.querySelectorAll('.name-line');
    if (nameLines.length > 0) {
      nameLines.forEach((line) => processTextToKinetic(line, line.textContent.trim()));
    } else {
      const text = el.getAttribute('data-text') || el.textContent.trim();
      processTextToKinetic(el, text);
    }
  });

  // Animate on entrance
  triggerKineticAnimation(document.querySelector('.hero-title'));
}

function processTextToKinetic(container, text) {
  container.innerHTML = '';
  const words = text.split(' ');
  words.forEach((word) => {
    const wordSpan = document.createElement('span');
    wordSpan.style.display = 'inline-block';
    wordSpan.style.whiteSpace = 'nowrap';
    wordSpan.style.marginRight = '0.22em';

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const wrapper = document.createElement('span');
      wrapper.className = 'kinetic-char-wrapper';

      const topSlice = document.createElement('span');
      topSlice.className = 'kinetic-top-slice';
      topSlice.textContent = char;

      const bottomSlice = document.createElement('span');
      bottomSlice.className = 'kinetic-bottom-slice';
      bottomSlice.textContent = char;

      wrapper.appendChild(topSlice);
      wrapper.appendChild(bottomSlice);
      wordSpan.appendChild(wrapper);
    }
    container.appendChild(wordSpan);
  });
}

function triggerKineticAnimation(el) {
  if (!el) return;
  const chars = el.querySelectorAll('.kinetic-char-wrapper');
  chars.forEach((char, idx) => {
    const top = char.querySelector('.kinetic-top-slice');
    const bottom = char.querySelector('.kinetic-bottom-slice');
    if (!top || !bottom) return;

    const offset = idx % 2 === 0 ? 12 : -12;
    top.style.transform = `translateX(${-offset}px)`;
    bottom.style.transform = `translateX(${offset}px)`;
    top.style.opacity = '0.5';
    bottom.style.opacity = '0.5';

    setTimeout(() => {
      top.style.transform = 'translateX(0)';
      bottom.style.transform = 'translateX(0)';
      top.style.opacity = '1';
      bottom.style.opacity = '1';
    }, 100 + idx * 25);
  });
}

/* ---------------- 3. Meet the Founders Continuous Scroll Reveal ---------------- */
function initFoundersScroll() {
  const cards = document.querySelectorAll('.founder-card');
  if (!cards.length) return;

  function updateFounders() {
    const windowH = window.innerHeight;
    const screenCenter = windowH * 0.5;

    // Find the card closest to viewport center
    let closestCard = null;
    let minDistance = Infinity;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const dist = Math.abs(cardCenter - screenCenter);

      if (dist < minDistance) {
        minDistance = dist;
        closestCard = card;
      }

      // 60fps parallax drift on portrait
      if (rect.top < windowH && rect.bottom > 0) {
        const factor = (cardCenter - screenCenter) / windowH;
        const img = card.querySelector('.founder-img');
        if (img) {
          img.style.transform = `translateY(${factor * -34}px) scale(1.05)`;
        }
      }
    });

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;

      // Card is in active reading zone (between 18% and 82% of screen height)
      // or is the single closest card to center
      const inZone = cardCenter >= windowH * 0.18 && cardCenter <= windowH * 0.82;
      const isPrimary = (card === closestCard);

      if (inZone || isPrimary) {
        if (!card.classList.contains('revealed')) {
          card.classList.add('revealed');
          const nameEl = card.querySelector('.founder-name');
          if (nameEl && !card.dataset.activeInView) {
            card.dataset.activeInView = 'true';
            triggerKineticAnimation(nameEl);
          }
        }
      } else {
        card.classList.remove('revealed');
        // Clear activeInView when scrolled out so it will re-animate when scrolled back
        delete card.dataset.activeInView;
      }
    });
  }

  // Smooth scroll listener
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateFounders();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateFounders, { passive: true });

  // Initial calculation
  setTimeout(updateFounders, 50);
}

/* ---------------- 4. Studio Highlights Accordion ---------------- */
function initHighlightsAccordion() {
  const cards = document.querySelectorAll('.highlight-card');
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      cards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
    });

    card.addEventListener('click', () => {
      cards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
}

/* ---------------- 5. Selected Clients Interaction ---------------- */
function initClientsInteraction() {
  const items = document.querySelectorAll('.client-item');
  const activeImg = document.getElementById('clientActiveImg');
  if (!items.length || !activeImg) return;

  items.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      items.forEach((el) => el.classList.remove('active'));
      item.classList.add('active');

      const imgSrc = item.getAttribute('data-img');
      if (imgSrc && activeImg.src !== imgSrc) {
        activeImg.style.opacity = '0.4';
        activeImg.style.transform = 'scale(0.97)';
        setTimeout(() => {
          activeImg.src = imgSrc;
          activeImg.style.opacity = '1';
          activeImg.style.transform = 'scale(1)';
        }, 150);
      }
    });
  });
}

/* ---------------- 6. Testimonials Slider ---------------- */
function initTestimonialsSlider() {
  const prevBtn = document.getElementById('tPrevBtn');
  const nextBtn = document.getElementById('tNextBtn');
  const tCard = document.getElementById('activeTestimonialCard');
  const tImg = document.getElementById('tImg');
  const tNum = document.getElementById('tNum');
  const tLocation = document.getElementById('tLocation');
  const tQuote = document.getElementById('tQuote');
  const tAuthor = document.getElementById('tAuthor');
  const tRole = document.getElementById('tRole');
  const dots = document.querySelectorAll('.t-dot');

  if (!tCard) return;

  const testimonials = [
    {
      num: '01',
      location: 'Zürich, Switzerland',
      quote: '“The team created a home that feels calm, timeless, and deeply personal. Every detail was thoughtfully considered from start to finish.”',
      author: 'Emma Larson',
      role: 'Private residence client',
      img: imgEmma
    },
    {
      num: '02',
      location: 'Oaxaca, Mexico',
      quote: '“Auren transformed our historic hacienda into an effortlessly functional modern sanctuary without compromising an ounce of its two-hundred-year soul.”',
      author: 'Julian Vance',
      role: 'Hospitality Partner, Monarca Collection',
      img: imgJulian
    },
    {
      num: '03',
      location: 'Stockholm Archipelago, Sweden',
      quote: '“Their sensitivity to natural light, raw granite materiality, and spatial balance delivered an island retreat that feels like an organic extension of the coastal cliff.”',
      author: 'Henrik Lindqvist',
      role: 'Nordic Residence Development',
      img: imgHenrik
    },
    {
      num: '04',
      location: 'Berlin, Germany',
      quote: '“Working with Auren was an exercise in pure architectural restraint. The acoustic stillness, monolithic wall planes, and proportional harmony allow the art to breathe.”',
      author: 'Claire Moreau',
      role: 'Contemporary Gallery Director',
      img: imgClaire
    },
    {
      num: '05',
      location: 'Engadin Valley, Switzerland',
      quote: '“From the first volumetric plaster study to the bespoke alpine stone masonry, Auren’s partners maintained an uncompromising dedication to honest craft.”',
      author: 'Dr. Arthur Sterling',
      role: 'Private Alpine Estate Client',
      img: imgArthur
    }
  ];

  let activeIdx = 0;

  function updateDots(idx) {
    if (!dots.length) return;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
    });
  }

  function renderTestimonial(idx) {
    if (idx < 0) idx = testimonials.length - 1;
    if (idx >= testimonials.length) idx = 0;

    tCard.style.opacity = '0';
    tCard.style.transform = 'translateY(15px)';

    setTimeout(() => {
      const data = testimonials[idx];
      if (tNum) tNum.textContent = `${data.num} / 05`;
      if (tLocation) tLocation.textContent = data.location;
      if (tQuote) tQuote.textContent = data.quote;
      if (tAuthor) tAuthor.textContent = data.author;
      if (tRole) tRole.textContent = data.role;
      if (tImg) {
        tImg.src = data.img;
        tImg.alt = data.author;
      }

      updateDots(idx);
      tCard.style.opacity = '1';
      tCard.style.transform = 'translateY(0)';
      activeIdx = idx;
    }, 200);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => renderTestimonial(activeIdx - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => renderTestimonial(activeIdx + 1));

  // Interactive dots
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => renderTestimonial(i));
  });
}

/* ---------------- 7. Scroll Entry Reveals ---------------- */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        const splitText = entry.target.querySelector('.kinetic-split');
        if (splitText) {
          triggerKineticAnimation(splitText);
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('.statement-section, .philosophy-section, .recognition-section, .highlights-section').forEach((el) => {
    observer.observe(el);
  });
}

/* ---------------- 8. Projects Filter ---------------- */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* ---------------- 9. Careers Accordion ---------------- */
function initCareersAccordion() {
  const positionCards = document.querySelectorAll('.position-card');
  if (!positionCards.length) return;

  positionCards.forEach((card) => {
    const summary = card.querySelector('.position-summary');
    if (!summary) return;

    summary.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');
      positionCards.forEach((c) => c.classList.remove('open'));
      if (!isOpen) {
        card.classList.add('open');
      }
    });
  });
}

/* ---------------- 10. Contact Form Handler ---------------- */
function initContactForm() {
  const form = document.getElementById('studioContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit-btn');
    const originalText = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = 'Transmitting Inquiry...';

    setTimeout(() => {
      form.innerHTML = `
        <div style="text-align: center; padding: 48px 20px;">
          <h3 style="font-family: var(--font-display); font-size: 28px; margin-bottom: 12px; font-weight: 700;">Inquiry Received</h3>
          <p style="color: var(--text-secondary); max-width: 440px; margin: 0 auto; line-height: 1.6; font-size: 15px;">
            Thank you for reaching out to Auren Studio. A studio partner will review your architectural project brief and respond within two business days.
          </p>
        </div>
      `;
    }, 900);
  });
}

/* ---------------- 11. Newsletter Form Handler ---------------- */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    const btn = form.querySelector('.newsletter-btn');
    if (input && input.value) {
      btn.textContent = 'Subscribed';
      btn.style.backgroundColor = '#2d6a4f';
      input.value = '';
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.style.backgroundColor = '';
      }, 3500);
    }
  });
}

