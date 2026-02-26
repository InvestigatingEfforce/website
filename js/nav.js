/* ============================================================
   INVESTIGATING EFFORCE — Navigation & Interactivity
   nav.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMegaMenu();
  initMobileNav();
  initGlobalSearch();
  initFilterBars();
  initTimelineFilters();
  initTableSort();
  initSmoothAnchors();
  initFadeInOnScroll();
});


/* ============================================================
   MEGA MENU
   ============================================================ */
function initMegaMenu() {
  const navItems = document.querySelectorAll('.nav-item[data-mega]');
  const mainNav = document.querySelector('.main-nav');
  let activeItem = null;
  let closeTimeout = null;

  // Push page content down by setting margin-bottom on .main-nav
  const updateNavSpacing = () => {
    if (!mainNav) return;
    const openMenu = mainNav.querySelector('.nav-item--open > .mega-menu') ||
                     mainNav.querySelector('.nav-item[data-mega]:hover > .mega-menu');
    if (openMenu && openMenu.offsetHeight) {
      mainNav.style.marginBottom = openMenu.offsetHeight + 'px';
    } else {
      mainNav.style.marginBottom = '0';
    }
  };

  navItems.forEach(item => {
    const trigger = item.querySelector('.nav-item__trigger');
    const megaMenu = item.querySelector('.mega-menu');

    if (!megaMenu) return;

    // Position mega menu relative to viewport edge
    const positionMega = () => {
      megaMenu.style.left = `-${item.getBoundingClientRect().left}px`;
    };

    // Mouse enter
    item.addEventListener('mouseenter', () => {
      clearTimeout(closeTimeout);
      if (activeItem && activeItem !== item) {
        activeItem.classList.remove('nav-item--open');
      }
      positionMega();
      item.classList.add('nav-item--open');
      activeItem = item;
      // Wait one frame for display:block to take effect, then measure height
      requestAnimationFrame(updateNavSpacing);
    });

    // Mouse leave with delay
    item.addEventListener('mouseleave', () => {
      closeTimeout = setTimeout(() => {
        item.classList.remove('nav-item--open');
        if (activeItem === item) activeItem = null;
        updateNavSpacing();
      }, 200);
    });

    // Keyboard accessibility
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isOpen = item.classList.contains('nav-item--open');
        navItems.forEach(ni => ni.classList.remove('nav-item--open'));
        if (!isOpen) {
          positionMega();
          item.classList.add('nav-item--open');
          const firstLink = megaMenu.querySelector('a');
          if (firstLink) firstLink.focus();
        }
        requestAnimationFrame(updateNavSpacing);
      }
      if (e.key === 'Escape') {
        item.classList.remove('nav-item--open');
        trigger.focus();
        updateNavSpacing();
      }
    });
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item')) {
      navItems.forEach(item => item.classList.remove('nav-item--open'));
      activeItem = null;
      updateNavSpacing();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      navItems.forEach(item => item.classList.remove('nav-item--open'));
      activeItem = null;
      updateNavSpacing();
    }
  });
}


/* ============================================================
   MOBILE NAV
   ============================================================ */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('main-nav--open');
    const isOpen = nav.classList.contains('main-nav--open');
    toggle.setAttribute('aria-expanded', isOpen);
    toggle.innerHTML = isOpen ? '&#x2715;' : '&#9776;';
  });

  // Mobile mega menu accordions
  if (window.innerWidth <= 768) {
    const triggers = nav.querySelectorAll('.nav-item__trigger');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        const item = trigger.closest('.nav-item');
        if (item.querySelector('.mega-menu')) {
          e.preventDefault();
          item.classList.toggle('nav-item--open');
        }
      });
    });
  }
}


/* ============================================================
   GLOBAL SEARCH
   ============================================================ */
function initGlobalSearch() {
  const searchInput = document.querySelector('.masthead__search input');
  if (!searchInput) return;

  // TODO: Wire up to search index when ready
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query) {
        // Redirect to search page or filter current page
        const searchPage = '/pages/search.html';
        window.location.href = `${searchPage}?q=${encodeURIComponent(query)}`;
      }
    }
  });
}


