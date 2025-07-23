// ===== CALCULADORAS CORPORAIS E DE SAÚDE =====

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const calculators = document.querySelectorAll('.calculator');

// ===== NAVIGATION =====
// Tab navigation
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const calculatorId = button.getAttribute('data-calculator');
        showCalculator(calculatorId);
        
        // Update active tab
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

// Show specific calculator
function showCalculator(calculatorId) {
    calculators.forEach(calc => {
        calc.classList.remove('active');
        if (calc.id === calculatorId) {
            calc.classList.add('active');
        }
    });
}

// ===== UTILITY FUNCTIONS =====
function formatNumber(number, decimals = 1) {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number);
}

function showResult(calculatorId) {
    const result = document.getElementById(`${calculatorId}-result`);
    if (result) {
        result.classList.add('show');
    }
}

function copyResult(calculatorId) {
    let resultText = '';
    
    switch (calculatorId) {
        case 'imc':
            const imcValue = document.getElementById('imc-value').textContent;
            const imcClass = document.getElementById('imc-classification').textContent;
            resultText = `IMC: ${imcValue} - ${imcClass}`;
            break;
        case 'tmb':
            const tmbValue = document.getElementById('tmb-value').textContent;
            const tmbTotal = document.getElementById('tmb-total').textContent;
            resultText = `TMB: ${tmbValue} kcal/dia\\nGasto Total: ${tmbTotal} kcal/dia`;
            break;
        case 'gordura':
            const gorduraValue = document.getElementById('gordura-value').textContent;
            const gorduraClass = document.getElementById('gordura-classification').textContent;
            resultText = `Gordura Corporal: ${gorduraValue}% - ${gorduraClass}`;
            break;
        case 'massa':
            const massaGorda = document.getElementById('massa-gorda-value').textContent;
            const massaMagra = document.getElementById('massa-magra-value').textContent;
            resultText = `Massa Gorda: ${massaGorda} kg\\nMassa Magra: ${massaMagra} kg`;
            break;
        case 'peso-ideal':
            const pesoMedio = document.getElementById('peso-medio').textContent;
            resultText = `Peso Ideal Médio: ${pesoMedio} kg`;
            break;
        case 'rcq':
            const rcqValue = document.getElementById('rcq-value').textContent;
            const rcqClass = document.getElementById('rcq-classification').textContent;
            resultText = `RCQ: ${rcqValue} - ${rcqClass}`;
            break;
        case 'idade-metabolica':
            const idadeReal = document.getElementById('idade-real').textContent;
            const idadeMetabolica = document.getElementById('idade-metabolica-value').textContent;
            resultText = `Idade Real: ${idadeReal} anos\\nIdade Metabólica: ${idadeMetabolica} anos`;
            break;
        case 'iac':
            const iacValue = document.getElementById('iac-value').textContent;
            const iacClass = document.getElementById('iac-classification').textContent;
            resultText = `IAC: ${iacValue}% - ${iacClass}`;
            break;
    }
    
    if (resultText && window.calculatorUtils) {
        window.calculatorUtils.copyToClipboard(resultText);
    }
}

// ===== IMC CALCULATOR - VERSÃO MELHORADA =====
document.getElementById('imc-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('imc-peso').value);
    const altura = parseFloat(document.getElementById('imc-altura').value) / 100; // Convert to meters
    
    const imc = peso / (altura * altura);
    
    // Update result with enhanced information
    const classification = getIMCClassificationEnhanced(imc);
    document.getElementById('imc-value').textContent = formatNumber(imc, 1);
    document.getElementById('imc-classification').innerHTML = `
        <div class="classification-main">${classification.category}</div>
        <div class="classification-details">
            <div class="health-status">${classification.healthStatus}</div>
            <div class="professional-tip">${classification.tip}</div>
            <div class="recommendation">${classification.recommendation}</div>
        </div>
    `;
    
    showResult('imc');
});

function getIMCClassificationEnhanced(imc) {
    let category, healthStatus, tip, recommendation, color;
    
    if (imc < 18.5) {
        category = 'Abaixo do peso';
        healthStatus = '⚠️ Atenção necessária';
        tip = '💡 <strong>Dica Profissional:</strong> O baixo peso pode indicar desnutrição ou outros problemas de saúde. É importante aumentar a ingestão calórica de forma saudável.';
        recommendation = '📋 <strong>Recomendação:</strong> Consulte um nutricionista para um plano alimentar adequado. Inclua proteínas, carboidratos complexos e gorduras saudáveis nas refeições.';
        color = '#3498db';
    } else if (imc >= 18.5 && imc <= 24.9) {
        category = 'Peso normal';
        healthStatus = '✅ Excelente condição';
        tip = '💡 <strong>Dica Profissional:</strong> Parabéns! Você está na faixa ideal de peso. Mantenha seus hábitos saudáveis para preservar essa condição.';
        recommendation = '📋 <strong>Recomendação:</strong> Continue com uma alimentação equilibrada e pratique exercícios regularmente. Faça check-ups médicos preventivos.';
        color = '#27ae60';
    } else if (imc >= 25.0 && imc <= 29.9) {
        category = 'Sobrepeso';
        healthStatus = '⚠️ Atenção recomendada';
        tip = '💡 <strong>Dica Profissional:</strong> O sobrepeso aumenta o risco de doenças cardiovasculares e diabetes. Pequenas mudanças nos hábitos podem fazer grande diferença.';
        recommendation = '📋 <strong>Recomendação:</strong> Adote uma dieta balanceada com déficit calórico moderado e inclua atividade física regular. Meta: perder 0,5-1kg por semana.';
        color = '#f39c12';
    } else if (imc >= 30.0 && imc <= 34.9) {
        category = 'Obesidade Grau I';
        healthStatus = '🚨 Intervenção necessária';
        tip = '💡 <strong>Dica Profissional:</strong> A obesidade grau I requer atenção médica. O acompanhamento profissional é fundamental para um emagrecimento seguro e eficaz.';
        recommendation = '📋 <strong>Recomendação:</strong> Procure orientação médica e nutricional. Inicie atividades físicas de baixo impacto e faça mudanças graduais na alimentação.';
        color = '#e67e22';
    } else if (imc >= 35.0 && imc <= 39.9) {
        category = 'Obesidade Grau II';
        healthStatus = '🚨 Intervenção urgente';
        tip = '💡 <strong>Dica Profissional:</strong> A obesidade grau II apresenta riscos significativos à saúde. O tratamento multidisciplinar é essencial para resultados sustentáveis.';
        recommendation = '📋 <strong>Recomendação:</strong> Acompanhamento médico obrigatório. Considere tratamentos especializados e avalie todas as opções terapêuticas disponíveis.';
        color = '#d35400';
    } else {
        category = 'Obesidade Grau III';
        healthStatus = '🚨 Emergência médica';
        tip = '💡 <strong>Dica Profissional:</strong> A obesidade mórbida requer intervenção médica imediata. Existem tratamentos eficazes, incluindo opções cirúrgicas quando indicadas.';
        recommendation = '📋 <strong>Recomendação:</strong> Procure atendimento médico especializado urgentemente. Avalie cirurgia bariátrica e outros tratamentos intensivos com profissionais qualificados.';
        color = '#c0392b';
    }
    
    return { category, healthStatus, tip, recommendation, color };
}

