/* TOGGLE NAVBAR ICON */
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

/* SCROLL SECTIONS ACTIVE LINK */
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        };
    });

    /* STICKY NAVBAR */
    let header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 100);

    /* REMOVE TOGGLE ICON AND NAVBAR WHEN CLICK NAVBAR LINK (SCROLL) */
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};

/* SCROLL REVEAL ARTIFACTS */
ScrollReveal({
    distance: '80px',
    duration: 2000,
    delay: 200
});

ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img, .skills-container, .projects-box, .contact form, .timeline-item', { origin: 'bottom' });
ScrollReveal().reveal('.home-content h1, .about-intro, .a-propos-text', { origin: 'left' });
ScrollReveal().reveal('.home-content p, .a-propos-info', { origin: 'right' });

/* TYPED JS */
const typed = new Typed('.multiple-text', {
    strings: ['Systèmes', 'Réseaux', 'et Sécurité Informatique'],
    typeSpeed: 60,
    backSpeed: 30,
    backDelay: 1000,
    loop: true
});

/* FORM SUBMISSION PREVENT (Demo) */
const form = document.querySelector('form');
if (form) {
    form.onsubmit = (e) => {
        e.preventDefault();
        alert('Ceci est une démo. Le message ne sera pas réellement envoyé.');
    };
}

/* PROJECT MODAL LOGIC */
const projectLinks = document.querySelectorAll('.project-link');
const projectModal = document.getElementById('projectModal');
const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('closeModal');
const projectIframe = document.getElementById('projectIframe');
const modalLoader = document.getElementById('modalLoader');

if (projectLinks.length > 0 && projectModal) {
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('href');
            
            // Afficher la modale et le loader
            modalLoader.style.display = 'block';
            projectIframe.style.opacity = '0';
            projectModal.classList.add('active');
            
            // Set l'URL de l'iframe
            projectIframe.src = url;
            document.body.style.overflow = 'hidden'; // Empêcher le scroll de la page principale
        });
    });

    // Cacher le loader quand la page est chargée
    projectIframe.addEventListener('load', function() {
        if(projectIframe.src && projectIframe.src !== '' && projectIframe.src !== window.location.href) {
            modalLoader.style.display = 'none';
            projectIframe.style.opacity = '1';
            projectIframe.style.transition = 'opacity 0.3s ease';
        }
    });

    // Fonction de fermeture de la modale
    const closeModal = () => {
        projectModal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Réactiver le scroll
        
        // Vider l'iframe après l'animation de fermeture
        setTimeout(() => {
            projectIframe.src = '';
            projectIframe.style.opacity = '0';
        }, 400); // 400ms pour correspondre à la transition CSS
    };

    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
}

/* TIMELINE TOGGLE LOGIC (MASTERBOARD V11) */
function toggleTimeline(element) {
    // 1. Réinitialiser la couleur du titre Dual en Cyan (V42)
    const dualTitle = document.getElementById('dual-title');
    if(dualTitle) dualTitle.style.setProperty('color', '#00eaff', 'important');

    // 2. Gérer l'état actif visuel sur la frise
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.classList.remove('active');
    });
    element.classList.add('active');

    // 2. Récupérer les données de l'item (Priorité aux données du panneau V54)
    const title = element.getAttribute('data-panel-title') || element.querySelector('h3').innerText;
    const date = element.getAttribute('data-panel-date') || element.querySelector('.header-date').innerText;
    const institutionHtml = element.querySelector('.institution').innerHTML;
    const details = element.querySelector('.timeline-details').innerHTML;
    
    // 3. Cibler le panneau d'affichage
    const displayBox = document.getElementById('timeline-display-box');
    
    // 4. Injecter le contenu avec une petite animation
    displayBox.style.opacity = '0';
    
    setTimeout(() => {
        displayBox.innerHTML = `
            <div class="display-box-content">
                <h3>${title}</h3>
                <p class="institution"><strong>${institutionHtml}</strong> | ${date}</p>
                <div class="details-list">${details}</div>
            </div>
        `;
        displayBox.style.opacity = '1';
        
        // Scroll fluide vers le panneau de lecture pour le confort
        displayBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);
}