/* ============================================================
   FILTER BARS — Generic filtering for any page
   ============================================================ */
function initFilterBars() {
  const filterBars = document.querySelectorAll('.filter-bar');

  filterBars.forEach(bar => {
    const selects = bar.querySelectorAll('.filter-bar__select');
    const searchInput = bar.querySelector('.filter-bar__search');
    const resetBtn = bar.querySelector('.filter-bar__reset');
    const countEl = bar.querySelector('.filter-bar__count');
    const targetSelector = bar.dataset.target || '.filterable-item';
    const items = document.querySelectorAll(targetSelector);

    const applyFilters = () => {
      let visibleCount = 0;

      // Gather active filters
      const filters = {};
      selects.forEach(select => {
        const key = select.dataset.filter;
        const val = select.value;
        if (val) filters[key] = val.toLowerCase();
      });

      const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';

      items.forEach(item => {
        let show = true;

        // Check dropdown filters
        for (const [key, val] of Object.entries(filters)) {
          const itemVal = (item.dataset[key] || '').toLowerCase();
          // Support comma-separated values (e.g., data-tags="person,legal")
          const itemVals = itemVal.split(',').map(v => v.trim());
          if (!itemVals.includes(val) && itemVal !== val) {
            show = false;
            break;
          }
        }

        // Check text search
        if (show && searchQuery) {
          const text = item.textContent.toLowerCase();
          show = text.includes(searchQuery);
        }

        item.style.display = show ? '' : 'none';
        item.dataset.hidden = !show;
        if (show) visibleCount++;
      });

      if (countEl) {
        countEl.textContent = `${visibleCount} of ${items.length} shown`;
      }
    };

    selects.forEach(select => select.addEventListener('change', applyFilters));
    if (searchInput) {
      searchInput.addEventListener('input', debounce(applyFilters, 200));
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        selects.forEach(s => s.value = '');
        if (searchInput) searchInput.value = '';
        applyFilters();
      });
    }

    // Initial count
    if (countEl) {
      countEl.textContent = `${items.length} of ${items.length} shown`;
    }
  });
}


/* ============================================================
   TIMELINE-SPECIFIC FILTERS
   ============================================================ */
function initTimelineFilters() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  // Tag click filtering
  document.addEventListener('click', (e) => {
    const tag = e.target.closest('.tag[data-filter-value]');
    if (!tag) return;

    e.preventDefault();
    const filterType = tag.dataset.filterType;
    const filterValue = tag.dataset.filterValue;

    // Toggle active state
    tag.classList.toggle('tag--active');

    // Get all active tags
    const activeTags = document.querySelectorAll('.tag--active[data-filter-value]');
    const entries = timeline.querySelectorAll('.timeline-entry');

    if (activeTags.length === 0) {
      // Show all
      entries.forEach(entry => {
        entry.style.display = '';
        entry.dataset.hidden = 'false';
      });
      return;
    }

    // Build filter map
    const activeFilters = {};
    activeTags.forEach(at => {
      const type = at.dataset.filterType;
      if (!activeFilters[type]) activeFilters[type] = [];
      activeFilters[type].push(at.dataset.filterValue.toLowerCase());
    });

    entries.forEach(entry => {
      let show = true;

      for (const [type, values] of Object.entries(activeFilters)) {
        const entryVal = (entry.dataset[type] || '').toLowerCase();
        const entryVals = entryVal.split(',').map(v => v.trim());
        const hasMatch = values.some(v => entryVals.includes(v));
        if (!hasMatch) {
          show = false;
          break;
        }
      }

      entry.style.display = show ? '' : 'none';
      entry.dataset.hidden = (!show).toString();
    });

    // Update count if present
    updateFilterCount(timeline);
  });
}


/* ============================================================
   TABLE SORTING
   ============================================================ */