// ===== TMB CALCULATOR WITH MULTIPLE FORMULAS =====
document.getElementById('tmb-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('tmb-peso').value);
    const altura = parseFloat(document.getElementById('tmb-altura').value);
    const idade = parseInt(document.getElementById('tmb-idade').value);
    const sexo = document.getElementById('tmb-sexo').value;
    const atividade = parseFloat(document.getElementById('tmb-atividade').value);
    
    // Calculate TMB using multiple formulas for comparison
    let harrisBenedict, mifflinStJeor, katchMcArdle;
    
    // Harris-Benedict Formula (Revised)
    if (sexo === 'masculino') {
        harrisBenedict = 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * idade);
    } else {
        harrisBenedict = 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * idade);
    }
    
    // Mifflin-St Jeor Formula (more accurate for most people)
    if (sexo === 'masculino') {
        mifflinStJeor = (10 * peso) + (6.25 * altura) - (5 * idade) + 5;
    } else {
        mifflinStJeor = (10 * peso) + (6.25 * altura) - (5 * idade) - 161;
    }
    
    // Use Mifflin-St Jeor as primary (more accurate)
    const tmb = mifflinStJeor;
    const gastoTotal = tmb * atividade;
    
    // Update results with detailed breakdown
    document.getElementById('tmb-value').textContent = formatNumber(tmb, 0);
    document.getElementById('tmb-total').textContent = formatNumber(gastoTotal, 0);
    
    // Add comparison of formulas
    const comparacao = document.getElementById('tmb-comparacao') || createComparisonElement();
    comparacao.innerHTML = `
        <h4>Comparação de Fórmulas</h4>
        <div class="formula-comparison">
            <div class="formula-item primary">
                <span class="formula-name">Mifflin-St Jeor (Recomendada)</span>
                <span class="formula-value">${formatNumber(mifflinStJeor, 0)} kcal/dia</span>
                <span class="formula-note">Mais precisa para a maioria das pessoas</span>
            </div>
            <div class="formula-item">
                <span class="formula-name">Harris-Benedict</span>
                <span class="formula-value">${formatNumber(harrisBenedict, 0)} kcal/dia</span>
                <span class="formula-note">Fórmula clássica, pode superestimar</span>
            </div>
        </div>
    `;
    
    // Enhanced recommendations based on activity level and goals
    const recomendacoes = document.getElementById('tmb-recomendacoes') || createRecommendationsElement();
    let recomendacoesHTML = `
        <h4>Recomendações Personalizadas</h4>
        <div class="tmb-goals">
            <div class="goal-item">
                <h5><i class="fas fa-minus-circle"></i> Para Perder Peso</h5>
                <p><strong>Déficit calórico:</strong> ${formatNumber(gastoTotal - 500, 0)} - ${formatNumber(gastoTotal - 300, 0)} kcal/dia</p>
                <p>Reduza 300-500 kcal do seu gasto total. Perda saudável: 0,5-1kg por semana.</p>
            </div>
            <div class="goal-item">
                <h5><i class="fas fa-equals"></i> Para Manter Peso</h5>
                <p><strong>Manutenção:</strong> ${formatNumber(gastoTotal, 0)} kcal/dia</p>
                <p>Mantenha o equilíbrio entre calorias consumidas e gastas.</p>
            </div>
            <div class="goal-item">
                <h5><i class="fas fa-plus-circle"></i> Para Ganhar Peso</h5>
                <p><strong>Superávit calórico:</strong> ${formatNumber(gastoTotal + 300, 0)} - ${formatNumber(gastoTotal + 500, 0)} kcal/dia</p>
                <p>Adicione 300-500 kcal ao seu gasto total. Ganho saudável: 0,5kg por semana.</p>
            </div>
        </div>
    `;
    
    // Activity level specific advice
    if (atividade <= 1.2) {
        recomendacoesHTML += `
            <div class="activity-advice sedentary">
                <i class="fas fa-exclamation-triangle"></i>
                <span><strong>Nível de Atividade Baixo:</strong> Considere aumentar gradualmente a atividade física. Comece com caminhadas de 10-15 minutos por dia.</span>
            </div>
        `;
    } else if (atividade >= 1.9) {
        recomendacoesHTML += `
            <div class="activity-advice high">
                <i class="fas fa-fire"></i>
                <span><strong>Nível de Atividade Alto:</strong> Excelente! Mantenha a consistência e garanta recuperação adequada entre treinos intensos.</span>
            </div>
        `;
    }
    
    recomendacoesHTML += `
        <div class="general-tips">
            <h5>Dicas Importantes</h5>
            <ul>
                <li><strong>Hidratação:</strong> Beba pelo menos ${formatNumber(peso * 35, 0)}ml de água por dia</li>
                <li><strong>Distribuição:</strong> Divida as calorias em 4-6 refeições ao longo do dia</li>
                <li><strong>Qualidade:</strong> Priorize alimentos integrais e nutritivos sobre calorias vazias</li>
                <li><strong>Monitoramento:</strong> Acompanhe seu progresso semanalmente, não diariamente</li>
            </ul>
        </div>
    `;
    
    recomendacoes.innerHTML = recomendacoesHTML;
    
    showResult('tmb');
});

function createComparisonElement() {
    const element = document.createElement('div');
    element.id = 'tmb-comparacao';
    element.className = 'tmb-comparison';
    document.getElementById('tmb-result').appendChild(element);
    return element;
}

function createRecommendationsElement() {
    const element = document.createElement('div');
    element.id = 'tmb-recomendacoes';
    element.className = 'tmb-recommendations';
    document.getElementById('tmb-result').appendChild(element);
    return element;
}

// ===== GORDURA CORPORAL CALCULATOR =====
// Show/hide quadril field based on gender
document.getElementById('gordura-sexo').addEventListener('change', function() {
    const quadrilGroup = document.getElementById('gordura-quadril-group');
    const quadrilInput = document.getElementById('gordura-quadril');
    
    if (this.value === 'feminino') {
        quadrilGroup.style.display = 'block';
        quadrilInput.required = true;
    } else {
        quadrilGroup.style.display = 'none';
        quadrilInput.required = false;
        quadrilInput.value = '';
    }
});

document.getElementById('gordura-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const altura = parseFloat(document.getElementById('gordura-altura').value);
    const sexo = document.getElementById('gordura-sexo').value;
    const cintura = parseFloat(document.getElementById('gordura-cintura').value);
    const pescoco = parseFloat(document.getElementById('gordura-pescoco').value);
    const quadril = parseFloat(document.getElementById('gordura-quadril').value) || 0;
    
    let gordura;
    
    // US Navy Formula
    if (sexo === 'masculino') {
        gordura = 495 / (1.0324 - 0.19077 * Math.log10(cintura - pescoco) + 0.15456 * Math.log10(altura)) - 450;
    } else {
        gordura = 495 / (1.29579 - 0.35004 * Math.log10(cintura + quadril - pescoco) + 0.22100 * Math.log10(altura)) - 450;
    }
    
    // Ensure positive value
    gordura = Math.max(0, gordura);
    
    // Update result
    document.getElementById('gordura-value').textContent = formatNumber(gordura, 1);
    document.getElementById('gordura-classification').textContent = getGorduraClassification(gordura, sexo);
    
    showResult('gordura');
});

