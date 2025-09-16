// Elementos da interface
const frictionToggle = document.getElementById('friction-toggle');
const unitSelect = document.getElementById('unit-select');
const calculateWhat = document.getElementById('calculate-what');
const massInput = document.getElementById('mass-input');
const accelerationInput = document.getElementById('acceleration-input');
const forceInput = document.getElementById('force-input');
const frictionInputs = document.querySelectorAll('.friction-input');
const calculateButton = document.getElementById('calculate-button');
const resultDiv = document.getElementById('result');
const resultValue = document.getElementById('result-value');
const calculationDetails = document.getElementById('calculation-details');
const historyContainer = document.getElementById('calculation-history');

// Array para armazenar histórico de cálculos
let calculationHistory = [];

// Calcular quando o botão for clicado
calculateButton.addEventListener('click', function() {
    // Obter valores dos campos
    const mass = parseFloat(document.getElementById('mass').value) || 0;
    const acceleration = parseFloat(document.getElementById('acceleration').value) || 0;
    const force = parseFloat(document.getElementById('force').value) || 0;
    const hasFriction = frictionToggle.checked;
    const frictionCoefficient = parseFloat(document.getElementById('friction-coefficient').value) || 0;
    const normalForce = parseFloat(document.getElementById('normal-force').value) || 0;
    const unitSystem = unitSelect.value;
    
    // Validar entradas
    if (!validateInputs(mass, acceleration, force, hasFriction, frictionCoefficient, normalForce)) {
        return;
    }
    
    let result = 0;
    let details = '';
    let unit = unitSystem === 'si' ? 'N' : 'dina';
    let massUnit = unitSystem === 'si' ? 'kg' : 'g';
    let accelerationUnit = unitSystem === 'si' ? 'm/s²' : 'cm/s²';
    
    // Fator de conversão para CGS se necessário
    const conversionFactor = unitSystem === 'cgs' ? 100000 : 1; // 1 N = 100000 dinas
    
    // Calcular com base na seleção
    switch(calculateWhat.value) {
        case 'force':
            result = calculateForce(mass, acceleration, hasFriction, frictionCoefficient, normalForce);
            if (unitSystem === 'cgs') result *= conversionFactor;
            details = formatForceCalculation(mass, acceleration, hasFriction, frictionCoefficient, normalForce, result, unit, unitSystem);
            resultValue.textContent = `Força (F) = ${result.toFixed(2)} ${unit}`;
            break;
            
        case 'mass':
            result = calculateMass(force, acceleration, hasFriction, frictionCoefficient, normalForce);
            if (unitSystem === 'cgs') result *= 1000; // Converter kg para g
            details = formatMassCalculation(force, acceleration, hasFriction, frictionCoefficient, normalForce, result, massUnit, unitSystem);
            resultValue.textContent = `Massa (m) = ${result.toFixed(2)} ${massUnit}`;
            break;
            
        case 'acceleration':
            result = calculateAcceleration(force, mass, hasFriction, frictionCoefficient, normalForce);
            if (unitSystem === 'cgs') result *= 100; // Converter m/s² para cm/s²
            details = formatAccelerationCalculation(force, mass, hasFriction, frictionCoefficient, normalForce, result, accelerationUnit, unitSystem);
            resultValue.textContent = `Aceleração (a) = ${result.toFixed(2)} ${accelerationUnit}`;
            break;
    }
    
    // Mostrar detalhes do cálculo
    calculationDetails.textContent = details;
    
    // Exibir resultado
    resultDiv.style.display = 'block';
    
    // Adicionar ao histórico
    addToHistory(details, resultValue.textContent);
    
    // Calcular forças para o gráfico
    let resultantForce = 0;
    let frictionForceValue = 0;
    let netForce = 0;
    
    if (hasFriction) {
        frictionForceValue = frictionCoefficient * normalForce;
        if (calculateWhat.value === 'force') {
            resultantForce = result;
            netForce = resultantForce - frictionForceValue;
        } else {
            resultantForce = mass * acceleration;
            netForce = resultantForce - frictionForceValue;
        }
    } else {
        resultantForce = calculateWhat.value === 'force' ? result : mass * acceleration;
        netForce = resultantForce;
    }
    
    // Atualizar gráfico
    updateForceChart(resultantForce, frictionForceValue, netForce);
    
    // Animar com base no resultado
    animateResult(result, calculateWhat.value, unitSystem);
});

// Funções de cálculo
function calculateForce(mass, acceleration, hasFriction, frictionCoefficient, normalForce) {
    if (hasFriction) {
        const frictionForce = frictionCoefficient * normalForce;
        return mass * acceleration + frictionForce;
    } else {
        return mass * acceleration;
    }
}

function calculateMass(force, acceleration, hasFriction, frictionCoefficient, normalForce) {
    if (hasFriction) {
        const frictionForce = frictionCoefficient * normalForce;
        return (force - frictionForce) / acceleration;
    } else {
        return force / acceleration;
    }
}

function calculateAcceleration(force, mass, hasFriction, frictionCoefficient, normalForce) {
    if (hasFriction) {
        const frictionForce = frictionCoefficient * normalForce;
        return (force - frictionForce) / mass;
    } else {
        return force / mass;
    }
}

