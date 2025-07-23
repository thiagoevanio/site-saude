// ===== CALCULADORAS NUTRICIONAIS =====

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
        case 'calorias':
            const calTmb = document.getElementById('calorias-tmb').textContent;
            const calManutencao = document.getElementById('calorias-manutencao').textContent;
            const calObjetivo = document.getElementById('calorias-objetivo-valor').textContent;
            resultText = `TMB: ${calTmb} kcal/dia\\nManutenção: ${calManutencao} kcal/dia\\nObjetivo: ${calObjetivo} kcal/dia`;
            break;
        case 'proteinas':
            const protGramas = document.getElementById('proteinas-gramas').textContent;
            const protRefeicao = document.getElementById('proteinas-refeicao').textContent;
            resultText = `Proteínas: ${protGramas} g/dia\\nPor refeição: ${protRefeicao} g`;
            break;
        case 'carboidratos':
            const carbGramas = document.getElementById('carboidratos-gramas').textContent;
            const gordGramas = document.getElementById('gorduras-gramas').textContent;
            resultText = `Carboidratos: ${carbGramas} g/dia\\nGorduras: ${gordGramas} g/dia`;
            break;
        case 'macronutrientes':
            const macroProteinas = document.getElementById('macro-proteinas-g').textContent;
            const macroCarboidratos = document.getElementById('macro-carboidratos-g').textContent;
            const macroGorduras = document.getElementById('macro-gorduras-g').textContent;
            resultText = `Proteínas: ${macroProteinas} g/dia\\nCarboidratos: ${macroCarboidratos} g/dia\\nGorduras: ${macroGorduras} g/dia`;
            break;
        case 'gasto-calorico':
            const gastoCalorias = document.getElementById('gasto-calorias').textContent;
            resultText = `Calorias queimadas: ${gastoCalorias} kcal`;
            break;
        case 'agua':
            const aguaLitros = document.getElementById('agua-litros').textContent;
            const aguaCopos = document.getElementById('agua-copos').textContent;
            resultText = `Água diária: ${aguaLitros} litros (${aguaCopos} copos)`;
            break;
        case 'indice-glicemico':
            const igValor = document.getElementById('ig-valor').textContent;
            const igCarga = document.getElementById('ig-carga').textContent;
            resultText = `Índice Glicêmico: ${igValor}\\nCarga Glicêmica: ${igCarga}`;
            break;
        case 'fibras':
            const fibrasGramas = document.getElementById('fibras-gramas').textContent;
            resultText = `Fibras diárias: ${fibrasGramas} g/dia`;
            break;
    }
    
    if (resultText && window.calculatorUtils) {
        window.calculatorUtils.copyToClipboard(resultText);
    }
}

// ===== TMB CALCULATION FUNCTION =====
function calculateTMB(peso, altura, idade, sexo) {
    // Harris-Benedict Formula (Revised)
    if (sexo === 'masculino') {
        return 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * idade);
    } else {
        return 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * idade);
    }
}

// ===== CALORIAS CALCULATOR =====
document.getElementById('calorias-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('calorias-peso').value);
    const altura = parseFloat(document.getElementById('calorias-altura').value);
    const idade = parseInt(document.getElementById('calorias-idade').value);
    const sexo = document.getElementById('calorias-sexo').value;
    const atividade = parseFloat(document.getElementById('calorias-atividade').value);
    const objetivo = document.getElementById('calorias-objetivo').value;
    
    const tmb = calculateTMB(peso, altura, idade, sexo);
    const manutencao = tmb * atividade;
    
    let objetivoValue;
    switch (objetivo) {
        case 'perder':
            objetivoValue = manutencao - 500;
            break;
        case 'ganhar':
            objetivoValue = manutencao + 500;
            break;
        default:
            objetivoValue = manutencao;
    }
    
    // Update results
    document.getElementById('calorias-tmb').textContent = formatNumber(tmb, 0);
    document.getElementById('calorias-manutencao').textContent = formatNumber(manutencao, 0);
    document.getElementById('calorias-objetivo-valor').textContent = formatNumber(objetivoValue, 0);
    
    showResult('calorias');
});

// ===== PROTEÍNAS CALCULATOR =====
document.getElementById('proteinas-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('proteinas-peso').value);
    const atividade = parseFloat(document.getElementById('proteinas-atividade').value);
    const objetivo = document.getElementById('proteinas-objetivo').value;
    
    let multiplier = atividade;
    
    // Adjust based on objective
    switch (objetivo) {
        case 'ganho':
            multiplier = Math.max(multiplier, 1.6);
            break;
        case 'perda':
            multiplier = Math.max(multiplier, 1.2);
            break;
    }
    
    const proteinasDiarias = peso * multiplier;
    const proteinasPorRefeicao = proteinasDiarias / 5; // 5 refeições
    const caloriasDasProteinas = proteinasDiarias * 4; // 4 kcal por grama
    
    // Update results
    document.getElementById('proteinas-gramas').textContent = formatNumber(proteinasDiarias, 1);
    document.getElementById('proteinas-refeicao').textContent = formatNumber(proteinasPorRefeicao, 1);
    document.getElementById('proteinas-calorias').textContent = formatNumber(caloriasDasProteinas, 0);
    
    showResult('proteinas');
});

// ===== CARBOIDRATOS E GORDURAS CALCULATOR =====
document.getElementById('carboidratos-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const calorias = parseFloat(document.getElementById('carboidratos-calorias').value);
    const proteinas = parseFloat(document.getElementById('carboidratos-proteinas').value);
    const distribuicao = document.getElementById('carboidratos-distribuicao').value;
    
    const caloriasDasProteinas = proteinas * 4;
    const caloriasRestantes = calorias - caloriasDasProteinas;
    
    let carboidratosPercent, gordurasPercent;
    
    switch (distribuicao) {
        case 'low-carb':
            carboidratosPercent = 25;
            gordurasPercent = 50;
            break;
        case 'high-carb':
            carboidratosPercent = 60;
            gordurasPercent = 15;
            break;
        case 'keto':
            carboidratosPercent = 5;
            gordurasPercent = 70;
            break;
        default: // balanced
            carboidratosPercent = 45;
            gordurasPercent = 30;
    }
    
    const caloriasCarboidratos = (calorias * carboidratosPercent) / 100;
    const caloriasGorduras = (calorias * gordurasPercent) / 100;
    
    const gramasCarboidratos = caloriasCarboidratos / 4; // 4 kcal por grama
    const gramasGorduras = caloriasGorduras / 9; // 9 kcal por grama
    
    const proteinasPercent = (caloriasDasProteinas / calorias) * 100;
    
    // Update results
    document.getElementById('carboidratos-gramas').textContent = formatNumber(gramasCarboidratos, 1);
    document.getElementById('gorduras-gramas').textContent = formatNumber(gramasGorduras, 1);
    document.getElementById('carboidratos-proteinas-valor').textContent = formatNumber(proteinas, 1);
    
    document.getElementById('carboidratos-percent').textContent = `${formatNumber(carboidratosPercent, 0)}%`;
    document.getElementById('gorduras-percent').textContent = `${formatNumber(gordurasPercent, 0)}%`;
    document.getElementById('proteinas-percent').textContent = `${formatNumber(proteinasPercent, 0)}%`;
    
    showResult('carboidratos');
});