function getGorduraClassification(gordura, sexo) {
    if (sexo === 'masculino') {
        if (gordura < 6) return 'Essencial';
        if (gordura < 14) return 'Atlético';
        if (gordura < 18) return 'Fitness';
        if (gordura < 25) return 'Aceitável';
        return 'Obesidade';
    } else {
        if (gordura < 14) return 'Essencial';
        if (gordura < 21) return 'Atlético';
        if (gordura < 25) return 'Fitness';
        if (gordura < 32) return 'Aceitável';
        return 'Obesidade';
    }
}

// ===== MASSA MAGRA E GORDA CALCULATOR =====
document.getElementById('massa-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('massa-peso').value);
    const gorduraPercent = parseFloat(document.getElementById('massa-gordura').value);
    
    const massaGorda = peso * (gorduraPercent / 100);
    const massaMagra = peso - massaGorda;
    
    // Update results
    document.getElementById('massa-gorda-value').textContent = formatNumber(massaGorda, 1);
    document.getElementById('massa-magra-value').textContent = formatNumber(massaMagra, 1);
    
    showResult('massa');
});

// ===== PESO IDEAL CALCULATOR =====
document.getElementById('peso-ideal-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const altura = parseFloat(document.getElementById('peso-ideal-altura').value);
    const sexo = document.getElementById('peso-ideal-sexo').value;
    const idade = parseInt(document.getElementById('peso-ideal-idade').value);
    
    const alturaM = altura / 100;
    
    // Different formulas
    let robinson, miller, devine;
    
    if (sexo === 'masculino') {
        // Robinson Formula
        robinson = 52 + 1.9 * ((altura - 152.4) / 2.54);
        // Miller Formula  
        miller = 56.2 + 1.41 * ((altura - 152.4) / 2.54);
        // Devine Formula
        devine = 50 + 2.3 * ((altura - 152.4) / 2.54);
    } else {
        // Robinson Formula
        robinson = 49 + 1.7 * ((altura - 152.4) / 2.54);
        // Miller Formula
        miller = 53.1 + 1.36 * ((altura - 152.4) / 2.54);
        // Devine Formula
        devine = 45.5 + 2.3 * ((altura - 152.4) / 2.54);
    }
    
    const pesoMedio = (robinson + miller + devine) / 3;
    
    // Update results
    document.getElementById('peso-robinson').textContent = formatNumber(robinson, 1);
    document.getElementById('peso-miller').textContent = formatNumber(miller, 1);
    document.getElementById('peso-devine').textContent = formatNumber(devine, 1);
    document.getElementById('peso-medio').textContent = formatNumber(pesoMedio, 1);
    
    showResult('peso-ideal');
});

// ===== RCQ CALCULATOR =====
document.getElementById('rcq-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const cintura = parseFloat(document.getElementById('rcq-cintura').value);
    const quadril = parseFloat(document.getElementById('rcq-quadril').value);
    const sexo = document.getElementById('rcq-sexo').value;
    
    const rcq = cintura / quadril;
    
    // Update result
    document.getElementById('rcq-value').textContent = formatNumber(rcq, 2);
    document.getElementById('rcq-classification').textContent = getRCQClassification(rcq, sexo);
    
    showResult('rcq');
});

function getRCQClassification(rcq, sexo) {
    if (sexo === 'masculino') {
        if (rcq < 0.90) return 'Baixo risco';
        if (rcq < 0.95) return 'Risco moderado';
        return 'Alto risco';
    } else {
        if (rcq < 0.80) return 'Baixo risco';
        if (rcq < 0.85) return 'Risco moderado';
        return 'Alto risco';
    }
}

// ===== IDADE METABÓLICA CALCULATOR =====
document.getElementById('idade-metabolica-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('idade-peso').value);
    const altura = parseFloat(document.getElementById('idade-altura').value);
    const idadeReal = parseInt(document.getElementById('idade-idade').value);
    const sexo = document.getElementById('idade-sexo').value;
    
    // Calculate TMB
    let tmb;
    if (sexo === 'masculino') {
        tmb = 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * idadeReal);
    } else {
        tmb = 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * idadeReal);
    }
    
    // Estimate metabolic age (simplified calculation)
    let idadeMetabolica;
    if (sexo === 'masculino') {
        idadeMetabolica = (88.362 + (13.397 * peso) + (4.799 * altura) - tmb) / 5.677;
    } else {
        idadeMetabolica = (447.593 + (9.247 * peso) + (3.098 * altura) - tmb) / 4.330;
    }
    
    idadeMetabolica = Math.round(Math.max(18, Math.min(80, idadeMetabolica)));
    
    // Update results
    document.getElementById('idade-real').textContent = idadeReal;
    document.getElementById('idade-metabolica-value').textContent = idadeMetabolica;
    
    // Interpretation
    let interpretacao;
    if (idadeMetabolica < idadeReal) {
        interpretacao = `Parabéns! Sua idade metabólica é ${idadeReal - idadeMetabolica} anos menor que sua idade real. Isso indica um metabolismo eficiente.`;
    } else if (idadeMetabolica > idadeReal) {
        interpretacao = `Sua idade metabólica é ${idadeMetabolica - idadeReal} anos maior que sua idade real. Considere melhorar seus hábitos alimentares e de exercício.`;
    } else {
        interpretacao = 'Sua idade metabólica corresponde à sua idade real. Mantenha seus hábitos saudáveis.';
    }
    
    document.getElementById('idade-interpretacao').innerHTML = `<p>${interpretacao}</p>`;
    
    showResult('idade-metabolica');
});

// ===== IAC CALCULATOR =====
document.getElementById('iac-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const altura = parseFloat(document.getElementById('iac-altura').value) / 100; // Convert to meters
    const quadril = parseFloat(document.getElementById('iac-quadril').value) / 100; // Convert to meters
    const sexo = document.getElementById('iac-sexo').value;
    
    // IAC Formula: (Hip circumference / (Height^1.5)) - 18
    const iac = (quadril / Math.pow(altura, 1.5)) - 18;
    
    // Update result
    document.getElementById('iac-value').textContent = formatNumber(iac, 1);
    document.getElementById('iac-classification').textContent = getIACClassification(iac, sexo);
    
    showResult('iac');
});

function getIACClassification(iac, sexo) {
    if (sexo === 'masculino') {
        if (iac < 8) return 'Muito baixo';
        if (iac < 21) return 'Saudável';
        if (iac < 26) return 'Sobrepeso';
        return 'Obesidade';
    } else {
        if (iac < 21) return 'Muito baixo';
        if (iac < 33) return 'Saudável';
        if (iac < 39) return 'Sobrepeso';
        return 'Obesidade';
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Check if there's a selected category from localStorage
    const selectedCategory = localStorage.getItem('selectedCategory');
    if (selectedCategory === 'corporais') {
        // Clear the selection
        localStorage.removeItem('selectedCategory');
    }
    
    // Show first calculator by default
    showCalculator('imc');
});



