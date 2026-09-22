(() => {
  'use strict';

  // `subscribed: true` marks a newsletter the current visitor already gets:
  // that card renders disabled/grey with an "Already Subscribed" label and
  // is not togglable. This only means anything once there's a real backend
  // capturing emails on our own domain that can tell us what a visitor is
  // already subscribed to - until then every card stays `subscribed: false`
  // (the rendering/CSS/disabled-state logic stays wired up and ready for
  // whenever that lookup is added).
  const NEWSLETTERS = [
    {
      id: 'the-huddle', name: 'The Huddle', subscribed: false,
      art: 'newsletter-brand-assets/the-huddle-artwork.jpg',
      description: "The Huddle delivers the day’s biggest NFL stories, on and off the field, covering rivalries, matchups, expert analysis, power rankings, and the latest insider draft news and picks.",
    },
    {
      id: 'essentially-golf', name: 'Essentially Golf', subscribed: false,
      art: 'newsletter-brand-assets/essentially-golf-artwork.jpg',
      description: "The pulse of today’s golf world. With daily news from fairways across the globe and tips to improve your game, Essentially Golf is the ace you need.",
    },
    {
      id: 'essentially-dugout', name: 'Essentially Dugout', subscribed: false,
      art: 'newsletter-brand-assets/essentially-dugout-artwork.jpg',
      description: "All of MLB in One Quick Morning Read. The biggest games, breaking stories, trade buzz, and moments every baseball fan will be talking about.",
    },
    {
      id: 'essentially-dunk', name: 'Essentially Dunk', subscribed: false,
      art: 'newsletter-brand-assets/essentially-dunk-artwork.jpg',
      description: "Bringing you league-wide coverage everyday on the All-Stars, MVPs, iconic legends, and the drama defining the NBA.",
    },
    {
      id: 'essentially-w', name: 'Essentially W', subscribed: false,
      art: 'newsletter-brand-assets/essentially-w-artwork.jpg',
      description: "Essentially W delivers everyday front-court analysis and back court drama, where the W takes center court.",
    },
    {
      id: 'lucky-dog-on-track', name: 'Lucky Dog On Track', subscribed: false,
      art: 'newsletter-brand-assets/lucky-dog-on-track-artwork.jpg',
      description: "No-filter NASCAR in your inbox. Lucky Dog on Track brings exclusive driver access, pit lane coverage, and unfiltered commentary.",
    },
  ];

  // Decorative team-ticker strip shown behind every card's artwork area in the
  // Figma export. The exporter did not preserve each pill's real fill color
  // (all 32 came back as the same placeholder blue), so real NFL team colors
  // are used here instead of that placeholder.
  const TEAM_TICKER_ROWS = [
    [
      ['BEARS', '#0B162A'], ['GIANTS', '#0B2265'], ['RAIDERS', '#000000'], ['BROWNS', '#311D00'],
      ['PACKERS', '#203731'], ['COMMANDERS', '#5A1414'], ['BENGALS', '#FB4F14'], ['CARDINALS', '#97233F'],
      ['JETS', '#125740'], ['TITANS', '#4B92DB'], ['COLTS', '#002C5F'], ['SAINTS', '#D3BC8D'],
      ['DOLPHINS', '#008E97'], ['CHIEFS', '#E31837'], ['VIKINGS', '#4F2683'], ['RAMS', '#003594'],
    ],
    [
      ['49ERS', '#AA0000'], ['BRONCOS', '#FB4F14'], ['STEELERS', '#FFB612'], ['TEXANS', '#03202F'],
      ['PANTHERS', '#0085CA'], ['PATRIOTS', '#002244'], ['LIONS', '#0076B6'], ['RAVENS', '#241773'],
      ['SEAHAWKS', '#002244'], ['BILLS', '#00338D'], ['CHARGERS', '#0080C6'], ['JAGUARS', '#006778'],
      ['BUCCANEERS', '#D50A0A'], ['FALCONS', '#A71930'], ['COWBOYS', '#041E42'], ['EAGLES', '#004C54'],
    ],
  ];

  const ICON_CLOCK = '<svg viewBox="0 0 12 13" fill="none" aria-hidden="true"><circle cx="6" cy="6.5" r="5.5" stroke="currentColor"/><path d="M6 3.5v3l2 1.2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ICON_PLUS = '<img class="icon-plus" src="newsletter-brand-assets/card-toggle-add.svg" alt="" aria-hidden="true">';
  const ICON_CHECK = '<img class="icon-check" src="newsletter-brand-assets/card-toggle-check.svg" alt="" aria-hidden="true">';

  function tickerRowMarkup(row) {
    return row.map(([label, color]) =>
      `<span class="newsletter-card-ticker-pill" style="background:${color}">${label}</span>`
    ).join('');
  }

  function artworkMarkup(newsletter) {
    if (newsletter.art) {
      return `<img src="${newsletter.art}" alt="" loading="lazy" decoding="async">`;
    }
    return `
      <span class="newsletter-card-art-title">
        <span class="newsletter-card-art-brand">EssentiallySports</span>
        <span class="newsletter-card-art-name">${newsletter.name}</span>
      </span>
      <span class="newsletter-card-ticker" aria-hidden="true">
        <span class="newsletter-card-ticker-row">${tickerRowMarkup(TEAM_TICKER_ROWS[0])}</span>
        <span class="newsletter-card-ticker-row">${tickerRowMarkup(TEAM_TICKER_ROWS[1])}</span>
      </span>`;
  }

  function toggleMarkup(newsletter) {
    if (newsletter.subscribed) {
      return '<span class="newsletter-card-subscribed-label">Already Subscribed</span>';
    }
    return `
      <span class="newsletter-card-toggle">
        <span class="newsletter-card-toggle-circle">${ICON_PLUS}${ICON_CHECK}</span>
      </span>`;
  }

  function cardMarkup(newsletter) {
    const subscribed = Boolean(newsletter.subscribed);
    const classes = ['newsletter-card', subscribed ? 'is-subscribed' : ''].filter(Boolean).join(' ');
    const stateAttrs = subscribed
      ? `disabled aria-label="${newsletter.name} - already subscribed"`
      : 'aria-pressed="false"';
    return `
      <li>
        <button type="button" class="${classes}" data-newsletter-id="${newsletter.id}" ${stateAttrs}>
          <span class="newsletter-card-art">
            ${artworkMarkup(newsletter)}
          </span>
          <span class="newsletter-card-content">
            <span class="newsletter-card-title">${newsletter.name.toUpperCase()}</span>
            <span class="newsletter-card-frequency">${ICON_CLOCK}<span>Daily</span></span>
            <span class="newsletter-card-description">${newsletter.description}</span>
            ${toggleMarkup(newsletter)}
          </span>
        </button>
      </li>`;
  }

  function renderCards(root) {
    const grid = root.querySelector('.newsletter-grid');
    if (!grid) return;
    grid.innerHTML = NEWSLETTERS.map(cardMarkup).join('');
  }

  function initCards(root) {
    root.querySelectorAll('.newsletter-card:not(.is-subscribed)').forEach(card => {
      card.addEventListener('click', () => {
        const nowSelected = !card.classList.contains('is-selected');
        card.classList.toggle('is-selected', nowSelected);
        card.setAttribute('aria-pressed', String(nowSelected));
      });
    });
  }

  /**
   * No newsletter-subscription backend exists in the essentiallysports-design-tools
   * repo (no Beehiiv/Supabase/serverless endpoint was found there). This function is
   * an isolated stub to be wired up to a real endpoint later; it deliberately does
   * not report a fake success.
   */
  async function submitSubscription({ email, newsletters }) {
    throw new Error('Newsletter subscription endpoint is not configured yet.');
  }

  function emailIsValid(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function initForm(root) {
    const form = root.querySelector('.newsletter-signup-form');
    if (!form) return;
    const emailInput = form.querySelector('#newsletter-email');
    const submitButton = form.querySelector('.newsletter-submit');
    const statusEl = form.querySelector('.newsletter-form-status');
    let submitting = false;

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (submitting) return;

      const email = emailInput.value.trim();
      const selected = [...form.querySelectorAll('.newsletter-card.is-selected')].map(c => c.dataset.newsletterId);

      if (!emailIsValid(email)) {
        statusEl.textContent = 'Please enter a valid email address.';
        emailInput.focus();
        return;
      }
      if (selected.length === 0) {
        statusEl.textContent = 'Please select at least one newsletter.';
        return;
      }

      submitting = true;
      submitButton.disabled = true;
      statusEl.textContent = 'Submitting…';

      try {
        await submitSubscription({ email, newsletters: selected });
        statusEl.textContent = 'Subscribed!';
        form.reset();
      } catch (error) {
        statusEl.textContent = 'Subscription is not connected yet. Please try again later.';
      } finally {
        submitting = false;
        submitButton.disabled = false;
      }
    });
  }

  function boot() {
    renderCards(document);
    initCards(document);
    initForm(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