// ===== MACRONUTRIENTES CALCULATOR WITH ENHANCED RECOMMENDATIONS =====
document.getElementById('macronutrientes-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('macro-peso').value);
    const altura = parseFloat(document.getElementById('macro-altura').value);
    const idade = parseInt(document.getElementById('macro-idade').value);
    const sexo = document.getElementById('macro-sexo').value;
    const atividade = parseFloat(document.getElementById('macro-atividade').value);
    const objetivo = document.getElementById('macro-objetivo').value;
    
    const tmb = calculateTMB(peso, altura, idade, sexo);
    let calorias = tmb * atividade;
    
    // Adjust calories based on objective
    switch (objetivo) {
        case 'perder':
            calorias -= 500;
            break;
        case 'ganhar':
            calorias += 500;
            break;
    }
    
    // Enhanced macronutrient distribution based on objective
    let proteinasPercent, carboidratosPercent, gordurasPercent;
    
    switch (objetivo) {
        case 'perder':
            proteinasPercent = 30; // Higher protein for satiety and muscle preservation
            carboidratosPercent = 35;
            gordurasPercent = 35;
            break;
        case 'ganhar':
            proteinasPercent = 25;
            carboidratosPercent = 50; // Higher carbs for energy and muscle building
            gordurasPercent = 25;
            break;
        default: // manter
            proteinasPercent = 25;
            carboidratosPercent = 45;
            gordurasPercent = 30;
    }
    
    // Adjust protein based on activity level
    if (atividade >= 1.6) { // Active individuals need more protein
        proteinasPercent = Math.min(proteinasPercent + 5, 35);
        carboidratosPercent = Math.max(carboidratosPercent - 3, 30);
        gordurasPercent = Math.max(gordurasPercent - 2, 20);
    }
    
    const proteinasKcal = (calorias * proteinasPercent) / 100;
    const carboidratosKcal = (calorias * carboidratosPercent) / 100;
    const gordurasKcal = (calorias * gordurasPercent) / 100;
    
    const proteinasGramas = proteinasKcal / 4;
    const carboidratosGramas = carboidratosKcal / 4;
    const gordurasGramas = gordurasKcal / 9;
    
    // Update results
    document.getElementById('macro-calorias-total').textContent = formatNumber(calorias, 0);
    
    document.getElementById('macro-proteinas-g').textContent = formatNumber(proteinasGramas, 1);
    document.getElementById('macro-carboidratos-g').textContent = formatNumber(carboidratosGramas, 1);
    document.getElementById('macro-gorduras-g').textContent = formatNumber(gordurasGramas, 1);
    
    document.getElementById('macro-proteinas-percent').textContent = `${proteinasPercent}%`;
    document.getElementById('macro-carboidratos-percent').textContent = `${carboidratosPercent}%`;
    document.getElementById('macro-gorduras-percent').textContent = `${gordurasPercent}%`;
    
    document.getElementById('macro-proteinas-kcal').textContent = `${formatNumber(proteinasKcal, 0)} kcal`;
    document.getElementById('macro-carboidratos-kcal').textContent = `${formatNumber(carboidratosKcal, 0)} kcal`;
    document.getElementById('macro-gorduras-kcal').textContent = `${formatNumber(gordurasKcal, 0)} kcal`;
    
    // Enhanced meal distribution and food recommendations
    const recomendacoes = document.getElementById('macro-recomendacoes') || createMacroRecommendationsElement();
    let recomendacoesHTML = `
        <h4>Distribuição por Refeição (5 refeições/dia)</h4>
        <div class="meal-distribution">
            <div class="meal-item">
                <h5>Café da Manhã (25%)</h5>
                <p>Proteínas: ${formatNumber(proteinasGramas * 0.25, 1)}g | Carboidratos: ${formatNumber(carboidratosGramas * 0.25, 1)}g | Gorduras: ${formatNumber(gordurasGramas * 0.25, 1)}g</p>
            </div>
            <div class="meal-item">
                <h5>Lanche da Manhã (15%)</h5>
                <p>Proteínas: ${formatNumber(proteinasGramas * 0.15, 1)}g | Carboidratos: ${formatNumber(carboidratosGramas * 0.15, 1)}g | Gorduras: ${formatNumber(gordurasGramas * 0.15, 1)}g</p>
            </div>
            <div class="meal-item">
                <h5>Almoço (30%)</h5>
                <p>Proteínas: ${formatNumber(proteinasGramas * 0.30, 1)}g | Carboidratos: ${formatNumber(carboidratosGramas * 0.30, 1)}g | Gorduras: ${formatNumber(gordurasGramas * 0.30, 1)}g</p>
            </div>
            <div class="meal-item">
                <h5>Lanche da Tarde (15%)</h5>
                <p>Proteínas: ${formatNumber(proteinasGramas * 0.15, 1)}g | Carboidratos: ${formatNumber(carboidratosGramas * 0.15, 1)}g | Gorduras: ${formatNumber(gordurasGramas * 0.15, 1)}g</p>
            </div>
            <div class="meal-item">
                <h5>Jantar (15%)</h5>
                <p>Proteínas: ${formatNumber(proteinasGramas * 0.15, 1)}g | Carboidratos: ${formatNumber(carboidratosGramas * 0.15, 1)}g | Gorduras: ${formatNumber(gordurasGramas * 0.15, 1)}g</p>
            </div>
        </div>
        
        <h4>Fontes Alimentares Recomendadas</h4>
        <div class="food-sources">
            <div class="macro-source">
                <h5><i class="fas fa-drumstick-bite"></i> Proteínas de Qualidade</h5>
                <ul>
                    <li><strong>Animais:</strong> Frango, peixe, ovos, carne magra, laticínios</li>
                    <li><strong>Vegetais:</strong> Feijões, lentilhas, quinoa, tofu, tempeh</li>
                    <li><strong>Suplementos:</strong> Whey protein, caseína (se necessário)</li>
                </ul>
            </div>
            <div class="macro-source">
                <h5><i class="fas fa-bread-slice"></i> Carboidratos Complexos</h5>
                <ul>
                    <li><strong>Integrais:</strong> Aveia, arroz integral, quinoa, batata-doce</li>
                    <li><strong>Frutas:</strong> Banana, maçã, berries, manga</li>
                    <li><strong>Vegetais:</strong> Brócolis, espinafre, abóbora, beterraba</li>
                </ul>
            </div>
            <div class="macro-source">
                <h5><i class="fas fa-seedling"></i> Gorduras Saudáveis</h5>
                <ul>
                    <li><strong>Monoinsaturadas:</strong> Azeite, abacate, oleaginosas</li>
                    <li><strong>Poli-insaturadas:</strong> Peixes gordos, sementes, óleo de linhaça</li>
                    <li><strong>Saturadas (moderação):</strong> Coco, manteiga, carnes</li>
                </ul>
            </div>
        </div>
    `;
    
    // Objective-specific tips
    if (objetivo === 'perder') {
        recomendacoesHTML += `
            <div class="objective-tips weight-loss">
                <h5><i class="fas fa-minus-circle"></i> Dicas para Perda de Peso</h5>
                <ul>
                    <li>Priorize proteínas em cada refeição para maior saciedade</li>
                    <li>Consuma carboidratos principalmente no pré e pós-treino</li>
                    <li>Inclua fibras para aumentar a saciedade (25-35g/dia)</li>
                    <li>Beba água antes das refeições</li>
                    <li>Evite alimentos ultraprocessados</li>
                </ul>
            </div>
        `;
    } else if (objetivo === 'ganhar') {
        recomendacoesHTML += `
            <div class="objective-tips weight-gain">
                <h5><i class="fas fa-plus-circle"></i> Dicas para Ganho de Peso</h5>
                <ul>
                    <li>Faça refeições frequentes (a cada 3-4 horas)</li>
                    <li>Inclua carboidratos de qualidade em todas as refeições</li>
                    <li>Consuma proteína dentro de 2h após o treino</li>
                    <li>Adicione gorduras saudáveis para aumentar calorias</li>
                    <li>Considere shakes calóricos entre refeições</li>
                </ul>
            </div>
        `;
    } else {
        recomendacoesHTML += `
            <div class="objective-tips maintenance">
                <h5><i class="fas fa-equals"></i> Dicas para Manutenção</h5>
                <ul>
                    <li>Mantenha consistência na alimentação</li>
                    <li>Monitore o peso semanalmente</li>
                    <li>Ajuste as porções conforme necessário</li>
                    <li>Foque na qualidade dos alimentos</li>
                    <li>Permita flexibilidade ocasional (regra 80/20)</li>
                </ul>
            </div>
        `;
    }
    
    recomendacoes.innerHTML = recomendacoesHTML;
    
    showResult('macronutrientes');
});

function createMacroRecommendationsElement() {
    const element = document.createElement('div');
    element.id = 'macro-recomendacoes';
    element.className = 'macro-recommendations';
    document.getElementById('macronutrientes-result').appendChild(element);
    return element;
}

// ===== GASTO CALÓRICO CALCULATOR =====
document.getElementById('gasto-calorico-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('gasto-peso').value);
    const duracao = parseInt(document.getElementById('gasto-duracao').value);
    const met = parseFloat(document.getElementById('gasto-atividade').value);
    
    // Formula: Calories = MET × weight (kg) × time (hours)
    const horas = duracao / 60;
    const calorias = met * peso * horas;
    
    // Update result
    document.getElementById('gasto-calorias').textContent = formatNumber(calorias, 0);
    
    // Create equivalencies
    const equivalencias = document.getElementById('gasto-equivalencias');
    equivalencias.innerHTML = `
        <div class="equiv-item">
            <i class="fas fa-apple-alt"></i>
            <span>${formatNumber(calorias / 80, 1)} maçãs médias</span>
        </div>
        <div class="equiv-item">
            <i class="fas fa-bread-slice"></i>
            <span>${formatNumber(calorias / 70, 1)} fatias de pão</span>
        </div>
        <div class="equiv-item">
            <i class="fas fa-cookie"></i>
            <span>${formatNumber(calorias / 150, 1)} biscoitos recheados</span>
        </div>
        <div class="equiv-item">
            <i class="fas fa-ice-cream"></i>
            <span>${formatNumber(calorias / 200, 1)} bolas de sorvete</span>
        </div>
    `;
    
    showResult('gasto-calorico');
});

// ===== ÁGUA CALCULATOR =====
document.getElementById('agua-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('agua-peso').value);
    const atividade = parseFloat(document.getElementById('agua-atividade').value);
    const clima = parseFloat(document.getElementById('agua-clima').value);
    const idade = parseInt(document.getElementById('agua-idade').value);
    
    // Base calculation: 35ml per kg of body weight
    let aguaBase = peso * 35;
    
    // Adjust for age
    if (idade > 65) {
        aguaBase *= 0.9; // Elderly need slightly less
    } else if (idade < 18) {
        aguaBase *= 1.1; // Young people need more
    }
    
    // Apply activity and climate multipliers
    const aguaTotal = aguaBase * atividade * clima;
    
    const litros = aguaTotal / 1000;
    const copos = Math.round(aguaTotal / 200); // 200ml per glass
    const porHora = Math.round(aguaTotal / 16); // Assuming 16 waking hours
    
    // Update results
    document.getElementById('agua-litros').textContent = formatNumber(litros, 1);
    document.getElementById('agua-copos').textContent = copos;
    document.getElementById('agua-hora').textContent = porHora;
    
    showResult('agua');
});

