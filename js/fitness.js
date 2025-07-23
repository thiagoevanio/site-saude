// ===== CALCULADORAS FITNESS =====

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
        case '1rm':
            const rmValor = document.getElementById('rm-valor').textContent;
            resultText = `1RM Estimado: ${rmValor} kg`;
            break;
        case 'imc-atletico':
            const imcTrad = document.getElementById('imc-at-tradicional').textContent;
            const imcAtl = document.getElementById('imc-at-atletico').textContent;
            resultText = `IMC Tradicional: ${imcTrad}\\nIMC Atlético: ${imcAtl}`;
            break;
        case 'consumo-calorico':
            const ccCalorias = document.getElementById('cc-calorias').textContent;
            const ccPorMinuto = document.getElementById('cc-por-minuto').textContent;
            resultText = `Calorias: ${ccCalorias} kcal\\nPor minuto: ${ccPorMinuto} kcal/min`;
            break;
        case 'vo2-maximo':
            const vo2Valor = document.getElementById('vo2-valor').textContent;
            const vo2Class = document.getElementById('vo2-classificacao').textContent;
            resultText = `VO2 Máximo: ${vo2Valor} ml/kg/min\\nClassificação: ${vo2Class}`;
            break;
        case 'recuperacao':
            const recTempo = document.getElementById('rec-tempo').textContent;
            const recProximo = document.getElementById('rec-proximo').textContent;
            resultText = `Recuperação: ${recTempo} horas\\nPróximo treino: ${recProximo} dias`;
            break;
        case 'frequencia-cardiaca':
            const fcMaxima = document.getElementById('fc-maxima').textContent;
            resultText = `FC Máxima: ${fcMaxima} bpm`;
            break;
    }
    
    if (resultText && window.calculatorUtils) {
        window.calculatorUtils.copyToClipboard(resultText);
    }
}

// ===== DYNAMIC FORM CONTROLS =====
// Consumo Calórico - Show/hide fields based on exercise type
document.getElementById('cc-exercicio').addEventListener('change', function() {
    const exercicio = this.value;
    const velocidadeGroup = document.getElementById('cc-velocidade-group');
    const inclinacaoGroup = document.getElementById('cc-inclinacao-group');
    const intensidadeGroup = document.getElementById('cc-intensidade-group');
    
    // Hide all optional fields first
    velocidadeGroup.style.display = 'none';
    inclinacaoGroup.style.display = 'none';
    intensidadeGroup.style.display = 'none';
    
    // Show relevant fields based on exercise
    if (exercicio === 'caminhada' || exercicio === 'corrida') {
        velocidadeGroup.style.display = 'block';
        inclinacaoGroup.style.display = 'block';
        document.getElementById('cc-velocidade').required = true;
    } else if (exercicio === 'ciclismo') {
        velocidadeGroup.style.display = 'block';
        document.getElementById('cc-velocidade').required = true;
    } else if (exercicio === 'natacao') {
        intensidadeGroup.style.display = 'block';
        document.getElementById('cc-intensidade').required = true;
    }
});

// VO2 Máximo - Show/hide fields based on test method
document.getElementById('vo2-metodo').addEventListener('change', function() {
    const metodo = this.value;
    const distanciaGroup = document.getElementById('vo2-distancia-group');
    const rockportGroup = document.getElementById('vo2-rockport-group');
    const stepGroup = document.getElementById('vo2-step-group');
    const condicionamentoGroup = document.getElementById('vo2-condicionamento-group');
    
    // Hide all optional fields first
    distanciaGroup.style.display = 'none';
    rockportGroup.style.display = 'none';
    stepGroup.style.display = 'none';
    condicionamentoGroup.style.display = 'none';
    
    // Clear required attributes
    document.getElementById('vo2-distancia').required = false;
    document.getElementById('vo2-tempo').required = false;
    document.getElementById('vo2-fc-final').required = false;
    document.getElementById('vo2-fc-recuperacao').required = false;
    document.getElementById('vo2-condicionamento').required = false;
    
    // Show relevant fields based on method
    switch (metodo) {
        case 'cooper':
            distanciaGroup.style.display = 'block';
            document.getElementById('vo2-distancia').required = true;
            break;
        case 'rockport':
            rockportGroup.style.display = 'block';
            document.getElementById('vo2-tempo').required = true;
            document.getElementById('vo2-fc-final').required = true;
            break;
        case 'step':
            stepGroup.style.display = 'block';
            document.getElementById('vo2-fc-recuperacao').required = true;
            break;
        case 'estimativa':
            condicionamentoGroup.style.display = 'block';
            document.getElementById('vo2-condicionamento').required = true;
            break;
    }
});

// ===== 1RM CALCULATOR =====
document.getElementById('1rm-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('rm-peso').value);
    const repeticoes = parseInt(document.getElementById('rm-repeticoes').value);
    const formula = document.getElementById('rm-formula').value;
    
    let rm1;
    
    switch (formula) {
        case 'epley':
            rm1 = peso * (1 + repeticoes / 30);
            break;
        case 'brzycki':
            rm1 = peso / (1.0278 - 0.0278 * repeticoes);
            break;
        case 'lander':
            rm1 = peso / (1.013 - 0.0267123 * repeticoes);
            break;
        case 'oconner':
            rm1 = peso * (1 + 0.025 * repeticoes);
            break;
    }
    
    // Update result
    document.getElementById('rm-valor').textContent = formatNumber(rm1, 1);
    
    // Create percentage table
    const percentages = document.getElementById('rm-percentages');
    const percentageData = [
        { percent: 95, reps: '1-2', purpose: 'Força máxima' },
        { percent: 90, reps: '2-4', purpose: 'Força' },
        { percent: 85, reps: '4-6', purpose: 'Força/Potência' },
        { percent: 80, reps: '6-8', purpose: 'Hipertrofia/Força' },
        { percent: 75, reps: '8-10', purpose: 'Hipertrofia' },
        { percent: 70, reps: '10-12', purpose: 'Hipertrofia' },
        { percent: 65, reps: '12-15', purpose: 'Resistência muscular' },
        { percent: 60, reps: '15+', purpose: 'Resistência' }
    ];
    
    percentages.innerHTML = percentageData.map(data => `
        <div class="rm-row">
            <span class="rm-percent">${data.percent}%</span>
            <span class="rm-weight">${formatNumber(rm1 * data.percent / 100, 1)} kg</span>
            <span class="rm-reps">${data.reps} reps</span>
            <span class="rm-purpose">${data.purpose}</span>
        </div>
    `).join('');
    
    showResult('1rm');
});

// ===== IMC ATLÉTICO CALCULATOR =====
document.getElementById('imc-atletico-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('imc-at-peso').value);
    const altura = parseFloat(document.getElementById('imc-at-altura').value) / 100; // Convert to meters
    const sexo = document.getElementById('imc-at-sexo').value;
    const gordura = parseFloat(document.getElementById('imc-at-gordura').value);
    const nivel = document.getElementById('imc-at-nivel').value;
    
    // Traditional IMC
    const imcTradicional = peso / (altura * altura);
    
    // Athletic IMC adjustment based on body fat and athletic level
    let ajuste = 0;
    
    // Adjustment for body fat percentage
    if (sexo === 'masculino') {
        if (gordura < 10) ajuste += 2;
        else if (gordura < 15) ajuste += 1;
    } else {
        if (gordura < 16) ajuste += 2;
        else if (gordura < 20) ajuste += 1;
    }
    
    // Adjustment for athletic level
    switch (nivel) {
        case 'recreativo':
            ajuste += 0.5;
            break;
        case 'amador':
            ajuste += 1;
            break;
        case 'semi-profissional':
            ajuste += 1.5;
            break;
        case 'profissional':
            ajuste += 2;
            break;
    }
    
    const imcAtletico = imcTradicional - ajuste;
    
    // Update results
    document.getElementById('imc-at-tradicional').textContent = formatNumber(imcTradicional, 1);
    document.getElementById('imc-at-atletico').textContent = formatNumber(imcAtletico, 1);
    
    // Classifications
    document.getElementById('imc-at-trad-class').textContent = getIMCClassification(imcTradicional);
    document.getElementById('imc-at-atl-class').textContent = getIMCClassification(imcAtletico);
    
    // Interpretation
    let interpretacao;
    if (imcTradicional > 25 && imcAtletico <= 25) {
        interpretacao = 'Seu IMC tradicional indica sobrepeso, mas o IMC atlético mostra que isso se deve à maior massa muscular, não gordura excessiva.';
    } else if (imcAtletico < imcTradicional) {
        interpretacao = `O IMC atlético é ${formatNumber(imcTradicional - imcAtletico, 1)} pontos menor que o tradicional, refletindo sua composição corporal atlética.`;
    } else {
        interpretacao = 'Seus valores de IMC tradicional e atlético são similares.';
    }
    
    document.getElementById('imc-at-interpretacao').innerHTML = `<p>${interpretacao}</p>`;
    
    showResult('imc-atletico');
});

