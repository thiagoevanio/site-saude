// ===== CALCULADORAS DE BEM-ESTAR =====

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
        case 'qualidade-sono':
            const sonoScore = document.getElementById('sono-score').textContent;
            const sonoDuracao = document.getElementById('sono-duracao').textContent;
            const sonoEficiencia = document.getElementById('sono-eficiencia').textContent;
            resultText = `Qualidade do sono: ${sonoScore} pontos\\nDuração: ${sonoDuracao} horas\\nEficiência: ${sonoEficiencia}%`;
            break;
        case 'nivel-estresse':
            const estresseNivel = document.getElementById('estresse-nivel').textContent;
            const estressePontuacao = document.getElementById('estresse-pontuacao').textContent;
            resultText = `Nível de estresse: ${estresseNivel}\\nPontuação: ${estressePontuacao} pontos`;
            break;
        case 'risco-sedentarismo':
            const sedRisco = document.getElementById('sed-risco').textContent;
            const sedAtividade = document.getElementById('sed-atividade-total').textContent;
            resultText = `Risco de sedentarismo: ${sedRisco}\\nAtividade semanal: ${sedAtividade} min/semana`;
            break;
        case 'consumo-cafeina':
            const cafConsumo = document.getElementById('caf-consumo-atual').textContent;
            const cafLimite = document.getElementById('caf-limite-seguro').textContent;
            const cafStatus = document.getElementById('caf-status').textContent;
            resultText = `Consumo atual: ${cafConsumo} mg/dia\\nLimite seguro: ${cafLimite} mg/dia\\nStatus: ${cafStatus}`;
            break;
    }
    
    if (resultText && window.calculatorUtils) {
        window.calculatorUtils.copyToClipboard(resultText);
    }
}

// ===== TIME CALCULATION FUNCTIONS =====
function timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToHours(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
}

function calculateSleepDuration(bedtime, wakeTime) {
    let bedMinutes = timeToMinutes(bedtime);
    let wakeMinutes = timeToMinutes(wakeTime);
    
    // Handle overnight sleep
    if (wakeMinutes <= bedMinutes) {
        wakeMinutes += 24 * 60; // Add 24 hours
    }
    
    return wakeMinutes - bedMinutes;
}

