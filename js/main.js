/* =========================================
   RIDY Payout Landing Page — Interactivity
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ──────────────────────────────────────
  // 1. Hero Tab Switcher
  // ──────────────────────────────────────
  const heroTabBtns = document.querySelectorAll('[data-tabs="hero"] .tab-btn');
  const heroPanels  = document.querySelectorAll('.tab-content .tab-panel');

  heroTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // Switch active button
      heroTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Fade out current panel, then switch
      heroPanels.forEach(panel => {
        if (panel.classList.contains('active')) {
          panel.style.opacity = '0';
          setTimeout(() => {
            panel.classList.remove('active');
            panel.style.display = 'none';

            // Fade in target panel
            const targetPanel = document.querySelector(`[data-panel="${target}"]`);
            if (targetPanel) {
              targetPanel.style.display = 'block';
              targetPanel.classList.add('active');
              // Trigger reflow for transition
              void targetPanel.offsetHeight;
              targetPanel.style.opacity = '1';
            }
          }, 150);
        }
      });
    });
  });


  // ──────────────────────────────────────
  // 2. Guide Tabs (Mobile)
  // ──────────────────────────────────────
  const guideTabBtns  = document.querySelectorAll('.guide-tab-btn');
  const guideColumns  = document.querySelectorAll('.guide-column');

  guideTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.guideTab;

      // Switch active tab
      guideTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/hide columns (mobile only; desktop shows both via CSS)
      guideColumns.forEach(col => {
        col.classList.remove('active');
        if (col.dataset.guideColumn === target) {
          col.classList.add('active');
        }
      });
    });
  });


  // ──────────────────────────────────────
  // 3. Accordion (Exclusive open)
  // ──────────────────────────────────────
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');

    trigger.addEventListener('click', () => {
      const parentColumn = item.closest('.guide-column');
      const isOpen = item.classList.contains('open');

      // Close all other items in same column
      if (parentColumn) {
        parentColumn.querySelectorAll('.accordion-item.open').forEach(openItem => {
          openItem.classList.remove('open');
        });
      }

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });


  // ──────────────────────────────────────
  // 4. Scroll Reveal (IntersectionObserver)
  // ──────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Apply staggered delay for grid children
          const parent = entry.target.parentElement;
          if (parent && (parent.classList.contains('admin-grid') || parent.classList.contains('rider-feature-list'))) {
            const siblings = Array.from(parent.querySelectorAll('.reveal'));
            const index = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 100}ms`;
          }

          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything
    revealElements.forEach(el => el.classList.add('visible'));
  }


  // ──────────────────────────────────────
  // 5. Mobile Sticky Bar (Hero exit trigger)
  // ──────────────────────────────────────
  const stickyBar   = document.getElementById('mobileStickyBar');
  const heroSection = document.getElementById('hero');

  if (stickyBar && heroSection && 'IntersectionObserver' in window) {
    const stickyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          // Hero has left viewport → show sticky bar
          stickyBar.classList.add('visible');
          document.body.classList.add('sticky-active');
        } else {
          // Hero is visible → hide sticky bar
          stickyBar.classList.remove('visible');
          document.body.classList.remove('sticky-active');
        }
      });
    }, {
      threshold: 0
    });

    stickyObserver.observe(heroSection);
  }


  // ──────────────────────────────────────
  // 6. Smooth Scroll for anchor links
  // ──────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});


// ──────────────────────────────────────
// 7. Consult Modal (도입 상담 분기점)
// ──────────────────────────────────────
function openConsultModal() {
  var modal = document.getElementById('consultModal');
  document.getElementById('consultStep1').style.display = '';
  document.getElementById('consultPhoneConfirm').style.display = 'none';
  document.getElementById('consultFormConfirm').style.display = 'none';
  modal.classList.add('active');
}

function closeConsultModal() {
  document.getElementById('consultModal').classList.remove('active');
}

function backToStep1() {
  document.getElementById('consultPhoneConfirm').style.display = 'none';
  document.getElementById('consultFormConfirm').style.display = 'none';
  document.getElementById('consultStep1').style.display = '';
}

function showPhoneConfirm() {
  document.getElementById('consultStep1').style.display = 'none';
  document.getElementById('consultPhoneConfirm').style.display = '';
}

function showFormConfirm() {
  document.getElementById('consultStep1').style.display = 'none';
  document.getElementById('consultFormConfirm').style.display = '';
}

function startPhoneCall() {
  window.location.href = 'tel:1555-6595';
  closeConsultModal();
}

function openConsultForm() {
  closeConsultModal();
  if (window.Tally) {
    window.Tally.openPopup('dWxAOV', {
      layout: 'modal',
      width: 500,
      overlay: true,
      emojiText: '📋',
      emojiAnimation: 'wave',
      autoClose: 3000
    });
  }
}

// 오버레이 배경 클릭 시 모달 닫기
document.addEventListener('click', function(e) {
  var modal = document.getElementById('consultModal');
  if (e.target === modal) {
    closeConsultModal();
  }
});