function getIMCClassification(imc) {
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    if (imc < 35) return 'Obesidade Grau I';
    if (imc < 40) return 'Obesidade Grau II';
    return 'Obesidade Grau III';
}

// ===== CONSUMO CALÓRICO CALCULATOR =====
document.getElementById('consumo-calorico-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('cc-peso').value);
    const duracao = parseInt(document.getElementById('cc-duracao').value);
    const exercicio = document.getElementById('cc-exercicio').value;
    
    let met = 0;
    
    if (exercicio === 'caminhada' || exercicio === 'corrida') {
        const velocidade = parseFloat(document.getElementById('cc-velocidade').value);
        const inclinacao = parseFloat(document.getElementById('cc-inclinacao').value) || 0;
        
        if (exercicio === 'caminhada') {
            // Walking MET calculation
            if (velocidade <= 3) met = 2.5;
            else if (velocidade <= 4) met = 3.0;
            else if (velocidade <= 5) met = 3.5;
            else if (velocidade <= 6) met = 4.3;
            else met = 5.0;
            
            // Incline adjustment for walking
            met += inclinacao * 0.1;
        } else {
            // Running MET calculation
            if (velocidade <= 6) met = 6.0;
            else if (velocidade <= 8) met = 8.3;
            else if (velocidade <= 10) met = 9.8;
            else if (velocidade <= 12) met = 11.0;
            else if (velocidade <= 14) met = 12.3;
            else met = 14.0;
            
            // Incline adjustment for running
            met += inclinacao * 0.15;
        }
    } else if (exercicio === 'ciclismo') {
        const velocidade = parseFloat(document.getElementById('cc-velocidade').value);
        
        if (velocidade <= 15) met = 4.0;
        else if (velocidade <= 20) met = 6.8;
        else if (velocidade <= 25) met = 8.0;
        else if (velocidade <= 30) met = 10.0;
        else met = 12.0;
    } else if (exercicio === 'natacao') {
        const intensidade = document.getElementById('cc-intensidade').value;
        
        switch (intensidade) {
            case 'leve': met = 4.0; break;
            case 'moderada': met = 8.0; break;
            case 'intensa': met = 11.0; break;
            case 'muito-intensa': met = 14.0; break;
        }
    }
    
    // Calculate calories: MET × weight (kg) × time (hours)
    const horas = duracao / 60;
    const calorias = met * peso * horas;
    const porMinuto = calorias / duracao;
    
    // Update results
    document.getElementById('cc-calorias').textContent = formatNumber(calorias, 0);
    document.getElementById('cc-por-minuto').textContent = formatNumber(porMinuto, 1);
    document.getElementById('cc-met').textContent = formatNumber(met, 1);
    
    showResult('consumo-calorico');
});

// ===== VO2 MÁXIMO CALCULATOR =====
document.getElementById('vo2-maximo-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const idade = parseInt(document.getElementById('vo2-idade').value);
    const sexo = document.getElementById('vo2-sexo').value;
    const metodo = document.getElementById('vo2-metodo').value;
    
    let vo2Max = 0;
    
    switch (metodo) {
        case 'cooper':
            const distancia = parseFloat(document.getElementById('vo2-distancia').value);
            // Cooper formula: VO2max = (distance in meters - 504.9) / 44.73
            vo2Max = (distancia - 504.9) / 44.73;
            break;
            
        case 'rockport':
            const tempo = parseFloat(document.getElementById('vo2-tempo').value);
            const fcFinal = parseInt(document.getElementById('vo2-fc-final').value);
            // Simplified Rockport formula
            if (sexo === 'masculino') {
                vo2Max = 15.3 * (1609 / (tempo * 60)) - 0.1 * fcFinal - 0.2 * idade + 10;
            } else {
                vo2Max = 15.3 * (1609 / (tempo * 60)) - 0.1 * fcFinal - 0.2 * idade + 5;
            }
            break;
            
        case 'step':
            const fcRecuperacao = parseInt(document.getElementById('vo2-fc-recuperacao').value);
            // Step test formula (simplified)
            if (sexo === 'masculino') {
                vo2Max = 111.33 - (0.42 * fcRecuperacao);
            } else {
                vo2Max = 65.81 - (0.1847 * fcRecuperacao);
            }
            break;
            
        case 'estimativa':
            const condicionamento = document.getElementById('vo2-condicionamento').value;
            // Age-based estimation with fitness level adjustment
            let baseVO2;
            if (sexo === 'masculino') {
                baseVO2 = 60 - (idade - 20) * 0.5;
            } else {
                baseVO2 = 50 - (idade - 20) * 0.4;
            }
            
            switch (condicionamento) {
                case 'sedentario': vo2Max = baseVO2 * 0.7; break;
                case 'ativo': vo2Max = baseVO2 * 0.9; break;
                case 'treinado': vo2Max = baseVO2 * 1.1; break;
                case 'atleta': vo2Max = baseVO2 * 1.3; break;
                case 'elite': vo2Max = baseVO2 * 1.5; break;
            }
            break;
    }
    
    vo2Max = Math.max(vo2Max, 15); // Minimum reasonable value
    
    // Update results
    document.getElementById('vo2-valor').textContent = formatNumber(vo2Max, 1);
    document.getElementById('vo2-classificacao').textContent = getVO2Classification(vo2Max, idade, sexo);
    
    // Interpretation
    let interpretacao = getVO2Interpretation(vo2Max, idade, sexo);
    document.getElementById('vo2-interpretacao').innerHTML = `<p>${interpretacao}</p>`;
    
    showResult('vo2-maximo');
});

function getVO2Classification(vo2, idade, sexo) {
    // Simplified classification based on age and gender
    let thresholds;
    
    if (sexo === 'masculino') {
        if (idade < 30) {
            thresholds = [32, 37, 44, 51];
        } else if (idade < 40) {
            thresholds = [31, 35, 41, 47];
        } else if (idade < 50) {
            thresholds = [29, 33, 38, 44];
        } else {
            thresholds = [26, 31, 35, 41];
        }
    } else {
        if (idade < 30) {
            thresholds = [27, 31, 37, 42];
        } else if (idade < 40) {
            thresholds = [26, 30, 35, 40];
        } else if (idade < 50) {
            thresholds = [24, 28, 32, 37];
        } else {
            thresholds = [21, 25, 30, 34];
        }
    }
    
    if (vo2 < thresholds[0]) return 'Muito baixo';
    if (vo2 < thresholds[1]) return 'Baixo';
    if (vo2 < thresholds[2]) return 'Regular';
    if (vo2 < thresholds[3]) return 'Bom';
    return 'Excelente';
}