// ===== QUALIDADE DO SONO CALCULATOR =====
document.getElementById('qualidade-sono-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const horarioDormir = document.getElementById('sono-horario-dormir').value;
    const horarioAcordar = document.getElementById('sono-horario-acordar').value;
    const tempoAdormecer = parseInt(document.getElementById('sono-tempo-adormecer').value);
    const despertares = parseInt(document.getElementById('sono-despertares').value);
    const qualidadeSubjetiva = parseInt(document.getElementById('sono-qualidade-subjetiva').value);
    const energiaDia = parseInt(document.getElementById('sono-energia-dia').value);
    const idade = parseInt(document.getElementById('sono-idade').value);
    
    // Calculate sleep duration
    const duracaoTotal = calculateSleepDuration(horarioDormir, horarioAcordar);
    const duracaoHoras = duracaoTotal / 60;
    
    // Calculate sleep efficiency with more precise awakening duration
    const tempoNaCama = duracaoTotal;
    // More realistic awakening duration: 5-15 minutes depending on number of awakenings
    const duracaoDespertares = despertares === 0 ? 0 : 
                              despertares === 1 ? 5 : 
                              despertares <= 3 ? despertares * 8 : 
                              despertares * 12; // Longer awakenings for frequent disruptions
    const tempoAdormecido = duracaoTotal - tempoAdormecer - duracaoDespertares;
    const eficiencia = Math.max(0, (tempoAdormecido / tempoNaCama) * 100);
    
    // Calculate sleep cycles (90 minutes each)
    const ciclosCompletos = Math.floor(tempoAdormecido / 90);
    
    // Calculate sleep quality score (0-20 scale)
    let score = 0;
    
    // Duration score (0-5)
    if (duracaoHoras >= 7 && duracaoHoras <= 9) {
        score += 5;
    } else if (duracaoHoras >= 6 && duracaoHoras < 7) {
        score += 4;
    } else if (duracaoHoras >= 5 && duracaoHoras < 6) {
        score += 3;
    } else if (duracaoHoras >= 4 && duracaoHoras < 5) {
        score += 2;
    } else {
        score += 1;
    }
    
    // Efficiency score (0-5)
    if (eficiencia >= 90) score += 5;
    else if (eficiencia >= 80) score += 4;
    else if (eficiencia >= 70) score += 3;
    else if (eficiencia >= 60) score += 2;
    else score += 1;
    
    // Sleep onset score (0-3)
    if (tempoAdormecer <= 15) score += 3;
    else if (tempoAdormecer <= 30) score += 2;
    else if (tempoAdormecer <= 45) score += 1;
    
    // Awakenings score (0-2)
    if (despertares === 0) score += 2;
    else if (despertares === 1) score += 1;
    
    // Subjective quality (0-4)
    score += qualidadeSubjetiva;
    
    // Daytime energy (0-1)
    if (energiaDia >= 3) score += 1;
    
    // Update results
    document.getElementById('sono-score').textContent = score;
    document.getElementById('sono-duracao').textContent = formatNumber(duracaoHoras, 1);
    document.getElementById('sono-eficiencia').textContent = formatNumber(eficiencia, 0);
    document.getElementById('sono-ciclos').textContent = ciclosCompletos;
    
    // Generate personalized recommendations based on specific deficiencies
    const recomendacoes = document.getElementById('sono-recomendacoes');
    let recomendacoesHTML = '';
    
    if (score >= 18) {
        recomendacoesHTML = `
            <div class="rec-item excellent">
                <i class="fas fa-star"></i>
                <span><strong>Excelente qualidade de sono!</strong> Continue mantendo seus hábitos saudáveis. Considere ser um exemplo para outros sobre higiene do sono.</span>
            </div>
            <div class="rec-item excellent">
                <i class="fas fa-chart-line"></i>
                <span><strong>Monitoramento:</strong> Continue acompanhando sua qualidade de sono para manter esse padrão excepcional.</span>
            </div>
        `;
    } else {
        // Personalized recommendations based on specific issues
        if (duracaoHoras < 7) {
            recomendacoesHTML += `
                <div class="rec-item priority">
                    <i class="fas fa-clock"></i>
                    <span><strong>Prioridade Alta:</strong> Você está dormindo apenas ${formatNumber(duracaoHoras, 1)} horas. Tente dormir mais cedo para atingir 7-9 horas por noite. Estabeleça um horário fixo para ir para a cama.</span>
                </div>
            `;
        } else if (duracaoHoras > 9) {
            recomendacoesHTML += `
                <div class="rec-item">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span><strong>Atenção:</strong> Você está dormindo ${formatNumber(duracaoHoras, 1)} horas, o que pode ser excessivo. Considere avaliar a qualidade do sono e consultar um médico se persistir.</span>
                </div>
            `;
        }
        
        if (tempoAdormecer > 30) {
            recomendacoesHTML += `
                <div class="rec-item priority">
                    <i class="fas fa-moon"></i>
                    <span><strong>Dificuldade para adormecer:</strong> Você leva ${tempoAdormecer} minutos para dormir. Pratique técnicas de relaxamento: respiração profunda, meditação ou leitura. Evite telas 1h antes de dormir.</span>
                </div>
            `;
        } else if (tempoAdormecer > 20) {
            recomendacoesHTML += `
                <div class="rec-item">
                    <i class="fas fa-moon"></i>
                    <span><strong>Tempo para adormecer:</strong> Crie uma rotina relaxante antes de dormir: banho morno, chá de camomila ou alongamentos leves.</span>
                </div>
            `;
        }
        
        if (despertares > 2) {
            recomendacoesHTML += `
                <div class="rec-item priority">
                    <i class="fas fa-bed"></i>
                    <span><strong>Múltiplos despertares:</strong> ${despertares} despertares por noite é excessivo. Evite líquidos 2h antes de dormir, mantenha o quarto escuro e silencioso. Considere consultar um médico.</span>
                </div>
            `;
        } else if (despertares > 0) {
            recomendacoesHTML += `
                <div class="rec-item">
                    <i class="fas fa-bed"></i>
                    <span><strong>Despertares noturnos:</strong> Use cortinas blackout, tampões de ouvido ou máscara de dormir para minimizar interrupções.</span>
                </div>
            `;
        }
        
        if (eficiencia < 85) {
            recomendacoesHTML += `
                <div class="rec-item priority">
                    <i class="fas fa-thermometer-half"></i>
                    <span><strong>Baixa eficiência do sono (${formatNumber(eficiencia, 0)}%):</strong> Mantenha o quarto entre 18-22°C, use a cama apenas para dormir e intimidade. Evite cochilos longos durante o dia.</span>
                </div>
            `;
        }
        
        if (qualidadeSubjetiva <= 2) {
            recomendacoesHTML += `
                <div class="rec-item">
                    <i class="fas fa-heart"></i>
                    <span><strong>Qualidade subjetiva baixa:</strong> Avalie fatores como estresse, ansiedade ou desconforto físico. Considere técnicas de mindfulness antes de dormir.</span>
                </div>
            `;
        }
        
        if (energiaDia <= 2) {
            recomendacoesHTML += `
                <div class="rec-item">
                    <i class="fas fa-battery-quarter"></i>
                    <span><strong>Baixa energia diurna:</strong> Exponha-se à luz natural pela manhã, faça exercícios regulares (mas não próximo ao horário de dormir) e mantenha horários consistentes.</span>
                </div>
            `;
        }
        
        // General recommendations
        recomendacoesHTML += `
            <div class="rec-item">
                <i class="fas fa-sun"></i>
                <span><strong>Ritmo circadiano:</strong> Exponha-se à luz natural pela manhã e evite luz azul 2h antes de dormir.</span>
            </div>
            <div class="rec-item">
                <i class="fas fa-coffee"></i>
                <span><strong>Substâncias:</strong> Evite cafeína após 14h, álcool 3h antes de dormir e refeições pesadas 2h antes.</span>
            </div>
            <div class="rec-item">
                <i class="fas fa-dumbbell"></i>
                <span><strong>Exercícios:</strong> Pratique atividade física regular, mas termine pelo menos 3h antes de dormir.</span>
            </div>
        `;
    }
    
    recomendacoes.innerHTML = recomendacoesHTML;
    
    showResult('qualidade-sono');
});

