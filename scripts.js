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

/* CONTACT FORM HANDLING (Web3Forms) */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formResult = document.getElementById('form-result');
    const submitBtn = document.getElementById('submit-btn');

    if (!contactForm) return;

    // Jingle de confirmation (Web Audio API)
    function playSuccessJingle() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const notes = [
                { freq: 523.25, start: 0, dur: 0.15 },
                { freq: 659.25, start: 0.15, dur: 0.15 },
                { freq: 783.99, start: 0.30, dur: 0.15 },
                { freq: 1046.50, start: 0.45, dur: 0.30 }
            ];
            notes.forEach(n => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = n.freq;
                gain.gain.setValueAtTime(0.15, ctx.currentTime + n.start);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.start + n.dur);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + n.start);
                osc.stop(ctx.currentTime + n.start + n.dur + 0.05);
            });
        } catch (e) { }
    }

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // 1. Validation manuelle
        const requiredFields = [
            { name: 'nom', label: 'Nom' },
            { name: 'prenom', label: 'Prénom' },
            { name: 'email', label: 'Email' },
            { name: 'objet', label: 'Objet' },
            { name: 'message', label: 'Message' }
        ];

        let missingFields = [];
        requiredFields.forEach(field => {
            const input = contactForm.querySelector(`[name="${field.name}"]`);
            if (!input || !input.value.trim()) {
                missingFields.push(field.label);
                if (input) {
                    input.style.borderColor = "#e74c3c";
                    input.addEventListener('input', () => input.style.borderColor = "", { once: true });
                }
            }
        });

        if (missingFields.length > 0) {
            formResult.textContent = `Veuillez remplir les champs suivants : ${missingFields.join(', ')}.`;
            formResult.className = 'form-result error';
            formResult.style.display = 'block';
            return;
        }

        // 2. Préparation de l'envoi (FormData natif pour éviter les erreurs CORS preflight 403)
        const formData = new FormData(contactForm);
        
        // Afficher le chargement
        submitBtn.disabled = true;
        const originalBtnSpan = submitBtn.querySelector('span');
        const originalBtnIcon = submitBtn.querySelector('i');
        const originalBtnText = originalBtnSpan.textContent;
        originalBtnSpan.textContent = 'Envoi en cours...';
        originalBtnIcon.className = 'bx bx-loader-alt bx-spin';
        formResult.style.display = 'none';

        // 3. Envoi via Fetch
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(async response => {
            const data = await response.json();
            console.log("Web3Forms Response:", data);
            
            if (response.ok && data.success) {
                // SUCCÈS RÉEL - Redirection vers la page de remerciement
                window.location.href = "merci.html";
            } else {
                // ERREUR SERVEUR
                console.error("Erreur API:", data);
                formResult.textContent = data.message || "Une erreur est survenue lors de l'envoi.";
                formResult.className = 'form-result error';
            }
        })
        .catch(error => {
            // ERREUR RÉSEAU / SÉCURITÉ
            console.error("Erreur Fetch:", error);
            formResult.textContent = "Impossible d'envoyer le message. Vérifiez votre connexion ou la console.";
            formResult.className = 'form-result error';
        })
        .finally(() => {
            submitBtn.disabled = false;
            originalBtnSpan.textContent = originalBtnText;
            originalBtnIcon.className = 'bx bx-send';
            formResult.style.display = 'block';
        });
    });
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
            const url = this.getAttribute('href');
            
            // Si c'est un PDF, on laisse le comportement par défaut (ouverture nouvel onglet)
            if (url.toLowerCase().endsWith('.pdf')) {
                return;
            }

            e.preventDefault();
            
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

