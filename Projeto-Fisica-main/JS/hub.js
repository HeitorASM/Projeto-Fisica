// Toggle do menu mobile
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

// Fechar o menu ao clicar em um link
document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));

// Destacar a seção atual no menu
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
    let current = "";
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute("id");
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href").substring(1) === current) {
            link.classList.add("active");
        }
    });
});

// Animação de digitação para o título (opcional)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = "";
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Aplicar animação de digitação ao título se ele estiver visível
const titleElement = document.querySelector(".logo-placeholder h1");
if (titleElement) {
    const originalText = titleElement.textContent;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeWriter(titleElement, originalText, 100);
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(titleElement);
}

// Efeito de parallax suave no header
window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 100) {
        header.style.background = "linear-gradient(90deg, #2c3e50 0%, #3a5678 100%)";
        header.style.padding = "1rem 0";
    } else {
        header.style.background = "linear-gradient(90deg, #2c3e50 0%, #4a6580 100%)";
        header.style.padding = "2rem 0";
    }
});

// Tooltip para ícones informativos
const infoIcons = document.querySelectorAll(".fa-info-circle, .fa-lightbulb, .fa-book");
infoIcons.forEach(icon => {
    icon.addEventListener("mouseenter", (e) => {
        const tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        tooltip.textContent = e.target.parentElement.textContent.trim();
        document.body.appendChild(tooltip);
        
        const rect = e.target.getBoundingClientRect();
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    });
    
    icon.addEventListener("mouseleave", () => {
        const tooltip = document.querySelector(".tooltip");
        if (tooltip) {
            tooltip.remove();
        }
    });
});