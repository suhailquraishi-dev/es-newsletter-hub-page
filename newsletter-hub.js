(() => {
  'use strict';

  const CARD_DESCRIPTION = "The Huddle delivers the day’s biggest NFL stories, on and off the field, covering rivalries, matchups, expert analysis, power rankings, and the latest insider draft news and picks.";

  // The Figma source reuses the exact same "THE HUDDLE" artwork frame for
  // every card regardless of newsletter name (confirmed against the Figma
  // file directly) - reproduced as-is rather than generating unique artwork.
  const CARD_ART = 'newsletter-brand-assets/the-huddle-artwork.webp';

  const NEWSLETTERS = [
    { id: 'the-huddle', name: 'The Huddle', selected: true, art: CARD_ART },
    { id: 'essentially-w', name: 'Essentially W', selected: false, art: CARD_ART },
    { id: 'essentially-dugout', name: 'Essentially Dugout', selected: true, art: CARD_ART },
    { id: 'essentially-golf', name: 'Essentially Golf', selected: false, art: CARD_ART },
    { id: 'lucky-dog-on-track', name: 'Lucky Dog On Track', selected: true, art: CARD_ART },
    { id: 'break-point', name: 'Break Point', selected: false, art: CARD_ART },
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
  const ICON_PLUS = '<svg class="icon-plus" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  const ICON_CHECK = '<svg class="icon-check" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

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

  function cardMarkup(newsletter) {
    return `
      <li>
        <button type="button" class="newsletter-card" data-newsletter-id="${newsletter.id}" aria-pressed="${newsletter.selected}">
          <span class="newsletter-card-art">
            ${artworkMarkup(newsletter)}
          </span>
          <span class="newsletter-card-content">
            <span class="newsletter-card-title">${newsletter.name.toUpperCase()}</span>
            <span class="newsletter-card-frequency">${ICON_CLOCK}<span>Daily</span></span>
            <span class="newsletter-card-description">${CARD_DESCRIPTION}</span>
            <span class="newsletter-card-toggle">
              <span class="newsletter-card-toggle-circle">${ICON_PLUS}${ICON_CHECK}</span>
            </span>
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
    root.querySelectorAll('.newsletter-card').forEach(card => {
      const id = card.dataset.newsletterId;
      const record = NEWSLETTERS.find(n => n.id === id);
      card.addEventListener('click', () => {
        const nowSelected = !card.classList.contains('is-selected');
        card.classList.toggle('is-selected', nowSelected);
        card.setAttribute('aria-pressed', String(nowSelected));
        if (record) record.selected = nowSelected;
      });
    });
    root.querySelectorAll('.newsletter-card.is-selected, .newsletter-card:not(.is-selected)').forEach(card => {
      const id = card.dataset.newsletterId;
      const record = NEWSLETTERS.find(n => n.id === id);
      card.classList.toggle('is-selected', Boolean(record?.selected));
    });
  }

  /**
   * No newsletter-subscription backend exists in the essentiallysports-design-tools
   * repo (no Beehiiv/Supabase/serverless endpoint was found there). This function is
   * an isolated stub to be wired up to a real endpoint later; it deliberately does
   * not report a fake success.
   */
  async function submitSubscription({ name, email, newsletters }) {
    throw new Error('Newsletter subscription endpoint is not configured yet.');
  }

  function emailIsValid(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function initForm(root) {
    const form = root.querySelector('.newsletter-signup-form');
    if (!form) return;
    const nameInput = form.querySelector('#newsletter-name');
    const emailInput = form.querySelector('#newsletter-email');
    const submitButton = form.querySelector('.newsletter-submit');
    const statusEl = form.querySelector('.newsletter-form-status');
    let submitting = false;

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (submitting) return;

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const selected = NEWSLETTERS.filter(n => n.selected).map(n => n.id);

      if (!name) {
        statusEl.textContent = 'Please enter your name.';
        nameInput.focus();
        return;
      }
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
        await submitSubscription({ name, email, newsletters: selected });
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