// ===== CALCULADORA DE GORDURA CORPORAL MELHORADA =====
document.getElementById('gordura-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const sexo = document.getElementById('gordura-sexo').value;
    const idade = parseInt(document.getElementById('gordura-idade').value);
    const peso = parseFloat(document.getElementById('gordura-peso').value);
    const altura = parseFloat(document.getElementById('gordura-altura').value);
    const pescoco = parseFloat(document.getElementById('gordura-pescoco').value);
    const cintura = parseFloat(document.getElementById('gordura-cintura').value);
    const quadril = sexo === 'feminino' ? parseFloat(document.getElementById('gordura-quadril').value) : 0;
    
    let gorduraCorporal;
    
    // Fórmula US Navy
    if (sexo === 'masculino') {
        gorduraCorporal = 495 / (1.0324 - 0.19077 * Math.log10(cintura - pescoco) + 0.15456 * Math.log10(altura)) - 450;
    } else {
        gorduraCorporal = 495 / (1.29579 - 0.35004 * Math.log10(cintura + quadril - pescoco) + 0.22100 * Math.log10(altura)) - 450;
    }
    
    gorduraCorporal = Math.max(0, gorduraCorporal);
    
    // Interpretação e recomendações
    const interpretacao = interpretarGorduraCorporal(gorduraCorporal, sexo, idade);
    const recomendacoes = gerarRecomendacoesGordura(gorduraCorporal, sexo, idade, peso, altura);
    
    document.getElementById('gordura-value').textContent = formatNumber(gorduraCorporal, 1);
    document.getElementById('gordura-classification').innerHTML = `
        <div class="result-interpretation ${interpretacao.classe}">
            <h4>${interpretacao.categoria}</h4>
            <p>${interpretacao.descricao}</p>
        </div>
        ${recomendacoes}
    `;
    
    showResult('gordura');
});

function interpretarGorduraCorporal(gordura, sexo, idade) {
    let faixas;
    
    if (sexo === 'masculino') {
        if (idade < 30) {
            faixas = { excelente: 6, bom: 11, medio: 14, alto: 20, muito_alto: 25 };
        } else if (idade < 40) {
            faixas = { excelente: 11, bom: 17, medio: 21, alto: 24, muito_alto: 28 };
        } else if (idade < 50) {
            faixas = { excelente: 13, bom: 19, medio: 23, alto: 26, muito_alto: 30 };
        } else {
            faixas = { excelente: 15, bom: 21, medio: 25, alto: 28, muito_alto: 32 };
        }
    } else {
        if (idade < 30) {
            faixas = { excelente: 14, bom: 17, medio: 20, alto: 27, muito_alto: 32 };
        } else if (idade < 40) {
            faixas = { excelente: 15, bom: 18, medio: 22, alto: 28, muito_alto: 33 };
        } else if (idade < 50) {
            faixas = { excelente: 16, bom: 20, medio: 25, alto: 31, muito_alto: 36 };
        } else {
            faixas = { excelente: 17, bom: 22, medio: 27, alto: 33, muito_alto: 38 };
        }
    }

    if (gordura <= faixas.excelente) {
        return {
            categoria: "Excelente",
            classe: "excellent",
            descricao: "Você possui um percentual de gordura corporal excelente para sua idade e sexo. Isso indica uma composição corporal muito saudável com boa massa muscular."
        };
    } else if (gordura <= faixas.bom) {
        return {
            categoria: "Bom",
            classe: "good",
            descricao: "Seu percentual de gordura corporal está em uma faixa boa e saudável. Continue mantendo seus hábitos de exercício e alimentação."
        };
    } else if (gordura <= faixas.medio) {
        return {
            categoria: "Médio",
            classe: "average",
            descricao: "Seu percentual de gordura corporal está na média. Há espaço para melhorias através de exercícios e ajustes na alimentação."
        };
    } else if (gordura <= faixas.alto) {
        return {
            categoria: "Alto",
            classe: "poor",
            descricao: "Seu percentual de gordura corporal está acima do recomendado. É importante adotar medidas para reduzi-lo e melhorar sua saúde."
        };
    } else {
        return {
            categoria: "Muito Alto",
            classe: "poor",
            descricao: "Seu percentual de gordura corporal está muito alto, o que pode representar riscos à saúde. Recomenda-se buscar orientação profissional."
        };
    }
}

function gerarRecomendacoesGordura(gordura, sexo, idade, peso, altura) {
    const imc = peso / ((altura / 100) ** 2);
    
    return `
        <div class="recommendations-section">
            <h4>Recomendações Personalizadas</h4>
            
            <div class="recommendation-item priority-high">
                <h5>🎯 Estratégias de Redução</h5>
                <ul>
                    <li><strong>Déficit Calórico:</strong> Crie um déficit de 300-500 calorias diárias através da combinação de dieta e exercício</li>
                    <li><strong>Treinamento de Força:</strong> 3-4x por semana para preservar massa muscular durante a perda de gordura</li>
                    <li><strong>Cardio Moderado:</strong> 150-300 minutos por semana de atividade aeróbica moderada</li>
                    <li><strong>HIIT:</strong> 2-3 sessões semanais de treino intervalado de alta intensidade</li>
                </ul>
            </div>
            
            <div class="recommendation-item priority-medium">
                <h5>🥗 Orientações Nutricionais</h5>
                <ul>
                    <li><strong>Proteína:</strong> ${formatNumber(peso * 1.6, 0)}-${formatNumber(peso * 2.2, 0)}g diárias para preservar massa muscular</li>
                    <li><strong>Hidratação:</strong> ${formatNumber(peso * 35, 0)}ml de água por dia</li>
                    <li><strong>Fibras:</strong> 25-35g diárias para maior saciedade</li>
                    <li><strong>Refeições:</strong> 4-6 refeições menores ao longo do dia</li>
                </ul>
            </div>
            
            <div class="recommendation-item priority-low">
                <h5>📊 Monitoramento</h5>
                <ul>
                    <li><strong>Medições:</strong> Refaça as medidas a cada 2-4 semanas</li>
                    <li><strong>Fotos:</strong> Tire fotos de progresso mensalmente</li>
                    <li><strong>Peso:</strong> Pese-se 1-2x por semana, sempre no mesmo horário</li>
                    <li><strong>Circunferências:</strong> Meça cintura, quadril e outras áreas mensalmente</li>
                </ul>
            </div>
            
            <div class="tips-grid">
                <div class="tip-card">
                    <h5>💪 Exercícios Eficazes</h5>
                    <p>Combine exercícios compostos (agachamento, levantamento terra) com isolados para maximizar a queima de gordura e preservar músculos.</p>
                </div>
                <div class="tip-card">
                    <h5>⏰ Timing Nutricional</h5>
                    <p>Consuma proteína em todas as refeições e carboidratos preferencialmente antes e após os treinos.</p>
                </div>
                <div class="tip-card">
                    <h5>😴 Recuperação</h5>
                    <p>Durma 7-9 horas por noite. O sono inadequado pode aumentar o cortisol e dificultar a perda de gordura.</p>
                </div>
            </div>
            
            ${gordura > 25 ? `
                <div class="warning-box">
                    <h4>Atenção Importante</h4>
                    <p>Percentuais muito altos de gordura corporal podem estar associados a riscos de saúde. Considere consultar um profissional de saúde para avaliação completa e orientação personalizada.</p>
                </div>
            ` : ''}
        </div>
    `;
}