function getVO2Interpretation(vo2, idade, sexo) {
    const classificacao = getVO2Classification(vo2, idade, sexo);
    
    let interpretacao = '';
    let recomendacoes = '';
    
    if (classificacao === 'Excelente') {
        interpretacao = `
            <div class="vo2-interpretation excellent">
                <h4><i class="fas fa-trophy"></i> Capacidade Cardiorrespiratória Excelente</h4>
                <p>Parabéns! Sua capacidade cardiorrespiratória está em nível excelente para sua idade e sexo. Isso indica um sistema cardiovascular muito eficiente e baixo risco de doenças cardíacas.</p>
                <p><strong>Benefícios:</strong> Maior resistência, melhor recuperação, proteção cardiovascular e longevidade.</p>
            </div>
        `;
        recomendacoes = `
            <div class="vo2-recommendations">
                <h5>Manutenção do Alto Desempenho</h5>
                <ul>
                    <li><strong>Variação:</strong> Alterne entre treinos de alta intensidade e recuperação ativa</li>
                    <li><strong>Periodização:</strong> Use ciclos de treinamento para evitar overtraining</li>
                    <li><strong>Monitoramento:</strong> Acompanhe FC de repouso e variabilidade cardíaca</li>
                    <li><strong>Nutrição:</strong> Mantenha hidratação adequada e carboidratos para performance</li>
                </ul>
            </div>
        `;
    } else if (classificacao === 'Bom') {
        interpretacao = `
            <div class="vo2-interpretation good">
                <h4><i class="fas fa-thumbs-up"></i> Boa Capacidade Cardiorrespiratória</h4>
                <p>Sua capacidade cardiorrespiratória está em bom nível. Continue mantendo a atividade física regular para preservar e melhorar ainda mais sua condição.</p>
                <p><strong>Potencial:</strong> Com treino específico, você pode alcançar o nível excelente.</p>
            </div>
        `;
        recomendacoes = `
            <div class="vo2-recommendations">
                <h5>Estratégias para Melhoria</h5>
                <ul>
                    <li><strong>HIIT:</strong> 2-3x por semana, intervalos de 30s-4min em alta intensidade</li>
                    <li><strong>Base aeróbica:</strong> 3-4x por semana, 30-60min em intensidade moderada</li>
                    <li><strong>Progressão:</strong> Aumente gradualmente duração e intensidade</li>
                    <li><strong>Recuperação:</strong> 1-2 dias de descanso ativo por semana</li>
                </ul>
            </div>
        `;
    } else if (classificacao === 'Regular') {
        interpretacao = `
            <div class="vo2-interpretation average">
                <h4><i class="fas fa-chart-line"></i> Capacidade Cardiorrespiratória Regular</h4>
                <p>Sua capacidade cardiorrespiratória está na média. Há muito potencial para melhoria com um programa de exercícios estruturado.</p>
                <p><strong>Oportunidade:</strong> Melhorias significativas são possíveis em 8-12 semanas de treino consistente.</p>
            </div>
        `;
        recomendacoes = `
            <div class="vo2-recommendations">
                <h5>Programa de Desenvolvimento</h5>
                <ul>
                    <li><strong>Início gradual:</strong> Comece com 20-30min de caminhada rápida, 3x por semana</li>
                    <li><strong>Progressão:</strong> Adicione 5min por semana até atingir 45-60min</li>
                    <li><strong>Intensidade:</strong> Inclua 1-2 sessões de intensidade moderada-alta</li>
                    <li><strong>Variedade:</strong> Alterne entre caminhada, corrida, ciclismo e natação</li>
                </ul>
            </div>
        `;
    } else {
        interpretacao = `
            <div class="vo2-interpretation low">
                <h4><i class="fas fa-exclamation-triangle"></i> Capacidade Cardiorrespiratória Baixa</h4>
                <p>Sua capacidade cardiorrespiratória pode ser significativamente melhorada. É importante iniciar um programa de exercícios aeróbicos gradual e consistente.</p>
                <p><strong>Importante:</strong> Consulte um médico antes de iniciar exercícios se tiver fatores de risco cardiovascular.</p>
            </div>
        `;
        recomendacoes = `
            <div class="vo2-recommendations">
                <h5>Programa Inicial Seguro</h5>
                <ul>
                    <li><strong>Avaliação médica:</strong> Consulte um médico antes de iniciar</li>
                    <li><strong>Início muito gradual:</strong> 10-15min de caminhada leve, 3x por semana</li>
                    <li><strong>Progressão lenta:</strong> Aumente 2-3min por semana</li>
                    <li><strong>Monitoramento:</strong> Use a escala de percepção de esforço (6-20)</li>
                    <li><strong>Consistência:</strong> Foque na regularidade antes da intensidade</li>
                </ul>
            </div>
        `;
    }
    
    return interpretacao + recomendacoes;
}

// ===== RECUPERAÇÃO MUSCULAR CALCULATOR =====
document.getElementById('recuperacao-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const grupoMuscular = document.getElementById('rec-grupo-muscular').value;
    const intensidade = document.getElementById('rec-intensidade').value;
    const volume = document.getElementById('rec-volume').value;
    const experiencia = document.getElementById('rec-experiencia').value;
    const idade = parseInt(document.getElementById('rec-idade').value);
    const sono = document.getElementById('rec-sono').value;
    
    // Base recovery time by muscle group (in hours)
    const baseRecovery = {
        'peito': 48,
        'costas': 48,
        'ombros': 36,
        'biceps': 24,
        'triceps': 24,
        'quadriceps': 48,
        'posteriores': 48,
        'gluteos': 36,
        'panturrilhas': 24,
        'abdomen': 24
    };
    
    let tempoRecuperacao = baseRecovery[grupoMuscular];
    
    // Intensity adjustment
    const intensityMultiplier = {
        'leve': 0.7,
        'moderada': 1.0,
        'alta': 1.3,
        'maxima': 1.6
    };
    tempoRecuperacao *= intensityMultiplier[intensidade];
    
    // Volume adjustment
    const volumeMultiplier = {
        'baixo': 0.8,
        'moderado': 1.0,
        'alto': 1.2,
        'muito-alto': 1.4
    };
    tempoRecuperacao *= volumeMultiplier[volume];
    
    // Experience adjustment
    const experienceMultiplier = {
        'iniciante': 1.3,
        'intermediario': 1.0,
        'avancado': 0.8
    };
    tempoRecuperacao *= experienceMultiplier[experiencia];
    
    // Age adjustment
    if (idade > 40) {
        tempoRecuperacao *= 1.1;
    } else if (idade > 50) {
        tempoRecuperacao *= 1.2;
    } else if (idade > 60) {
        tempoRecuperacao *= 1.3;
    }
    
    // Sleep quality adjustment
    const sleepMultiplier = {
        'ruim': 1.3,
        'regular': 1.1,
        'boa': 1.0,
        'excelente': 0.9
    };
    tempoRecuperacao *= sleepMultiplier[sono];
    
    const proximoTreino = Math.ceil(tempoRecuperacao / 24);
    
    // Update results
    document.getElementById('rec-tempo').textContent = Math.round(tempoRecuperacao);
    document.getElementById('rec-proximo').textContent = proximoTreino;
    
    // Recovery tips
    const dicas = document.getElementById('rec-dicas');
    dicas.innerHTML = `
        <div class="dica-item">
            <i class="fas fa-bed"></i>
            <span>Durma 7-9 horas por noite para otimizar a recuperação</span>
        </div>
        <div class="dica-item">
            <i class="fas fa-utensils"></i>
            <span>Consuma proteínas (1.6-2.2g/kg) para reparação muscular</span>
        </div>
        <div class="dica-item">
            <i class="fas fa-tint"></i>
            <span>Mantenha-se hidratado (35ml/kg de peso corporal)</span>
        </div>
        <div class="dica-item">
            <i class="fas fa-snowflake"></i>
            <span>Considere banhos frios ou crioterapia para reduzir inflamação</span>
        </div>
        <div class="dica-item">
            <i class="fas fa-spa"></i>
            <span>Pratique técnicas de relaxamento e gerenciamento do estresse</span>
        </div>
    `;
    
    showResult('recuperacao');
});