// ===== NÍVEL DE ESTRESSE CALCULATOR =====
document.getElementById('nivel-estresse-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    // Calculate symptoms scores
    const sintomasFisicos = Array.from(document.querySelectorAll('input[name="sintomas-fisicos"]:checked'))
        .reduce((sum, checkbox) => sum + parseInt(checkbox.value), 0);
    
    const sintomasEmocionais = Array.from(document.querySelectorAll('input[name="sintomas-emocionais"]:checked'))
        .reduce((sum, checkbox) => sum + parseInt(checkbox.value), 0);
    
    const sintomasComportamentais = Array.from(document.querySelectorAll('input[name="sintomas-comportamentais"]:checked'))
        .reduce((sum, checkbox) => sum + parseInt(checkbox.value), 0);
    
    const estresseTrabalho = parseInt(document.getElementById('estresse-trabalho').value);
    const estressePessoal = parseInt(document.getElementById('estresse-pessoal').value);
    
    // Calculate total score
    const pontuacaoTotal = sintomasFisicos + sintomasEmocionais + sintomasComportamentais + 
                          estresseTrabalho + estressePessoal;
    
    // Determine stress level
    let nivelEstresse, cor;
    if (pontuacaoTotal <= 10) {
        nivelEstresse = 'Baixo';
        cor = '#10b981';
    } else if (pontuacaoTotal <= 20) {
        nivelEstresse = 'Moderado';
        cor = '#f59e0b';
    } else if (pontuacaoTotal <= 30) {
        nivelEstresse = 'Alto';
        cor = '#ef4444';
    } else {
        nivelEstresse = 'Muito Alto';
        cor = '#dc2626';
    }
    
    // Update results
    document.getElementById('estresse-nivel').textContent = nivelEstresse;
    document.getElementById('estresse-pontuacao').textContent = pontuacaoTotal;
    
    // Set color for stress level
    const nivelElement = document.getElementById('estresse-nivel');
    nivelElement.style.color = cor;
    
    // Generate enhanced interpretation with more granular feedback
    let interpretacao;
    if (pontuacaoTotal <= 10) {
        interpretacao = `
            <div class="stress-interpretation excellent">
                <h4><i class="fas fa-check-circle"></i> Nível de Estresse Baixo</h4>
                <p>Parabéns! Seu nível de estresse está baixo, indicando um bom equilíbrio emocional e físico. Você demonstra ter estratégias eficazes para lidar com as pressões do dia a dia.</p>
                <p><strong>Mantenha:</strong> Continue praticando seus hábitos saudáveis de gerenciamento do estresse e técnicas de autocuidado.</p>
            </div>
        `;
    } else if (pontuacaoTotal <= 20) {
        interpretacao = `
            <div class="stress-interpretation moderate">
                <h4><i class="fas fa-exclamation-triangle"></i> Nível de Estresse Moderado</h4>
                <p>Você apresenta sinais moderados de estresse. Embora ainda seja manejável, é importante implementar estratégias de relaxamento e cuidar do bem-estar antes que se intensifique.</p>
                <p><strong>Ação recomendada:</strong> Identifique as principais fontes de estresse e desenvolva estratégias específicas para cada uma.</p>
            </div>
        `;
    } else if (pontuacaoTotal <= 30) {
        interpretacao = `
            <div class="stress-interpretation high">
                <h4><i class="fas fa-exclamation-circle"></i> Nível de Estresse Alto</h4>
                <p>Seu nível de estresse está alto e pode estar impactando significativamente sua qualidade de vida, saúde física e mental. É importante tomar medidas imediatas.</p>
                <p><strong>Ação necessária:</strong> Considere buscar apoio profissional e implementar mudanças significativas no estilo de vida.</p>
            </div>
        `;
    } else {
        interpretacao = `
            <div class="stress-interpretation critical">
                <h4><i class="fas fa-times-circle"></i> Nível de Estresse Muito Alto</h4>
                <p>Você apresenta sinais de estresse muito alto, o que pode ter consequências sérias para sua saúde física e mental. É fundamental buscar ajuda profissional imediatamente.</p>
                <p><strong>Ação urgente:</strong> Procure um psicólogo, psiquiatra ou médico especializado em saúde mental o quanto antes.</p>
            </div>
        `;
    }
    
    document.getElementById('estresse-interpretacao').innerHTML = interpretacao;
    
    // Generate personalized strategies based on symptom types and stress level
    const estrategias = document.getElementById('estresse-estrategias');
    let estrategiasHTML = '';
    
    if (pontuacaoTotal <= 10) {
        estrategiasHTML = `
            <div class="estrategia-item maintenance">
                <i class="fas fa-leaf"></i>
                <span><strong>Manutenção:</strong> Continue praticando atividades relaxantes como meditação, yoga ou hobbies que lhe trazem prazer.</span>
            </div>
            <div class="estrategia-item maintenance">
                <i class="fas fa-running"></i>
                <span><strong>Exercícios:</strong> Mantenha exercícios regulares para preservar o bem-estar físico e mental.</span>
            </div>
            <div class="estrategia-item maintenance">
                <i class="fas fa-users"></i>
                <span><strong>Relacionamentos:</strong> Continue cultivando relacionamentos saudáveis e redes de apoio social.</span>
            </div>
        `;
    } else {
        // Immediate stress relief techniques
        estrategiasHTML = `
            <div class="estrategia-item immediate">
                <i class="fas fa-lungs"></i>
                <span><strong>Respiração 4-7-8:</strong> Inspire por 4s, segure por 7s, expire por 8s. Repita 4 vezes, várias vezes ao dia.</span>
            </div>
            <div class="estrategia-item immediate">
                <i class="fas fa-pause"></i>
                <span><strong>Técnica STOP:</strong> Pare, Respire, Observe seus pensamentos e sentimentos, Prossiga com consciência.</span>
            </div>
        `;
        
        // Strategies based on symptom types
        if (sintomasFisicos > 5) {
            estrategiasHTML += `
                <div class="estrategia-item physical">
                    <i class="fas fa-heartbeat"></i>
                    <span><strong>Sintomas Físicos:</strong> Pratique relaxamento muscular progressivo, massagens ou banhos mornos para aliviar tensões corporais.</span>
                </div>
                <div class="estrategia-item physical">
                    <i class="fas fa-dumbbell"></i>
                    <span><strong>Exercício Físico:</strong> 30 min de atividade física moderada, 5x por semana. Prefira atividades que você goste.</span>
                </div>
            `;
        }
        
        if (sintomasEmocionais > 5) {
            estrategiasHTML += `
                <div class="estrategia-item emotional">
                    <i class="fas fa-brain"></i>
                    <span><strong>Regulação Emocional:</strong> Pratique mindfulness, journaling ou técnicas de reestruturação cognitiva para processar emoções.</span>
                </div>
                <div class="estrategia-item emotional">
                    <i class="fas fa-heart"></i>
                    <span><strong>Autocompaixão:</strong> Trate-se com gentileza, como trataria um bom amigo em situação similar.</span>
                </div>
            `;
        }
        
        if (sintomasComportamentais > 5) {
            estrategiasHTML += `
                <div class="estrategia-item behavioral">
                    <i class="fas fa-calendar-check"></i>
                    <span><strong>Organização:</strong> Use técnicas de gestão de tempo, estabeleça prioridades claras e aprenda a dizer "não" quando necessário.</span>
                </div>
                <div class="estrategia-item behavioral">
                    <i class="fas fa-balance-scale"></i>
                    <span><strong>Equilíbrio:</strong> Estabeleça limites claros entre trabalho e vida pessoal. Reserve tempo para atividades prazerosas.</span>
                </div>
            `;
        }
        
        // Work and personal stress specific strategies
        if (estresseTrabalho >= 4) {
            estrategiasHTML += `
                <div class="estrategia-item work">
                    <i class="fas fa-briefcase"></i>
                    <span><strong>Estresse no Trabalho:</strong> Converse com seu supervisor sobre carga de trabalho, organize pausas regulares e considere técnicas de produtividade.</span>
                </div>
            `;
        }
        
        if (estressePessoal >= 4) {
            estrategiasHTML += `
                <div class="estrategia-item personal">
                    <i class="fas fa-home"></i>
                    <span><strong>Estresse Pessoal:</strong> Identifique e aborde questões familiares ou pessoais. Considere terapia familiar ou de casal se necessário.</span>
                </div>
            `;
        }
        
        // General strategies for all stress levels
        estrategiasHTML += `
            <div class="estrategia-item general">
                <i class="fas fa-bed"></i>
                <span><strong>Sono de Qualidade:</strong> 7-9 horas por noite com horários regulares. O sono é fundamental para o gerenciamento do estresse.</span>
            </div>
            <div class="estrategia-item general">
                <i class="fas fa-users"></i>
                <span><strong>Apoio Social:</strong> Mantenha conexões sociais significativas. Compartilhe seus sentimentos com pessoas de confiança.</span>
            </div>
            <div class="estrategia-item general">
                <i class="fas fa-utensils"></i>
                <span><strong>Nutrição:</strong> Mantenha uma alimentação equilibrada, evite excesso de cafeína e álcool, especialmente em períodos estressantes.</span>
            </div>
        `;
        
        if (pontuacaoTotal > 20) {
            estrategiasHTML += `
                <div class="estrategia-item urgent">
                    <i class="fas fa-user-md"></i>
                    <span><strong>Ajuda Profissional:</strong> Considere terapia cognitivo-comportamental, EMDR ou outras abordagens terapêuticas. Não hesite em buscar ajuda.</span>
                </div>
            `;
        }
        
        if (pontuacaoTotal > 30) {
            estrategiasHTML += `
                <div class="estrategia-item critical">
                    <i class="fas fa-phone"></i>
                    <span><strong>Emergência:</strong> Se tiver pensamentos de autolesão, ligue para o CVV (188) ou procure um pronto-socorro imediatamente.</span>
                </div>
            `;
        }
    }
    
    estrategias.innerHTML = estrategiasHTML;
    
    showResult('nivel-estresse');
});

