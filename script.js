/* script.js — Lippbyte Notes */
(function () {
  'use strict';

  // ─── DOM refs ────────────────────────────────────────────
  const progressFill = document.getElementById('topFill');
  const sections = document.querySelectorAll('.part-section');
  const sidebar = document.getElementById('leftSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const toggleBtn = document.getElementById('sidebarToggle');
  const closeBtn = document.getElementById('closeSidebar');

  // ─── Reading Progress Bar ─────────────────────────────────
  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressFill) progressFill.style.width = pct + '%';
  }

  // ─── Scroll handler ───────────────────────────────────────
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  updateProgress();

  // ─── Mobile Sidebar Toggles ──────────────────────────────
  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('visible');
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('visible');
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);

  // Close sidebar when clicking links on mobile
  const sidebarLinks = document.querySelectorAll('.sidebar-link, .sidebar-sublink-item');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        closeSidebar();
      }
    });
  });

  // ─── Active Section Highlight ──────────────────────────────
  if (sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -65% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          
          // Remove active class from all sublinks in the current page
          document.querySelectorAll('.sidebar-sublink-item').forEach(link => {
            link.classList.remove('active');
          });
          
          // Add active class to matching sublink
          const activeLink = document.querySelector(`.sidebar-sublink-item[data-section="${id}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      observer.observe(section);
    });
  }

  // ─── Dynamic Copy Code Buttons ─────────────────────────────
  const codeBlocks = document.querySelectorAll('.code-block');
  codeBlocks.forEach((block) => {
    const titlebar = block.querySelector('.code-titlebar');
    if (titlebar) {
      if (!titlebar.querySelector('.copy-code-btn')) {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-code-btn';
        copyBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block; vertical-align:middle; margin-right:4px;">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>Copy</span>
        `;
        titlebar.appendChild(copyBtn);
        
        copyBtn.addEventListener('click', () => {
          const pre = block.querySelector('pre');
          const code = pre ? pre.innerText : '';
          navigator.clipboard.writeText(code).then(() => {
            copyBtn.innerHTML = `
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block; vertical-align:middle; margin-right:4px; color:#27C93F;">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span style="color:#27C93F;">Copied!</span>
            `;
            setTimeout(() => {
              copyBtn.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block; vertical-align:middle; margin-right:4px;">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>Copy</span>
              `;
            }, 2000);
          }).catch((err) => {
            console.error('Failed to copy text: ', err);
          });
        });
      }
    }
  });

  // ─── Prism highlight (if loaded) ─────────────────────────
  if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
  }

})();