// ===== FREQUÊNCIA CARDÍACA CALCULATOR =====
document.getElementById('frequencia-cardiaca-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const idade = parseInt(document.getElementById('fc-idade').value);
    const fcRepouso = parseInt(document.getElementById('fc-repouso').value) || null;
    const metodo = document.getElementById('fc-metodo').value;
    
    let fcMaxima;
    
    // Calculate maximum heart rate
    switch (metodo) {
        case 'simples':
            fcMaxima = 220 - idade;
            break;
        case 'tanaka':
            fcMaxima = 208 - (0.7 * idade);
            break;
        case 'karvonen':
            if (!fcRepouso) {
                alert('FC de repouso é obrigatória para o método Karvonen');
                return;
            }
            fcMaxima = 220 - idade;
            break;
    }
    
    // Update maximum HR
    document.getElementById('fc-maxima').textContent = Math.round(fcMaxima);
    
    // Calculate training zones
    const zones = document.getElementById('fc-zones');
    let zonesHTML = '';
    
    if (metodo === 'karvonen' && fcRepouso) {
        // Karvonen method: Target HR = ((HRmax - HRrest) × %Intensity) + HRrest
        const zonesData = [
            { name: 'Recuperação Ativa', min: 50, max: 60, color: '#10b981', purpose: 'Recuperação e aquecimento' },
            { name: 'Aeróbico Base', min: 60, max: 70, color: '#3b82f6', purpose: 'Queima de gordura' },
            { name: 'Aeróbico', min: 70, max: 80, color: '#f59e0b', purpose: 'Resistência aeróbica' },
            { name: 'Limiar', min: 80, max: 90, color: '#ef4444', purpose: 'Limiar anaeróbico' },
            { name: 'Anaeróbico', min: 90, max: 95, color: '#8b5cf6', purpose: 'Potência anaeróbica' },
            { name: 'Neuromuscular', min: 95, max: 100, color: '#ec4899', purpose: 'Potência máxima' }
        ];
        
        zonesData.forEach(zone => {
            const hrMin = Math.round(((fcMaxima - fcRepouso) * zone.min / 100) + fcRepouso);
            const hrMax = Math.round(((fcMaxima - fcRepouso) * zone.max / 100) + fcRepouso);
            
            zonesHTML += `
                <div class="fc-zone" style="border-left: 4px solid ${zone.color}">
                    <div class="fc-zone-header">
                        <span class="fc-zone-name">${zone.name}</span>
                        <span class="fc-zone-range">${hrMin} - ${hrMax} bpm</span>
                    </div>
                    <div class="fc-zone-purpose">${zone.purpose}</div>
                    <div class="fc-zone-percent">${zone.min}% - ${zone.max}% FC Reserva</div>
                </div>
            `;
        });
    } else {
        // Simple percentage method
        const zonesData = [
            { name: 'Recuperação Ativa', min: 50, max: 60, color: '#10b981', purpose: 'Recuperação e aquecimento' },
            { name: 'Aeróbico Base', min: 60, max: 70, color: '#3b82f6', purpose: 'Queima de gordura' },
            { name: 'Aeróbico', min: 70, max: 80, color: '#f59e0b', purpose: 'Resistência aeróbica' },
            { name: 'Limiar', min: 80, max: 90, color: '#ef4444', purpose: 'Limiar anaeróbico' },
            { name: 'Anaeróbico', min: 90, max: 95, color: '#8b5cf6', purpose: 'Potência anaeróbica' },
            { name: 'Máximo', min: 95, max: 100, color: '#ec4899', purpose: 'Esforço máximo' }
        ];
        
        zonesData.forEach(zone => {
            const hrMin = Math.round(fcMaxima * zone.min / 100);
            const hrMax = Math.round(fcMaxima * zone.max / 100);
            
            zonesHTML += `
                <div class="fc-zone" style="border-left: 4px solid ${zone.color}">
                    <div class="fc-zone-header">
                        <span class="fc-zone-name">${zone.name}</span>
                        <span class="fc-zone-range">${hrMin} - ${hrMax} bpm</span>
                    </div>
                    <div class="fc-zone-purpose">${zone.purpose}</div>
                    <div class="fc-zone-percent">${zone.min}% - ${zone.max}% FC Máxima</div>
                </div>
            `;
        });
    }
    
    zones.innerHTML = zonesHTML;
    
    showResult('frequencia-cardiaca');
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Check if there's a selected category from localStorage
    const selectedCategory = localStorage.getItem('selectedCategory');
    if (selectedCategory === 'fitness') {
        // Clear the selection
        localStorage.removeItem('selectedCategory');
    }
    
    // Show first calculator by default
    showCalculator('1rm');
    
    // Add CSS for fitness-specific elements
    const style = document.createElement('style');
    style.textContent = `
        .rm-percentages {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        
        .rm-row {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 2fr;
            gap: 1rem;
            padding: 0.75rem;
            background: var(--white-color);
            border-radius: var(--radius-md);
            border: 1px solid var(--gray-200);
            align-items: center;
        }
        
        .rm-percent {
            font-weight: 600;
            color: var(--primary-color);
        }
        
        .rm-weight {
            font-weight: 500;
            color: var(--dark-color);
        }
        
        .rm-reps {
            color: var(--gray-600);
        }
        
        .rm-purpose {
            color: var(--gray-600);
            font-size: 0.875rem;
        }
        
        .dica-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            background: var(--white-color);
            border-radius: var(--radius-md);
            border: 1px solid var(--gray-200);
            margin-bottom: 0.5rem;
        }
        
        .dica-item i {
            color: var(--secondary-color);
            font-size: 1.25rem;
            min-width: 20px;
        }
        
        .fc-zone {
            padding: 1rem;
            background: var(--white-color);
            border-radius: var(--radius-md);
            margin-bottom: 0.75rem;
        }
        
        .fc-zone-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }
        
        .fc-zone-name {
            font-weight: 600;
            color: var(--dark-color);
        }
        
        .fc-zone-range {
            font-weight: 500;
            color: var(--primary-color);
        }
        
        .fc-zone-purpose {
            color: var(--gray-600);
            margin-bottom: 0.25rem;
        }
        
        .fc-zone-percent {
            font-size: 0.875rem;
            color: var(--gray-500);
        }
        
        @media (max-width: 768px) {
            .rm-row {
                grid-template-columns: 1fr;
                text-align: center;
                gap: 0.25rem;
            }
            
            .fc-zone-header {
                flex-direction: column;
                gap: 0.25rem;
            }
        }
    `;
    document.head.appendChild(style);
});