// ===== ÍNDICE GLICÊMICO CALCULATOR =====
document.getElementById('indice-glicemico-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const ig = parseInt(document.getElementById('ig-alimento').value);
    const quantidade = parseFloat(document.getElementById('ig-quantidade').value);
    const carboidratosPor100g = parseFloat(document.getElementById('ig-carboidratos').value);
    
    // Calculate glycemic load: (GI × carbs per serving) / 100
    const carboidratosNaPorcao = (carboidratosPor100g * quantidade) / 100;
    const cargaGlicemica = (ig * carboidratosNaPorcao) / 100;
    
    // Update results
    document.getElementById('ig-valor').textContent = ig;
    document.getElementById('ig-carga').textContent = formatNumber(cargaGlicemica, 1);
    
    // Classifications
    let igClassificacao, cargaClassificacao;
    
    if (ig <= 55) {
        igClassificacao = 'Baixo';
    } else if (ig <= 69) {
        igClassificacao = 'Médio';
    } else {
        igClassificacao = 'Alto';
    }
    
    if (cargaGlicemica <= 10) {
        cargaClassificacao = 'Baixa';
    } else if (cargaGlicemica <= 19) {
        cargaClassificacao = 'Média';
    } else {
        cargaClassificacao = 'Alta';
    }
    
    document.getElementById('ig-classificacao').textContent = igClassificacao;
    document.getElementById('ig-carga-classificacao').textContent = cargaClassificacao;
    
    showResult('indice-glicemico');
});

// ===== FIBRAS CALCULATOR =====
document.getElementById('fibras-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const idade = parseInt(document.getElementById('fibras-idade').value);
    const sexo = document.getElementById('fibras-sexo').value;
    const objetivo = document.getElementById('fibras-objetivo').value;
    
    let fibrasBase;
    
    // Base recommendations by age and gender
    if (sexo === 'masculino') {
        if (idade <= 18) {
            fibrasBase = 38;
        } else if (idade <= 50) {
            fibrasBase = 38;
        } else {
            fibrasBase = 30;
        }
    } else {
        if (idade <= 18) {
            fibrasBase = 26;
        } else if (idade <= 50) {
            fibrasBase = 25;
        } else {
            fibrasBase = 21;
        }
    }
    
    // Adjust based on objective
    let fibrasTotal = fibrasBase;
    switch (objetivo) {
        case 'perda-peso':
            fibrasTotal = fibrasBase * 1.2;
            break;
        case 'digestao':
            fibrasTotal = fibrasBase * 1.15;
            break;
        case 'colesterol':
            fibrasTotal = fibrasBase * 1.1;
            break;
    }
    
    // Distribution: approximately 1/3 soluble, 2/3 insoluble
    const fibrasSoluveis = fibrasTotal * 0.33;
    const fibrasInsoluveis = fibrasTotal * 0.67;
    
    // Update results
    document.getElementById('fibras-gramas').textContent = formatNumber(fibrasTotal, 0);
    document.getElementById('fibras-soluveis').textContent = formatNumber(fibrasSoluveis, 0);
    document.getElementById('fibras-insoluveis').textContent = formatNumber(fibrasInsoluveis, 0);
    
    showResult('fibras');
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Check if there's a selected category from localStorage
    const selectedCategory = localStorage.getItem('selectedCategory');
    if (selectedCategory === 'nutricionais') {
        // Clear the selection
        localStorage.removeItem('selectedCategory');
    }
    
    // Show first calculator by default
    showCalculator('calorias');
    
    // Add CSS for equivalencies and other elements
    const style = document.createElement('style');
    style.textContent = `
        .result__summary {
            margin-bottom: 1.5rem;
        }
        
        .result__percentage {
            font-size: 0.875rem;
            color: var(--gray-500);
            margin-top: 0.25rem;
        }
        
        .result__calories {
            font-size: 0.75rem;
            color: var(--gray-400);
            margin-top: 0.25rem;
        }
        
        .equivalencias {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .equiv-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem;
            background: var(--white-color);
            border-radius: var(--radius-md);
            border: 1px solid var(--gray-200);
        }
        
        .equiv-item i {
            color: var(--secondary-color);
            font-size: 1.25rem;
        }
        
        .ig-info {
            margin-top: 1rem;
        }
        
        .ig-legend {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .ig-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .ig-color {
            width: 16px;
            height: 16px;
            border-radius: 50%;
        }
        
        .ig-color.low {
            background: var(--secondary-color);
        }
        
        .ig-color.medium {
            background: var(--accent-color);
        }
        
        .ig-color.high {
            background: #ef4444;
        }
        
        .fibras-fontes {
            margin-top: 1rem;
        }
        
        .fonte-item {
            padding: 0.75rem;
            background: var(--white-color);
            border-radius: var(--radius-md);
            border: 1px solid var(--gray-200);
            margin-bottom: 0.5rem;
        }
        
        @media (max-width: 768px) {
            .equivalencias {
                grid-template-columns: 1fr;
            }
            
            .ig-legend {
                flex-direction: column;
            }
        }
    `;
    document.head.appendChild(style);
});


// ===== CALCULADORA DE CALORIAS DIÁRIAS MELHORADA =====
document.getElementById('calorias-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('calorias-peso').value);
    const altura = parseFloat(document.getElementById('calorias-altura').value);
    const idade = parseInt(document.getElementById('calorias-idade').value);
    const sexo = document.getElementById('calorias-sexo').value;
    const atividade = parseFloat(document.getElementById('calorias-atividade').value);
    const objetivo = document.getElementById('calorias-objetivo').value;
    
    // Calcular TMB usando Mifflin-St Jeor (mais precisa)
    let tmb;
    if (sexo === 'masculino') {
        tmb = (10 * peso) + (6.25 * altura) - (5 * idade) + 5;
    } else {
        tmb = (10 * peso) + (6.25 * altura) - (5 * idade) - 161;
    }
    
    const manutencao = tmb * atividade;
    let caloriasObjetivo;
    let ajuste = '';
    
    switch (objetivo) {
        case 'perder':
            caloriasObjetivo = manutencao - 500;
            ajuste = 'Déficit de 500 kcal para perda de ~0,5kg/semana';
            break;
        case 'perder-rapido':
            caloriasObjetivo = manutencao - 750;
            ajuste = 'Déficit de 750 kcal para perda de ~0,75kg/semana';
            break;
        case 'manter':
            caloriasObjetivo = manutencao;
            ajuste = 'Manutenção do peso atual';
            break;
        case 'ganhar':
            caloriasObjetivo = manutencao + 300;
            ajuste = 'Superávit de 300 kcal para ganho controlado';
            break;
        case 'ganhar-rapido':
            caloriasObjetivo = manutencao + 500;
            ajuste = 'Superávit de 500 kcal para ganho de ~0,5kg/semana';
            break;
    }
    
    document.getElementById('calorias-tmb').textContent = formatNumber(tmb, 0);
    document.getElementById('calorias-manutencao').textContent = formatNumber(manutencao, 0);
    document.getElementById('calorias-objetivo-valor').textContent = formatNumber(caloriasObjetivo, 0);
    
    const resultadoDiv = document.getElementById('calorias-result');
    resultadoDiv.innerHTML = `
        <div class="calculator-result">
            <div class="result-header">
                <div class="icon">🔥</div>
                <h3>Necessidades Calóricas Diárias</h3>
            </div>
            
            <div class="tips-grid" style="margin-bottom: 2rem;">
                <div class="tip-card">
                    <h5>⚡ TMB</h5>
                    <div class="result-value" style="margin: 1rem 0;">
                        <span class="number" style="font-size: 1.8rem;">${formatNumber(tmb, 0)}</span>
                        <span class="unit">kcal/dia</span>
                    </div>
                    <p style="font-size: 0.9rem; color: #666;">Metabolismo basal</p>
                </div>
                <div class="tip-card">
                    <h5>🏃‍♂️ Manutenção</h5>
                    <div class="result-value" style="margin: 1rem 0;">
                        <span class="number" style="font-size: 1.8rem;">${formatNumber(manutencao, 0)}</span>
                        <span class="unit">kcal/dia</span>
                    </div>
                    <p style="font-size: 0.9rem; color: #666;">Com atividade física</p>
                </div>
                <div class="tip-card">
                    <h5>🎯 Objetivo</h5>
                    <div class="result-value" style="margin: 1rem 0;">
                        <span class="number" style="font-size: 1.8rem;">${formatNumber(caloriasObjetivo, 0)}</span>
                        <span class="unit">kcal/dia</span>
                    </div>
                    <p style="font-size: 0.9rem; color: #666;">${ajuste}</p>
                </div>
            </div>
            
            ${gerarRecomendacoesCalorias(caloriasObjetivo, objetivo, peso, atividade)}
        </div>
    `;
    
    showResult('calorias');
});

