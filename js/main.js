// ========================
// NAVIGATION
// ========================

// Menu burger toggle
const burger = document.querySelector('.nav__burger');
const navList = document.querySelector('.nav__list');
const navLinks = document.querySelectorAll('.nav__link');

if (burger) {
  burger.addEventListener('click', () => {
    navList.classList.toggle('nav__list--open');
    burger.classList.toggle('nav__burger--active');
  });
}

// Close menu when clicking on a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navList.classList.remove('nav__list--open');
    burger.classList.remove('nav__burger--active');
  });
});

// ========================
// HEADER SCROLL EFFECT
// ========================

const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  // Add shadow on scroll
  if (currentScroll > 10) {
    header.classList.add('header--scrolled');
  } else {
    header.classList.remove('header--scrolled');
  }

  lastScroll = currentScroll;
});

// ========================
// ACTIVE NAVIGATION LINK
// ========================

const sections = document.querySelectorAll('.section');

const observerOptions = {
  root: null,
  rootMargin: '-50% 0px',
  threshold: 0
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');

      // Remove active class from all links
      navLinks.forEach(link => {
        link.classList.remove('nav__link--active');
      });

      // Add active class to current link
      const activeLink = document.querySelector(`.nav__link[href="#${id}"]`);
      if (activeLink) {
        activeLink.classList.add('nav__link--active');
      }
    }
  });
}, observerOptions);

sections.forEach(section => {
  observer.observe(section);
});

// ========================
// TIMELINE SCROLL ANIMATIONS
// ========================

const timelineItems = document.querySelectorAll('.education__timeline-item');

const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, {
  threshold: 0.2,
  rootMargin: '0px 0px -100px 0px'
});

timelineItems.forEach(item => {
  timelineObserver.observe(item);
});

// ========================
// SMOOTH SCROLL POLYFILL
// ========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));

    if (target) {
      const headerHeight = header.offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ========================
// HERO ANIMATIONS ON LOAD
// ========================

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// ========================
// PROJECTS LOADER
// ========================

async function loadProjects() {
  try {
    const response = await fetch('data/projects.json');
    const data = await response.json();
    const projectsContainer = document.querySelector('.projects');

    if (!projectsContainer) return;

    // Trier les projets par date (plus récent en premier)
    const sortedProjects = data.projects.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    // Générer le HTML pour chaque projet
    projectsContainer.innerHTML = sortedProjects.map(project => {
      // Formater la date
      const date = new Date(project.date);
      const formattedDate = date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });

      // Générer le badge pour chaque compétence
      const competencesBadges = project.competences.map(comp =>
        `<span class="project-card__badge">${comp}</span>`
      ).join('');

      // Générer le média (image ou vidéo)
      const mediaHTML = project.media.type === 'video'
        ? `<video class="project-card__media" controls>
             <source src="${project.media.url}" type="video/mp4">
             Votre navigateur ne supporte pas la lecture de vidéos.
           </video>`
        : `<img src="${project.media.url}" alt="${project.titre}" class="project-card__media">`;

      // Générer le lien si présent
      const linkHTML = project.lien
        ? `<a href="${project.lien}" target="_blank" rel="noopener noreferrer" class="project-card__link">
             <i class="fa-solid fa-arrow-up-right-from-square"></i> Voir le projet
           </a>`
        : '';

      // Générer le lien repository
      const linkREPO = project.repository
        ? `<a href="${project.repository}" target="_blank" rel="noopener noreferrer" class="project-card__repo">
             <i class="fa-brands fa-github"></i> Voir le repo
           </a>`
        : '';

      // Conteneur pour les liens
      const linksContainer = (linkHTML || linkREPO)
        ? `<div class="project-card__links">
             ${linkHTML}
             ${linkREPO}
           </div>`
        : '';

      return `
        <article class="project-card">
          <div class="project-card__image-container">
            ${mediaHTML}
          </div>
          <div class="project-card__content">
            <div class="project-card__header">
              <h3 class="project-card__title">${project.titre}</h3>
              <span class="project-card__date">${formattedDate}</span>
            </div>
            <p class="project-card__description">${project.description}</p>
            <div class="project-card__competences">
              ${competencesBadges}
            </div>
            ${linksContainer}
          </div>
        </article>
      `;
    }).join('');

  } catch (error) {
    console.error('Erreur lors du chargement des projets:', error);
  }
}

// Charger les projets au chargement de la page
document.addEventListener('DOMContentLoaded', loadProjects);

// ========================
// EXPERIENCE ACCORDION
// ========================

const experienceToggles = document.querySelectorAll('.experience-card__toggle');

experienceToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    const card = toggle.closest('.experience-card');

    // Toggle la classe active sur la card
    card.classList.toggle('experience-card--active');

    // Optionnel: fermer les autres cards (accordion comportement)
    // Décommenter si vous voulez qu'une seule card soit ouverte à la fois
    /*
    experienceToggles.forEach(otherToggle => {
      if (otherToggle !== toggle) {
        const otherCard = otherToggle.closest('.experience-card');
        otherCard.classList.remove('experience-card--active');
      }
    });
    */
  });
});

// ========================
// EMAIL OBFUSCATION
// ========================

document.addEventListener('DOMContentLoaded', () => {
  const emailLink = document.querySelector('.contact-link--email');

  if (emailLink) {
    emailLink.addEventListener('click', (e) => {
      e.preventDefault();
      const email = emailLink.getAttribute('data-email');

      if (email) {
        // Ouvrir le client email
        window.location.href = `mailto:${email}`;
      }
    });
  }
});