// ===== CALCULADORA DE RISCO DE SEDENTARISMO MELHORADA =====
document.getElementById('risco-sedentarismo-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const idade = parseInt(document.getElementById('sed-idade').value);
    const sexo = document.getElementById('sed-sexo').value;
    const exercicioSemana = parseInt(document.getElementById('sed-exercicio-semana').value);
    const duracaoExercicio = parseInt(document.getElementById('sed-duracao-exercicio').value);
    const intensidade = parseInt(document.getElementById('sed-intensidade').value);
    const tempoSentado = parseInt(document.getElementById('sed-tempo-sentado').value);
    const trabalho = parseInt(document.getElementById('sed-trabalho').value);
    const transporte = parseInt(document.getElementById('sed-transporte').value);
    
    // Calcular atividade semanal em minutos com peso por intensidade
    const fatoresIntensidade = {
        1: 0.5, // Muito leve
        2: 1.0, // Leve
        3: 1.5, // Moderada
        4: 2.0, // Intensa
        5: 2.5  // Muito intensa
    };
    
    const atividadeSemanal = exercicioSemana * duracaoExercicio;
    const atividadePonderada = atividadeSemanal * fatoresIntensidade[intensidade];
    
    // Metas OMS: 150 min moderada OU 75 min intensa por semana
    const metaOMSModerada = 150;
    const metaOMSIntensa = 75;
    const metaEquivalente = intensidade >= 4 ? metaOMSIntensa : metaOMSModerada;
    const percentualMeta = Math.min(200, (atividadePonderada / metaEquivalente) * 100);
    
    // Calcular score de risco (0-100)
    let risco = 0;
    
    // Fator idade (0-20 pontos)
    if (idade >= 65) risco += 20;
    else if (idade >= 50) risco += 15;
    else if (idade >= 35) risco += 10;
    else if (idade >= 25) risco += 5;
    
    // Nível de atividade física (0-35 pontos)
    if (atividadePonderada === 0) risco += 35;
    else if (atividadePonderada < metaEquivalente * 0.25) risco += 30;
    else if (atividadePonderada < metaEquivalente * 0.5) risco += 25;
    else if (atividadePonderada < metaEquivalente * 0.75) risco += 15;
    else if (atividadePonderada < metaEquivalente) risco += 10;
    else if (atividadePonderada < metaEquivalente * 1.5) risco += 5;
    // 0 pontos se >= 1.5x meta
    
    // Tempo sentado (0-25 pontos)
    if (tempoSentado >= 14) risco += 25;
    else if (tempoSentado >= 12) risco += 20;
    else if (tempoSentado >= 10) risco += 15;
    else if (tempoSentado >= 8) risco += 10;
    else if (tempoSentado >= 6) risco += 5;
    
    // Tipo de trabalho (0-10 pontos)
    if (trabalho === 3) risco += 10; // Muito sedentário
    else if (trabalho === 2) risco += 5; // Moderadamente sedentário
    
    // Tipo de transporte (0-10 pontos)
    if (transporte === 3) risco += 10; // Sempre carro/transporte
    else if (transporte === 2) risco += 5; // Misto
    else if (transporte === 1) risco -= 5; // Ativo (pode ser negativo)
    
    risco = Math.max(0, Math.min(100, risco));
    
    // Determinar nível de risco e classificação
    let nivelRisco, classificacao, cor, classe;
    if (risco <= 20) {
        nivelRisco = 'Muito Baixo';
        classificacao = 'Estilo de vida ativo';
        cor = '#10b981';
        classe = 'excellent';
    } else if (risco <= 35) {
        nivelRisco = 'Baixo';
        classificacao = 'Boa atividade física';
        cor = '#22c55e';
        classe = 'good';
    } else if (risco <= 50) {
        nivelRisco = 'Moderado';
        classificacao = 'Precisa melhorar';
        cor = '#f59e0b';
        classe = 'average';
    } else if (risco <= 70) {
        nivelRisco = 'Alto';
        classificacao = 'Sedentarismo preocupante';
        cor = '#ef4444';
        classe = 'poor';
    } else {
        nivelRisco = 'Muito Alto';
        classificacao = 'Sedentarismo severo';
        cor = '#dc2626';
        classe = 'poor';
    }
    
    document.getElementById('sed-risco').textContent = nivelRisco;
    document.getElementById('sed-atividade-total').textContent = Math.round(atividadeSemanal);
    document.getElementById('sed-meta-oms').textContent = formatNumber(percentualMeta, 0);
    
    const resultadoDiv = document.getElementById('risco-sedentarismo-result');
    resultadoDiv.innerHTML = `
        <div class="calculator-result">
            <div class="result-header">
                <div class="icon">🏃‍♂️</div>
                <h3>Avaliação de Sedentarismo</h3>
            </div>
            
            <div class="result-value">
                <span class="number">${risco}</span>
                <span class="unit">pontos de risco</span>
            </div>
            
            <div class="result-interpretation ${classe}">
                <h4>Risco ${nivelRisco}</h4>
                <p>${classificacao} - ${percentualMeta >= 100 ? 'Você atinge' : 'Você atinge apenas'} ${formatNumber(percentualMeta, 0)}% da meta da OMS</p>
            </div>
            
            ${gerarRecomendacoesSedentarismo(risco, atividadeSemanal, atividadePonderada, tempoSentado, trabalho, metaEquivalente, intensidade)}
        </div>
    `;
    
    showResult('risco-sedentarismo');
});