/* MOBILE TIMELINE GENERATOR (V65 - With Institutions) */
function initMobileTimeline() {
    const eduList = document.getElementById('mobile-edu-list');
    const expList = document.getElementById('mobile-exp-list');
    if (!eduList || !expList) return;

    // Récupérer tous les items et les inverser pour avoir le plus récent en haut
    const items = Array.from(document.querySelectorAll('.timeline-item')).reverse();
    
    items.forEach(item => {
        if (item.classList.contains('dual-node')) {
            // Handle Education part of Dual Node
            const eduData = item.querySelector('.details-data-edu');
            const eduInst = eduData.querySelector('.institution') ? eduData.querySelector('.institution').innerText : "";
            const eduTitleNode = item.querySelector('.dual-header h3');
            const eduTitle = eduTitleNode.innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, ' ').split(/\s+/).join(' ').trim();
            
            const date = item.querySelector('.header-date').innerText;
            createMobileBlock(eduTitle, date, eduData.innerHTML, 'education', eduList, eduInst);

            // Handle Work part of Dual Node
            const workData = item.querySelector('.details-data-work');
            const workInst = workData.querySelector('.institution') ? workData.querySelector('.institution').innerText : "";
            const workTitleElement = workData.querySelector('.specific-title');
            const workTitle = workTitleElement ? 
                workTitleElement.innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, ' ').split(/\s+/).join(' ').trim() : 
                eduTitle;
            createMobileBlock(workTitle, date, workData.innerHTML, 'work', expList, workInst);
        } else {
            const titleElement = item.querySelector('h3');
            const titleRaw = item.getAttribute('data-panel-title') || (titleElement ? titleElement.innerHTML : "Détails");
            const title = titleRaw.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, ' ').split(/\s+/).join(' ').trim();
            
            const dateElement = item.querySelector('.header-date');
            const date = item.getAttribute('data-panel-date') || (dateElement ? dateElement.innerText : "");
            
            const instElement = item.querySelector('.institution');
            const institution = instElement ? instElement.innerText : "";

            const detailsElement = item.querySelector('.timeline-details');
            const details = detailsElement ? detailsElement.innerHTML : "";
            
            const type = item.classList.contains('education') ? 'education' : 
                         item.classList.contains('work') ? 'work' : 'volunteering';
            const target = type === 'education' ? eduList : expList;
            
            createMobileBlock(title, date, details, type, target, institution);
        }
    });
}

function createMobileBlock(title, date, details, type, target, institution) {
    const block = document.createElement('div');
    block.className = `mobile-item ${type}`;
    
    // Si institution n'est pas déjà dans details (pour dual nodes c'est déjà dedans)
    let instHtml = "";
    if (institution && !details.includes(institution)) {
        instHtml = `<p class="mobile-institution"><strong>${institution}</strong></p>`;
    }

    block.innerHTML = `
        <div class="mobile-item-header">
            <h5>${title}</h5>
            <span class="mobile-year">${date}</span>
        </div>
        <div class="mobile-item-details">
            ${instHtml}
            ${details}
        </div>
    `;
    
    block.onclick = function() {
        this.classList.toggle('active');
    };
    
    target.appendChild(block);
}

// Attach Event Listeners (CSP Compliant)
function initTimelineEvents() {
    // Regular items
    document.querySelectorAll('.timeline-item:not(.dual-node)').forEach(item => {
        item.addEventListener('click', () => toggleTimeline(item));
    });

    // Dual nodes (dots)
    document.querySelectorAll('.dot-half').forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            const type = dot.getAttribute('data-type');
            toggleDualV2(dot, type);
        });
    });

    // Contact boxes
    document.querySelectorAll('.contact-box[data-href]').forEach(box => {
        box.addEventListener('click', () => {
            window.location.href = box.getAttribute('data-href');
        });
    });

    document.querySelectorAll('.contact-box[data-url]').forEach(box => {
        box.addEventListener('click', () => {
            window.open(box.getAttribute('data-url'), '_blank', 'noopener,noreferrer');
        });
    });
}

/* OBFUSCATION LOGIC */
function initObfuscation() {
    // Decode text contents
    document.querySelectorAll('.obf-text').forEach(el => {
        el.textContent = atob(el.getAttribute('data-obf'));
    });

    // Decode links
    document.querySelectorAll('.obf-link').forEach(el => {
        const decoded = atob(el.getAttribute('data-obf'));
        const type = el.getAttribute('data-type');
        el.href = type + ':' + decoded;
    });

    // Decode contact boxes (data-href)
    document.querySelectorAll('.obf-box').forEach(el => {
        const decoded = atob(el.getAttribute('data-obf'));
        const type = el.getAttribute('data-type');
        el.setAttribute('data-href', type + ':' + decoded);
    });
}

/* SMOOTH SCROLL SANS MODIFICATION DE L'URL */
function initSmoothScroll() {
    // Intercepter tous les clics sur les liens internes (#section)
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') {
            // Lien "#" seul = retour en haut
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            e.preventDefault();
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Nettoyer le hash de l'URL au chargement si présent
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 100);
        }
        history.replaceState(null, '', window.location.pathname);
    }
}

// Call on load
document.addEventListener('DOMContentLoaded', () => {
    initObfuscation();
    initMobileTimeline();
    initTimelineEvents();
    initContactForm();
    initSmoothScroll();
});
