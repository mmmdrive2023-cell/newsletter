(() => {
  const storyGrid = document.querySelector('.story-grid');
  const cards = [...document.querySelectorAll('.story-card')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const setCardState = (card, open) => {
    card.classList.toggle('is-open', open);

    card.querySelectorAll('[data-toggle]').forEach((control) => {
      control.setAttribute('aria-expanded', String(open));
    });

    const detail = card.querySelector('.story-details');
    if (detail) {
      detail.setAttribute('aria-hidden', String(!open));
      if ('inert' in detail) detail.inert = !open;
    }

    const chipLabel = card.querySelector('.open-chip span');
    if (chipLabel) {
      chipLabel.textContent = open ? 'Close article' : 'Open article';
    }

    const textButton = card.querySelector('.story-toggle');
    if (textButton) {
      textButton.firstChild.textContent = open ? 'Close article ' : 'Read article ';
    }
  };

  const setOpenStory = (activeCard = null) => {
    cards.forEach((card) => {
      setCardState(card, card === activeCard);
    });

    storyGrid?.classList.toggle('has-open-story', Boolean(activeCard));
  };

  const updateWithTransition = (update) => {
    if (document.startViewTransition && !reduceMotion.matches) {
      document.startViewTransition(update);
    } else {
      update();
    }
  };

  cards.forEach((card) => {
    const detail = card.querySelector('.story-details');
    if (detail && 'inert' in detail) detail.inert = true;

    const toggleStory = () => {
      const shouldOpen = !card.classList.contains('is-open');
      updateWithTransition(() => setOpenStory(shouldOpen ? card : null));

      window.setTimeout(() => {
        card.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
      }, 80);
    };

    card.querySelectorAll('[data-toggle]').forEach((control) => {
      control.addEventListener('click', toggleStory);
    });

    card.querySelector('[data-close]')?.addEventListener('click', () => {
      updateWithTransition(() => setOpenStory(null));

      window.setTimeout(() => {
        card.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
      }, 60);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    const openCard = document.querySelector('.story-card.is-open');
    if (!openCard) return;

    const focusTarget = openCard.querySelector('[data-toggle]');
    updateWithTransition(() => setOpenStory(null));
    focusTarget?.focus({ preventScroll: true });
  });

  document.querySelectorAll('.subscribe-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const input = form.querySelector('input[type="email"]');
      const status = form.parentElement.querySelector('.form-status') || form.nextElementSibling;
      if (!input) return;

      if (!input.checkValidity()) {
        input.reportValidity();
        return;
      }

      if (status?.classList.contains('form-status')) {
        status.textContent = 'Thank you — your subscription has been recorded for this mockup.';
      }

      input.value = '';
    });
  });
})();

const heroSlider = document.getElementById('heroSlider');

if (heroSlider) {
  const slides = heroSlider.querySelectorAll('.hero-slide');
  const dots = heroSlider.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let heroInterval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
    });

    currentSlide = index;
  }

  function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }

  function startHeroAutoplay() {
    heroInterval = setInterval(nextSlide, 4000); // change every 4 seconds
  }

  function resetHeroAutoplay() {
    clearInterval(heroInterval);
    startHeroAutoplay();
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      resetHeroAutoplay();
    });
  });

  heroSlider.addEventListener('mouseenter', () => {
    clearInterval(heroInterval);
  });

  heroSlider.addEventListener('mouseleave', () => {
    startHeroAutoplay();
  });

  showSlide(0);
  startHeroAutoplay();
}