// ===== CALCULADORA 1RM MELHORADA =====
document.getElementById('1rm-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('1rm-peso').value);
    const repeticoes = parseInt(document.getElementById('1rm-repeticoes').value);
    const exercicio = document.getElementById('1rm-exercicio').value;
    const experiencia = document.getElementById('1rm-experiencia').value;
    
    // Múltiplas fórmulas para comparação
    const formulas = {
        'epley': peso * (1 + repeticoes / 30),
        'brzycki': peso / (1.0278 - 0.0278 * repeticoes),
        'lander': peso / (1.013 - 0.0267123 * repeticoes),
        'lombardi': peso * Math.pow(repeticoes, 0.10),
        'mayhew': peso / (0.522 + 0.419 * Math.exp(-0.055 * repeticoes)),
        'oconner': peso * (1 + 0.025 * repeticoes)
    };
    
    // Média das fórmulas para resultado principal
    const valores = Object.values(formulas);
    const media = valores.reduce((a, b) => a + b, 0) / valores.length;
    
    // Ajuste por experiência
    let ajuste = 1.0;
    switch (experiencia) {
        case 'iniciante':
            ajuste = 0.95; // Mais conservador
            break;
        case 'intermediario':
            ajuste = 1.0;
            break;
        case 'avancado':
            ajuste = 1.05; // Pode ter melhor técnica
            break;
    }
    
    const rm1 = media * ajuste;
    
    document.getElementById('rm-valor').textContent = formatNumber(rm1, 1);
    
    const resultadoDiv = document.getElementById('1rm-result');
    resultadoDiv.innerHTML = `
        <div class="calculator-result">
            <div class="result-header">
                <div class="icon">🏋️‍♂️</div>
                <h3>1RM Estimado - ${exercicio.charAt(0).toUpperCase() + exercicio.slice(1)}</h3>
            </div>
            
            <div class="result-value">
                <span class="number">${formatNumber(rm1, 1)}</span>
                <span class="unit">kg</span>
            </div>
            
            <div class="result-interpretation good">
                <h4>Baseado em ${peso}kg x ${repeticoes} repetições</h4>
                <p>Estimativa calculada usando múltiplas fórmulas científicas e ajustada para seu nível de experiência.</p>
            </div>
            
            ${gerar1RMRecomendacoes(rm1, peso, repeticoes, exercicio, formulas)}
        </div>
    `;
    
    showResult('1rm');
});

function gerar1RMRecomendacoes(rm1, peso, repeticoes, exercicio, formulas) {
    // Calcular percentuais para diferentes objetivos
    const percentuais = {
        'forca_maxima': { min: 90, max: 100, reps: '1-3' },
        'forca': { min: 85, max: 95, reps: '3-6' },
        'hipertrofia': { min: 65, max: 85, reps: '6-12' },
        'resistencia': { min: 50, max: 65, reps: '12-20' },
        'aquecimento': { min: 40, max: 60, reps: '8-15' }
    };
    
    return `
        <div class="recommendations-section">
            <h4>Comparação de Fórmulas Científicas</h4>
            
            <div class="formula-comparison">
                <div class="formula-item ${formulas.epley === Math.max(...Object.values(formulas)) ? 'primary' : ''}">
                    <span class="formula-name">Epley (1985)</span>
                    <span class="formula-value">${formatNumber(formulas.epley, 1)} kg</span>
                    <span class="formula-note">Mais usada</span>
                </div>
                <div class="formula-item">
                    <span class="formula-name">Brzycki (1993)</span>
                    <span class="formula-value">${formatNumber(formulas.brzycki, 1)} kg</span>
                    <span class="formula-note">Conservadora</span>
                </div>
                <div class="formula-item">
                    <span class="formula-name">Lander (1985)</span>
                    <span class="formula-value">${formatNumber(formulas.lander, 1)} kg</span>
                    <span class="formula-note">Atletas</span>
                </div>
                <div class="formula-item">
                    <span class="formula-name">Lombardi (1989)</span>
                    <span class="formula-value">${formatNumber(formulas.lombardi, 1)} kg</span>
                    <span class="formula-note">Powerlifting</span>
                </div>
            </div>
            
            <div class="recommendation-item priority-high">
                <h5>🎯 Zonas de Treinamento Baseadas no 1RM</h5>
                <div class="training-zones">
                    <div class="zone-item">
                        <h6>💪 Força Máxima (${percentuais.forca_maxima.min}-${percentuais.forca_maxima.max}%)</h6>
                        <p><strong>${formatNumber(rm1 * percentuais.forca_maxima.min / 100, 1)}-${formatNumber(rm1 * percentuais.forca_maxima.max / 100, 1)} kg</strong> | ${percentuais.forca_maxima.reps} reps</p>
                    </div>
                    <div class="zone-item">
                        <h6>🔥 Força (${percentuais.forca.min}-${percentuais.forca.max}%)</h6>
                        <p><strong>${formatNumber(rm1 * percentuais.forca.min / 100, 1)}-${formatNumber(rm1 * percentuais.forca.max / 100, 1)} kg</strong> | ${percentuais.forca.reps} reps</p>
                    </div>
                    <div class="zone-item">
                        <h6>📈 Hipertrofia (${percentuais.hipertrofia.min}-${percentuais.hipertrofia.max}%)</h6>
                        <p><strong>${formatNumber(rm1 * percentuais.hipertrofia.min / 100, 1)}-${formatNumber(rm1 * percentuais.hipertrofia.max / 100, 1)} kg</strong> | ${percentuais.hipertrofia.reps} reps</p>
                    </div>
                    <div class="zone-item">
                        <h6>⚡ Resistência (${percentuais.resistencia.min}-${percentuais.resistencia.max}%)</h6>
                        <p><strong>${formatNumber(rm1 * percentuais.resistencia.min / 100, 1)}-${formatNumber(rm1 * percentuais.resistencia.max / 100, 1)} kg</strong> | ${percentuais.resistencia.reps} reps</p>
                    </div>
                </div>
            </div>
            
            <div class="recommendation-item priority-medium">
                <h5>📊 Progressão Sugerida</h5>
                <ul>
                    <li><strong>Semana 1-2:</strong> ${formatNumber(rm1 * 0.70, 1)}kg (70%) - Adaptação técnica</li>
                    <li><strong>Semana 3-4:</strong> ${formatNumber(rm1 * 0.80, 1)}kg (80%) - Aumento de carga</li>
                    <li><strong>Semana 5-6:</strong> ${formatNumber(rm1 * 0.85, 1)}kg (85%) - Intensificação</li>
                    <li><strong>Semana 7:</strong> Deload - ${formatNumber(rm1 * 0.60, 1)}kg (60%)</li>
                    <li><strong>Semana 8:</strong> Teste novo 1RM</li>
                </ul>
            </div>
            
            <div class="tips-grid">
                <div class="tip-card">
                    <h5>⚠️ Segurança</h5>
                    <p>Sempre teste 1RM com supervisor experiente e após aquecimento adequado. Use equipamentos de segurança.</p>
                </div>
                <div class="tip-card">
                    <h5>📅 Frequência</h5>
                    <p>Teste 1RM máximo a cada 6-8 semanas. Testes frequentes podem causar fadiga e lesões.</p>
                </div>
                <div class="tip-card">
                    <h5>🎯 Precisão</h5>
                    <p>Fórmulas são mais precisas para 2-10 repetições. Acima de 15 reps, a precisão diminui significativamente.</p>
                </div>
            </div>
            
            <div class="warning-box">
                <h4>Importante</h4>
                <p>Esta é uma estimativa baseada em fórmulas científicas. O 1RM real pode variar devido a fatores como técnica, fadiga, experiência e condições do dia. Use como referência, não como valor absoluto.</p>
            </div>
        </div>
    `;
}