function gerarRecomendacoesCalorias(calorias, objetivo, peso, atividade) {
    const distribuicaoRefeicoes = {
        'cafe': Math.round(calorias * 0.25),
        'lanche1': Math.round(calorias * 0.10),
        'almoco': Math.round(calorias * 0.30),
        'lanche2': Math.round(calorias * 0.15),
        'jantar': Math.round(calorias * 0.20)
    };
    
    return `
        <div class="recommendations-section">
            <h4>Distribuição Calórica Recomendada</h4>
            
            <div class="meal-distribution">
                <div class="meal-item">
                    <h5>🌅 Café da Manhã</h5>
                    <p><strong>${distribuicaoRefeicoes.cafe} kcal</strong> (25% do total)</p>
                    <p>Inclua proteínas, carboidratos complexos e gorduras boas</p>
                </div>
                <div class="meal-item">
                    <h5>🍎 Lanche da Manhã</h5>
                    <p><strong>${distribuicaoRefeicoes.lanche1} kcal</strong> (10% do total)</p>
                    <p>Frutas, oleaginosas ou iogurte</p>
                </div>
                <div class="meal-item">
                    <h5>🍽️ Almoço</h5>
                    <p><strong>${distribuicaoRefeicoes.almoco} kcal</strong> (30% do total)</p>
                    <p>Refeição principal com todos os macronutrientes</p>
                </div>
                <div class="meal-item">
                    <h5>🥨 Lanche da Tarde</h5>
                    <p><strong>${distribuicaoRefeicoes.lanche2} kcal</strong> (15% do total)</p>
                    <p>Opção nutritiva para manter energia</p>
                </div>
                <div class="meal-item">
                    <h5>🌙 Jantar</h5>
                    <p><strong>${distribuicaoRefeicoes.jantar} kcal</strong> (20% do total)</p>
                    <p>Refeição mais leve, rica em proteínas</p>
                </div>
            </div>
            
            <div class="recommendation-item priority-high">
                <h5>📊 Estratégias por Objetivo</h5>
                ${objetivo.includes('perder') ? `
                    <ul>
                        <li><strong>Priorize Proteínas:</strong> ${formatNumber(peso * 1.8, 0)}g diárias para preservar massa muscular</li>
                        <li><strong>Fibras:</strong> 25-35g para maior saciedade</li>
                        <li><strong>Hidratação:</strong> ${formatNumber(peso * 35, 0)}ml de água por dia</li>
                        <li><strong>Timing:</strong> Evite calorias líquidas e lanches noturnos</li>
                    </ul>
                ` : objetivo.includes('ganhar') ? `
                    <ul>
                        <li><strong>Densidade Calórica:</strong> Escolha alimentos nutritivos e calóricos</li>
                        <li><strong>Proteínas:</strong> ${formatNumber(peso * 2.0, 0)}g diárias para síntese muscular</li>
                        <li><strong>Carboidratos:</strong> Antes e após treinos para energia e recuperação</li>
                        <li><strong>Frequência:</strong> 5-6 refeições menores ao longo do dia</li>
                    </ul>
                ` : `
                    <ul>
                        <li><strong>Equilíbrio:</strong> Mantenha proporção adequada de macronutrientes</li>
                        <li><strong>Consistência:</strong> Evite grandes variações calóricas diárias</li>
                        <li><strong>Qualidade:</strong> 80% alimentos integrais, 20% flexibilidade</li>
                        <li><strong>Monitoramento:</strong> Ajuste conforme mudanças no peso/composição</li>
                    </ul>
                `}
            </div>
            
            <div class="tips-grid">
                <div class="tip-card">
                    <h5>📱 Aplicativos Úteis</h5>
                    <p>Use apps como MyFitnessPal, FatSecret ou Cronometer para rastrear calorias com precisão.</p>
                </div>
                <div class="tip-card">
                    <h5>⚖️ Pesagem de Alimentos</h5>
                    <p>Invista em uma balança digital para medir porções com precisão, especialmente no início.</p>
                </div>
                <div class="tip-card">
                    <h5>🔄 Ajustes Necessários</h5>
                    <p>Reavalie suas necessidades a cada 2-4 semanas e ajuste conforme os resultados.</p>
                </div>
            </div>
        </div>
    `;
}

// ===== CALCULADORA DE HIDRATAÇÃO MELHORADA =====
document.getElementById('agua-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('agua-peso').value);
    const atividade = document.getElementById('agua-atividade').value;
    const clima = document.getElementById('agua-clima').value;
    const idade = parseInt(document.getElementById('agua-idade').value);
    
    // Cálculo base: 35ml por kg de peso
    let aguaBase = peso * 35;
    
    // Ajustes por atividade física
    switch (atividade) {
        case 'sedentario':
            aguaBase *= 1.0;
            break;
        case 'leve':
            aguaBase *= 1.1;
            break;
        case 'moderado':
            aguaBase *= 1.3;
            break;
        case 'intenso':
            aguaBase *= 1.5;
            break;
        case 'muito-intenso':
            aguaBase *= 1.7;
            break;
    }
    
    // Ajustes por clima
    switch (clima) {
        case 'frio':
            aguaBase *= 0.9;
            break;
        case 'temperado':
            aguaBase *= 1.0;
            break;
        case 'quente':
            aguaBase *= 1.2;
            break;
        case 'muito-quente':
            aguaBase *= 1.4;
            break;
    }
    
    // Ajuste por idade (pessoas mais velhas precisam de mais atenção à hidratação)
    if (idade > 65) {
        aguaBase *= 1.1;
    }
    
    const aguaLitros = aguaBase / 1000;
    const aguaCopos = Math.round(aguaBase / 250); // Copos de 250ml
    
    document.getElementById('agua-litros').textContent = formatNumber(aguaLitros, 1);
    document.getElementById('agua-copos').textContent = aguaCopos;
    
    const resultadoDiv = document.getElementById('agua-result');
    resultadoDiv.innerHTML = `
        <div class="calculator-result">
            <div class="result-header">
                <div class="icon">💧</div>
                <h3>Necessidades de Hidratação</h3>
            </div>
            
            <div class="result-value">
                <span class="number">${formatNumber(aguaLitros, 1)}</span>
                <span class="unit">litros por dia</span>
            </div>
            
            <div class="result-interpretation good">
                <h4>Equivale a ${aguaCopos} copos de 250ml</h4>
                <p>Esta recomendação considera seu peso, nível de atividade, clima e idade para uma hidratação adequada.</p>
            </div>
            
            ${gerarRecomendacoesHidratacao(aguaLitros, atividade, clima, peso)}
        </div>
    `;
    
    showResult('agua');
});

function gerarRecomendacoesHidratacao(litros, atividade, clima, peso) {
    const distribucaoHoraria = {
        'manha': Math.round(litros * 0.3 * 1000),
        'tarde': Math.round(litros * 0.4 * 1000),
        'noite': Math.round(litros * 0.3 * 1000)
    };
    
    return `
        <div class="recommendations-section">
            <h4>Estratégias de Hidratação</h4>
            
            <div class="recommendation-item priority-high">
                <h5>⏰ Distribuição ao Longo do Dia</h5>
                <ul>
                    <li><strong>Manhã (6h-12h):</strong> ${distribucaoHoraria.manha}ml - Reidrate após o jejum noturno</li>
                    <li><strong>Tarde (12h-18h):</strong> ${distribucaoHoraria.tarde}ml - Período de maior atividade</li>
                    <li><strong>Noite (18h-22h):</strong> ${distribucaoHoraria.noite}ml - Reduza 2h antes de dormir</li>
                </ul>
            </div>
            
            <div class="recommendation-item priority-medium">
                <h5>🏃‍♂️ Hidratação Durante Exercícios</h5>
                <ul>
                    <li><strong>Antes:</strong> 400-600ml, 2-3h antes do exercício</li>
                    <li><strong>Durante:</strong> 150-250ml a cada 15-20 minutos</li>
                    <li><strong>Após:</strong> 150% do peso perdido em suor</li>
                    <li><strong>Eletrólitos:</strong> Adicione em exercícios > 1h ou clima quente</li>
                </ul>
            </div>
            
            <div class="recommendation-item priority-low">
                <h5>🌡️ Sinais de Hidratação</h5>
                <ul>
                    <li><strong>Urina Clara:</strong> Indicador de boa hidratação</li>
                    <li><strong>Sede Mínima:</strong> Não espere sentir sede para beber</li>
                    <li><strong>Pele Elástica:</strong> Teste beliscando a pele do dorso da mão</li>
                    <li><strong>Energia Estável:</strong> Desidratação causa fadiga</li>
                </ul>
            </div>
            
            <div class="tips-grid">
                <div class="tip-card">
                    <h5>🍋 Saborizantes Naturais</h5>
                    <p>Adicione limão, pepino, hortelã ou frutas para tornar a água mais atrativa sem calorias extras.</p>
                </div>
                <div class="tip-card">
                    <h5>📱 Lembretes</h5>
                    <p>Use apps ou alarmes para lembrar de beber água regularmente, especialmente se você esquece facilmente.</p>
                </div>
                <div class="tip-card">
                    <h5>🥤 Outras Fontes</h5>
                    <p>Chás, água de coco, sopas e frutas ricas em água também contribuem para a hidratação diária.</p>
                </div>
            </div>
            
            ${atividade === 'muito-intenso' || clima === 'muito-quente' ? `
                <div class="warning-box">
                    <h4>Atenção Especial</h4>
                    <p>Seu nível de atividade/clima requer atenção extra à hidratação. Monitore sinais de desidratação e considere suplementação de eletrólitos.</p>
                </div>
            ` : ''}
        </div>
    `;
}

// ===== CALCULADORA DE FIBRAS MELHORADA =====
document.getElementById('fibras-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const idade = parseInt(document.getElementById('fibras-idade').value);
    const sexo = document.getElementById('fibras-sexo').value;
    const objetivo = document.getElementById('fibras-objetivo').value;
    const atividade = document.getElementById('fibras-atividade').value;
    
    // Recomendações base por idade e sexo
    let fibrasBase;
    if (sexo === 'masculino') {
        if (idade <= 50) {
            fibrasBase = 38;
        } else {
            fibrasBase = 30;
        }
    } else {
        if (idade <= 50) {
            fibrasBase = 25;
        } else {
            fibrasBase = 21;
        }
    }
    
    // Ajustes por objetivo
    switch (objetivo) {
        case 'perder-peso':
            fibrasBase += 10; // Mais fibras para saciedade
            break;
        case 'controle-glicemia':
            fibrasBase += 15; // Fibras ajudam no controle glicêmico
            break;
        case 'saude-intestinal':
            fibrasBase += 12; // Fibras para microbiota
            break;
        case 'colesterol':
            fibrasBase += 8; // Fibras solúveis reduzem colesterol
            break;
        case 'geral':
            // Manter base
            break;
    }
    
    // Ajuste por atividade (pessoas ativas podem precisar de mais)
    if (atividade === 'alto') {
        fibrasBase += 5;
    }
    
    document.getElementById('fibras-gramas').textContent = formatNumber(fibrasBase, 0);
    
    const resultadoDiv = document.getElementById('fibras-result');
    resultadoDiv.innerHTML = `
        <div class="calculator-result">
            <div class="result-header">
                <div class="icon">🌾</div>
                <h3>Necessidades de Fibras</h3>
            </div>
            
            <div class="result-value">
                <span class="number">${formatNumber(fibrasBase, 0)}</span>
                <span class="unit">gramas por dia</span>
            </div>
            
            <div class="result-interpretation good">
                <h4>Recomendação Personalizada</h4>
                <p>Esta quantidade considera sua idade, sexo, objetivo e nível de atividade para otimizar os benefícios das fibras.</p>
            </div>
            
            ${gerarRecomendacoesFibras(fibrasBase, objetivo)}
        </div>
    `;
    
    showResult('fibras');
});