function gerarRecomendacoesSedentarismo(risco, atividade, atividadePonderada, tempoSentado, trabalho, meta, intensidade) {
    const deficitAtividade = Math.max(0, meta - atividadePonderada);
    const horasSentadoIdeal = Math.max(4, 8 - Math.floor(risco / 10));
    
    return `
        <div class="recommendations-section">
            <h4>Análise Detalhada do Sedentarismo</h4>
            
            <div class="risk-factors">
                <h5>🎯 Fatores de Risco Identificados</h5>
                <div class="factors-grid">
                    <div class="factor-item ${atividade < 60 ? 'high-risk' : atividade < 120 ? 'medium-risk' : 'low-risk'}">
                        <h6>⚡ Atividade Física</h6>
                        <p><strong>${atividade} min/semana</strong></p>
                        <p>${atividade < 60 ? 'Muito baixa' : atividade < 120 ? 'Insuficiente' : 'Adequada'}</p>
                    </div>
                    <div class="factor-item ${tempoSentado >= 10 ? 'high-risk' : tempoSentado >= 8 ? 'medium-risk' : 'low-risk'}">
                        <h6>💺 Tempo Sentado</h6>
                        <p><strong>${tempoSentado}h/dia</strong></p>
                        <p>${tempoSentado >= 10 ? 'Excessivo' : tempoSentado >= 8 ? 'Alto' : 'Aceitável'}</p>
                    </div>
                    <div class="factor-item ${trabalho === 3 ? 'high-risk' : trabalho === 2 ? 'medium-risk' : 'low-risk'}">
                        <h6>💼 Trabalho</h6>
                        <p><strong>${trabalho === 3 ? 'Muito sedentário' : trabalho === 2 ? 'Moderado' : 'Ativo'}</strong></p>
                    </div>
                </div>
            </div>
            
            <div class="recommendation-item priority-high">
                <h5>🎯 Plano de Ação Personalizado</h5>
                ${deficitAtividade > 0 ? `
                    <div class="action-plan">
                        <h6>Déficit de Atividade: ${Math.round(deficitAtividade)} min/semana</h6>
                        <ul>
                            <li><strong>Semana 1-2:</strong> Adicione ${Math.round(deficitAtividade * 0.25)} min/semana (${Math.round(deficitAtividade * 0.25 / 7)} min/dia)</li>
                            <li><strong>Semana 3-4:</strong> Aumente para ${Math.round(deficitAtividade * 0.5)} min/semana</li>
                            <li><strong>Semana 5-6:</strong> Alcance ${Math.round(deficitAtividade * 0.75)} min/semana</li>
                            <li><strong>Semana 7-8:</strong> Atinja a meta completa de ${Math.round(meta)} min/semana</li>
                        </ul>
                    </div>
                ` : `
                    <div class="maintenance-plan">
                        <h6>Manutenção do Nível Atual</h6>
                        <ul>
                            <li><strong>Continue:</strong> Mantendo ${atividade} min/semana de atividade</li>
                            <li><strong>Varie:</strong> Experimente diferentes tipos de exercício</li>
                            <li><strong>Progrida:</strong> Aumente gradualmente intensidade ou duração</li>
                        </ul>
                    </div>
                `}
            </div>
            
            <div class="recommendation-item priority-medium">
                <h5>⏰ Estratégias para Reduzir Tempo Sentado</h5>
                <ul>
                    <li><strong>Regra 20-20-20:</strong> A cada 20 min, olhe para algo a 20 metros por 20 segundos</li>
                    <li><strong>Pausas Ativas:</strong> Levante-se por 2-3 min a cada hora</li>
                    <li><strong>Mesa em Pé:</strong> Use por 2-4h/dia se possível</li>
                    <li><strong>Reuniões Ativas:</strong> Caminhe durante ligações telefônicas</li>
                    <li><strong>Meta Diária:</strong> Reduza para máximo ${horasSentadoIdeal}h sentado/dia</li>
                </ul>
            </div>
            
            <div class="exercise-recommendations">
                <h5>🏋️‍♂️ Programa de Exercícios Progressivo</h5>
                
                ${risco >= 70 ? `
                    <div class="beginner-program">
                        <h6>Programa Iniciante (Risco Muito Alto)</h6>
                        <div class="week-plan">
                            <div class="week-item">
                                <h7>Semana 1-2: Adaptação</h7>
                                <ul>
                                    <li>Caminhada leve: 10 min, 3x/semana</li>
                                    <li>Alongamento: 5 min diários</li>
                                    <li>Exercícios de respiração: 5 min/dia</li>
                                </ul>
                            </div>
                            <div class="week-item">
                                <h7>Semana 3-4: Progressão</h7>
                                <ul>
                                    <li>Caminhada: 15 min, 4x/semana</li>
                                    <li>Exercícios de força com peso corporal: 2x/semana</li>
                                    <li>Atividades domésticas ativas</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ` : risco >= 35 ? `
                    <div class="intermediate-program">
                        <h6>Programa Intermediário</h6>
                        <ul>
                            <li><strong>Cardio:</strong> 30 min, 4-5x/semana (caminhada rápida, ciclismo)</li>
                            <li><strong>Força:</strong> 20-30 min, 2-3x/semana</li>
                            <li><strong>Flexibilidade:</strong> 10-15 min, 3x/semana</li>
                            <li><strong>Atividades recreativas:</strong> Dança, esportes, jardinagem</li>
                        </ul>
                    </div>
                ` : `
                    <div class="advanced-program">
                        <h6>Programa de Manutenção/Otimização</h6>
                        <ul>
                            <li><strong>Variedade:</strong> Combine diferentes modalidades</li>
                            <li><strong>Intensidade:</strong> Inclua treinos de alta intensidade (HIIT)</li>
                            <li><strong>Desafios:</strong> Estabeleça metas progressivas</li>
                            <li><strong>Recuperação:</strong> Inclua dias de descanso ativo</li>
                        </ul>
                    </div>
                `}
            </div>
            
            <div class="tips-grid">
                <div class="tip-card">
                    <h5>🚶‍♂️ Atividade Incidental</h5>
                    <p>Use escadas, estacione longe, desça um ponto antes no transporte público. Pequenas mudanças somam muito!</p>
                </div>
                <div class="tip-card">
                    <h5>📱 Tecnologia Aliada</h5>
                    <p>Use apps de contagem de passos, lembretes para se mover, ou vídeos de exercício em casa.</p>
                </div>
                <div class="tip-card">
                    <h5>👥 Apoio Social</h5>
                    <p>Exercite-se com amigos, família ou grupos. O apoio social aumenta a aderência em 40%.</p>
                </div>
            </div>
            
            <div class="health-benefits">
                <h5>💪 Benefícios de Reduzir o Sedentarismo</h5>
                <div class="benefits-grid">
                    <div class="benefit-item">
                        <h6>❤️ Cardiovascular</h6>
                        <p>Redução de 20-30% no risco de doenças cardíacas</p>
                    </div>
                    <div class="benefit-item">
                        <h6>🧠 Mental</h6>
                        <p>Melhora do humor, redução da ansiedade e depressão</p>
                    </div>
                    <div class="benefit-item">
                        <h6>💀 Óssea</h6>
                        <p>Fortalecimento dos ossos, prevenção da osteoporose</p>
                    </div>
                    <div class="benefit-item">
                        <h6>⚖️ Peso</h6>
                        <p>Controle do peso corporal e composição corporal</p>
                    </div>
                </div>
            </div>
            
            ${risco >= 50 ? `
                <div class="warning-box">
                    <h4>Riscos do Sedentarismo Prolongado</h4>
                    <p>Sedentarismo está associado a aumento de 20-30% no risco de morte prematura, diabetes tipo 2, doenças cardiovasculares e alguns tipos de câncer. Pequenas mudanças já trazem benefícios significativos!</p>
                </div>
            ` : ''}
            
            <div class="motivation-section">
                <h5>🎯 Metas SMART para as Próximas 4 Semanas</h5>
                <ul>
                    <li><strong>Específica:</strong> ${deficitAtividade > 0 ? `Aumentar atividade física em ${Math.round(deficitAtividade/4)} min/semana` : 'Manter nível atual de atividade'}</li>
                    <li><strong>Mensurável:</strong> Registrar minutos de atividade diariamente</li>
                    <li><strong>Atingível:</strong> Começar com pequenos incrementos</li>
                    <li><strong>Relevante:</strong> Focar em atividades prazerosas</li>
                    <li><strong>Temporal:</strong> Reavaliar progresso em 4 semanas</li>
                </ul>
            </div>
        </div>
    `;
}