// ===== CALCULADORA DE PESO IDEAL MELHORADA =====
document.getElementById('peso-ideal-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const altura = parseFloat(document.getElementById('peso-ideal-altura').value);
    const sexo = document.getElementById('peso-ideal-sexo').value;
    const idade = parseInt(document.getElementById('peso-ideal-idade').value);
    
    // Múltiplas fórmulas para comparação
    const robinson = sexo === 'masculino' ? 
        52 + 1.9 * ((altura - 152.4) / 2.54) : 
        49 + 1.7 * ((altura - 152.4) / 2.54);
    
    const miller = sexo === 'masculino' ? 
        56.2 + 1.41 * ((altura - 152.4) / 2.54) : 
        53.1 + 1.36 * ((altura - 152.4) / 2.54);
    
    const devine = sexo === 'masculino' ? 
        50 + 2.3 * ((altura - 152.4) / 2.54) : 
        45.5 + 2.3 * ((altura - 152.4) / 2.54);
    
    const hamwi = sexo === 'masculino' ? 
        48 + 2.7 * ((altura - 152.4) / 2.54) : 
        45.5 + 2.2 * ((altura - 152.4) / 2.54);
    
    // Faixa baseada no IMC ideal (18.5-24.9)
    const alturaM = altura / 100;
    const pesoMinimo = 18.5 * alturaM * alturaM;
    const pesoMaximo = 24.9 * alturaM * alturaM;
    const pesoMedio = (pesoMinimo + pesoMaximo) / 2;
    
    document.getElementById('peso-medio').textContent = formatNumber(pesoMedio, 1);
    
    const resultadoDiv = document.getElementById('peso-ideal-result');
    resultadoDiv.innerHTML = `
        <div class="calculator-result">
            <div class="result-header">
                <div class="icon">⚖️</div>
                <h3>Resultado do Peso Ideal</h3>
            </div>
            
            <div class="result-value">
                <span class="number">${formatNumber(pesoMedio, 1)}</span>
                <span class="unit">kg (peso médio ideal)</span>
            </div>
            
            <div class="result-interpretation good">
                <h4>Faixa de Peso Saudável</h4>
                <p><strong>Mínimo:</strong> ${formatNumber(pesoMinimo, 1)} kg | <strong>Máximo:</strong> ${formatNumber(pesoMaximo, 1)} kg</p>
                <p>Esta faixa é baseada no IMC ideal (18,5-24,9) e é considerada mais precisa que fórmulas antigas.</p>
            </div>
            
            <div class="recommendations-section">
                <h4>Comparação de Fórmulas Clássicas</h4>
                
                <div class="formula-comparison">
                    <div class="formula-item">
                        <span class="formula-name">Robinson (1983)</span>
                        <span class="formula-value">${formatNumber(robinson, 1)} kg</span>
                        <span class="formula-note">Fórmula moderna</span>
                    </div>
                    <div class="formula-item">
                        <span class="formula-name">Miller (1983)</span>
                        <span class="formula-value">${formatNumber(miller, 1)} kg</span>
                        <span class="formula-note">Baseada em estudos</span>
                    </div>
                    <div class="formula-item">
                        <span class="formula-name">Devine (1974)</span>
                        <span class="formula-value">${formatNumber(devine, 1)} kg</span>
                        <span class="formula-note">Amplamente usada</span>
                    </div>
                    <div class="formula-item">
                        <span class="formula-name">Hamwi (1964)</span>
                        <span class="formula-value">${formatNumber(hamwi, 1)} kg</span>
                        <span class="formula-note">Fórmula clássica</span>
                    </div>
                </div>
                
                <div class="recommendation-item priority-high">
                    <h5>🎯 Estratégias para Alcançar o Peso Ideal</h5>
                    <ul>
                        <li><strong>Meta Realista:</strong> Vise perder/ganhar 0,5-1kg por semana</li>
                        <li><strong>Déficit/Superávit:</strong> 300-500 calorias por dia da sua TMB</li>
                        <li><strong>Exercícios:</strong> Combine cardio com musculação</li>
                        <li><strong>Consistência:</strong> Mudanças graduais são mais sustentáveis</li>
                    </ul>
                </div>
                
                <div class="tips-grid">
                    <div class="tip-card">
                        <h5>📊 Monitoramento</h5>
                        <p>Pese-se sempre no mesmo horário, preferencialmente pela manhã, em jejum e após usar o banheiro.</p>
                    </div>
                    <div class="tip-card">
                        <h5>🥗 Alimentação</h5>
                        <p>Foque na qualidade dos alimentos, não apenas nas calorias. Priorize alimentos integrais e nutritivos.</p>
                    </div>
                    <div class="tip-card">
                        <h5>💪 Exercícios</h5>
                        <p>Inclua tanto exercícios aeróbicos quanto de resistência para melhores resultados na composição corporal.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showResult('peso-ideal');
});

// ===== CALCULADORA RCQ MELHORADA =====
document.getElementById('rcq-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const cintura = parseFloat(document.getElementById('rcq-cintura').value);
    const quadril = parseFloat(document.getElementById('rcq-quadril').value);
    const sexo = document.getElementById('rcq-sexo').value;
    const idade = parseInt(document.getElementById('rcq-idade').value);
    
    const rcq = cintura / quadril;
    const interpretacao = interpretarRCQ(rcq, sexo, idade);
    
    document.getElementById('rcq-value').textContent = formatNumber(rcq, 2);
    document.getElementById('rcq-classification').innerHTML = `
        <div class="result-interpretation ${interpretacao.classe}">
            <h4>${interpretacao.categoria}</h4>
            <p>${interpretacao.descricao}</p>
        </div>
        ${gerarRecomendacoesRCQ(rcq, sexo, cintura, quadril)}
    `;
    
    showResult('rcq');
});

function interpretarRCQ(rcq, sexo, idade) {
    let faixas;
    
    if (sexo === 'masculino') {
        faixas = { baixo: 0.85, moderado: 0.90, alto: 0.95, muito_alto: 1.0 };
    } else {
        faixas = { baixo: 0.75, moderado: 0.80, alto: 0.85, muito_alto: 0.90 };
    }
    
    if (rcq <= faixas.baixo) {
        return {
            categoria: "Baixo Risco",
            classe: "excellent",
            descricao: "Excelente! Sua distribuição de gordura corporal indica baixo risco para doenças cardiovasculares e diabetes."
        };
    } else if (rcq <= faixas.moderado) {
        return {
            categoria: "Risco Moderado",
            classe: "good",
            descricao: "Boa distribuição de gordura corporal. Mantenha hábitos saudáveis para preservar essa condição."
        };
    } else if (rcq <= faixas.alto) {
        return {
            categoria: "Risco Alto",
            classe: "average",
            descricao: "Atenção! Há acúmulo de gordura na região abdominal, aumentando riscos cardiovasculares."
        };
    } else {
        return {
            categoria: "Risco Muito Alto",
            classe: "poor",
            descricao: "Alerta! Distribuição de gordura com alto risco para saúde. Recomenda-se intervenção imediata."
        };
    }
}

function gerarRecomendacoesRCQ(rcq, sexo, cintura, quadril) {
    const cinturaIdeal = sexo === 'masculino' ? 94 : 80;
    const reducaoNecessaria = Math.max(0, cintura - cinturaIdeal);
    
    return `
        <div class="recommendations-section">
            <h4>Recomendações Personalizadas</h4>
            
            ${reducaoNecessaria > 0 ? `
                <div class="recommendation-item priority-high">
                    <h5>🎯 Meta de Redução</h5>
                    <ul>
                        <li><strong>Cintura Atual:</strong> ${cintura} cm</li>
                        <li><strong>Cintura Ideal:</strong> ≤ ${cinturaIdeal} cm</li>
                        <li><strong>Redução Necessária:</strong> ${formatNumber(reducaoNecessaria, 1)} cm</li>
                        <li><strong>Tempo Estimado:</strong> ${Math.ceil(reducaoNecessaria / 2)}-${Math.ceil(reducaoNecessaria)} meses</li>
                    </ul>
                </div>
            ` : ''}
            
            <div class="recommendation-item priority-medium">
                <h5>🏃‍♂️ Exercícios Específicos</h5>
                <ul>
                    <li><strong>Cardio HIIT:</strong> 3x por semana, 20-30 minutos</li>
                    <li><strong>Exercícios Abdominais:</strong> Prancha, mountain climbers, bicycle crunches</li>
                    <li><strong>Exercícios Compostos:</strong> Agachamentos, deadlifts, burpees</li>
                    <li><strong>Caminhada:</strong> 30-45 minutos diários em ritmo moderado</li>
                </ul>
            </div>
            
            <div class="recommendation-item priority-low">
                <h5>🥗 Estratégias Nutricionais</h5>
                <ul>
                    <li><strong>Reduzir Açúcar:</strong> Evite bebidas açucaradas e doces processados</li>
                    <li><strong>Fibras:</strong> 25-35g diárias para reduzir gordura visceral</li>
                    <li><strong>Proteína:</strong> Em todas as refeições para preservar massa muscular</li>
                    <li><strong>Gorduras Boas:</strong> Abacate, nozes, azeite de oliva</li>
                </ul>
            </div>
            
            <div class="tips-grid">
                <div class="tip-card">
                    <h5>📏 Como Medir Corretamente</h5>
                    <p>Cintura: na menor circunferência entre costelas e quadril. Quadril: na maior circunferência dos glúteos.</p>
                </div>
                <div class="tip-card">
                    <h5>⚠️ Riscos da Gordura Abdominal</h5>
                    <p>Gordura visceral aumenta riscos de diabetes, doenças cardíacas e síndrome metabólica.</p>
                </div>
                <div class="tip-card">
                    <h5>🎯 Foco no Core</h5>
                    <p>Fortaleça músculos do core com exercícios funcionais para melhorar postura e reduzir medidas.</p>
                </div>
            </div>
            
            ${rcq > 0.9 ? `
                <div class="warning-box">
                    <h4>Atenção Médica Recomendada</h4>
                    <p>RCQ muito alto pode indicar síndrome metabólica. Consulte um médico para avaliação completa e exames complementares.</p>
                </div>
            ` : ''}
        </div>
    `;
}


// ===== CALCULADORA DE MASSA CORPORAL MELHORADA =====
document.getElementById('massa-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('massa-peso').value);
    const gordura = parseFloat(document.getElementById('massa-gordura').value);
    const altura = parseFloat(document.getElementById('massa-altura').value);
    const sexo = document.getElementById('massa-sexo').value;
    const idade = parseInt(document.getElementById('massa-idade').value);
    
    const massaGorda = (peso * gordura) / 100;
    const massaMagra = peso - massaGorda;
    const percentualMagra = (massaMagra / peso) * 100;
    
    // Análise da composição corporal
    const analise = analisarComposicaoCorporal(massaMagra, massaGorda, peso, sexo, idade, altura);
    
    document.getElementById('massa-gorda-value').textContent = formatNumber(massaGorda, 1);
    document.getElementById('massa-magra-value').textContent = formatNumber(massaMagra, 1);
    
    const resultadoDiv = document.getElementById('massa-result');
    resultadoDiv.innerHTML = `
        <div class="calculator-result">
            <div class="result-header">
                <div class="icon">⚖️</div>
                <h3>Análise da Composição Corporal</h3>
            </div>
            
            <div class="tips-grid" style="margin-bottom: 2rem;">
                <div class="tip-card">
                    <h5>🥩 Massa Gorda</h5>
                    <div class="result-value" style="margin: 1rem 0;">
                        <span class="number" style="font-size: 2rem;">${formatNumber(massaGorda, 1)}</span>
                        <span class="unit">kg (${formatNumber(gordura, 1)}%)</span>
                    </div>
                </div>
                <div class="tip-card">
                    <h5>💪 Massa Magra</h5>
                    <div class="result-value" style="margin: 1rem 0;">
                        <span class="number" style="font-size: 2rem;">${formatNumber(massaMagra, 1)}</span>
                        <span class="unit">kg (${formatNumber(percentualMagra, 1)}%)</span>
                    </div>
                </div>
            </div>
            
            <div class="result-interpretation ${analise.classe}">
                <h4>${analise.categoria}</h4>
                <p>${analise.descricao}</p>
            </div>
            
            ${gerarRecomendacoesMassa(massaMagra, massaGorda, peso, sexo, idade, altura)}
        </div>
    `;
    
    showResult('massa');
});

function analisarComposicaoCorporal(massaMagra, massaGorda, peso, sexo, idade, altura) {
    const alturaM = altura / 100;
    const indiceMassaMagra = massaMagra / (alturaM * alturaM);
    
    // Índices de referência para massa magra
    let faixasIMM;
    if (sexo === 'masculino') {
        faixasIMM = { baixo: 17, normal: 19.5, alto: 22, muito_alto: 24 };
    } else {
        faixasIMM = { baixo: 14, normal: 16.5, alto: 18.5, muito_alto: 20 };
    }
    
    if (indiceMassaMagra < faixasIMM.baixo) {
        return {
            categoria: "Massa Magra Baixa",
            classe: "poor",
            descricao: "Sua massa magra está abaixo do ideal. Isso pode indicar perda muscular ou necessidade de ganho de massa muscular."
        };
    } else if (indiceMassaMagra <= faixasIMM.normal) {
        return {
            categoria: "Massa Magra Normal",
            classe: "average",
            descricao: "Sua massa magra está dentro da faixa normal, mas há potencial para melhoria através de exercícios de resistência."
        };
    } else if (indiceMassaMagra <= faixasIMM.alto) {
        return {
            categoria: "Boa Massa Magra",
            classe: "good",
            descricao: "Excelente! Você possui uma boa quantidade de massa magra, indicando boa condição física e muscular."
        };
    } else {
        return {
            categoria: "Massa Magra Excelente",
            classe: "excellent",
            descricao: "Parabéns! Sua massa magra está em nível excelente, típico de atletas ou pessoas muito ativas fisicamente."
        };
    }
}

function gerarRecomendacoesMassa(massaMagra, massaGorda, peso, sexo, idade, altura) {
    const alturaM = altura / 100;
    const indiceMassaMagra = massaMagra / (alturaM * alturaM);
    const proteinaNecessaria = massaMagra * 2.2; // 2.2g por kg de massa magra
    
    return `
        <div class="recommendations-section">
            <h4>Estratégias para Otimizar Composição Corporal</h4>
            
            <div class="recommendation-item priority-high">
                <h5>💪 Desenvolvimento Muscular</h5>
                <ul>
                    <li><strong>Treinamento de Força:</strong> 3-4x por semana, focando grandes grupos musculares</li>
                    <li><strong>Progressão:</strong> Aumente carga/repetições gradualmente a cada 2-3 semanas</li>
                    <li><strong>Exercícios Compostos:</strong> Agachamento, deadlift, supino, remada</li>
                    <li><strong>Descanso:</strong> 48-72h entre treinos do mesmo grupo muscular</li>
                </ul>
            </div>
            
            <div class="recommendation-item priority-medium">
                <h5>🥗 Nutrição para Massa Magra</h5>
                <ul>
                    <li><strong>Proteína Diária:</strong> ${formatNumber(proteinaNecessaria, 0)}g (2,2g por kg de massa magra)</li>
                    <li><strong>Distribuição:</strong> 25-30g de proteína por refeição</li>
                    <li><strong>Timing:</strong> Proteína dentro de 2h após o treino</li>
                    <li><strong>Fontes:</strong> Carnes magras, ovos, laticínios, leguminosas</li>
                </ul>
            </div>
            
            <div class="recommendation-item priority-low">
                <h5>📊 Monitoramento e Avaliação</h5>
                <ul>
                    <li><strong>Bioimpedância:</strong> Avalie composição corporal mensalmente</li>
                    <li><strong>Medidas:</strong> Circunferências de braço, coxa, cintura</li>
                    <li><strong>Fotos:</strong> Registro visual do progresso</li>
                    <li><strong>Performance:</strong> Acompanhe força e resistência nos exercícios</li>
                </ul>
            </div>
            
            <div class="tips-grid">
                <div class="tip-card">
                    <h5>⚡ Metabolismo</h5>
                    <p>Cada kg de massa magra queima ~13 kcal/dia em repouso. Mais músculo = metabolismo mais acelerado!</p>
                </div>
                <div class="tip-card">
                    <h5>🏃‍♂️ Cardio Inteligente</h5>
                    <p>Prefira HIIT (2-3x/semana) ao cardio longo para preservar massa muscular durante a perda de gordura.</p>
                </div>
                <div class="tip-card">
                    <h5>😴 Recuperação</h5>
                    <p>O crescimento muscular acontece durante o descanso. Durma 7-9h e gerencie o estresse.</p>
                </div>
            </div>
            
            <div class="general-tips">
                <h5>📈 Metas Realistas</h5>
                <ul>
                    <li><strong>Ganho Muscular:</strong> 0,5-1kg por mês para iniciantes</li>
                    <li><strong>Perda de Gordura:</strong> 0,5-1kg por semana mantendo massa magra</li>
                    <li><strong>Recomposição:</strong> Processo mais lento, mas possível com treino e dieta adequados</li>
                </ul>
            </div>
        </div>
    `;
}

// ===== CALCULADORA DE IDADE METABÓLICA MELHORADA =====
document.getElementById('idade-metabolica-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const idade = parseInt(document.getElementById('idade-metabolica-idade').value);
    const peso = parseFloat(document.getElementById('idade-metabolica-peso').value);
    const altura = parseFloat(document.getElementById('idade-metabolica-altura').value);
    const sexo = document.getElementById('idade-metabolica-sexo').value;
    const atividade = parseFloat(document.getElementById('idade-metabolica-atividade').value);
    const gordura = parseFloat(document.getElementById('idade-metabolica-gordura').value);
    
    // Calcular TMB
    let tmb;
    if (sexo === 'masculino') {
        tmb = (10 * peso) + (6.25 * altura) - (5 * idade) + 5;
    } else {
        tmb = (10 * peso) + (6.25 * altura) - (5 * idade) - 161;
    }
    
    // Ajustar pela composição corporal e atividade
    const massaMagra = peso * (1 - gordura / 100);
    const tmbAjustada = tmb * (1 + (atividade - 1.2) * 0.1);
    
    // Estimar idade metabólica baseada na TMB
    let idadeMetabolica;
    if (sexo === 'masculino') {
        idadeMetabolica = (((10 * peso) + (6.25 * altura) + 5) - tmbAjustada) / 5;
    } else {
        idadeMetabolica = (((10 * peso) + (6.25 * altura) - 161) - tmbAjustada) / 5;
    }
    
    idadeMetabolica = Math.max(15, Math.min(80, Math.round(idadeMetabolica)));
    const diferenca = idadeMetabolica - idade;
    
    document.getElementById('idade-real').textContent = idade;
    document.getElementById('idade-metabolica-value').textContent = idadeMetabolica;
    
    const analise = analisarIdadeMetabolica(diferenca, idade, atividade, gordura);
    
    const resultadoDiv = document.getElementById('idade-metabolica-result');
    resultadoDiv.innerHTML = `
        <div class="calculator-result">
            <div class="result-header">
                <div class="icon">⏰</div>
                <h3>Análise da Idade Metabólica</h3>
            </div>
            
            <div class="tips-grid" style="margin-bottom: 2rem;">
                <div class="tip-card">
                    <h5>📅 Idade Cronológica</h5>
                    <div class="result-value" style="margin: 1rem 0;">
                        <span class="number" style="font-size: 2rem;">${idade}</span>
                        <span class="unit">anos</span>
                    </div>
                </div>
                <div class="tip-card">
                    <h5>⚡ Idade Metabólica</h5>
                    <div class="result-value" style="margin: 1rem 0;">
                        <span class="number" style="font-size: 2rem;">${idadeMetabolica}</span>
                        <span class="unit">anos</span>
                    </div>
                </div>
            </div>
            
            <div class="result-interpretation ${analise.classe}">
                <h4>${analise.categoria}</h4>
                <p>${analise.descricao}</p>
                <p><strong>Diferença:</strong> ${diferenca > 0 ? '+' : ''}${diferenca} anos</p>
            </div>
            
            ${gerarRecomendacoesIdadeMetabolica(diferenca, idade, atividade, gordura, peso)}
        </div>
    `;
    
    showResult('idade-metabolica');
});

function analisarIdadeMetabolica(diferenca, idade, atividade, gordura) {
    if (diferenca <= -5) {
        return {
            categoria: "Metabolismo Jovem",
            classe: "excellent",
            descricao: "Excelente! Seu metabolismo está funcionando como o de uma pessoa mais jovem. Isso indica ótima condição física e hábitos saudáveis."
        };
    } else if (diferenca <= -2) {
        return {
            categoria: "Metabolismo Acelerado",
            classe: "good",
            descricao: "Muito bom! Seu metabolismo está ligeiramente acelerado para sua idade, indicando boa saúde metabólica."
        };
    } else if (diferenca <= 2) {
        return {
            categoria: "Metabolismo Normal",
            classe: "average",
            descricao: "Seu metabolismo está adequado para sua idade. Há oportunidades de melhoria através de exercícios e alimentação."
        };
    } else if (diferenca <= 5) {
        return {
            categoria: "Metabolismo Lento",
            classe: "poor",
            descricao: "Atenção! Seu metabolismo está mais lento que o esperado para sua idade. Mudanças no estilo de vida podem ajudar."
        };
    } else {
        return {
            categoria: "Metabolismo Muito Lento",
            classe: "poor",
            descricao: "Seu metabolismo está significativamente mais lento. É importante adotar medidas para acelerar o metabolismo e melhorar a saúde."
        };
    }
}

function gerarRecomendacoesIdadeMetabolica(diferenca, idade, atividade, gordura, peso) {
    return `
        <div class="recommendations-section">
            <h4>Estratégias para Acelerar o Metabolismo</h4>
            
            <div class="recommendation-item priority-high">
                <h5>🔥 Aceleração Metabólica</h5>
                <ul>
                    <li><strong>Musculação:</strong> 3-4x por semana para aumentar massa muscular</li>
                    <li><strong>HIIT:</strong> 2-3 sessões semanais de alta intensidade</li>
                    <li><strong>Proteína:</strong> ${formatNumber(peso * 1.8, 0)}g diárias para efeito térmico</li>
                    <li><strong>Água Gelada:</strong> 2-3L diários para acelerar metabolismo</li>
                </ul>
            </div>
            
            <div class="recommendation-item priority-medium">
                <h5>⏰ Otimização Hormonal</h5>
                <ul>
                    <li><strong>Sono:</strong> 7-9h por noite para regular hormônios</li>
                    <li><strong>Jejum Intermitente:</strong> 16:8 para melhorar sensibilidade insulínica</li>
                    <li><strong>Gerenciamento do Estresse:</strong> Meditação, yoga, respiração</li>
                    <li><strong>Exposição ao Frio:</strong> Banhos frios para ativar gordura marrom</li>
                </ul>
            </div>
            
            <div class="recommendation-item priority-low">
                <h5>🥗 Nutrição Metabólica</h5>
                <ul>
                    <li><strong>Refeições Frequentes:</strong> 4-6 pequenas refeições por dia</li>
                    <li><strong>Termogênicos Naturais:</strong> Pimenta, gengibre, chá verde</li>
                    <li><strong>Carboidratos Complexos:</strong> Aveia, quinoa, batata doce</li>
                    <li><strong>Gorduras Boas:</strong> Abacate, nozes, azeite de oliva</li>
                </ul>
            </div>
            
            <div class="tips-grid">
                <div class="tip-card">
                    <h5>💪 Massa Muscular</h5>
                    <p>Cada kg de músculo queima 13 kcal/dia em repouso. Mais músculo = metabolismo mais rápido 24h por dia!</p>
                </div>
                <div class="tip-card">
                    <h5>🌡️ Efeito Térmico</h5>
                    <p>Proteínas gastam 20-30% de suas calorias na digestão, carboidratos 5-10% e gorduras apenas 0-3%.</p>
                </div>
                <div class="tip-card">
                    <h5>⚡ NEAT</h5>
                    <p>Aumente atividades não-exercício: use escadas, caminhe mais, fidget, trabalhe em pé.</p>
                </div>
            </div>
            
            ${diferenca > 5 ? `
                <div class="warning-box">
                    <h4>Avaliação Médica Recomendada</h4>
                    <p>Metabolismo muito lento pode indicar problemas hormonais (tireoide, insulina). Considere exames médicos para investigação.</p>
                </div>
            ` : ''}
        </div>
    `;
}

// ===== CALCULADORA IAC MELHORADA =====
document.getElementById('iac-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const quadril = parseFloat(document.getElementById('iac-quadril').value);
    const altura = parseFloat(document.getElementById('iac-altura').value);
    const sexo = document.getElementById('iac-sexo').value;
    const idade = parseInt(document.getElementById('iac-idade').value);
    
    // Fórmula IAC
    const iac = (quadril / (altura * Math.sqrt(altura / 100))) - 18;
    
    const interpretacao = interpretarIAC(iac, sexo, idade);
    
    document.getElementById('iac-value').textContent = formatNumber(iac, 1);
    document.getElementById('iac-classification').innerHTML = `
        <div class="result-interpretation ${interpretacao.classe}">
            <h4>${interpretacao.categoria}</h4>
            <p>${interpretacao.descricao}</p>
        </div>
        ${gerarRecomendacoesIAC(iac, sexo, idade, quadril, altura)}
    `;
    
    showResult('iac');
});

function interpretarIAC(iac, sexo, idade) {
    let faixas;
    
    if (sexo === 'masculino') {
        if (idade < 30) {
            faixas = { baixo: 8, normal: 21, alto: 26, muito_alto: 30 };
        } else {
            faixas = { baixo: 11, normal: 22, alto: 27, muito_alto: 32 };
        }
    } else {
        if (idade < 30) {
            faixas = { baixo: 21, normal: 33, alto: 39, muito_alto: 45 };
        } else {
            faixas = { baixo: 23, normal: 35, alto: 42, muito_alto: 48 };
        }
    }
    
    if (iac < faixas.baixo) {
        return {
            categoria: "Muito Baixo",
            classe: "poor",
            descricao: "IAC muito baixo pode indicar baixo percentual de gordura corporal, mas também pode sugerir perda excessiva de massa."
        };
    } else if (iac <= faixas.normal) {
        return {
            categoria: "Normal",
            classe: "excellent",
            descricao: "Excelente! Seu IAC está na faixa normal, indicando uma composição corporal saudável."
        };
    } else if (iac <= faixas.alto) {
        return {
            categoria: "Alto",
            classe: "average",
            descricao: "Seu IAC está elevado, sugerindo acúmulo de gordura corporal. Mudanças no estilo de vida podem ajudar."
        };
    } else {
        return {
            categoria: "Muito Alto",
            classe: "poor",
            descricao: "IAC muito alto indica excesso significativo de gordura corporal, aumentando riscos à saúde."
        };
    }
}

function gerarRecomendacoesIAC(iac, sexo, idade, quadril, altura) {
    const quadrilIdeal = altura * Math.sqrt(altura / 100) * (sexo === 'masculino' ? 1.05 : 1.25);
    const reducaoNecessaria = Math.max(0, quadril - quadrilIdeal);
    
    return `
        <div class="recommendations-section">
            <h4>Estratégias Baseadas no IAC</h4>
            
            ${reducaoNecessaria > 0 ? `
                <div class="recommendation-item priority-high">
                    <h5>🎯 Meta de Redução</h5>
                    <ul>
                        <li><strong>Quadril Atual:</strong> ${quadril} cm</li>
                        <li><strong>Quadril Ideal:</strong> ≤ ${formatNumber(quadrilIdeal, 1)} cm</li>
                        <li><strong>Redução Necessária:</strong> ${formatNumber(reducaoNecessaria, 1)} cm</li>
                        <li><strong>Meta Mensal:</strong> 2-4 cm de redução</li>
                    </ul>
                </div>
            ` : ''}
            
            <div class="recommendation-item priority-medium">
                <h5>🏃‍♀️ Exercícios para Quadril e Glúteos</h5>
                <ul>
                    <li><strong>Agachamentos:</strong> 3 séries de 15-20 repetições</li>
                    <li><strong>Lunges:</strong> 3 séries de 12 por perna</li>
                    <li><strong>Hip Thrust:</strong> 3 séries de 15 repetições</li>
                    <li><strong>Cardio:</strong> Caminhada inclinada, escada, bicicleta</li>
                </ul>
            </div>
            
            <div class="recommendation-item priority-low">
                <h5>📏 Monitoramento Específico</h5>
                <ul>
                    <li><strong>Medição Correta:</strong> Quadril na maior circunferência dos glúteos</li>
                    <li><strong>Frequência:</strong> Meça quinzenalmente, mesmo horário</li>
                    <li><strong>Registro:</strong> Anote medidas e compare com fotos</li>
                    <li><strong>Progresso:</strong> Foque na redução gradual e consistente</li>
                </ul>
            </div>
            
            <div class="tips-grid">
                <div class="tip-card">
                    <h5>🔬 Vantagem do IAC</h5>
                    <p>O IAC não requer peso corporal e pode ser mais preciso que o IMC para avaliar gordura corporal em algumas populações.</p>
                </div>
                <div class="tip-card">
                    <h5>🍎 vs 🍐 Formato Corporal</h5>
                    <p>IAC alto pode indicar formato "pêra" (gordura nos quadris), geralmente menos perigoso que formato "maçã" (gordura abdominal).</p>
                </div>
                <div class="tip-card">
                    <h5>⚖️ Complemento ao IMC</h5>
                    <p>Use IAC junto com IMC e RCQ para uma avaliação mais completa da composição corporal.</p>
                </div>
            </div>
        </div>
    `;
}