// ===== CALCULADORA DE FREQUÊNCIA CARDÍACA MELHORADA =====
document.getElementById('frequencia-cardiaca-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const idade = parseInt(document.getElementById('fc-idade').value);
    const fc_repouso = parseInt(document.getElementById('fc-repouso').value);
    const objetivo = document.getElementById('fc-objetivo').value;
    const condicao = document.getElementById('fc-condicao').value;
    
    // Múltiplas fórmulas para FC máxima
    const fc_max_220 = 220 - idade; // Fórmula clássica
    const fc_max_tanaka = 208 - (0.7 * idade); // Mais precisa para adultos
    const fc_max_gulati = 206 - (0.88 * idade); // Específica para mulheres
    
    // Usar Tanaka como padrão (mais precisa)
    const fc_maxima = fc_max_tanaka;
    
    // Calcular zonas usando método Karvonen (reserva cardíaca)
    const reserva_cardiaca = fc_maxima - fc_repouso;
    
    const zonas = {
        'recuperacao': {
            min: Math.round(fc_repouso + (reserva_cardiaca * 0.50)),
            max: Math.round(fc_repouso + (reserva_cardiaca * 0.60)),
            nome: 'Recuperação Ativa',
            beneficios: 'Recuperação, aquecimento, volta à calma'
        },
        'aerobica_leve': {
            min: Math.round(fc_repouso + (reserva_cardiaca * 0.60)),
            max: Math.round(fc_repouso + (reserva_cardiaca * 0.70)),
            nome: 'Aeróbica Leve',
            beneficios: 'Queima de gordura, base aeróbica'
        },
        'aerobica': {
            min: Math.round(fc_repouso + (reserva_cardiaca * 0.70)),
            max: Math.round(fc_repouso + (reserva_cardiaca * 0.80)),
            nome: 'Aeróbica',
            beneficios: 'Condicionamento cardiovascular'
        },
        'anaerobica': {
            min: Math.round(fc_repouso + (reserva_cardiaca * 0.80)),
            max: Math.round(fc_repouso + (reserva_cardiaca * 0.90)),
            nome: 'Anaeróbica',
            beneficios: 'Potência, VO2 máximo'
        },
        'neuromuscular': {
            min: Math.round(fc_repouso + (reserva_cardiaca * 0.90)),
            max: Math.round(fc_maxima),
            nome: 'Neuromuscular',
            beneficios: 'Potência máxima, velocidade'
        }
    };
    
    document.getElementById('fc-maxima').textContent = Math.round(fc_maxima);
    
    const resultadoDiv = document.getElementById('frequencia-cardiaca-result');
    resultadoDiv.innerHTML = `
        <div class="calculator-result">
            <div class="result-header">
                <div class="icon">❤️</div>
                <h3>Zonas de Frequência Cardíaca</h3>
            </div>
            
            <div class="result-value">
                <span class="number">${Math.round(fc_maxima)}</span>
                <span class="unit">bpm máxima</span>
            </div>
            
            <div class="result-interpretation good">
                <h4>FC de Repouso: ${fc_repouso} bpm</h4>
                <p>Reserva Cardíaca: ${Math.round(reserva_cardiaca)} bpm (diferença entre máxima e repouso)</p>
            </div>
            
            ${gerarRecomendacoesFC(zonas, fc_maxima, fc_repouso, objetivo, condicao)}
        </div>
    `;
    
    showResult('frequencia-cardiaca');
});

function gerarRecomendacoesFC(zonas, fc_maxima, fc_repouso, objetivo, condicao) {
    return `
        <div class="recommendations-section">
            <h4>Zonas de Treinamento Personalizadas</h4>
            
            <div class="heart-rate-zones">
                <div class="zone-card zone-1">
                    <h5>💙 Zona 1: ${zonas.recuperacao.nome}</h5>
                    <div class="zone-range">${zonas.recuperacao.min}-${zonas.recuperacao.max} bpm</div>
                    <p>${zonas.recuperacao.beneficios}</p>
                    <div class="zone-percentage">50-60% FC Máx</div>
                </div>
                
                <div class="zone-card zone-2">
                    <h5>💚 Zona 2: ${zonas.aerobica_leve.nome}</h5>
                    <div class="zone-range">${zonas.aerobica_leve.min}-${zonas.aerobica_leve.max} bpm</div>
                    <p>${zonas.aerobica_leve.beneficios}</p>
                    <div class="zone-percentage">60-70% FC Máx</div>
                </div>
                
                <div class="zone-card zone-3">
                    <h5>💛 Zona 3: ${zonas.aerobica.nome}</h5>
                    <div class="zone-range">${zonas.aerobica.min}-${zonas.aerobica.max} bpm</div>
                    <p>${zonas.aerobica.beneficios}</p>
                    <div class="zone-percentage">70-80% FC Máx</div>
                </div>
                
                <div class="zone-card zone-4">
                    <h5>🧡 Zona 4: ${zonas.anaerobica.nome}</h5>
                    <div class="zone-range">${zonas.anaerobica.min}-${zonas.anaerobica.max} bpm</div>
                    <p>${zonas.anaerobica.beneficios}</p>
                    <div class="zone-percentage">80-90% FC Máx</div>
                </div>
                
                <div class="zone-card zone-5">
                    <h5>❤️ Zona 5: ${zonas.neuromuscular.nome}</h5>
                    <div class="zone-range">${zonas.neuromuscular.min}-${zonas.neuromuscular.max} bpm</div>
                    <p>${zonas.neuromuscular.beneficios}</p>
                    <div class="zone-percentage">90-100% FC Máx</div>
                </div>
            </div>
            
            <div class="recommendation-item priority-high">
                <h5>🎯 Distribuição Semanal Recomendada</h5>
                <ul>
                    <li><strong>Zona 1-2 (80%):</strong> Base aeróbica, recuperação ativa</li>
                    <li><strong>Zona 3 (15%):</strong> Treinos de tempo/ritmo</li>
                    <li><strong>Zona 4-5 (5%):</strong> Intervalos de alta intensidade</li>
                    <li><strong>Polarização:</strong> Evite treinar muito na Zona 3 (zona cinza)</li>
                </ul>
            </div>
            
            <div class="recommendation-item priority-medium">
                <h5>📊 Monitoramento Durante o Exercício</h5>
                <ul>
                    <li><strong>Frequencímetro:</strong> Use monitor cardíaco para precisão</li>
                    <li><strong>Percepção:</strong> Zona 1-2 = conversa fácil, Zona 3-4 = frases curtas</li>
                    <li><strong>Respiração:</strong> Zona 1-2 = nasal, Zona 3+ = bucal</li>
                    <li><strong>Duração:</strong> Zonas altas = intervalos curtos, baixas = contínuo</li>
                </ul>
            </div>
            
            <div class="tips-grid">
                <div class="tip-card">
                    <h5>📈 Melhoria da FC Repouso</h5>
                    <p>FC de repouso baixa indica melhor condicionamento. Atletas têm 40-60 bpm, sedentários 70-100 bpm.</p>
                </div>
                <div class="tip-card">
                    <h5>🔄 Variabilidade</h5>
                    <p>FC pode variar ±10 bpm devido a fatores como hidratação, sono, estresse e temperatura.</p>
                </div>
                <div class="tip-card">
                    <h5>⚡ Recuperação</h5>
                    <p>Boa recuperação: FC volta ao normal em 1-2 min após exercício intenso.</p>
                </div>
            </div>
            
            ${objetivo === 'queima-gordura' ? `
                <div class="objective-tips fat-burn">
                    <h5>🎯 Foco na Queima de Gordura</h5>
                    <ul>
                        <li>Priorize Zona 2 (60-70%) para oxidação máxima de gorduras</li>
                        <li>Sessões longas (45-90 min) em jejum ou baixo carboidrato</li>
                        <li>Combine com HIIT 2x/semana para acelerar metabolismo</li>
                        <li>Mantenha consistência - gordura é queimada lentamente</li>
                    </ul>
                </div>
            ` : objetivo === 'condicionamento' ? `
                <div class="objective-tips conditioning">
                    <h5>🎯 Foco no Condicionamento</h5>
                    <ul>
                        <li>Base em Zona 2 (70% do tempo) para capacidade aeróbica</li>
                        <li>Zona 3-4 (20% do tempo) para limiar anaeróbico</li>
                        <li>Zona 5 (10% do tempo) para VO2 máximo</li>
                        <li>Periodize: 3 semanas progressão + 1 semana recuperação</li>
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
}