function initTableSort() {
  const tables = document.querySelectorAll('.data-table[data-sortable]');

  tables.forEach(table => {
    const headers = table.querySelectorAll('th[data-sort]');
    const tbody = table.querySelector('tbody');

    headers.forEach((th, colIndex) => {
      th.addEventListener('click', () => {
        const sortKey = th.dataset.sort;
        const isAsc = th.classList.contains('sorted-asc');

        // Reset all headers
        headers.forEach(h => {
          h.classList.remove('sorted', 'sorted-asc', 'sorted-desc');
          const ind = h.querySelector('.sort-indicator');
          if (ind) ind.textContent = '↕';
        });

        // Set current
        th.classList.add('sorted', isAsc ? 'sorted-desc' : 'sorted-asc');
        const indicator = th.querySelector('.sort-indicator');
        if (indicator) indicator.textContent = isAsc ? '↓' : '↑';

        // Sort rows
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const direction = isAsc ? -1 : 1;

        rows.sort((a, b) => {
          const aCell = a.cells[colIndex];
          const bCell = b.cells[colIndex];
          let aVal = (aCell.dataset.sortValue || aCell.textContent).trim();
          let bVal = (bCell.dataset.sortValue || bCell.textContent).trim();

          // Try numeric
          const aNum = parseFloat(aVal.replace(/[^0-9.-]/g, ''));
          const bNum = parseFloat(bVal.replace(/[^0-9.-]/g, ''));

          if (!isNaN(aNum) && !isNaN(bNum)) {
            return (aNum - bNum) * direction;
          }

          // Try date
          const aDate = Date.parse(aVal);
          const bDate = Date.parse(bVal);
          if (!isNaN(aDate) && !isNaN(bDate)) {
            return (aDate - bDate) * direction;
          }

          // String comparison
          return aVal.localeCompare(bVal) * direction;
        });

        rows.forEach(row => tbody.appendChild(row));
      });
    });
  });
}


/* ============================================================
   SMOOTH ANCHOR SCROLLING
   ============================================================ */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update URL
        history.pushState(null, '', anchor.getAttribute('href'));
      }
    });
  });
}


/* ============================================================
   FADE IN ON SCROLL
   ============================================================ */
function initFadeInOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.observe-fade').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}


/* ============================================================
   UTILITIES
   ============================================================ */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function updateFilterCount(container) {
  const countEl = container.closest('section')?.querySelector('.filter-bar__count')
    || document.querySelector('.filter-bar__count');
  if (!countEl) return;

  const items = container.querySelectorAll('.timeline-entry, .filterable-item');
  const visible = Array.from(items).filter(i => i.style.display !== 'none').length;
  countEl.textContent = `${visible} of ${items.length} shown`;
}


/* ============================================================
   GYAZO EMBED HELPER
   ============================================================ */
function embedGyazo(containerId, gyazoId, caption) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const figure = document.createElement('figure');
  figure.className = 'evidence-embed';

  const img = document.createElement('img');
  img.src = `https://i.gyazo.com/${gyazoId}.png`;
  img.alt = caption || 'Evidence screenshot';
  img.loading = 'lazy';

  figure.appendChild(img);

  if (caption) {
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = caption;
    figure.appendChild(figcaption);
  }

  container.appendChild(figure);
}


/* ============================================================
   CLAIM STATUS HELPER
   Returns HTML for a claim status badge
   ============================================================ */
function claimStatusBadge(status) {
  const statusMap = {
    unrebutted: { label: 'Unrebutted', class: 'claim-status--unrebutted' },
    partial:    { label: 'Partially Rebutted', class: 'claim-status--partial' },
    rebutted:   { label: 'Rebutted', class: 'claim-status--rebutted' },
    pending:    { label: 'Pending Response', class: 'claim-status--pending' },
  };

  const s = statusMap[status] || statusMap.pending;
  return `<span class="claim-status ${s.class}"><span class="claim-status__dot"></span>${s.label}</span>`;
}
