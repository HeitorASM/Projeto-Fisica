// Elementos de animação
const animationBox = document.getElementById('animation-box');
const particlesToggle = document.getElementById('particles-toggle');
let animationInterval;

// Função para animar o resultado
function animateResult(result, calculationType, unitSystem) {
    // Limpar qualquer animação anterior
    clearInterval(animationInterval);
    
    // Reiniciar posição do objeto
    animationBox.style.left = '0px';
    
    // Remover todas as partículas
    document.querySelectorAll('.friction-particle').forEach(particle => {
        particle.remove();
    });
    
    // Determinar a velocidade da animação com base no resultado
    let speed = 0;
    
    if (calculationType === 'force') {
        // Para força, velocidade proporcional ao valor
        speed = Math.min(10, Math.max(1, result / 20));
    } else if (calculationType === 'acceleration') {
        // Para aceleração, velocidade proporcional ao valor
        const accelerationValue = unitSystem === 'si' ? result : result / 100;
        speed = Math.min(10, Math.max(1, accelerationValue * 2));
    } else if (calculationType === 'mass') {
        // Para massa, velocidade inversamente proporcional ao valor
        const massValue = unitSystem === 'si' ? result : result / 1000;
        speed = Math.min(10, Math.max(1, 20 / massValue));
    }
    
    // Iniciar animação
    let position = 0;
    const maxPosition = document.querySelector('.animation-container').offsetWidth - animationBox.offsetWidth;
    
    animationInterval = setInterval(() => {
        position += speed;
        
        // Verificar se chegou ao final
        if (position >= maxPosition) {
            clearInterval(animationInterval);
            
            // Repetir a animação após uma breve pausa
            setTimeout(() => {
                animateResult(result, calculationType, unitSystem);
            }, 1000);
            
            return;
        }
        
        // Atualizar posição
        animationBox.style.left = `${position}px`;
        
        // Adicionar partículas de atrito se ativado
        if (particlesToggle.checked && Math.random() < 0.3) {
            createFrictionParticle(position);
        }
    }, 30);
}

// Função para criar partículas de atrito
function createFrictionParticle(position) {
    const container = document.querySelector('.animation-container');
    const particle = document.createElement('div');
    particle.classList.add('friction-particle');
    
    // Posicionar a partícula na base do objeto
    const boxBottom = animationBox.offsetTop + animationBox.offsetHeight;
    particle.style.left = `${position + animationBox.offsetWidth / 2}px`;
    particle.style.top = `${boxBottom}px`;
    
    container.appendChild(particle);
    
    // Remover a partícula após a animação
    setTimeout(() => {
        particle.remove();
    }, 1000);
}

// Alternar partículas de atrito
particlesToggle.addEventListener('change', function() {
    if (!this.checked) {
        // Remover todas as partículas se desativado
        document.querySelectorAll('.friction-particle').forEach(particle => {
            particle.remove();
        });
    }
});