// ===== CALCULADORA DE RECUPERAÇÃO MELHORADA =====
document.getElementById('recuperacao-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const intensidade = document.getElementById('rec-intensidade').value;
    const duracao = parseInt(document.getElementById('rec-duracao').value);
    const tipo_treino = document.getElementById('rec-tipo').value;
    const experiencia = document.getElementById('rec-experiencia').value;
    const idade = parseInt(document.getElementById('rec-idade').value);
    const sono = document.getElementById('rec-sono').value;
    const estresse = document.getElementById('rec-estresse').value;
    
    // Tempo base de recuperação por intensidade (em horas)
    let tempoBase;
    switch (intensidade) {
        case 'leve':
            tempoBase = 12;
            break;
        case 'moderada':
            tempoBase = 24;
            break;
        case 'alta':
            tempoBase = 48;
            break;
        case 'maxima':
            tempoBase = 72;
            break;
    }
    
    // Ajustes por duração
    const fatorDuracao = duracao / 60; // Normalizar para 1 hora
    tempoBase *= Math.sqrt(fatorDuracao); // Raiz quadrada para não ser linear
    
    // Ajustes por tipo de treino
    const fatoresTreino = {
        'cardio': 0.8,
        'forca': 1.2,
        'hiit': 1.4,
        'funcional': 1.0,
        'esportes': 1.1
    };
    tempoBase *= fatoresTreino[tipo_treino];
    
    // Ajustes por experiência
    const fatoresExperiencia = {
        'iniciante': 1.3,
        'intermediario': 1.0,
        'avancado': 0.8
    };
    tempoBase *= fatoresExperiencia[experiencia];
    
    // Ajustes por idade
    if (idade > 40) {
        tempoBase *= 1.2;
    } else if (idade > 50) {
        tempoBase *= 1.4;
    }
    
    // Ajustes por qualidade do sono
    const fatoresSono = {
        'ruim': 1.5,
        'regular': 1.2,
        'boa': 1.0,
        'excelente': 0.9
    };
    tempoBase *= fatoresSono[sono];
    
    // Ajustes por nível de estresse
    const fatoresEstresse = {
        'baixo': 0.9,
        'moderado': 1.0,
        'alto': 1.3,
        'muito-alto': 1.6
    };
    tempoBase *= fatoresEstresse[estresse];
    
    const tempoRecuperacao = Math.round(tempoBase);
    const proximoTreino = Math.ceil(tempoRecuperacao / 24);
    
    document.getElementById('rec-tempo').textContent = tempoRecuperacao;
    document.getElementById('rec-proximo').textContent = proximoTreino;
    
    const resultadoDiv = document.getElementById('recuperacao-result');
    resultadoDiv.innerHTML = `
        <div class="calculator-result">
            <div class="result-header">
                <div class="icon">🔄</div>
                <h3>Tempo de Recuperação</h3>
            </div>
            
            <div class="tips-grid" style="margin-bottom: 2rem;">
                <div class="tip-card">
                    <h5>⏰ Recuperação Total</h5>
                    <div class="result-value" style="margin: 1rem 0;">
                        <span class="number" style="font-size: 2rem;">${tempoRecuperacao}</span>
                        <span class="unit">horas</span>
                    </div>
                </div>
                <div class="tip-card">
                    <h5>📅 Próximo Treino</h5>
                    <div class="result-value" style="margin: 1rem 0;">
                        <span class="number" style="font-size: 2rem;">${proximoTreino}</span>
                        <span class="unit">dias</span>
                    </div>
                </div>
            </div>
            
            ${gerarRecomendacoesRecuperacao(tempoRecuperacao, intensidade, tipo_treino, sono, estresse)}
        </div>
    `;
    
    showResult('recuperacao');
});

function gerarRecomendacoesRecuperacao(tempo, intensidade, tipo_treino, sono, estresse) {
    const fases = {
        'imediata': Math.round(tempo * 0.1), // 0-10% do tempo
        'rapida': Math.round(tempo * 0.4), // 10-50% do tempo
        'lenta': Math.round(tempo * 0.5) // 50-100% do tempo
    };
    
    return `
        <div class="recommendations-section">
            <h4>Fases da Recuperação</h4>
            
            <div class="recovery-phases">
                <div class="phase-card immediate">
                    <h5>⚡ Recuperação Imediata (0-${fases.imediata}h)</h5>
                    <ul>
                        <li><strong>Hidratação:</strong> Reponha 150% do peso perdido em suor</li>
                        <li><strong>Nutrição:</strong> Carboidratos + proteína na proporção 3:1</li>
                        <li><strong>Alongamento:</strong> 10-15 min de alongamento leve</li>
                        <li><strong>Banho:</strong> Água fria (10-15°C) por 10-15 min</li>
                    </ul>
                </div>
                
                <div class="phase-card rapid">
                    <h5>🔄 Recuperação Rápida (${fases.imediata}-${fases.rapida}h)</h5>
                    <ul>
                        <li><strong>Sono:</strong> 7-9h de sono de qualidade</li>
                        <li><strong>Alimentação:</strong> Refeições anti-inflamatórias</li>
                        <li><strong>Atividade:</strong> Caminhada leve ou yoga</li>
                        <li><strong>Massagem:</strong> Auto-massagem ou foam roller</li>
                    </ul>
                </div>
                
                <div class="phase-card slow">
                    <h5>🐌 Recuperação Lenta (${fases.rapida}-${tempo}h)</h5>
                    <ul>
                        <li><strong>Adaptação:</strong> Síntese proteica e reparação tecidual</li>
                        <li><strong>Supercompensação:</strong> Melhoria da capacidade física</li>
                        <li><strong>Monitoramento:</strong> Avalie sinais de recuperação</li>
                        <li><strong>Preparação:</strong> Prepare-se para próximo treino</li>
                    </ul>
                </div>
            </div>
            
            <div class="recommendation-item priority-high">
                <h5>🎯 Estratégias de Recuperação Ativa</h5>
                <ul>
                    <li><strong>Mobilidade:</strong> 15-20 min de exercícios de mobilidade diários</li>
                    <li><strong>Cardio Leve:</strong> 20-30 min de caminhada ou natação suave</li>
                    <li><strong>Respiração:</strong> Técnicas de respiração para ativar parassimpático</li>
                    <li><strong>Meditação:</strong> 10-15 min para reduzir cortisol</li>
                </ul>
            </div>
            
            <div class="recommendation-item priority-medium">
                <h5>🔬 Sinais de Recuperação Completa</h5>
                <ul>
                    <li><strong>FC Repouso:</strong> Volta aos valores normais</li>
                    <li><strong>Humor:</strong> Motivação e energia restauradas</li>
                    <li><strong>Dor Muscular:</strong> DOMS (dor tardia) diminuída</li>
                    <li><strong>Performance:</strong> Capacidade de repetir intensidade anterior</li>
                </ul>
            </div>
            
            <div class="tips-grid">
                <div class="tip-card">
                    <h5>💤 Sono Otimizado</h5>
                    <p>80% da recuperação acontece durante o sono. Priorize 7-9h de sono de qualidade em ambiente escuro e fresco.</p>
                </div>
                <div class="tip-card">
                    <h5>🥗 Nutrição Pós-Treino</h5>
                    <p>Janela anabólica: consuma proteína + carboidratos dentro de 2h após treino intenso.</p>
                </div>
                <div class="tip-card">
                    <h5>🌡️ Terapias de Contraste</h5>
                    <p>Alterne banho quente (3-4 min) e frio (30-60s) por 3-4 ciclos para acelerar recuperação.</p>
                </div>
            </div>
            
            ${sono === 'ruim' || estresse === 'alto' || estresse === 'muito-alto' ? `
                <div class="warning-box">
                    <h4>Fatores Limitantes Identificados</h4>
                    <p>Sono inadequado ou estresse alto podem dobrar o tempo de recuperação. Priorize melhorar estes fatores para otimizar seus resultados.</p>
                </div>
            ` : ''}
            
            <div class="general-tips">
                <h5>📋 Protocolo de Recuperação Personalizado</h5>
                <ul>
                    <li><strong>Imediatamente:</strong> Hidrate + alongue + nutrição</li>
                    <li><strong>Primeiras 6h:</strong> Banho frio + refeição completa</li>
                    <li><strong>Primeiras 24h:</strong> Sono de qualidade + atividade leve</li>
                    <li><strong>48-72h:</strong> Monitore sinais + prepare próximo treino</li>
                </ul>
            </div>
        </div>
    `;
}