// Funções de formatação para detalhes do cálculo
function formatForceCalculation(mass, acceleration, hasFriction, frictionCoefficient, normalForce, result, unit, unitSystem) {
    if (hasFriction) {
        if (unitSystem === 'cgs') {
            const frictionForce = frictionCoefficient * normalForce * 100000;
            return `F = m × a + μ × N = ${mass} × ${acceleration} + ${frictionCoefficient} × ${normalForce} = ${(mass * acceleration).toFixed(2)} + ${frictionForce.toFixed(2)} = ${result.toFixed(2)} ${unit}`;
        }
        return `F = m × a + μ × N = ${mass} × ${acceleration} + ${frictionCoefficient} × ${normalForce} = ${(mass * acceleration).toFixed(2)} + ${(frictionCoefficient * normalForce).toFixed(2)} = ${result.toFixed(2)} ${unit}`;
    } else {
        return `F = m × a = ${mass} × ${acceleration} = ${result.toFixed(2)} ${unit}`;
    }
}

function formatMassCalculation(force, acceleration, hasFriction, frictionCoefficient, normalForce, result, unit, unitSystem) {
    if (hasFriction) {
        if (unitSystem === 'cgs') {
            const frictionForce = frictionCoefficient * normalForce * 100000;
            return `m = (F - μ × N) / a = (${force} - ${frictionCoefficient} × ${normalForce}) / ${acceleration} = ${(force - frictionForce / 100000).toFixed(2)} / ${acceleration} = ${result.toFixed(2)} ${unit}`;
        }
        return `m = (F - μ × N) / a = (${force} - ${frictionCoefficient} × ${normalForce}) / ${acceleration} = ${(force - frictionCoefficient * normalForce).toFixed(2)} / ${acceleration} = ${result.toFixed(2)} ${unit}`;
    } else {
        return `m = F / a = ${force} / ${acceleration} = ${result.toFixed(2)} ${unit}`;
    }
}

function formatAccelerationCalculation(force, mass, hasFriction, frictionCoefficient, normalForce, result, unit, unitSystem) {
    if (hasFriction) {
        if (unitSystem === 'cgs') {
            const frictionForce = frictionCoefficient * normalForce * 100000;
            return `a = (F - μ × N) / m = (${force} - ${frictionCoefficient} × ${normalForce}) / ${mass} = ${(force - frictionForce / 100000).toFixed(2)} / ${mass} = ${result.toFixed(2)} ${unit}`;
        }
        return `a = (F - μ × N) / m = (${force} - ${frictionCoefficient} × ${normalForce}) / ${mass} = ${(force - frictionCoefficient * normalForce).toFixed(2)} / ${mass} = ${result.toFixed(2)} ${unit}`;
    } else {
        return `a = F / m = ${force} / ${mass} = ${result.toFixed(2)} ${unit}`;
    }
}

// Validação de entradas
function validateInputs(mass, acceleration, force, hasFriction, frictionCoefficient, normalForce) {
    // Verificar se os campos necessários estão preenchidos
    const toCalculate = calculateWhat.value;
    
    if (toCalculate !== 'mass' && (isNaN(mass) || mass <= 0)) {
        alert("Por favor, insira uma massa válida (maior que zero).");
        return false;
    }
    
    if (toCalculate !== 'acceleration' && (isNaN(acceleration) || acceleration <= 0)) {
        alert("Por favor, insira uma aceleração válida (maior que zero).");
        return false;
    }
    
    if (toCalculate !== 'force' && (isNaN(force) || force <= 0)) {
        alert("Por favor, insira uma força válida (maior que zero).");
        return false;
    }
    
    if (hasFriction) {
        if (isNaN(frictionCoefficient) || frictionCoefficient <= 0 || frictionCoefficient > 1) {
            alert("Por favor, insira um coeficiente de atrito válido (entre 0 e 1).");
            return false;
        }
        
        if (isNaN(normalForce) || normalForce <= 0) {
            alert("Por favor, insira uma força normal válida (maior que zero).");
            return false;
        }
    }
    
    return true;
}

// Adicionar cálculo ao histórico
function addToHistory(calculation, result) {
    const historyItem = {
        calculation,
        result,
        timestamp: new Date().toLocaleString('pt-BR')
    };
    
    calculationHistory.unshift(historyItem);
    
    // Manter apenas os últimos 5 cálculos
    if (calculationHistory.length > 5) {
        calculationHistory.pop();
    }
    
    // Atualizar a exibição do histórico
    updateHistoryDisplay();
}

// Atualizar a exibição do histórico
function updateHistoryDisplay() {
    historyContainer.innerHTML = '';
    
    calculationHistory.forEach(item => {
        const historyElement = document.createElement('div');
        historyElement.classList.add('history-item');
        historyElement.innerHTML = `
            <p><strong>${item.timestamp}</strong></p>
            <p>${item.calculation}</p>
            <p>${item.result}</p>
        `;
        historyContainer.appendChild(historyElement);
    });
    
    // Mostrar ou ocultar a seção de histórico com base no conteúdo
    document.querySelector('.history-section').style.display = 
        calculationHistory.length > 0 ? 'block' : 'none';
}