function gerarRecomendacoesFibras(fibras, objetivo) {
    const fontesFibras = {
        'soluveis': [
            'Aveia (10g por xícara)',
            'Feijões (6-8g por 1/2 xícara)',
            'Maçã com casca (4g por unidade)',
            'Cevada (6g por 1/2 xícara)',
            'Psyllium (5g por colher de sopa)'
        ],
        'insoluveis': [
            'Farelo de trigo (12g por 1/4 xícara)',
            'Pão integral (3g por fatia)',
            'Brócolis (5g por xícara)',
            'Cenoura (3g por unidade)',
            'Arroz integral (4g por xícara)'
        ],
        'mistas': [
            'Quinoa (5g por xícara)',
            'Chia (10g por 2 colheres de sopa)',
            'Linhaça (8g por 2 colheres de sopa)',
            'Abacate (10g por unidade)',
            'Framboesa (8g por xícara)'
        ]
    };
    
    return `
        <div class="recommendations-section">
            <h4>Fontes de Fibras por Categoria</h4>
            
            <div class="food-sources">
                <div class="macro-source">
                    <h5>🌊 Fibras Solúveis</h5>
                    <p><strong>Benefícios:</strong> Reduzem colesterol, controlam glicemia</p>
                    <ul>
                        ${fontesFibras.soluveis.map(fonte => `<li>${fonte}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="macro-source">
                    <h5>🌿 Fibras Insolúveis</h5>
                    <p><strong>Benefícios:</strong> Melhoram trânsito intestinal, previnem constipação</p>
                    <ul>
                        ${fontesFibras.insoluveis.map(fonte => `<li>${fonte}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="macro-source">
                    <h5>🌱 Fontes Mistas</h5>
                    <p><strong>Benefícios:</strong> Combinam ambos os tipos de fibras</p>
                    <ul>
                        ${fontesFibras.mistas.map(fonte => `<li>${fonte}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="recommendation-item priority-high">
                <h5>📈 Como Aumentar Gradualmente</h5>
                <ul>
                    <li><strong>Semana 1-2:</strong> Adicione 5g por dia à sua ingestão atual</li>
                    <li><strong>Semana 3-4:</strong> Aumente mais 5g, totalizando +10g</li>
                    <li><strong>Semana 5-6:</strong> Continue aumentando até atingir a meta</li>
                    <li><strong>Hidratação:</strong> Aumente água proporcionalmente (250ml por 5g de fibra)</li>
                </ul>
            </div>
            
            <div class="recommendation-item priority-medium">
                <h5>🍽️ Distribuição nas Refeições</h5>
                <ul>
                    <li><strong>Café da Manhã:</strong> ${Math.round(fibras * 0.3)}g - Aveia, frutas, pão integral</li>
                    <li><strong>Almoço:</strong> ${Math.round(fibras * 0.4)}g - Saladas, legumes, grãos integrais</li>
                    <li><strong>Jantar:</strong> ${Math.round(fibras * 0.2)}g - Vegetais, quinoa</li>
                    <li><strong>Lanches:</strong> ${Math.round(fibras * 0.1)}g - Frutas, oleaginosas</li>
                </ul>
            </div>
            
            <div class="tips-grid">
                <div class="tip-card">
                    <h5>⚠️ Efeitos Colaterais</h5>
                    <p>Aumento muito rápido pode causar gases e desconforto. Vá devagar e beba bastante água.</p>
                </div>
                <div class="tip-card">
                    <h5>🥗 Dica Prática</h5>
                    <p>Deixe cascas em frutas e vegetais sempre que possível - é onde está a maior concentração de fibras.</p>
                </div>
                <div class="tip-card">
                    <h5>🕐 Timing</h5>
                    <p>Distribua fibras ao longo do dia para melhor digestão e aproveitamento dos benefícios.</p>
                </div>
            </div>
            
            ${objetivo === 'perder-peso' ? `
                <div class="objective-tips weight-loss">
                    <h5>🎯 Dicas para Perda de Peso</h5>
                    <ul>
                        <li>Coma fibras antes das refeições principais para aumentar saciedade</li>
                        <li>Prefira frutas inteiras ao invés de sucos</li>
                        <li>Inclua vegetais em pelo menos metade do prato</li>
                        <li>Mastigue bem para potencializar o efeito de saciedade</li>
                    </ul>
                </div>
            ` : objetivo === 'controle-glicemia' ? `
                <div class="objective-tips maintenance">
                    <h5>🎯 Dicas para Controle Glicêmico</h5>
                    <ul>
                        <li>Combine fibras com carboidratos para reduzir picos de glicose</li>
                        <li>Priorize fibras solúveis (aveia, feijões, maçã)</li>
                        <li>Coma salada antes do prato principal</li>
                        <li>Evite sucos, prefira frutas inteiras</li>
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
}


// ===== CALCULADORA DE PROTEÍNAS MELHORADA =====
document.getElementById('proteinas-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('proteinas-peso').value);
    const objetivo = document.getElementById('proteinas-objetivo').value;
    const atividade = document.getElementById('proteinas-atividade').value;
    const idade = parseInt(document.getElementById('proteinas-idade').value);
    const sexo = document.getElementById('proteinas-sexo').value;
    
    let proteinasPorKg;
    
    // Determinar necessidade baseada no objetivo e atividade
    switch (objetivo) {
        case 'sedentario':
            proteinasPorKg = 0.8;
            break;
        case 'manutencao':
            proteinasPorKg = atividade === 'baixo' ? 1.2 : atividade === 'moderado' ? 1.4 : 1.6;
            break;
        case 'ganho-muscular':
            proteinasPorKg = atividade === 'baixo' ? 1.6 : atividade === 'moderado' ? 2.0 : 2.2;
            break;
        case 'perda-peso':
            proteinasPorKg = atividade === 'baixo' ? 1.8 : atividade === 'moderado' ? 2.2 : 2.4;
            break;
        case 'atleta':
            proteinasPorKg = 2.5;
            break;
    }
    
    // Ajustes por idade (pessoas mais velhas precisam de mais proteína)
    if (idade > 65) {
        proteinasPorKg += 0.2;
    }
    
    const proteinasTotal = peso * proteinasPorKg;
    const proteinasPorRefeicao = proteinasTotal / 5; // 5 refeições
    const calorias = proteinasTotal * 4; // 4 kcal por grama
    
    document.getElementById('proteinas-gramas').textContent = formatNumber(proteinasTotal, 0);
    document.getElementById('proteinas-refeicao').textContent = formatNumber(proteinasPorRefeicao, 0);
    
    const resultadoDiv = document.getElementById('proteinas-result');
    resultadoDiv.innerHTML = `
        <div class="calculator-result">
            <div class="result-header">
                <div class="icon">🥩</div>
                <h3>Necessidades de Proteínas</h3>
            </div>
            
            <div class="result-value">
                <span class="number">${formatNumber(proteinasTotal, 0)}</span>
                <span class="unit">gramas por dia</span>
            </div>
            
            <div class="result-interpretation good">
                <h4>${formatNumber(proteinasPorKg, 1)}g por kg de peso corporal</h4>
                <p>Equivale a ${formatNumber(calorias, 0)} kcal de proteínas (${formatNumber((calorias/2000)*100, 0)}% de uma dieta de 2000 kcal)</p>
            </div>
            
            ${gerarRecomendacoesProteinas(proteinasTotal, proteinasPorRefeicao, objetivo, peso)}
        </div>
    `;
    
    showResult('proteinas');
});

function gerarRecomendacoesProteinas(total, porRefeicao, objetivo, peso) {
    const fontesProteinas = {
        'animais': [
            'Peito de frango (23g por 100g)',
            'Salmão (25g por 100g)',
            'Ovos (6g por unidade)',
            'Iogurte grego (15g por 150g)',
            'Queijo cottage (14g por 100g)',
            'Carne vermelha magra (26g por 100g)'
        ],
        'vegetais': [
            'Feijão preto (9g por 1/2 xícara)',
            'Lentilha (9g por 1/2 xícara)',
            'Quinoa (8g por xícara)',
            'Tofu (10g por 100g)',
            'Amendoim (7g por 30g)',
            'Chia (5g por 2 colheres de sopa)'
        ],
        'suplementos': [
            'Whey protein (20-25g por scoop)',
            'Caseína (20-24g por scoop)',
            'Proteína vegetal (15-20g por scoop)',
            'BCAA (5-10g por porção)',
            'Albumina (10-15g por colher)'
        ]
    };
    
    return `
        <div class="recommendations-section">
            <h4>Fontes de Proteínas de Alta Qualidade</h4>
            
            <div class="food-sources">
                <div class="macro-source">
                    <h5>🥩 Proteínas Animais</h5>
                    <p><strong>Vantagens:</strong> Perfil completo de aminoácidos, alta biodisponibilidade</p>
                    <ul>
                        ${fontesProteinas.animais.map(fonte => `<li>${fonte}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="macro-source">
                    <h5>🌱 Proteínas Vegetais</h5>
                    <p><strong>Vantagens:</strong> Fibras, antioxidantes, menor impacto ambiental</p>
                    <ul>
                        ${fontesProteinas.vegetais.map(fonte => `<li>${fonte}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="macro-source">
                    <h5>💊 Suplementos</h5>
                    <p><strong>Vantagens:</strong> Praticidade, absorção rápida, controle de calorias</p>
                    <ul>
                        ${fontesProteinas.suplementos.map(fonte => `<li>${fonte}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="recommendation-item priority-high">
                <h5>⏰ Distribuição Ideal ao Longo do Dia</h5>
                <ul>
                    <li><strong>Café da Manhã:</strong> ${Math.round(porRefeicao)}g - Ovos, iogurte, whey protein</li>
                    <li><strong>Lanche Manhã:</strong> ${Math.round(porRefeicao * 0.7)}g - Oleaginosas, queijo</li>
                    <li><strong>Almoço:</strong> ${Math.round(porRefeicao * 1.2)}g - Carnes, peixes, leguminosas</li>
                    <li><strong>Lanche Tarde:</strong> ${Math.round(porRefeicao * 0.8)}g - Iogurte, whey protein</li>
                    <li><strong>Jantar:</strong> ${Math.round(porRefeicao * 1.1)}g - Proteínas magras, tofu</li>
                </ul>
            </div>
            
            <div class="recommendation-item priority-medium">
                <h5>🏋️‍♂️ Timing para Exercícios</h5>
                <ul>
                    <li><strong>Pré-treino:</strong> 10-15g de proteína 1-2h antes</li>
                    <li><strong>Pós-treino:</strong> 20-30g dentro de 2h após o exercício</li>
                    <li><strong>Antes de dormir:</strong> 20-25g de caseína para síntese noturna</li>
                    <li><strong>Jejum:</strong> Quebrar com proteína para preservar massa muscular</li>
                </ul>
            </div>
            
            <div class="tips-grid">
                <div class="tip-card">
                    <h5>🧬 Aminoácidos Essenciais</h5>
                    <p>Combine diferentes fontes vegetais para obter perfil completo de aminoácidos (ex: arroz + feijão).</p>
                </div>
                <div class="tip-card">
                    <h5>🔥 Efeito Térmico</h5>
                    <p>Proteínas gastam 20-30% de suas calorias na digestão, ajudando no metabolismo e saciedade.</p>
                </div>
                <div class="tip-card">
                    <h5>💧 Hidratação</h5>
                    <p>Aumente a ingestão de água ao consumir mais proteínas para auxiliar na função renal.</p>
                </div>
            </div>
            
            ${objetivo === 'ganho-muscular' ? `
                <div class="objective-tips muscle-gain">
                    <h5>🎯 Dicas para Ganho Muscular</h5>
                    <ul>
                        <li>Consuma proteína a cada 3-4 horas para manter síntese proteica</li>
                        <li>Priorize leucina (carnes, ovos, whey) para estimular mTOR</li>
                        <li>Combine com carboidratos pós-treino para melhor absorção</li>
                        <li>Não negligencie proteínas nos dias de descanso</li>
                    </ul>
                </div>
            ` : objetivo === 'perda-peso' ? `
                <div class="objective-tips weight-loss">
                    <h5>🎯 Dicas para Perda de Peso</h5>
                    <ul>
                        <li>Inicie refeições com proteína para aumentar saciedade</li>
                        <li>Prefira fontes magras para controlar calorias</li>
                        <li>Use whey protein como lanche para controlar fome</li>
                        <li>Mantenha alta ingestão para preservar massa muscular</li>
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
}

// ===== CALCULADORA DE CARBOIDRATOS MELHORADA =====
document.getElementById('carboidratos-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('carboidratos-peso').value);
    const atividade = document.getElementById('carboidratos-atividade').value;
    const objetivo = document.getElementById('carboidratos-objetivo').value;
    const tipo_treino = document.getElementById('carboidratos-treino').value;
    
    let carbsPorKg;
    
    // Base por atividade física
    switch (atividade) {
        case 'sedentario':
            carbsPorKg = 3;
            break;
        case 'leve':
            carbsPorKg = 4;
            break;
        case 'moderado':
            carbsPorKg = 5;
            break;
        case 'intenso':
            carbsPorKg = 6;
            break;
        case 'muito-intenso':
            carbsPorKg = 8;
            break;
    }
    
    // Ajustes por objetivo
    switch (objetivo) {
        case 'perder-peso':
            carbsPorKg *= 0.7; // Redução para déficit calórico
            break;
        case 'manter-peso':
            // Manter base
            break;
        case 'ganhar-peso':
            carbsPorKg *= 1.3; // Aumento para superávit
            break;
        case 'performance':
            carbsPorKg *= 1.5; // Máximo para performance
            break;
    }
    
    // Ajustes por tipo de treino
    if (tipo_treino === 'forca') {
        carbsPorKg *= 1.1;
    } else if (tipo_treino === 'resistencia') {
        carbsPorKg *= 1.4;
    }
    
    const carbsTotal = peso * carbsPorKg;
    const calorias = carbsTotal * 4;
    
    document.getElementById('carboidratos-gramas').textContent = formatNumber(carbsTotal, 0);
    
    const resultadoDiv = document.getElementById('carboidratos-result');
    resultadoDiv.innerHTML = `
        <div class="calculator-result">
            <div class="result-header">
                <div class="icon">🍞</div>
                <h3>Necessidades de Carboidratos</h3>
            </div>
            
            <div class="result-value">
                <span class="number">${formatNumber(carbsTotal, 0)}</span>
                <span class="unit">gramas por dia</span>
            </div>
            
            <div class="result-interpretation good">
                <h4>${formatNumber(carbsPorKg, 1)}g por kg de peso corporal</h4>
                <p>Equivale a ${formatNumber(calorias, 0)} kcal de carboidratos (${formatNumber((calorias/2000)*100, 0)}% de uma dieta de 2000 kcal)</p>
            </div>
            
            ${gerarRecomendacoesCarboidratos(carbsTotal, objetivo, atividade, tipo_treino)}
        </div>
    `;
    
    showResult('carboidratos');
});

function gerarRecomendacoesCarboidratos(total, objetivo, atividade, tipo_treino) {
    const fontesCarboidratos = {
        'complexos': [
            'Aveia (54g por xícara)',
            'Arroz integral (45g por xícara)',
            'Quinoa (39g por xícara)',
            'Batata doce (27g por 150g)',
            'Pão integral (12g por fatia)',
            'Macarrão integral (37g por xícara)'
        ],
        'simples': [
            'Banana (27g por unidade)',
            'Maçã (25g por unidade)',
            'Uva passa (22g por 30g)',
            'Mel (17g por colher de sopa)',
            'Tâmara (18g por unidade)',
            'Manga (25g por xícara)'
        ],
        'pre_pos_treino': [
            'Banana + aveia (pré-treino)',
            'Batata doce + frango (pós-treino)',
            'Arroz branco + proteína (pós-treino)',
            'Maltodextrina (durante treino longo)',
            'Frutas secas (pré-treino)',
            'Bebida esportiva (durante exercício)'
        ]
    };
    
    const distribuicao = {
        'manha': Math.round(total * 0.25),
        'pre_treino': Math.round(total * 0.15),
        'pos_treino': Math.round(total * 0.20),
        'almoco': Math.round(total * 0.25),
        'jantar': Math.round(total * 0.15)
    };
    
    return `
        <div class="recommendations-section">
            <h4>Fontes de Carboidratos por Categoria</h4>
            
            <div class="food-sources">
                <div class="macro-source">
                    <h5>🌾 Carboidratos Complexos</h5>
                    <p><strong>Vantagens:</strong> Energia sustentada, fibras, vitaminas do complexo B</p>
                    <ul>
                        ${fontesCarboidratos.complexos.map(fonte => `<li>${fonte}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="macro-source">
                    <h5>🍎 Carboidratos Simples</h5>
                    <p><strong>Vantagens:</strong> Energia rápida, vitaminas, antioxidantes</p>
                    <ul>
                        ${fontesCarboidratos.simples.map(fonte => `<li>${fonte}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="macro-source">
                    <h5>🏋️‍♂️ Pré/Pós-Treino</h5>
                    <p><strong>Vantagens:</strong> Otimização de performance e recuperação</p>
                    <ul>
                        ${fontesCarboidratos.pre_pos_treino.map(fonte => `<li>${fonte}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="recommendation-item priority-high">
                <h5>⏰ Distribuição Estratégica</h5>
                <ul>
                    <li><strong>Café da Manhã:</strong> ${distribuicao.manha}g - Aveia, frutas, pão integral</li>
                    <li><strong>Pré-treino (1-2h):</strong> ${distribuicao.pre_treino}g - Banana, aveia, mel</li>
                    <li><strong>Pós-treino (0-2h):</strong> ${distribuicao.pos_treino}g - Arroz branco, batata</li>
                    <li><strong>Almoço:</strong> ${distribuicao.almoco}g - Arroz, quinoa, legumes</li>
                    <li><strong>Jantar:</strong> ${distribuicao.jantar}g - Carboidratos complexos</li>
                </ul>
            </div>
            
            <div class="recommendation-item priority-medium">
                <h5>🎯 Timing para Performance</h5>
                <ul>
                    <li><strong>3-4h antes:</strong> Refeição rica em carboidratos complexos</li>
                    <li><strong>1-2h antes:</strong> Carboidratos simples + baixa fibra</li>
                    <li><strong>Durante (>90min):</strong> 30-60g/h de carboidratos simples</li>
                    <li><strong>0-30min após:</strong> Carboidratos de alto IG + proteína</li>
                </ul>
            </div>
            
            <div class="tips-grid">
                <div class="tip-card">
                    <h5>📊 Índice Glicêmico</h5>
                    <p>Use carboidratos de baixo IG na maior parte do dia, alto IG apenas pré/pós-treino.</p>
                </div>
                <div class="tip-card">
                    <h5>🧠 Função Cerebral</h5>
                    <p>O cérebro consome ~120g de glicose por dia. Carboidratos são essenciais para função cognitiva.</p>
                </div>
                <div class="tip-card">
                    <h5>💤 Sono</h5>
                    <p>Carboidratos no jantar podem melhorar o sono ao aumentar serotonina e melatonina.</p>
                </div>
            </div>
            
            ${objetivo === 'perder-peso' ? `
                <div class="objective-tips weight-loss">
                    <h5>🎯 Dicas para Perda de Peso</h5>
                    <ul>
                        <li>Concentre carboidratos ao redor dos treinos</li>
                        <li>Prefira fontes ricas em fibras para saciedade</li>
                        <li>Evite carboidratos refinados e açúcares adicionados</li>
                        <li>Combine com proteínas para estabilizar glicemia</li>
                    </ul>
                </div>
            ` : objetivo === 'performance' ? `
                <div class="objective-tips performance">
                    <h5>🎯 Dicas para Performance</h5>
                    <ul>
                        <li>Maximize estoques de glicogênio com carb loading</li>
                        <li>Use suplementos durante exercícios longos</li>
                        <li>Priorize recuperação com carboidratos pós-treino</li>
                        <li>Monitore energia e ajuste conforme necessário</li>
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
}

// ===== CALCULADORA DE GORDURAS MELHORADA =====
document.getElementById('gorduras-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('gorduras-peso').value);
    const calorias_totais = parseFloat(document.getElementById('gorduras-calorias').value);
    const objetivo = document.getElementById('gorduras-objetivo').value;
    const sexo = document.getElementById('gorduras-sexo').value;
    
    let percentualGorduras;
    
    // Determinar percentual baseado no objetivo
    switch (objetivo) {
        case 'perder-peso':
            percentualGorduras = 25; // Moderado para saciedade
            break;
        case 'manter-peso':
            percentualGorduras = 30; // Padrão saudável
            break;
        case 'ganhar-peso':
            percentualGorduras = 35; // Maior densidade calórica
            break;
        case 'saude-hormonal':
            percentualGorduras = sexo === 'feminino' ? 35 : 30; // Mulheres precisam de mais
            break;
        case 'cetogenica':
            percentualGorduras = 70; // Dieta cetogênica
            break;
    }
    
    const gordurasGramas = (calorias_totais * percentualGorduras / 100) / 9;
    const calorias = gordurasGramas * 9;
    
    document.getElementById('gorduras-gramas').textContent = formatNumber(gordurasGramas, 0);
    
    const resultadoDiv = document.getElementById('gorduras-result');
    resultadoDiv.innerHTML = `
        <div class="calculator-result">
            <div class="result-header">
                <div class="icon">🥑</div>
                <h3>Necessidades de Gorduras</h3>
            </div>
            
            <div class="result-value">
                <span class="number">${formatNumber(gordurasGramas, 0)}</span>
                <span class="unit">gramas por dia</span>
            </div>
            
            <div class="result-interpretation good">
                <h4>${percentualGorduras}% das calorias totais</h4>
                <p>Equivale a ${formatNumber(calorias, 0)} kcal de gorduras (${formatNumber(gordurasGramas/peso, 1)}g por kg de peso)</p>
            </div>
            
            ${gerarRecomendacoesGorduras(gordurasGramas, objetivo, sexo)}
        </div>
    `;
    
    showResult('gorduras');
});

function gerarRecomendacoesGorduras(total, objetivo, sexo) {
    const fontesGorduras = {
        'monoinsaturadas': [
            'Azeite de oliva (14g por colher de sopa)',
            'Abacate (15g por 1/2 unidade)',
            'Oleaginosas (14g por 30g)',
            'Azeitonas (3g por 10 unidades)',
            'Óleo de canola (14g por colher de sopa)'
        ],
        'poliinsaturadas': [
            'Salmão (12g por 100g)',
            'Sardinha (11g por 100g)',
            'Chia (9g por 2 colheres de sopa)',
            'Linhaça (8g por 2 colheres de sopa)',
            'Nozes (18g por 30g)'
        ],
        'saturadas': [
            'Óleo de coco (12g por colher de sopa)',
            'Manteiga (11g por colher de sopa)',
            'Carne vermelha (5g por 100g)',
            'Ovos (5g por 2 unidades)',
            'Queijos (6g por 30g)'
        ]
    };
    
    const distribuicao = {
        'monoinsaturadas': Math.round(total * 0.5),
        'poliinsaturadas': Math.round(total * 0.3),
        'saturadas': Math.round(total * 0.2)
    };
    
    return `
        <div class="recommendations-section">
            <h4>Tipos de Gorduras e Fontes</h4>
            
            <div class="food-sources">
                <div class="macro-source">
                    <h5>🫒 Monoinsaturadas (50%)</h5>
                    <p><strong>Meta:</strong> ${distribuicao.monoinsaturadas}g/dia | <strong>Benefícios:</strong> Saúde cardiovascular, anti-inflamatório</p>
                    <ul>
                        ${fontesGorduras.monoinsaturadas.map(fonte => `<li>${fonte}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="macro-source">
                    <h5>🐟 Poliinsaturadas (30%)</h5>
                    <p><strong>Meta:</strong> ${distribuicao.poliinsaturadas}g/dia | <strong>Benefícios:</strong> Ômega-3, função cerebral, anti-inflamatório</p>
                    <ul>
                        ${fontesGorduras.poliinsaturadas.map(fonte => `<li>${fonte}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="macro-source">
                    <h5>🥥 Saturadas (20%)</h5>
                    <p><strong>Meta:</strong> ${distribuicao.saturadas}g/dia | <strong>Benefícios:</strong> Hormônios, absorção vitaminas</p>
                    <ul>
                        ${fontesGorduras.saturadas.map(fonte => `<li>${fonte}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="recommendation-item priority-high">
                <h5>🧠 Ômega-3 Essencial</h5>
                <ul>
                    <li><strong>EPA/DHA:</strong> 1-2g por dia de peixes gordos ou suplemento</li>
                    <li><strong>ALA:</strong> 2-3g por dia de chia, linhaça, nozes</li>
                    <li><strong>Proporção:</strong> Mantenha ômega-6:ômega-3 em 4:1 ou menos</li>
                    <li><strong>Suplementação:</strong> Considere óleo de peixe se não come peixe 2x/semana</li>
                </ul>
            </div>
            
            <div class="recommendation-item priority-medium">
                <h5>⏰ Distribuição nas Refeições</h5>
                <ul>
                    <li><strong>Café da Manhã:</strong> ${Math.round(total * 0.2)}g - Abacate, oleaginosas</li>
                    <li><strong>Almoço:</strong> ${Math.round(total * 0.3)}g - Azeite, peixes, carnes</li>
                    <li><strong>Lanche:</strong> ${Math.round(total * 0.2)}g - Nozes, sementes</li>
                    <li><strong>Jantar:</strong> ${Math.round(total * 0.3)}g - Óleos, peixes, abacate</li>
                </ul>
            </div>
            
            <div class="tips-grid">
                <div class="tip-card">
                    <h5>🔥 Ponto de Fumaça</h5>
                    <p>Use azeite extra virgem a frio, óleo de coco para cozinhar em alta temperatura.</p>
                </div>
                <div class="tip-card">
                    <h5>💊 Vitaminas Lipossolúveis</h5>
                    <p>Gorduras são essenciais para absorção das vitaminas A, D, E e K.</p>
                </div>
                <div class="tip-card">
                    <h5>⚖️ Saciedade</h5>
                    <p>Gorduras aumentam saciedade e retardam esvaziamento gástrico, controlando fome.</p>
                </div>
            </div>
            
            ${sexo === 'feminino' ? `
                <div class="gender-specific">
                    <h5>👩 Considerações para Mulheres</h5>
                    <ul>
                        <li>Mulheres precisam de mais gorduras para produção hormonal</li>
                        <li>Ômega-3 é especialmente importante durante menstruação</li>
                        <li>Gorduras saturadas são necessárias para hormônios sexuais</li>
                        <li>Evite dietas muito baixas em gordura (< 20% das calorias)</li>
                    </ul>
                </div>
            ` : ''}
            
            ${objetivo === 'cetogenica' ? `
                <div class="objective-tips keto">
                    <h5>🎯 Dicas para Dieta Cetogênica</h5>
                    <ul>
                        <li>Priorize TCM (óleo de coco) para cetose rápida</li>
                        <li>Monitore cetonas com fitas ou medidor</li>
                        <li>Aumente sal e eletrólitos na adaptação</li>
                        <li>Mantenha carboidratos < 20g para cetose</li>
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
}

// ===== CALCULADORA DE VITAMINAS MELHORADA =====
document.getElementById('vitaminas-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const idade = parseInt(document.getElementById('vitaminas-idade').value);
    const sexo = document.getElementById('vitaminas-sexo').value;
    const atividade = document.getElementById('vitaminas-atividade').value;
    const objetivo = document.getElementById('vitaminas-objetivo').value;
    const exposicao_sol = document.getElementById('vitaminas-sol').value;
    
    // Calcular necessidades baseadas em RDA/AI
    const vitaminas = calcularNecessidadesVitaminas(idade, sexo, atividade, objetivo, exposicao_sol);
    
    const resultadoDiv = document.getElementById('vitaminas-result');
    resultadoDiv.innerHTML = `
        <div class="calculator-result">
            <div class="result-header">
                <div class="icon">🍊</div>
                <h3>Necessidades de Vitaminas</h3>
            </div>
            
            <div class="result-interpretation good">
                <h4>Recomendações Personalizadas</h4>
                <p>Baseadas em idade, sexo, atividade física e objetivos específicos de saúde.</p>
            </div>
            
            ${gerarRecomendacoesVitaminas(vitaminas, objetivo, atividade)}
        </div>
    `;
    
    showResult('vitaminas');
});

function calcularNecessidadesVitaminas(idade, sexo, atividade, objetivo, exposicao_sol) {
    // Base RDA/AI com ajustes
    let vitaminas = {
        'A': sexo === 'masculino' ? 900 : 700, // mcg
        'C': 90, // mg - base para homens
        'D': exposicao_sol === 'baixa' ? 2000 : exposicao_sol === 'media' ? 1000 : 600, // UI
        'E': 15, // mg
        'K': sexo === 'masculino' ? 120 : 90, // mcg
        'B1': sexo === 'masculino' ? 1.2 : 1.1, // mg
        'B2': sexo === 'masculino' ? 1.3 : 1.1, // mg
        'B3': sexo === 'masculino' ? 16 : 14, // mg
        'B6': idade > 50 ? 1.7 : 1.3, // mg
        'B12': 2.4, // mcg
        'Folato': 400, // mcg
        'Biotina': 30 // mcg
    };
    
    // Ajustes para mulheres
    if (sexo === 'feminino') {
        vitaminas.C = 75;
        if (idade >= 19 && idade <= 50) {
            vitaminas.Folato = 400; // Idade fértil
        }
    }
    
    // Ajustes por atividade física
    if (atividade === 'alto' || atividade === 'muito-alto') {
        vitaminas.C *= 1.5; // Antioxidante
        vitaminas.E *= 1.3; // Proteção celular
        vitaminas.B1 *= 1.2; // Metabolismo energético
        vitaminas.B2 *= 1.2;
        vitaminas.B6 *= 1.2;
    }
    
    // Ajustes por objetivo
    if (objetivo === 'imunidade') {
        vitaminas.C *= 2;
        vitaminas.D *= 1.5;
        vitaminas.A *= 1.2;
    } else if (objetivo === 'energia') {
        vitaminas.B1 *= 1.5;
        vitaminas.B2 *= 1.5;
        vitaminas.B3 *= 1.3;
        vitaminas.B12 *= 1.5;
    } else if (objetivo === 'antioxidante') {
        vitaminas.C *= 1.8;
        vitaminas.E *= 1.5;
        vitaminas.A *= 1.3;
    }
    
    return vitaminas;
}

function gerarRecomendacoesVitaminas(vitaminas, objetivo, atividade) {
    const fontesVitaminas = {
        'A': ['Cenoura', 'Batata doce', 'Espinafre', 'Fígado', 'Manga'],
        'C': ['Acerola', 'Kiwi', 'Laranja', 'Morango', 'Brócolis'],
        'D': ['Salmão', 'Sardinha', 'Gema de ovo', 'Cogumelos', 'Sol'],
        'E': ['Amêndoas', 'Sementes de girassol', 'Abacate', 'Azeite', 'Espinafre'],
        'K': ['Couve', 'Espinafre', 'Brócolis', 'Aspargos', 'Alface'],
        'B1': ['Carne suína', 'Sementes de girassol', 'Feijão', 'Aveia', 'Arroz integral'],
        'B2': ['Fígado', 'Amêndoas', 'Cogumelos', 'Ovos', 'Iogurte'],
        'B3': ['Frango', 'Atum', 'Amendoim', 'Cogumelos', 'Abacate'],
        'B6': ['Salmão', 'Frango', 'Batata', 'Banana', 'Grão de bico'],
        'B12': ['Carne vermelha', 'Salmão', 'Ovos', 'Laticínios', 'Nutritional yeast'],
        'Folato': ['Espinafre', 'Aspargos', 'Lentilha', 'Abacate', 'Brócolis'],
        'Biotina': ['Ovos', 'Salmão', 'Abacate', 'Sementes', 'Fígado']
    };
    
    return `
        <div class="recommendations-section">
            <h4>Necessidades Diárias Personalizadas</h4>
            
            <div class="vitamins-grid">
                <div class="vitamin-group">
                    <h5>🥕 Vitaminas Lipossolúveis</h5>
                    <div class="vitamin-item">
                        <strong>Vitamina A:</strong> ${formatNumber(vitaminas.A, 0)} mcg
                        <p>Fontes: ${fontesVitaminas.A.join(', ')}</p>
                    </div>
                    <div class="vitamin-item">
                        <strong>Vitamina D:</strong> ${formatNumber(vitaminas.D, 0)} UI
                        <p>Fontes: ${fontesVitaminas.D.join(', ')}</p>
                    </div>
                    <div class="vitamin-item">
                        <strong>Vitamina E:</strong> ${formatNumber(vitaminas.E, 0)} mg
                        <p>Fontes: ${fontesVitaminas.E.join(', ')}</p>
                    </div>
                    <div class="vitamin-item">
                        <strong>Vitamina K:</strong> ${formatNumber(vitaminas.K, 0)} mcg
                        <p>Fontes: ${fontesVitaminas.K.join(', ')}</p>
                    </div>
                </div>
                
                <div class="vitamin-group">
                    <h5>🍊 Vitaminas Hidrossolúveis</h5>
                    <div class="vitamin-item">
                        <strong>Vitamina C:</strong> ${formatNumber(vitaminas.C, 0)} mg
                        <p>Fontes: ${fontesVitaminas.C.join(', ')}</p>
                    </div>
                    <div class="vitamin-item">
                        <strong>Vitamina B1:</strong> ${formatNumber(vitaminas.B1, 1)} mg
                        <p>Fontes: ${fontesVitaminas.B1.join(', ')}</p>
                    </div>
                    <div class="vitamin-item">
                        <strong>Vitamina B2:</strong> ${formatNumber(vitaminas.B2, 1)} mg
                        <p>Fontes: ${fontesVitaminas.B2.join(', ')}</p>
                    </div>
                    <div class="vitamin-item">
                        <strong>Vitamina B3:</strong> ${formatNumber(vitaminas.B3, 0)} mg
                        <p>Fontes: ${fontesVitaminas.B3.join(', ')}</p>
                    </div>
                    <div class="vitamin-item">
                        <strong>Vitamina B6:</strong> ${formatNumber(vitaminas.B6, 1)} mg
                        <p>Fontes: ${fontesVitaminas.B6.join(', ')}</p>
                    </div>
                    <div class="vitamin-item">
                        <strong>Vitamina B12:</strong> ${formatNumber(vitaminas.B12, 1)} mcg
                        <p>Fontes: ${fontesVitaminas.B12.join(', ')}</p>
                    </div>
                    <div class="vitamin-item">
                        <strong>Folato:</strong> ${formatNumber(vitaminas.Folato, 0)} mcg
                        <p>Fontes: ${fontesVitaminas.Folato.join(', ')}</p>
                    </div>
                    <div class="vitamin-item">
                        <strong>Biotina:</strong> ${formatNumber(vitaminas.Biotina, 0)} mcg
                        <p>Fontes: ${fontesVitaminas.Biotina.join(', ')}</p>
                    </div>
                </div>
            </div>
            
            <div class="recommendation-item priority-high">
                <h5>🌈 Estratégia "Coma o Arco-Íris"</h5>
                <ul>
                    <li><strong>Vermelho:</strong> Tomate, pimentão, morango (licopeno, vitamina C)</li>
                    <li><strong>Laranja:</strong> Cenoura, abóbora, manga (beta-caroteno)</li>
                    <li><strong>Amarelo:</strong> Milho, pimentão amarelo (luteína, zeaxantina)</li>
                    <li><strong>Verde:</strong> Espinafre, brócolis, kiwi (folato, vitamina K)</li>
                    <li><strong>Azul/Roxo:</strong> Mirtilo, uva, berinjela (antocianinas)</li>
                </ul>
            </div>
            
            <div class="tips-grid">
                <div class="tip-card">
                    <h5>☀️ Vitamina D</h5>
                    <p>Exponha-se ao sol 15-30 min/dia sem protetor solar para síntese natural de vitamina D.</p>
                </div>
                <div class="tip-card">
                    <h5>🥗 Absorção</h5>
                    <p>Vitaminas lipossolúveis (A,D,E,K) precisam de gordura para absorção. Combine com azeite ou abacate.</p>
                </div>
                <div class="tip-card">
                    <h5>💊 Suplementação</h5>
                    <p>Considere suplementos para B12 (veganos), D3 (pouco sol) e folato (mulheres em idade fértil).</p>
                </div>
            </div>
            
            ${objetivo === 'imunidade' ? `
                <div class="objective-tips immunity">
                    <h5>🎯 Foco na Imunidade</h5>
                    <ul>
                        <li>Priorize vitamina C de fontes naturais (acerola, kiwi)</li>
                        <li>Mantenha vitamina D acima de 30 ng/ml</li>
                        <li>Inclua zinco e selênio junto com as vitaminas</li>
                        <li>Evite megadoses que podem ser pró-oxidantes</li>
                    </ul>
                </div>
            ` : objetivo === 'energia' ? `
                <div class="objective-tips energy">
                    <h5>🎯 Foco na Energia</h5>
                    <ul>
                        <li>Complexo B é essencial para metabolismo energético</li>
                        <li>B12 é crucial - considere suplemento se vegano</li>
                        <li>Ferro e vitamina C juntos melhoram absorção</li>
                        <li>Evite álcool que depleta vitaminas do complexo B</li>
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
}

