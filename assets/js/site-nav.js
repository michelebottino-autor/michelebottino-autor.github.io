(() => {
  'use strict';
  function init() {
    const nav = document.getElementById('site-nav') || document.querySelector('header .nav');
    const menu = document.getElementById('menu');
    const toggle = document.getElementById('menu-toggle') || document.querySelector('.menu-toggle');
    if (!nav || !menu || !toggle || nav.dataset.navInitialized === 'true') return;
    nav.dataset.navInitialized = 'true';
    toggle.type = 'button';
    toggle.setAttribute('aria-controls',menu.id || 'menu');
    toggle.setAttribute('aria-expanded','false');
    const closeSubmenus = (except) => {
      nav.querySelectorAll('.has-submenu').forEach(item => {
        if (item === except) return;
        item.classList.remove('open');
        const button = item.querySelector('.submenu-toggle');
        if (button) button.setAttribute('aria-expanded','false');
      });
    };
    const close = () => {
      menu.classList.remove('active');
      toggle.setAttribute('aria-expanded','false');
      closeSubmenus();
    };
    toggle.addEventListener('click',event => {
      event.preventDefault();
      event.stopPropagation();
      const open = !menu.classList.contains('active');
      menu.classList.toggle('active',open);
      toggle.setAttribute('aria-expanded',String(open));
      if (!open) closeSubmenus();
    });
    // Capture-phase handler takes precedence over legacy inline listeners on older pages.
    // It prevents a single tap from opening and immediately closing a submenu.
    nav.addEventListener('click', event => {
      const button = event.target.closest('.submenu-toggle');
      if (!button || !nav.contains(button)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const item = button.closest('.has-submenu');
      if (!item) return;
      const open = !item.classList.contains('open');
      closeSubmenus(item);
      item.classList.toggle('open',open);
      button.setAttribute('aria-expanded',String(open));
      if (window.innerWidth <= 900 && !menu.classList.contains('active')) {
        menu.classList.add('active');
        toggle.setAttribute('aria-expanded','true');
      }
    }, true);
    nav.querySelectorAll('.submenu-toggle').forEach(button => {
      button.type = 'button';
      button.addEventListener('click',event => {
        event.preventDefault();
        event.stopPropagation();
        const item = button.closest('.has-submenu');
        if (!item) return;
        const open = !item.classList.contains('open');
        closeSubmenus(item);
        item.classList.toggle('open',open);
        button.setAttribute('aria-expanded',String(open));
      });
    });
    // Anchors remain native links: do not prevent their click or replace navigation.
    nav.addEventListener('click',event => {
      if (event.target.closest('a[href]')) close();
    });
    document.addEventListener('click',event => {
      if (!nav.contains(event.target)) close();
    });
    document.addEventListener('keydown',event => {
      if (event.key !== 'Escape') return;
      const wasOpen = menu.classList.contains('active') || !!nav.querySelector('.has-submenu.open');
      if (!wasOpen) return;
      close();
      toggle.focus();
    });
    window.addEventListener('resize',() => {
      if (window.innerWidth > 900) close();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();