// ===== CONSUMO DE CAFEÍNA CALCULATOR =====
document.getElementById('consumo-cafeina-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('caf-peso').value);
    const idade = parseInt(document.getElementById('caf-idade').value);
    const condicaoEspecial = document.getElementById('caf-gestante').value;
    const sensibilidade = document.getElementById('caf-sensibilidade').value;
    
    // Updated caffeine content values (more accurate ranges)
    const cafe = parseInt(document.getElementById('caf-cafe').value) * 95; // 80-120mg average
    const espresso = parseInt(document.getElementById('caf-espresso').value) * 63; // 47-75mg average
    const chaPreto = parseInt(document.getElementById('caf-cha-preto').value) * 47; // 40-55mg average
    const chaVerde = parseInt(document.getElementById('caf-cha-verde').value) * 28; // 25-35mg average
    const refrigerante = parseInt(document.getElementById('caf-refrigerante').value) * 34; // 30-40mg average
    const energetico = parseInt(document.getElementById('caf-energetico').value) * 80; // 50-300mg (using conservative average)
    const chocolate = parseInt(document.getElementById('caf-chocolate').value) * 12; // 5-25mg average
    
    const consumoAtual = cafe + espresso + chaPreto + chaVerde + refrigerante + energetico + chocolate;
    
    // Calculate safe limit
    let limiteSeguro;
    
    // Base limit: 400mg for healthy adults
    if (idade < 18) {
        limiteSeguro = Math.min(100, peso * 2.5); // 2.5mg/kg for adolescents, max 100mg
    } else {
        limiteSeguro = 400; // Standard adult limit
    }
    
    // Adjust for special conditions
    switch (condicaoEspecial) {
        case 'gestante':
        case 'lactante':
            limiteSeguro = 200;
            break;
        case 'hipertensao':
        case 'ansiedade':
        case 'insonia':
            limiteSeguro = 200;
            break;
    }
    
    // Adjust for sensitivity
    switch (sensibilidade) {
        case 'alta':
            limiteSeguro *= 0.5;
            break;
        case 'baixa':
            limiteSeguro *= 1.2;
            break;
    }
    
    limiteSeguro = Math.round(limiteSeguro);
    
    // Calculate percentage and status
    const percentual = (consumoAtual / limiteSeguro) * 100;
    let status, cor;
    
    if (percentual <= 50) {
        status = 'Seguro';
        cor = '#10b981';
    } else if (percentual <= 80) {
        status = 'Moderado';
        cor = '#f59e0b';
    } else if (percentual <= 100) {
        status = 'Limite';
        cor = '#ef4444';
    } else {
        status = 'Excessivo';
        cor = '#dc2626';
    }
    
    // Update results
    document.getElementById('caf-consumo-atual').textContent = consumoAtual;
    document.getElementById('caf-limite-seguro').textContent = limiteSeguro;
    document.getElementById('caf-status').textContent = status;
    document.getElementById('caf-percentual').textContent = formatNumber(percentual, 0);
    
    // Set color for status
    const statusElement = document.getElementById('caf-status');
    statusElement.style.color = cor;
    
    // Generate interpretation
    let interpretacao;
    if (percentual <= 50) {
        interpretacao = 'Seu consumo de cafeína está em níveis seguros. Continue monitorando para manter o equilíbrio.';
    } else if (percentual <= 80) {
        interpretacao = 'Seu consumo está moderado. Considere reduzir gradualmente para evitar dependência.';
    } else if (percentual <= 100) {
        interpretacao = 'Você está no limite seguro. Evite aumentar o consumo e monitore possíveis efeitos colaterais.';
    } else {
        interpretacao = 'Seu consumo está excessivo e pode causar efeitos adversos. Recomenda-se reduzir gradualmente.';
    }
    
    document.getElementById('caf-interpretacao').innerHTML = `<p>${interpretacao}</p>`;
    
    // Generate enhanced tips with gradual reduction plan
    const dicas = document.getElementById('caf-dicas');
    let dicasHTML = '';
    
    if (percentual > 100) {
        const excessoMg = consumoAtual - limiteSeguro;
        const reducaoSemanal = Math.ceil(excessoMg / 4); // Reduce over 4 weeks
        dicasHTML += `
            <div class="dica-item critical">
                <i class="fas fa-exclamation-triangle"></i>
                <span><strong>Plano de Redução Gradual:</strong> Reduza ${reducaoSemanal}mg por semana durante 4 semanas para evitar sintomas de abstinência (dor de cabeça, irritabilidade).</span>
            </div>
            <div class="dica-item critical">
                <i class="fas fa-calendar-alt"></i>
                <span><strong>Cronograma:</strong> Semana 1: ${consumoAtual - reducaoSemanal}mg, Semana 2: ${consumoAtual - (reducaoSemanal * 2)}mg, Semana 3: ${consumoAtual - (reducaoSemanal * 3)}mg, Semana 4: ${limiteSeguro}mg.</span>
            </div>
        `;
    } else if (percentual > 80) {
        dicasHTML += `
            <div class="dica-item warning">
                <i class="fas fa-chart-line"></i>
                <span><strong>Monitoramento:</strong> Você está próximo do limite. Monitore sintomas como ansiedade, insônia ou palpitações e considere reduzir gradualmente.</span>
            </div>
        `;
    }
    
    dicasHTML += `
        <div class="dica-item">
            <i class="fas fa-clock"></i>
            <span><strong>Timing Ideal:</strong> Evite cafeína após 14h para não prejudicar o sono. O pico de efeito ocorre 30-60 min após o consumo.</span>
        </div>
        <div class="dica-item">
            <i class="fas fa-tint"></i>
            <span><strong>Hidratação:</strong> Beba 2 copos de água para cada bebida com cafeína, pois ela tem efeito diurético.</span>
        </div>
        <div class="dica-item">
            <i class="fas fa-utensils"></i>
            <span><strong>Com Alimentos:</strong> Consuma cafeína com alimentos para reduzir irritação gástrica e absorção muito rápida.</span>
        </div>
    `;
    
    // Healthy alternatives
    dicasHTML += `
        <div class="dica-item alternatives">
            <i class="fas fa-leaf"></i>
            <span><strong>Alternativas Saudáveis:</strong> Chá verde (menos cafeína), chá de ervas, água com limão, ou descafeinados para reduzir o consumo.</span>
        </div>
        <div class="dica-item alternatives">
            <i class="fas fa-battery-full"></i>
            <span><strong>Energia Natural:</strong> Exercícios leves, exposição à luz solar, respiração profunda ou uma caminhada de 10 minutos podem aumentar a energia naturalmente.</span>
        </div>
    `;
    
    // Withdrawal symptoms warning
    if (consumoAtual > 200) {
        dicasHTML += `
            <div class="dica-item warning">
                <i class="fas fa-info-circle"></i>
                <span><strong>Sintomas de Abstinência:</strong> Se reduzir muito rapidamente, pode sentir dor de cabeça, fadiga, irritabilidade. Reduza gradualmente e mantenha-se hidratado.</span>
            </div>
        `;
    }
    
    dicasHTML += `
        <div class="dica-item">
            <i class="fas fa-chart-line"></i>
            <span><strong>Monitoramento:</strong> Observe sintomas como ansiedade, insônia, palpitações, tremores ou irritabilidade que podem indicar excesso de cafeína.</span>
        </div>
    `;
    
    dicas.innerHTML = dicasHTML;
    
    showResult('consumo-cafeina');
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Check if there's a selected category from localStorage
    const selectedCategory = localStorage.getItem('selectedCategory');
    if (selectedCategory === 'bem-estar') {
        // Clear the selection
        localStorage.removeItem('selectedCategory');
    }
    
    // Show first calculator by default
    showCalculator('qualidade-sono');
    
    // Add CSS for bem-estar specific elements
    const style = document.createElement('style');
    style.textContent = `
        .form-section {
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: var(--gray-50);
            border-radius: var(--radius-lg);
        }
        
        .form-section h4 {
            margin-bottom: 1rem;
            color: var(--dark-color);
            font-weight: 600;
        }
        
        .checkbox-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 0.75rem;
        }
        
        .checkbox-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            background: var(--white-color);
            border-radius: var(--radius-md);
            border: 1px solid var(--gray-200);
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .checkbox-item:hover {
            border-color: var(--primary-color);
            background: var(--primary-50);
        }
        
        .checkbox-item input[type="checkbox"] {
            margin: 0;
            transform: scale(1.2);
        }
        
        .cafeina-items {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .cafeina-item {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 1rem;
            align-items: center;
            padding: 1rem;
            background: var(--white-color);
            border-radius: var(--radius-md);
            border: 1px solid var(--gray-200);
        }
        
        .cafeina-item label {
            font-weight: 500;
            color: var(--dark-color);
        }
        
        .cafeina-item input {
            text-align: center;
        }
        
        .cafeina-mg {
            font-size: 0.875rem;
            color: var(--gray-500);
            text-align: right;
        }
        
        .rec-item, .estrategia-item, .dica-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            background: var(--white-color);
            border-radius: var(--radius-md);
            border: 1px solid var(--gray-200);
            margin-bottom: 0.5rem;
        }
        
        .rec-item i, .estrategia-item i, .dica-item i {
            color: var(--secondary-color);
            font-size: 1.25rem;
            min-width: 20px;
        }
        
        .rec-item.excellent {
            background: #f0f9ff;
            border-color: var(--secondary-color);
        }
        
        .rec-item.excellent i {
            color: #fbbf24;
        }
        
        .rec-item.priority {
            background: #fef2f2;
            border-color: #ef4444;
        }
        
        .rec-item.priority i {
            color: #ef4444;
        }
        
        .stress-interpretation {
            padding: 1.5rem;
            border-radius: var(--radius-lg);
            margin: 1rem 0;
        }
        
        .stress-interpretation.excellent {
            background: #f0f9ff;
            border: 2px solid var(--secondary-color);
        }
        
        .stress-interpretation.moderate {
            background: #fffbeb;
            border: 2px solid var(--accent-color);
        }
        
        .stress-interpretation.high {
            background: #fef2f2;
            border: 2px solid #ef4444;
        }
        
        .stress-interpretation.critical {
            background: #fef2f2;
            border: 2px solid #dc2626;
        }
        
        .stress-interpretation h4 {
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .estrategia-item.maintenance {
            background: #f0f9ff;
            border-color: var(--secondary-color);
        }
        
        .estrategia-item.immediate {
            background: #fef3c7;
            border-color: var(--accent-color);
        }
        
        .estrategia-item.physical {
            background: #fef2f2;
            border-color: #f87171;
        }
        
        .estrategia-item.emotional {
            background: #f3e8ff;
            border-color: #c084fc;
        }
        
        .estrategia-item.behavioral {
            background: #ecfdf5;
            border-color: #6ee7b7;
        }
        
        .estrategia-item.work {
            background: #f1f5f9;
            border-color: #64748b;
        }
        
        .estrategia-item.personal {
            background: #fdf4ff;
            border-color: #e879f9;
        }
        
        .estrategia-item.general {
            background: var(--white-color);
            border-color: var(--gray-200);
        }
        
        .estrategia-item.critical {
            background: #fef2f2;
            border-color: #dc2626;
            animation: pulse 2s infinite;
        }
        
        .dica-item.critical {
            background: #fef2f2;
            border-color: #dc2626;
        }
        
        .dica-item.warning {
            background: #fffbeb;
            border-color: var(--accent-color);
        }
        
        .dica-item.alternatives {
            background: #f0fdf4;
            border-color: var(--secondary-color);
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }
        
        @media (max-width: 768px) {
            .checkbox-grid {
                grid-template-columns: 1fr;
            }
            
            .cafeina-item {
                grid-template-columns: 1fr;
                text-align: center;
                gap: 0.5rem;
            }
            
            .cafeina-mg {
                text-align: center;
            }
        }
    `;
    document.head.appendChild(style);
});