/* DUAL TOGGLE LOGIC (V36 SMARTER) */
function toggleDualV2(element, type) {
    const parent = element.closest('.dual-node');
    const dataClass = type === 'edu' ? '.details-data-edu' : '.details-data-work';
    const dataNode = parent.querySelector(dataClass);
    
    // Déterminer la couleur sémantique
    const themeColor = type === 'edu' ? '#2ecc71' : '#3498db';
    
    // Mettre à jour le titre sur la frise
    const dualTitle = document.getElementById('dual-title');
    if(dualTitle) dualTitle.style.setProperty('color', themeColor, 'important');

    // Récupérer le titre (spécifique ou commmun)
    const specificTitle = dataNode.querySelector('.specific-title');
    const title = specificTitle ? specificTitle.innerText : parent.querySelector('.dual-header h3').innerText;
    
    const date = parent.querySelector('.header-date').innerText;
    const institutionHtml = dataNode.querySelector('.institution').innerHTML;
    const details = dataNode.querySelector('ul').outerHTML;

    const displayBox = document.getElementById('timeline-display-box');
    displayBox.style.opacity = '0';
    
    setTimeout(() => {
        displayBox.innerHTML = `
            <div class="display-box-content">
                <h3 style="color: ${themeColor} !important;">${title}</h3>
                <p class="institution"><strong>${institutionHtml}</strong> | ${date}</p>
                <div class="details-list">${details}</div>
            </div>
        `;
        displayBox.style.opacity = '1';
        displayBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);
}

/* MOBILE TIMELINE GENERATOR (V60) */
function initMobileTimeline() {
    const eduList = document.getElementById('mobile-edu-list');
    const expList = document.getElementById('mobile-exp-list');
    if (!eduList || !expList) return;

    // Récupérer tous les items et les inverser pour avoir le plus récent en haut (V61)
    const items = Array.from(document.querySelectorAll('.timeline-item')).reverse();
    
    items.forEach(item => {
        if (item.classList.contains('dual-node')) {
            // Handle Education part of Dual Node
            const eduData = item.querySelector('.details-data-edu');
            // Forcer l'ajout d'espaces à la place des <br> (V64)
            const eduTitleNode = item.querySelector('.dual-header h3');
            const eduTitle = eduTitleNode.innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, ' ').split(/\s+/).join(' ').trim();
            
            const date = item.querySelector('.header-date').innerText;
            createMobileBlock(eduTitle, date, eduData.innerHTML, 'education', eduList);

            // Handle Work part of Dual Node
            const workData = item.querySelector('.details-data-work');
            const workTitleElement = workData.querySelector('.specific-title');
            const workTitle = workTitleElement ? 
                workTitleElement.innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, ' ').split(/\s+/).join(' ').trim() : 
                eduTitle;
            createMobileBlock(workTitle, date, workData.innerHTML, 'work', expList);
        } else {
            const titleElement = item.querySelector('h3');
            const titleRaw = item.getAttribute('data-panel-title') || (titleElement ? titleElement.innerHTML : "Détails");
            const title = titleRaw.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, ' ').split(/\s+/).join(' ').trim();
            
            const dateElement = item.querySelector('.header-date');
            const date = item.getAttribute('data-panel-date') || (dateElement ? dateElement.innerText : "");
            const detailsElement = item.querySelector('.timeline-details');
            const details = detailsElement ? detailsElement.innerHTML : "";
            
            const type = item.classList.contains('education') ? 'education' : 
                         item.classList.contains('work') ? 'work' : 'volunteering';
            const target = type === 'education' ? eduList : expList;
            
            createMobileBlock(title, date, details, type, target);
        }
    });
}

function createMobileBlock(title, date, details, type, target) {
    const block = document.createElement('div');
    block.className = `mobile-item ${type}`;
    block.innerHTML = `
        <div class="mobile-item-header">
            <h5>${title}</h5>
            <span class="mobile-year">${date}</span>
        </div>
        <div class="mobile-item-details">
            ${details}
        </div>
    `;
    
    block.onclick = function() {
        this.classList.toggle('active');
    };
    
    target.appendChild(block);
}

// Call on load
document.addEventListener('DOMContentLoaded', initMobileTimeline);
