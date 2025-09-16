// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const frictionToggle = document.getElementById('friction-toggle');
    const calculateWhat = document.getElementById('calculate-what');
    const frictionInputs = document.querySelectorAll('.friction-input');
    const unitSelect = document.getElementById('unit-select');
    const massUnit = document.getElementById('mass-unit');
    const accelerationUnit = document.getElementById('acceleration-unit');
    const forceUnit = document.getElementById('force-unit');
    const normalForceUnit = document.getElementById('normal-force-unit');
    const exampleButtons = document.querySelectorAll('.example-btn');
    const restartAnimationBtn = document.getElementById('restart-animation');
    
    // Mostrar/ocultar campos de atrito
    frictionToggle.addEventListener('change', function() {
        frictionInputs.forEach(input => {
            input.style.display = this.checked ? 'block' : 'none';
        });
    });
    
    // Atualizar campos de entrada com base no que será calculado
    calculateWhat.addEventListener('change', function() {
        // Resetar todos os campos
        massInput.style.display = 'block';
        accelerationInput.style.display = 'block';
        forceInput.style.display = 'block';
        
        // Ocultar o campo que será calculado
        switch(this.value) {
            case 'force':
                forceInput.style.display = 'none';
                break;
            case 'mass':
                massInput.style.display = 'none';
                break;
            case 'acceleration':
                accelerationInput.style.display = 'none';
                break;
        }
    });
    
    // Atualizar unidades com base na seleção
    unitSelect.addEventListener('change', function() {
        if (this.value === 'si') {
            massUnit.textContent = 'kg';
            accelerationUnit.textContent = 'm/s²';
            forceUnit.textContent = 'N';
            normalForceUnit.textContent = 'N';
        } else {
            massUnit.textContent = 'g';
            accelerationUnit.textContent = 'cm/s²';
            forceUnit.textContent = 'dina';
            normalForceUnit.textContent = 'dina';
        }
    });
    
    // Botões de exemplo
    exampleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mass = this.dataset.mass || '';
            const acceleration = this.dataset.acceleration || '';
            const force = this.dataset.force || '';
            const friction = this.dataset.friction || '';
            const normal = this.dataset.normal || '';
            
            if (mass) document.getElementById('mass').value = mass;
            if (acceleration) document.getElementById('acceleration').value = acceleration;
            if (force) document.getElementById('force').value = force;
            if (friction) {
                frictionToggle.checked = true;
                frictionInputs.forEach(input => input.style.display = 'block');
                document.getElementById('friction-coefficient').value = friction;
            }
            if (normal) document.getElementById('normal-force').value = normal;
            
            // Rolar para a seção de cálculo
            document.querySelector('.input-group').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Botão para reiniciar animação
    restartAnimationBtn.addEventListener('click', function() {
        const resultDiv = document.getElementById('result');
        if (resultDiv.style.display === 'block') {
            const calculateButton = document.getElementById('calculate-button');
            calculateButton.click();
        }
    });
    
    // Inicializar a interface
    calculateWhat.dispatchEvent(new Event('change'));
    unitSelect.dispatchEvent(new Event('change'));
    
    // Relógio
    function updateDateTime() {
        const now = new Date();
        const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('current-date').textContent = now.toLocaleDateString('pt-BR', optionsDate);
        document.getElementById('current-time').textContent = now.toLocaleTimeString('pt-BR');
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();
    
    // Inicializar gráfico
    initializeChart();
});

// Função para inicializar o gráfico de forças
function initializeChart() {
    const ctx = document.getElementById('force-chart').getContext('2d');
    window.forceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Força Resultante', 'Força de Atrito', 'Força Líquida'],
            datasets: [{
                label: 'Magnitude das Forças (N)',
                data: [0, 0, 0],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.7)',
                    'rgba(231, 76, 60, 0.7)',
                    'rgba(46, 204, 113, 0.7)'
                ],
                borderColor: [
                    'rgb(52, 152, 219)',
                    'rgb(231, 76, 60)',
                    'rgb(46, 204, 113)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Função para atualizar o gráfico de forças
function updateForceChart(resultantForce, frictionForce, netForce) {
    if (window.forceChart) {
        window.forceChart.data.datasets[0].data = [
            resultantForce,
            frictionForce,
            netForce
        ];
        window.forceChart.update();
    }
}