// ===== CALCULADORA DE GASTO CALÓRICO MELHORADA =====
document.getElementById('gasto-calorico-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('gc-peso').value);
    const exercicio = document.getElementById('gc-exercicio').value;
    const duracao = parseInt(document.getElementById('gc-duracao').value);
    const intensidade = document.getElementById('gc-intensidade').value;
    
    // METs (Metabolic Equivalent of Task) por exercício e intensidade
    const mets = {
        'caminhada': { 'leve': 3.0, 'moderada': 4.0, 'alta': 5.0 },
        'corrida': { 'leve': 7.0, 'moderada': 9.0, 'alta': 12.0 },
        'ciclismo': { 'leve': 4.0, 'moderada': 6.8, 'alta': 10.0 },
        'natacao': { 'leve': 4.0, 'moderada': 6.0, 'alta': 8.0 },
        'musculacao': { 'leve': 3.0, 'moderada': 5.0, 'alta': 6.0 },
        'hiit': { 'leve': 6.0, 'moderada': 8.0, 'alta': 12.0 },
        'yoga': { 'leve': 2.5, 'moderada': 3.0, 'alta': 4.0 },
        'futebol': { 'leve': 5.0, 'moderada': 7.0, 'alta': 10.0 },
        'basquete': { 'leve': 4.5, 'moderada': 6.5, 'alta': 8.0 },
        'tenis': { 'leve': 4.0, 'moderada': 6.0, 'alta': 8.0 }
    };
    
    const met = mets[exercicio][intensidade];
    
    // Fórmula: Calorias = MET × peso(kg) × tempo(h)
    const calorias = met * peso * (duracao / 60);
    const caloriasPorMinuto = calorias / duracao;
    
    document.getElementById('gc-calorias').textContent = formatNumber(calorias, 0);
    document.getElementById('gc-por-minuto').textContent = formatNumber(caloriasPorMinuto, 1);
    
    const resultadoDiv = document.getElementById('gasto-calorico-result');
    resultadoDiv.innerHTML = `
        <div class="calculator-result">
            <div class="result-header">
                <div class="icon">🔥</div>
                <h3>Gasto Calórico - ${exercicio.charAt(0).toUpperCase() + exercicio.slice(1)}</h3>
            </div>
            
            <div class="result-value">
                <span class="number">${formatNumber(calorias, 0)}</span>
                <span class="unit">kcal queimadas</span>
            </div>
            
            <div class="result-interpretation good">
                <h4>${formatNumber(caloriasPorMinuto, 1)} kcal por minuto</h4>
                <p>Baseado em ${met} METs para ${exercicio} em intensidade ${intensidade} durante ${duracao} minutos.</p>
            </div>
            
            ${gerarRecomendacoesGastoCalorico(calorias, exercicio, intensidade, peso, duracao, met)}
        </div>
    `;
    
    showResult('gasto-calorico');
});

function gerarRecomendacoesGastoCalorico(calorias, exercicio, intensidade, peso, duracao, met) {
    // Comparações úteis
    const equivalencias = {
        'big_mac': Math.round(calorias / 550),
        'chocolate': Math.round(calorias / 25),
        'refrigerante': Math.round(calorias / 150),
        'arroz': Math.round(calorias / 130),
        'caminhada': Math.round(calorias / (3.0 * peso * (1/60))) // minutos de caminhada equivalente
    };
    
    return `
        <div class="recommendations-section">
            <h4>Análise do Gasto Calórico</h4>
            
            <div class="calorie-equivalents">
                <h5>🍔 Equivalências Alimentares</h5>
                <div class="equivalents-grid">
                    <div class="equivalent-item">
                        <span class="food-icon">🍔</span>
                        <span class="amount">${equivalencias.big_mac}</span>
                        <span class="food-name">Big Mac</span>
                    </div>
                    <div class="equivalent-item">
                        <span class="food-icon">🍫</span>
                        <span class="amount">${equivalencias.chocolate}</span>
                        <span class="food-name">Quadradinhos de chocolate</span>
                    </div>
                    <div class="equivalent-item">
                        <span class="food-icon">🥤</span>
                        <span class="amount">${equivalencias.refrigerante}</span>
                        <span class="food-name">Latas de refrigerante</span>
                    </div>
                    <div class="equivalent-item">
                        <span class="food-icon">🍚</span>
                        <span class="amount">${equivalencias.arroz}</span>
                        <span class="food-name">Xícaras de arroz</span>
                    </div>
                </div>
            </div>
            
            <div class="recommendation-item priority-high">
                <h5>📊 Otimização do Gasto Calórico</h5>
                <ul>
                    <li><strong>Intensidade:</strong> Aumentar para "alta" queimaria ${formatNumber((mets[exercicio]['alta'] * peso * (duracao / 60)), 0)} kcal (+${formatNumber((mets[exercicio]['alta'] * peso * (duracao / 60)) - calorias, 0)} kcal)</li>
                    <li><strong>Duração:</strong> Mais 15 min queimaria ${formatNumber((met * peso * 0.25), 0)} kcal adicionais</li>
                    <li><strong>Frequência:</strong> 3x/semana = ${formatNumber(calorias * 3, 0)} kcal/semana</li>
                    <li><strong>HIIT:</strong> Intervalos de alta intensidade podem aumentar gasto em 15-20%</li>
                </ul>
            </div>
            
            <div class="recommendation-item priority-medium">
                <h5>🔥 Efeito Pós-Exercício (EPOC)</h5>
                <ul>
                    <li><strong>Exercícios Intensos:</strong> Queima adicional de 6-15% nas próximas 24h</li>
                    <li><strong>EPOC Estimado:</strong> ${formatNumber(calorias * 0.10, 0)} kcal adicionais</li>
                    <li><strong>Musculação:</strong> EPOC pode durar até 38h após treino intenso</li>
                    <li><strong>Cardio HIIT:</strong> EPOC superior ao cardio contínuo</li>
                </ul>
            </div>
            
            <div class="tips-grid">
                <div class="tip-card">
                    <h5>⚖️ Déficit Calórico</h5>
                    <p>Para perder 0,5kg/semana, crie déficit de 3.500 kcal (500 kcal/dia) através de exercício + dieta.</p>
                </div>
                <div class="tip-card">
                    <h5>💪 Preservar Massa Muscular</h5>
                    <p>Combine cardio com musculação para queimar calorias sem perder músculos durante déficit calórico.</p>
                </div>
                <div class="tip-card">
                    <h5>📈 Progressão</h5>
                    <p>Aumente gradualmente intensidade ou duração para evitar platôs e continuar progredindo.</p>
                </div>
            </div>
            
            <div class="exercise-variations">
                <h5>🔄 Variações para Maximizar Queima</h5>
                <div class="variation-grid">
                    <div class="variation-item">
                        <h6>🏃‍♂️ Intervalos</h6>
                        <p>2 min intenso + 1 min recuperação</p>
                        <p><strong>Gasto:</strong> +20-30% vs contínuo</p>
                    </div>
                    <div class="variation-item">
                        <h6>⛰️ Inclinação</h6>
                        <p>Caminhada/corrida em subida</p>
                        <p><strong>Gasto:</strong> +50-100% vs plano</p>
                    </div>
                    <div class="variation-item">
                        <h6>🏋️‍♀️ Circuito</h6>
                        <p>Exercícios sem descanso</p>
                        <p><strong>Gasto:</strong> +15-25% vs tradicional</p>
                    </div>
                    <div class="variation-item">
                        <h6>🌊 Água</h6>
                        <p>Exercícios aquáticos</p>
                        <p><strong>Gasto:</strong> +25% vs solo</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

