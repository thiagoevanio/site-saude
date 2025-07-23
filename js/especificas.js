// ===== CALCULADORAS ESPECÍFICAS =====

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

function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
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
        case 'gestacional':
            const gestSemanas = document.getElementById('gest-semanas-atual').textContent;
            const gestDpp = document.getElementById('gest-dpp').textContent;
            resultText = `Gestação: ${gestSemanas} semanas\\nData provável do parto: ${gestDpp}`;
            break;
        case 'ovulacao':
            const ovData = document.getElementById('ov-data-ovulacao').textContent;
            const ovPeriodo = document.getElementById('ov-periodo-fertil').textContent;
            resultText = `Ovulação: ${ovData}\\nPeríodo fértil: ${ovPeriodo}`;
            break;
        case 'imc-infantil':
            const imcInfValor = document.getElementById('imc-inf-valor').textContent;
            const imcInfPercentil = document.getElementById('imc-inf-percentil').textContent;
            const imcInfClass = document.getElementById('imc-inf-classificacao').textContent;
            resultText = `IMC: ${imcInfValor} kg/m²\\nPercentil: ${imcInfPercentil}%\\nClassificação: ${imcInfClass}`;
            break;
        case 'calorias-faixa-etaria':
            const calTotal = document.getElementById('cal-calorias-total').textContent;
            const calTmb = document.getElementById('cal-tmb').textContent;
            resultText = `Calorias diárias: ${calTotal} kcal\\nTMB: ${calTmb} kcal`;
            break;
    }
    
    if (resultText && window.calculatorUtils) {
        window.calculatorUtils.copyToClipboard(resultText);
    }
}

// ===== DYNAMIC FORM CONTROLS =====
// Gestacional - Show/hide fields based on method
document.getElementById('gest-metodo').addEventListener('change', function() {
    const metodo = this.value;
    const dumGroup = document.getElementById('gest-dum-group');
    const concepcaoGroup = document.getElementById('gest-concepcao-group');
    const semanasGroup = document.getElementById('gest-semanas-group');
    
    // Hide all optional fields first
    dumGroup.style.display = 'none';
    concepcaoGroup.style.display = 'none';
    semanasGroup.style.display = 'none';
    
    // Clear required attributes
    document.getElementById('gest-dum').required = false;
    document.getElementById('gest-concepcao').required = false;
    document.getElementById('gest-semanas').required = false;
    
    // Show relevant fields based on method
    switch (metodo) {
        case 'dum':
            dumGroup.style.display = 'block';
            document.getElementById('gest-dum').required = true;
            break;
        case 'concepcao':
            concepcaoGroup.style.display = 'block';
            document.getElementById('gest-concepcao').required = true;
            break;
        case 'semanas':
            semanasGroup.style.display = 'block';
            document.getElementById('gest-semanas').required = true;
            break;
    }
});

// ===== DATE CALCULATION FUNCTIONS =====
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function diffInDays(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

function diffInWeeks(date1, date2) {
    return Math.floor(diffInDays(date1, date2) / 7);
}

// ===== GESTACIONAL CALCULATOR =====
document.getElementById('gestacional-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const metodo = document.getElementById('gest-metodo').value;
    const hoje = new Date();
    let inicioGestacao, semanas, dias;
    
    switch (metodo) {
        case 'dum':
            const dum = new Date(document.getElementById('gest-dum').value);
            inicioGestacao = dum;
            const diasGestacao = diffInDays(dum, hoje);
            semanas = Math.floor(diasGestacao / 7);
            dias = diasGestacao % 7;
            break;
            
        case 'concepcao':
            const concepcao = new Date(document.getElementById('gest-concepcao').value);
            // Add 14 days to conception date to get LMP equivalent
            inicioGestacao = addDays(concepcao, -14);
            const diasConcepcao = diffInDays(inicioGestacao, hoje);
            semanas = Math.floor(diasConcepcao / 7);
            dias = diasConcepcao % 7;
            break;
            
        case 'semanas':
            semanas = parseInt(document.getElementById('gest-semanas').value);
            dias = parseInt(document.getElementById('gest-dias').value) || 0;
            const totalDias = (semanas * 7) + dias;
            inicioGestacao = addDays(hoje, -totalDias);
            break;
    }
    
    // Calculate due date (280 days from LMP)
    const dpp = addDays(inicioGestacao, 280);
    
    // Determine trimester
    let trimestre;
    if (semanas < 13) {
        trimestre = '1º Trimestre';
    } else if (semanas < 27) {
        trimestre = '2º Trimestre';
    } else {
        trimestre = '3º Trimestre';
    }
    
    // Update results
    document.getElementById('gest-semanas-atual').textContent = `${semanas}s ${dias}d`;
    document.getElementById('gest-dpp').textContent = formatDate(dpp);
    document.getElementById('gest-trimestre').textContent = trimestre;
    
    // Create milestones
    const marcos = document.getElementById('gest-marcos');
    const milestones = [
        { week: 4, title: 'Implantação', description: 'Embrião se implanta no útero' },
        { week: 8, title: 'Fim do período embrionário', description: 'Órgãos principais formados' },
        { week: 12, title: 'Fim do 1º trimestre', description: 'Risco de aborto diminui significativamente' },
        { week: 16, title: 'Sexo pode ser determinado', description: 'Ultrassom pode revelar o sexo' },
        { week: 20, title: 'Ultrassom morfológico', description: 'Avaliação detalhada da anatomia fetal' },
        { week: 24, title: 'Viabilidade fetal', description: 'Bebê pode sobreviver fora do útero com cuidados intensivos' },
        { week: 28, title: 'Início do 3º trimestre', description: 'Desenvolvimento acelerado do cérebro' },
        { week: 32, title: 'Pulmões em desenvolvimento', description: 'Surfactante pulmonar em produção' },
        { week: 36, title: 'Bebê considerado a termo precoce', description: 'Órgãos quase completamente desenvolvidos' },
        { week: 40, title: 'Data provável do parto', description: 'Gestação a termo completo' }
    ];
    
    marcos.innerHTML = milestones
        .filter(milestone => milestone.week <= 42)
        .map(milestone => {
            const isPast = semanas >= milestone.week;
            const isCurrent = semanas === milestone.week;
            const statusClass = isPast ? 'past' : isCurrent ? 'current' : 'future';
            
            return `
                <div class="marco-item ${statusClass}">
                    <div class="marco-week">${milestone.week}ª semana</div>
                    <div class="marco-content">
                        <h5 class="marco-title">${milestone.title}</h5>
                        <p class="marco-description">${milestone.description}</p>
                    </div>
                    <div class="marco-status">
                        <i class="fas ${isPast ? 'fa-check-circle' : isCurrent ? 'fa-clock' : 'fa-circle'}"></i>
                    </div>
                </div>
            `;
        }).join('');
    
    showResult('gestacional');
});

// ===== OVULAÇÃO CALCULATOR =====
document.getElementById('ovulacao-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const dum = new Date(document.getElementById('ov-dum').value);
    const ciclo = parseInt(document.getElementById('ov-ciclo').value);
    const faseLutea = parseInt(document.getElementById('ov-fase-lutea').value);
    const objetivo = document.getElementById('ov-objetivo').value;
    
    // Calculate ovulation date
    const ovulacao = addDays(dum, ciclo - faseLutea);
    
    // Calculate fertile window (5 days before + ovulation day + 1 day after)
    const inicioFertil = addDays(ovulacao, -5);
    const fimFertil = addDays(ovulacao, 1);
    
    // Calculate next menstruation
    const proximaMenstruacao = addDays(dum, ciclo);
    
    // Update results
    document.getElementById('ov-data-ovulacao').textContent = formatDate(ovulacao);
    document.getElementById('ov-periodo-fertil').textContent = `${formatDate(inicioFertil)} a ${formatDate(fimFertil)}`;
    document.getElementById('ov-proxima-menstruacao').textContent = formatDate(proximaMenstruacao);
    
    // Create calendar
    const calendario = document.getElementById('ov-calendario');
    const hoje = new Date();
    const startDate = new Date(dum);
    const endDate = addDays(proximaMenstruacao, 7);
    
    let calendarHTML = '<div class="ov-calendar-grid">';
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const daysDiff = diffInDays(dum, d);
        let dayClass = 'calendar-day';
        let dayLabel = '';
        
        if (d.getTime() === dum.getTime()) {
            dayClass += ' menstruation';
            dayLabel = 'M';
        } else if (d.getTime() === ovulacao.getTime()) {
            dayClass += ' ovulation';
            dayLabel = 'O';
        } else if (d >= inicioFertil && d <= fimFertil) {
            dayClass += ' fertile';
            dayLabel = 'F';
        } else if (d.getTime() === proximaMenstruacao.getTime()) {
            dayClass += ' next-menstruation';
            dayLabel = 'M';
        }
        
        if (d.toDateString() === hoje.toDateString()) {
            dayClass += ' today';
        }
        
        calendarHTML += `
            <div class="${dayClass}" title="${formatDate(d)}">
                <span class="day-number">${d.getDate()}</span>
                <span class="day-label">${dayLabel}</span>
            </div>
        `;
    }
    
    calendarHTML += '</div>';
    
    // Add legend
    calendarHTML += `
        <div class="ov-legend">
            <div class="legend-item">
                <span class="legend-color menstruation"></span>
                <span>Menstruação</span>
            </div>
            <div class="legend-item">
                <span class="legend-color fertile"></span>
                <span>Período fértil</span>
            </div>
            <div class="legend-item">
                <span class="legend-color ovulation"></span>
                <span>Ovulação</span>
            </div>
            <div class="legend-item">
                <span class="legend-color today"></span>
                <span>Hoje</span>
            </div>
        </div>
    `;
    
    calendario.innerHTML = calendarHTML;
    
    // Interpretation
    let interpretacao;
    if (objetivo === 'engravidar') {
        interpretacao = `Para aumentar as chances de engravidar, tenha relações sexuais durante o período fértil, especialmente nos 2-3 dias antes da ovulação e no dia da ovulação.`;
    } else {
        interpretacao = `Para evitar gravidez pelo método natural, evite relações desprotegidas durante todo o período fértil. Lembre-se que este método não é 100% eficaz.`;
    }
    
    document.getElementById('ov-interpretacao').innerHTML = `<p>${interpretacao}</p>`;
    
    showResult('ovulacao');
});

// ===== IMC INFANTIL CALCULATOR =====
document.getElementById('imc-infantil-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('imc-inf-peso').value);
    const altura = parseFloat(document.getElementById('imc-inf-altura').value) / 100; // Convert to meters
    const idade = parseInt(document.getElementById('imc-inf-idade').value);
    const sexo = document.getElementById('imc-inf-sexo').value;
    
    // Calculate BMI
    const imc = peso / (altura * altura);
    
    // Calculate percentile (simplified approximation)
    const percentil = calculateChildBMIPercentile(imc, idade, sexo);
    
    // Determine classification
    let classificacao;
    if (percentil < 5) {
        classificacao = 'Abaixo do peso';
    } else if (percentil < 85) {
        classificacao = 'Peso normal';
    } else if (percentil < 95) {
        classificacao = 'Sobrepeso';
    } else {
        classificacao = 'Obesidade';
    }
    
    // Update results
    document.getElementById('imc-inf-valor').textContent = formatNumber(imc, 1);
    document.getElementById('imc-inf-percentil').textContent = Math.round(percentil);
    document.getElementById('imc-inf-classificacao').textContent = classificacao;
    
    showResult('imc-infantil');
});

function calculateChildBMIPercentile(bmi, age, gender) {
    // Simplified percentile calculation based on CDC growth charts
    // This is an approximation - real calculation would use complex statistical models
    
    let p50; // 50th percentile BMI for age and gender
    
    if (gender === 'masculino') {
        if (age <= 5) p50 = 15.5 + (age - 2) * 0.2;
        else if (age <= 10) p50 = 16.5 + (age - 5) * 0.3;
        else if (age <= 15) p50 = 18.0 + (age - 10) * 0.8;
        else p50 = 22.0 + (age - 15) * 0.5;
    } else {
        if (age <= 5) p50 = 15.2 + (age - 2) * 0.2;
        else if (age <= 10) p50 = 16.0 + (age - 5) * 0.3;
        else if (age <= 15) p50 = 17.5 + (age - 10) * 0.7;
        else p50 = 21.0 + (age - 15) * 0.4;
    }
    
    // Simplified percentile calculation
    const zScore = (bmi - p50) / (p50 * 0.15); // Approximate standard deviation
    
    // Convert z-score to percentile (simplified)
    if (zScore <= -2) return 2;
    if (zScore <= -1.5) return 7;
    if (zScore <= -1) return 16;
    if (zScore <= -0.5) return 31;
    if (zScore <= 0) return 50;
    if (zScore <= 0.5) return 69;
    if (zScore <= 1) return 84;
    if (zScore <= 1.5) return 93;
    if (zScore <= 2) return 98;
    return 99;
}

// ===== CALORIAS POR FAIXA ETÁRIA CALCULATOR =====
document.getElementById('calorias-faixa-etaria-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const idade = parseInt(document.getElementById('cal-idade').value);
    const sexo = document.getElementById('cal-sexo').value;
    const peso = parseFloat(document.getElementById('cal-peso').value);
    const altura = parseFloat(document.getElementById('cal-altura').value);
    const atividade = parseFloat(document.getElementById('cal-atividade').value);
    const condicoes = document.getElementById('cal-condicoes').value;
    
    let tmb;
    let faixaEtaria;
    
    // Determine age group and calculate BMR
    if (idade < 3) {
        faixaEtaria = 'Primeira infância';
        // For very young children, use simplified calculation
        tmb = sexo === 'masculino' ? 
            (60.9 * peso) - 54 : 
            (61.0 * peso) - 51;
    } else if (idade < 10) {
        faixaEtaria = 'Infância';
        tmb = sexo === 'masculino' ? 
            (22.7 * peso) + (495 * altura / 100) + 62 : 
            (22.5 * peso) + (499 * altura / 100) + 63;
    } else if (idade < 18) {
        faixaEtaria = 'Adolescência';
        tmb = sexo === 'masculino' ? 
            (17.5 * peso) + (651 * altura / 100) + 77 : 
            (12.2 * peso) + (749 * altura / 100) + 56;
    } else if (idade < 30) {
        faixaEtaria = 'Adulto jovem';
        tmb = sexo === 'masculino' ? 
            (15.3 * peso) + (679 * altura / 100) + 151 : 
            (14.7 * peso) + (496 * altura / 100) + 8;
    } else if (idade < 60) {
        faixaEtaria = 'Adulto';
        tmb = sexo === 'masculino' ? 
            (11.6 * peso) + (879 * altura / 100) - 10 : 
            (8.7 * peso) + (829 * altura / 100) - 183;
    } else {
        faixaEtaria = 'Idoso';
        tmb = sexo === 'masculino' ? 
            (13.5 * peso) + (487 * altura / 100) + 20 : 
            (10.5 * peso) + (596 * altura / 100) + 49;
    }
    
    // Calculate total calories
    let caloriasTotal = tmb * atividade;
    
    // Adjust for special conditions
    switch (condicoes) {
        case 'crescimento':
            caloriasTotal *= 1.2;
            break;
        case 'lactacao':
            caloriasTotal += 500;
            break;
        case 'gestacao':
            if (idade >= 14) {
                caloriasTotal += 300; // Second and third trimester
            }
            break;
        case 'recuperacao':
            caloriasTotal *= 1.3;
            break;
        case 'idoso-fragil':
            caloriasTotal *= 0.9;
            break;
    }
    
    // Update results
    document.getElementById('cal-calorias-total').textContent = formatNumber(caloriasTotal, 0);
    document.getElementById('cal-tmb').textContent = formatNumber(tmb, 0);
    document.getElementById('cal-faixa').textContent = faixaEtaria;
    
    // Create recommendations
    const recomendacoes = document.getElementById('cal-recomendacoes');
    let recomendacoesHTML = '';
    
    if (idade < 18) {
        recomendacoesHTML = `
            <div class="rec-item">
                <i class="fas fa-apple-alt"></i>
                <span><strong>Frutas e vegetais:</strong> 5-9 porções por dia</span>
            </div>
            <div class="rec-item">
                <i class="fas fa-bread-slice"></i>
                <span><strong>Carboidratos:</strong> 45-65% das calorias totais</span>
            </div>
            <div class="rec-item">
                <i class="fas fa-drumstick-bite"></i>
                <span><strong>Proteínas:</strong> 1.0-1.2g por kg de peso</span>
            </div>
            <div class="rec-item">
                <i class="fas fa-tint"></i>
                <span><strong>Água:</strong> ${formatNumber(peso * 35, 0)}ml por dia</span>
            </div>
            <div class="rec-item">
                <i class="fas fa-cookie"></i>
                <span><strong>Açúcares:</strong> Máximo 10% das calorias totais</span>
            </div>
        `;
    } else if (idade < 60) {
        recomendacoesHTML = `
            <div class="rec-item">
                <i class="fas fa-drumstick-bite"></i>
                <span><strong>Proteínas:</strong> ${formatNumber(peso * 0.8, 0)}-${formatNumber(peso * 1.2, 0)}g por dia</span>
            </div>
            <div class="rec-item">
                <i class="fas fa-bread-slice"></i>
                <span><strong>Carboidratos:</strong> 45-65% das calorias (${formatNumber(caloriasTotal * 0.45 / 4, 0)}-${formatNumber(caloriasTotal * 0.65 / 4, 0)}g)</span>
            </div>
            <div class="rec-item">
                <i class="fas fa-seedling"></i>
                <span><strong>Gorduras:</strong> 20-35% das calorias (${formatNumber(caloriasTotal * 0.20 / 9, 0)}-${formatNumber(caloriasTotal * 0.35 / 9, 0)}g)</span>
            </div>
            <div class="rec-item">
                <i class="fas fa-leaf"></i>
                <span><strong>Fibras:</strong> ${sexo === 'masculino' ? '38' : '25'}g por dia</span>
            </div>
            <div class="rec-item">
                <i class="fas fa-tint"></i>
                <span><strong>Água:</strong> ${formatNumber(peso * 35, 0)}ml por dia</span>
            </div>
        `;
    } else {
        recomendacoesHTML = `
            <div class="rec-item">
                <i class="fas fa-drumstick-bite"></i>
                <span><strong>Proteínas:</strong> ${formatNumber(peso * 1.0, 0)}-${formatNumber(peso * 1.2, 0)}g por dia (maior necessidade)</span>
            </div>
            <div class="rec-item">
                <i class="fas fa-bone"></i>
                <span><strong>Cálcio:</strong> 1200mg por dia para saúde óssea</span>
            </div>
            <div class="rec-item">
                <i class="fas fa-sun"></i>
                <span><strong>Vitamina D:</strong> 800-1000 UI por dia</span>
            </div>
            <div class="rec-item">
                <i class="fas fa-leaf"></i>
                <span><strong>Fibras:</strong> ${sexo === 'masculino' ? '30' : '21'}g por dia</span>
            </div>
            <div class="rec-item">
                <i class="fas fa-tint"></i>
                <span><strong>Água:</strong> ${formatNumber(peso * 30, 0)}ml por dia (atenção à hidratação)</span>
            </div>
        `;
    }
    
    recomendacoes.innerHTML = recomendacoesHTML;
    
    showResult('calorias-faixa-etaria');
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Check if there's a selected category from localStorage
    const selectedCategory = localStorage.getItem('selectedCategory');
    if (selectedCategory === 'especificas') {
        // Clear the selection
        localStorage.removeItem('selectedCategory');
    }
    
    // Show first calculator by default
    showCalculator('gestacional');
    
    // Add CSS for specific elements
    const style = document.createElement('style');
    style.textContent = `
        .marco-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: var(--white-color);
            border-radius: var(--radius-md);
            border: 1px solid var(--gray-200);
            margin-bottom: 0.75rem;
            transition: all 0.3s ease;
        }
        
        .marco-item.past {
            background: #f0f9ff;
            border-color: var(--secondary-color);
        }
        
        .marco-item.current {
            background: #fef3c7;
            border-color: var(--accent-color);
        }
        
        .marco-week {
            font-weight: 600;
            color: var(--primary-color);
            min-width: 80px;
        }
        
        .marco-content {
            flex: 1;
        }
        
        .marco-title {
            font-weight: 600;
            color: var(--dark-color);
            margin-bottom: 0.25rem;
        }
        
        .marco-description {
            color: var(--gray-600);
            font-size: 0.875rem;
            margin: 0;
        }
        
        .marco-status i {
            font-size: 1.25rem;
        }
        
        .marco-item.past .marco-status i {
            color: var(--secondary-color);
        }
        
        .marco-item.current .marco-status i {
            color: var(--accent-color);
        }
        
        .marco-item.future .marco-status i {
            color: var(--gray-400);
        }
        
        .ov-calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 0.25rem;
            margin-bottom: 1rem;
        }
        
        .calendar-day {
            aspect-ratio: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--gray-200);
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            position: relative;
        }
        
        .calendar-day.menstruation {
            background: #fecaca;
            border-color: #ef4444;
        }
        
        .calendar-day.fertile {
            background: #bbf7d0;
            border-color: var(--secondary-color);
        }
        
        .calendar-day.ovulation {
            background: #fbbf24;
            border-color: var(--accent-color);
            font-weight: 600;
        }
        
        .calendar-day.today {
            box-shadow: 0 0 0 2px var(--primary-color);
        }
        
        .day-number {
            font-weight: 500;
        }
        
        .day-label {
            font-size: 0.625rem;
            font-weight: 600;
        }
        
        .ov-legend {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
        }
        
        .legend-color {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 1px solid var(--gray-300);
        }
        
        .legend-color.menstruation {
            background: #fecaca;
        }
        
        .legend-color.fertile {
            background: #bbf7d0;
        }
        
        .legend-color.ovulation {
            background: #fbbf24;
        }
        
        .legend-color.today {
            background: var(--primary-color);
        }
        
        .imc-inf-interpretacao {
            margin-top: 1rem;
        }
        
        .imc-inf-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem;
            background: var(--white-color);
            border-radius: var(--radius-md);
            border: 1px solid var(--gray-200);
            margin-bottom: 0.5rem;
        }
        
        .imc-inf-range {
            font-weight: 500;
            color: var(--gray-700);
        }
        
        .imc-inf-class {
            font-weight: 600;
            padding: 0.25rem 0.75rem;
            border-radius: var(--radius-sm);
        }
        
        .imc-inf-class.underweight {
            background: #dbeafe;
            color: #1e40af;
        }
        
        .imc-inf-class.normal {
            background: #dcfce7;
            color: #166534;
        }
        
        .imc-inf-class.overweight {
            background: #fef3c7;
            color: #92400e;
        }
        
        .imc-inf-class.obese {
            background: #fecaca;
            color: #dc2626;
        }
        
        .rec-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            background: var(--white-color);
            border-radius: var(--radius-md);
            border: 1px solid var(--gray-200);
            margin-bottom: 0.5rem;
        }
        
        .rec-item i {
            color: var(--secondary-color);
            font-size: 1.25rem;
            min-width: 20px;
        }
        
        @media (max-width: 768px) {
            .marco-item {
                flex-direction: column;
                text-align: center;
                gap: 0.5rem;
            }
            
            .ov-calendar-grid {
                grid-template-columns: repeat(7, 1fr);
                gap: 0.125rem;
            }
            
            .calendar-day {
                font-size: 0.625rem;
            }
            
            .ov-legend {
                flex-direction: column;
                align-items: center;
            }
            
            .imc-inf-item {
                flex-direction: column;
                gap: 0.5rem;
                text-align: center;
            }
        }
    `;
    document.head.appendChild(style);
});


// ===== CALCULADORA GESTACIONAL MELHORADA =====
document.getElementById('gestacional-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const metodo = document.getElementById('gest-metodo').value;
    const hoje = new Date();
    let dataInicio;
    
    // Determinar data de início baseada no método
    switch (metodo) {
        case 'dum':
            dataInicio = new Date(document.getElementById('gest-dum').value);
            break;
        case 'concepcao':
            const concepcao = new Date(document.getElementById('gest-concepcao').value);
            dataInicio = new Date(concepcao.getTime() - (14 * 24 * 60 * 60 * 1000)); // 14 dias antes
            break;
        case 'semanas':
            const semanasAtual = parseInt(document.getElementById('gest-semanas').value);
            const diasAtual = parseInt(document.getElementById('gest-dias').value) || 0;
            const totalDias = (semanasAtual * 7) + diasAtual;
            dataInicio = new Date(hoje.getTime() - (totalDias * 24 * 60 * 60 * 1000));
            break;
    }
    
    // Calcular idade gestacional atual
    const diferencaMs = hoje.getTime() - dataInicio.getTime();
    const totalDiasGestacao = Math.floor(diferencaMs / (24 * 60 * 60 * 1000));
    const semanasCompletas = Math.floor(totalDiasGestacao / 7);
    const diasExtras = totalDiasGestacao % 7;
    
    // Data provável do parto (280 dias após DUM)
    const dpp = new Date(dataInicio.getTime() + (280 * 24 * 60 * 60 * 1000));
    const diasParaParto = Math.ceil((dpp.getTime() - hoje.getTime()) / (24 * 60 * 60 * 1000));
    
    // Determinar trimestre
    let trimestre;
    if (semanasCompletas < 13) {
        trimestre = { numero: 1, nome: "Primeiro Trimestre", periodo: "1ª a 12ª semana" };
    } else if (semanasCompletas < 27) {
        trimestre = { numero: 2, nome: "Segundo Trimestre", periodo: "13ª a 26ª semana" };
    } else {
        trimestre = { numero: 3, nome: "Terceiro Trimestre", periodo: "27ª a 40ª semana" };
    }
    
    document.getElementById('gest-semanas-atual').textContent = `${semanasCompletas}s ${diasExtras}d`;
    document.getElementById('gest-dpp').textContent = formatDate(dpp);
    
    const resultadoDiv = document.getElementById('gestacional-result');
    resultadoDiv.innerHTML = `
        <div class="calculator-result">
            <div class="result-header">
                <div class="icon">🤱</div>
                <h3>Acompanhamento Gestacional</h3>
            </div>
            
            <div class="tips-grid" style="margin-bottom: 2rem;">
                <div class="tip-card">
                    <h5>📅 Idade Gestacional</h5>
                    <div class="result-value" style="margin: 1rem 0;">
                        <span class="number" style="font-size: 1.8rem;">${semanasCompletas}</span>
                        <span class="unit">semanas ${diasExtras}d</span>
                    </div>
                </div>
                <div class="tip-card">
                    <h5>👶 Data Provável do Parto</h5>
                    <div class="result-value" style="margin: 1rem 0;">
                        <span class="number" style="font-size: 1.2rem;">${formatDate(dpp)}</span>
                        <span class="unit">${diasParaParto > 0 ? `em ${diasParaParto} dias` : 'já passou'}</span>
                    </div>
                </div>
            </div>
            
            <div class="result-interpretation good">
                <h4>${trimestre.nome}</h4>
                <p>${trimestre.periodo} - Você está no ${trimestre.numero}º trimestre da gestação.</p>
            </div>
            
            ${gerarRecomendacoesGestacionais(semanasCompletas, trimestre, diasParaParto)}
        </div>
    `;
    
    showResult('gestacional');
});

function gerarRecomendacoesGestacionais(semanas, trimestre, diasParto) {
    const marcos = {
        8: "Formação dos órgãos principais",
        12: "Fim do período crítico de formação",
        16: "Possível descoberta do sexo",
        20: "Ultrassom morfológico",
        24: "Viabilidade fetal",
        28: "Início da maturação pulmonar",
        32: "Ganho de peso acelerado",
        36: "Considerado a termo precoce",
        40: "Termo completo"
    };
    
    const proximoMarco = Object.keys(marcos).find(s => parseInt(s) > semanas);
    
    return `
        <div class="recommendations-section">
            <h4>Desenvolvimento e Cuidados por Trimestre</h4>
            
            <div class="trimester-info">
                ${trimestre.numero === 1 ? `
                    <div class="trimester-card first">
                        <h5>🌱 Primeiro Trimestre (1-12 semanas)</h5>
                        <div class="development">
                            <h6>Desenvolvimento:</h6>
                            <ul>
                                <li>Formação dos órgãos principais</li>
                                <li>Desenvolvimento do sistema nervoso</li>
                                <li>Batimentos cardíacas detectáveis (6ª semana)</li>
                                <li>Membros começam a se formar</li>
                            </ul>
                        </div>
                        <div class="care-tips">
                            <h6>Cuidados Essenciais:</h6>
                            <ul>
                                <li><strong>Ácido Fólico:</strong> 400-600 mcg diários</li>
                                <li><strong>Evitar:</strong> Álcool, cigarro, medicamentos sem prescrição</li>
                                <li><strong>Alimentação:</strong> Pequenas refeições frequentes</li>
                                <li><strong>Hidratação:</strong> 2-3 litros de água por dia</li>
                            </ul>
                        </div>
                    </div>
                ` : trimestre.numero === 2 ? `
                    <div class="trimester-card second">
                        <h5>🌸 Segundo Trimestre (13-26 semanas)</h5>
                        <div class="development">
                            <h6>Desenvolvimento:</h6>
                            <ul>
                                <li>Crescimento acelerado do bebê</li>
                                <li>Movimentos fetais perceptíveis</li>
                                <li>Desenvolvimento dos sentidos</li>
                                <li>Formação das impressões digitais</li>
                            </ul>
                        </div>
                        <div class="care-tips">
                            <h6>Cuidados Essenciais:</h6>
                            <ul>
                                <li><strong>Ferro:</strong> 27mg diários para prevenir anemia</li>
                                <li><strong>Cálcio:</strong> 1000mg diários para ossos</li>
                                <li><strong>Exercícios:</strong> Atividades leves e regulares</li>
                                <li><strong>Ultrassom:</strong> Morfológico entre 18-22 semanas</li>
                            </ul>
                        </div>
                    </div>
                ` : `
                    <div class="trimester-card third">
                        <h5>🌺 Terceiro Trimestre (27-40 semanas)</h5>
                        <div class="development">
                            <h6>Desenvolvimento:</h6>
                            <ul>
                                <li>Maturação dos pulmões</li>
                                <li>Ganho de peso significativo</li>
                                <li>Posicionamento para o parto</li>
                                <li>Desenvolvimento do sistema imunológico</li>
                            </ul>
                        </div>
                        <div class="care-tips">
                            <h6>Cuidados Essenciais:</h6>
                            <ul>
                                <li><strong>Monitoramento:</strong> Consultas mais frequentes</li>
                                <li><strong>Sinais de Trabalho:</strong> Contrações regulares, perda do tampão</li>
                                <li><strong>Preparação:</strong> Curso de gestantes, plano de parto</li>
                                <li><strong>Descanso:</strong> Sono adequado e posição lateral</li>
                            </ul>
                        </div>
                    </div>
                `}
            </div>
            
            <div class="recommendation-item priority-high">
                <h5>📋 Exames e Consultas Recomendadas</h5>
                <ul>
                    <li><strong>Pré-natal:</strong> Mensal até 28 sem, quinzenal até 36 sem, semanal após</li>
                    <li><strong>Ultrassons:</strong> 1º tri (6-11 sem), morfológico (18-22 sem), 3º tri (32-36 sem)</li>
                    <li><strong>Exames laboratoriais:</strong> Hemograma, glicemia, urina a cada trimestre</li>
                    <li><strong>Teste de tolerância:</strong> Glicose entre 24-28 semanas</li>
                </ul>
            </div>
            
            ${proximoMarco ? `
                <div class="recommendation-item priority-medium">
                    <h5>🎯 Próximo Marco (${proximoMarco}ª semana)</h5>
                    <p><strong>${marcos[proximoMarco]}</strong></p>
                    <p>Faltam ${parseInt(proximoMarco) - semanas} semanas para este marco importante do desenvolvimento.</p>
                </div>
            ` : ''}
            
            <div class="tips-grid">
                <div class="tip-card">
                    <h5>🥗 Nutrição</h5>
                    <p>Aumente 300-500 kcal/dia. Priorize proteínas, ferro, cálcio, ácido fólico e ômega-3.</p>
                </div>
                <div class="tip-card">
                    <h5>🏃‍♀️ Exercícios</h5>
                    <p>30 min de atividade moderada na maioria dos dias. Evite esportes de contato e risco de queda.</p>
                </div>
                <div class="tip-card">
                    <h5>😴 Sono</h5>
                    <p>7-9 horas por noite. Use travesseiros para apoio e durma preferencialmente do lado esquerdo.</p>
                </div>
            </div>
            
            ${semanas >= 37 ? `
                <div class="warning-box">
                    <h4>Sinais de Trabalho de Parto</h4>
                    <p>Contrações regulares e dolorosas, perda do tampão mucoso, ruptura da bolsa, diminuição dos movimentos fetais. Procure o hospital se apresentar estes sinais.</p>
                </div>
            ` : semanas < 37 && diasParto < 21 ? `
                <div class="warning-box">
                    <h4>Atenção: Parto Prematuro</h4>
                    <p>Você está próxima do termo. Fique atenta a sinais de trabalho de parto prematuro e mantenha contato próximo com seu obstetra.</p>
                </div>
            ` : ''}
        </div>
    `;
}

// ===== CALCULADORA DE OVULAÇÃO MELHORADA =====
document.getElementById('ovulacao-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const ultimaMenstruacao = new Date(document.getElementById('ov-ultima-menstruacao').value);
    const cicloDias = parseInt(document.getElementById('ov-ciclo-dias').value);
    const faselutea = parseInt(document.getElementById('ov-fase-lutea').value) || 14;
    
    // Calcular ovulação (fase lútea dias antes do próximo ciclo)
    const proximoCiclo = new Date(ultimaMenstruacao.getTime() + (cicloDias * 24 * 60 * 60 * 1000));
    const ovulacao = new Date(proximoCiclo.getTime() - (faselutea * 24 * 60 * 60 * 1000));
    
    // Período fértil (5 dias antes + dia da ovulação + 1 dia depois)
    const inicioFertil = new Date(ovulacao.getTime() - (5 * 24 * 60 * 60 * 1000));
    const fimFertil = new Date(ovulacao.getTime() + (1 * 24 * 60 * 60 * 1000));
    
    // Próximas ovulações (3 ciclos)
    const proximasOvulacoes = [];
    for (let i = 1; i <= 3; i++) {
        const proximaData = new Date(ovulacao.getTime() + (i * cicloDias * 24 * 60 * 60 * 1000));
        proximasOvulacoes.push(proximaData);
    }
    
    document.getElementById('ov-data-ovulacao').textContent = formatDate(ovulacao);
    document.getElementById('ov-periodo-fertil').textContent = `${formatDate(inicioFertil)} a ${formatDate(fimFertil)}`;
    
    const resultadoDiv = document.getElementById('ovulacao-result');
    resultadoDiv.innerHTML = `
        <div class="calculator-result">
            <div class="result-header">
                <div class="icon">🌸</div>
                <h3>Calendário de Ovulação</h3>
            </div>
            
            <div class="tips-grid" style="margin-bottom: 2rem;">
                <div class="tip-card">
                    <h5>🥚 Data da Ovulação</h5>
                    <div class="result-value" style="margin: 1rem 0;">
                        <span class="number" style="font-size: 1.2rem;">${formatDate(ovulacao)}</span>
                        <span class="unit">Dia mais fértil</span>
                    </div>
                </div>
                <div class="tip-card">
                    <h5>💕 Período Fértil</h5>
                    <div class="result-value" style="margin: 1rem 0;">
                        <span class="number" style="font-size: 1rem;">${formatDate(inicioFertil)}</span>
                        <span class="unit">a ${formatDate(fimFertil)}</span>
                    </div>
                </div>
            </div>
            
            <div class="result-interpretation good">
                <h4>Ciclo de ${cicloDias} dias</h4>
                <p>Baseado na última menstruação em ${formatDate(ultimaMenstruacao)} e fase lútea de ${faselutea} dias.</p>
            </div>
            
            ${gerarRecomendacoesOvulacao(ovulacao, inicioFertil, fimFertil, proximasOvulacoes, cicloDias)}
        </div>
    `;
    
    showResult('ovulacao');
});

function gerarRecomendacoesOvulacao(ovulacao, inicioFertil, fimFertil, proximasOvulacoes, cicloDias) {
    const hoje = new Date();
    const diasParaOvulacao = Math.ceil((ovulacao.getTime() - hoje.getTime()) / (24 * 60 * 60 * 1000));
    
    return `
        <div class="recommendations-section">
            <h4>Guia Completo de Fertilidade</h4>
            
            <div class="cycle-phases">
                <div class="phase-card menstrual">
                    <h5>🩸 Fase Menstrual (Dias 1-5)</h5>
                    <ul>
                        <li>Descamação do endométrio</li>
                        <li>Níveis hormonais baixos</li>
                        <li>Fertilidade: Muito baixa</li>
                        <li>Sintomas: Cólicas, sangramento</li>
                    </ul>
                </div>
                
                <div class="phase-card follicular">
                    <h5>🌱 Fase Folicular (Dias 1-${Math.round(cicloDias/2)})</h5>
                    <ul>
                        <li>Desenvolvimento dos folículos</li>
                        <li>Aumento do estrogênio</li>
                        <li>Fertilidade: Baixa a moderada</li>
                        <li>Sintomas: Energia crescente</li>
                    </ul>
                </div>
                
                <div class="phase-card ovulatory">
                    <h5>🥚 Fase Ovulatória (Dias ${Math.round(cicloDias/2)-2}-${Math.round(cicloDias/2)+2})</h5>
                    <ul>
                        <li>Liberação do óvulo</li>
                        <li>Pico de LH e estrogênio</li>
                        <li>Fertilidade: Máxima</li>
                        <li>Sintomas: Muco cervical, libido alta</li>
                    </ul>
                </div>
                
                <div class="phase-card luteal">
                    <h5>🌙 Fase Lútea (Dias ${Math.round(cicloDias/2)+3}-${cicloDias})</h5>
                    <ul>
                        <li>Produção de progesterona</li>
                        <li>Preparação do endométrio</li>
                        <li>Fertilidade: Baixa</li>
                        <li>Sintomas: TPM, retenção líquida</li>
                    </ul>
                </div>
            </div>
            
            <div class="recommendation-item priority-high">
                <h5>🎯 Maximizando as Chances de Concepção</h5>
                <ul>
                    <li><strong>Timing Ideal:</strong> Relações a cada 1-2 dias durante período fértil</li>
                    <li><strong>Melhor Momento:</strong> 2 dias antes da ovulação (maior fertilidade)</li>
                    <li><strong>Frequência:</strong> Não exagere - qualidade > quantidade</li>
                    <li><strong>Posição:</strong> Qualquer posição é eficaz, mitos sobre gravidade são falsos</li>
                </ul>
            </div>
            
            <div class="recommendation-item priority-medium">
                <h5>🔍 Sinais de Ovulação</h5>
                <ul>
                    <li><strong>Muco Cervical:</strong> Transparente, elástico, "clara de ovo"</li>
                    <li><strong>Temperatura Basal:</strong> Aumento de 0,2-0,5°C após ovulação</li>
                    <li><strong>Dor Ovulatória:</strong> Dor leve em um dos lados do abdômen</li>
                    <li><strong>Libido:</strong> Aumento natural do desejo sexual</li>
                </ul>
            </div>
            
            <div class="next-ovulations">
                <h5>📅 Próximas Ovulações Previstas</h5>
                <div class="ovulation-dates">
                    ${proximasOvulacoes.map((data, index) => `
                        <div class="ovulation-date">
                            <span class="cycle-number">Ciclo ${index + 2}</span>
                            <span class="date">${formatDate(data)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="tips-grid">
                <div class="tip-card">
                    <h5>🌡️ Temperatura Basal</h5>
                    <p>Meça sempre no mesmo horário, antes de levantar. Use termômetro específico para maior precisão.</p>
                </div>
                <div class="tip-card">
                    <h5>📱 Apps de Fertilidade</h5>
                    <p>Use aplicativos para rastrear sintomas, mas lembre-se que são estimativas baseadas em médias.</p>
                </div>
                <div class="tip-card">
                    <h5>🧪 Testes de Ovulação</h5>
                    <p>Detectam pico de LH 12-36h antes da ovulação. Mais precisos que cálculos de calendário.</p>
                </div>
            </div>
            
            ${diasParaOvulacao >= 0 && diasParaOvulacao <= 7 ? `
                <div class="fertility-alert">
                    <h5>🚨 Período Fértil Próximo!</h5>
                    <p>Sua ovulação está prevista para ${diasParaOvulacao === 0 ? 'hoje' : `${diasParaOvulacao} dias`}. Este é o momento ideal para tentativas de concepção.</p>
                </div>
            ` : ''}
            
            <div class="general-tips">
                <h5>💡 Dicas Gerais para Fertilidade</h5>
                <ul>
                    <li><strong>Estilo de Vida:</strong> Dieta equilibrada, exercícios moderados, peso saudável</li>
                    <li><strong>Suplementos:</strong> Ácido fólico 400mcg, vitamina D, ômega-3</li>
                    <li><strong>Evitar:</strong> Cigarro, álcool excessivo, estresse crônico</li>
                    <li><strong>Consulta Médica:</strong> Após 6-12 meses tentando sem sucesso</li>
                </ul>
            </div>
        </div>
    `;
}

// ===== CALCULADORA IMC INFANTIL MELHORADA =====
document.getElementById('imc-infantil-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const peso = parseFloat(document.getElementById('imc-inf-peso').value);
    const altura = parseFloat(document.getElementById('imc-inf-altura').value) / 100; // converter para metros
    const idade = parseInt(document.getElementById('imc-inf-idade').value);
    const sexo = document.getElementById('imc-inf-sexo').value;
    
    const imc = peso / (altura * altura);
    
    // Tabelas de percentis simplificadas (baseadas em dados da OMS)
    const percentis = calcularPercentilIMC(imc, idade, sexo);
    
    document.getElementById('imc-inf-valor').textContent = formatNumber(imc, 1);
    document.getElementById('imc-inf-percentil').textContent = percentis.percentil;
    document.getElementById('imc-inf-classificacao').textContent = percentis.classificacao;
    
    const resultadoDiv = document.getElementById('imc-infantil-result');
    resultadoDiv.innerHTML = `
        <div class="calculator-result">
            <div class="result-header">
                <div class="icon">👶</div>
                <h3>IMC Infantil - ${idade} anos</h3>
            </div>
            
            <div class="result-value">
                <span class="number">${formatNumber(imc, 1)}</span>
                <span class="unit">kg/m²</span>
            </div>
            
            <div class="result-interpretation ${percentis.classe}">
                <h4>${percentis.classificacao}</h4>
                <p>Percentil ${percentis.percentil} para ${sexo === 'masculino' ? 'meninos' : 'meninas'} de ${idade} anos</p>
            </div>
            
            ${gerarRecomendacoesIMCInfantil(imc, percentis, idade, sexo, peso, altura)}
        </div>
    `;
    
    showResult('imc-infantil');
});

function calcularPercentilIMC(imc, idade, sexo) {
    // Tabela simplificada de percentis por idade e sexo
    // Em implementação real, usaria tabelas completas da OMS/CDC
    const tabelas = {
        'masculino': {
            2: { p3: 14.7, p15: 15.3, p50: 16.2, p85: 17.3, p97: 18.4 },
            3: { p3: 14.3, p15: 14.8, p50: 15.7, p85: 16.9, p97: 18.2 },
            4: { p3: 14.0, p15: 14.5, p50: 15.3, p85: 16.6, p97: 18.0 },
            5: { p3: 13.8, p15: 14.2, p50: 15.0, p85: 16.5, p97: 18.0 },
            6: { p3: 13.7, p15: 14.1, p50: 15.0, p85: 16.6, p97: 18.4 },
            7: { p3: 13.7, p15: 14.2, p50: 15.2, p85: 16.9, p97: 19.1 },
            8: { p3: 13.8, p15: 14.4, p50: 15.5, p85: 17.5, p97: 20.3 },
            9: { p3: 14.0, p15: 14.7, p50: 16.0, p85: 18.3, p97: 21.8 },
            10: { p3: 14.2, p15: 15.0, p50: 16.4, p85: 19.0, p97: 23.2 }
        },
        'feminino': {
            2: { p3: 14.4, p15: 15.0, p50: 16.0, p85: 17.1, p97: 18.3 },
            3: { p3: 14.1, p15: 14.6, p50: 15.5, p85: 16.7, p97: 18.1 },
            4: { p3: 13.8, p15: 14.3, p50: 15.2, p85: 16.5, p97: 18.2 },
            5: { p3: 13.6, p15: 14.1, p50: 15.0, p85: 16.5, p97: 18.5 },
            6: { p3: 13.5, p15: 14.0, p50: 15.0, p85: 16.7, p97: 19.1 },
            7: { p3: 13.5, p15: 14.1, p50: 15.2, p85: 17.1, p97: 19.9 },
            8: { p3: 13.6, p15: 14.3, p50: 15.6, p85: 17.7, p97: 21.0 },
            9: { p3: 13.8, p15: 14.6, p50: 16.1, p85: 18.5, p97: 22.4 },
            10: { p3: 14.0, p15: 15.0, p50: 16.7, p85: 19.4, p97: 24.0 }
        }
    };
    
    const tabela = tabelas[sexo][idade] || tabelas[sexo][10]; // usar 10 anos como fallback
    
    let percentil, classificacao, classe;
    
    if (imc < tabela.p3) {
        percentil = "< 3";
        classificacao = "Baixo peso";
        classe = "poor";
    } else if (imc < tabela.p15) {
        percentil = "3-15";
        classificacao = "Baixo peso";
        classe = "average";
    } else if (imc < tabela.p85) {
        percentil = "15-85";
        classificacao = "Peso normal";
        classe = "excellent";
    } else if (imc < tabela.p97) {
        percentil = "85-97";
        classificacao = "Sobrepeso";
        classe = "average";
    } else {
        percentil = "> 97";
        classificacao = "Obesidade";
        classe = "poor";
    }
    
    return { percentil, classificacao, classe };
}

function gerarRecomendacoesIMCInfantil(imc, percentis, idade, sexo, peso, altura) {
    const alturaM = altura;
    const pesoIdealMin = 15.0 * alturaM * alturaM; // Aproximação para percentil 15
    const pesoIdealMax = 17.0 * alturaM * alturaM; // Aproximação para percentil 85
    
    return `
        <div class="recommendations-section">
            <h4>Orientações para Desenvolvimento Saudável</h4>
            
            <div class="child-growth-info">
                <div class="growth-card">
                    <h5>📊 Interpretação dos Percentis</h5>
                    <ul>
                        <li><strong>< 3%:</strong> Baixo peso - acompanhamento médico necessário</li>
                        <li><strong>3-15%:</strong> Baixo peso - atenção à alimentação</li>
                        <li><strong>15-85%:</strong> Peso normal - manter hábitos saudáveis</li>
                        <li><strong>85-97%:</strong> Sobrepeso - mudanças no estilo de vida</li>
                        <li><strong>> 97%:</strong> Obesidade - intervenção médica recomendada</li>
                    </ul>
                </div>
            </div>
            
            <div class="recommendation-item priority-high">
                <h5>🍎 Alimentação Saudável por Idade</h5>
                ${idade <= 3 ? `
                    <ul>
                        <li><strong>Leite:</strong> 500-600ml por dia (materno ou fórmula)</li>
                        <li><strong>Frutas:</strong> 2-3 porções pequenas por dia</li>
                        <li><strong>Vegetais:</strong> Oferecer variedade, mesmo se recusar</li>
                        <li><strong>Proteínas:</strong> Carnes, ovos, leguminosas em pequenas porções</li>
                    </ul>
                ` : idade <= 6 ? `
                    <ul>
                        <li><strong>Refeições:</strong> 3 principais + 2 lanches saudáveis</li>
                        <li><strong>Variedade:</strong> Todos os grupos alimentares</li>
                        <li><strong>Porções:</strong> Adequadas ao tamanho da criança</li>
                        <li><strong>Água:</strong> Priorizar sobre sucos e refrigerantes</li>
                    </ul>
                ` : `
                    <ul>
                        <li><strong>Autonomia:</strong> Envolver a criança no preparo das refeições</li>
                        <li><strong>Exemplo:</strong> Família como modelo de alimentação saudável</li>
                        <li><strong>Educação:</strong> Ensinar sobre nutrição de forma lúdica</li>
                        <li><strong>Moderação:</strong> Doces e guloseimas com parcimônia</li>
                    </ul>
                `}
            </div>
            
            <div class="recommendation-item priority-medium">
                <h5>🏃‍♂️ Atividade Física por Idade</h5>
                ${idade <= 3 ? `
                    <ul>
                        <li><strong>Brincadeiras Livres:</strong> Pelo menos 3h por dia</li>
                        <li><strong>Movimento:</strong> Engatinhar, andar, correr, pular</li>
                        <li><strong>Coordenação:</strong> Jogos com bolas, blocos, brinquedos</li>
                        <li><strong>Tela:</strong> Evitar antes dos 2 anos, limitar após</li>
                    </ul>
                ` : idade <= 6 ? `
                    <ul>
                        <li><strong>Atividade Diária:</strong> Pelo menos 3h de movimento</li>
                        <li><strong>Brincadeiras:</strong> Parque, bicicleta, natação</li>
                        <li><strong>Esportes:</strong> Introduzir modalidades básicas</li>
                        <li><strong>Tela:</strong> Máximo 1h por dia de qualidade</li>
                    </ul>
                ` : `
                    <ul>
                        <li><strong>Exercício Moderado:</strong> 60 min por dia</li>
                        <li><strong>Esportes:</strong> Escolher atividades prazerosas</li>
                        <li><strong>Família:</strong> Atividades físicas em conjunto</li>
                        <li><strong>Tela:</strong> Máximo 2h por dia, com pausas</li>
                    </ul>
                `}
            </div>
            
            <div class="tips-grid">
                <div class="tip-card">
                    <h5>😴 Sono Adequado</h5>
                    <p>${idade <= 3 ? '11-14h' : idade <= 6 ? '10-13h' : '9-11h'} por noite. Rotina consistente é fundamental para crescimento.</p>
                </div>
                <div class="tip-card">
                    <h5>👨‍👩‍👧‍👦 Ambiente Familiar</h5>
                    <p>Refeições em família, sem distrações. Evite usar comida como recompensa ou punição.</p>
                </div>
                <div class="tip-card">
                    <h5>📏 Acompanhamento</h5>
                    <p>Consultas pediátricas regulares para monitorar crescimento e desenvolvimento.</p>
                </div>
            </div>
            
            ${percentis.classe === 'poor' ? `
                <div class="warning-box">
                    <h4>Atenção Médica Recomendada</h4>
                    <p>O IMC está fora da faixa normal. Consulte um pediatra para avaliação completa e orientações específicas.</p>
                </div>
            ` : ''}
            
            <div class="general-tips">
                <h5>🎯 Metas de Peso Saudável</h5>
                <ul>
                    <li><strong>Faixa Ideal:</strong> ${formatNumber(pesoIdealMin, 1)}-${formatNumber(pesoIdealMax, 1)} kg para altura atual</li>
                    <li><strong>Crescimento:</strong> Foque no crescimento saudável, não apenas no peso</li>
                    <li><strong>Paciência:</strong> Mudanças levam tempo, seja consistente</li>
                    <li><strong>Positividade:</strong> Promova autoestima e imagem corporal saudável</li>
                </ul>
            </div>
        </div>
    `;
}

// ===== CALCULADORA DE CALORIAS POR FAIXA ETÁRIA MELHORADA =====
document.getElementById('calorias-faixa-etaria-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!window.calculatorUtils.validateForm(this)) return;
    
    const idade = parseInt(document.getElementById('cal-idade').value);
    const sexo = document.getElementById('cal-sexo').value;
    const peso = parseFloat(document.getElementById('cal-peso').value);
    const altura = parseFloat(document.getElementById('cal-altura').value);
    const atividade = parseFloat(document.getElementById('cal-atividade').value);
    
    // Calcular TMB usando fórmulas específicas por idade
    let tmb;
    
    if (idade <= 3) {
        // Fórmula para crianças pequenas
        tmb = sexo === 'masculino' ? 
            (60.9 * peso) - 54 : 
            (61.0 * peso) - 51;
    } else if (idade <= 10) {
        // Fórmula para crianças
        tmb = sexo === 'masculino' ? 
            (22.7 * peso) + (495 * altura/100) + 62 : 
            (22.5 * peso) + (499 * altura/100) + 63;
    } else if (idade <= 18) {
        // Fórmula para adolescentes
        tmb = sexo === 'masculino' ? 
            (17.5 * peso) + (651 * altura/100) + 77 : 
            (12.2 * peso) + (746 * altura/100) + 51;
    } else if (idade <= 30) {
        // Adultos jovens - Mifflin-St Jeor
        tmb = sexo === 'masculino' ? 
            (10 * peso) + (6.25 * altura) - (5 * idade) + 5 : 
            (10 * peso) + (6.25 * altura) - (5 * idade) - 161;
    } else if (idade <= 60) {
        // Adultos - Mifflin-St Jeor
        tmb = sexo === 'masculino' ? 
            (10 * peso) + (6.25 * altura) - (5 * idade) + 5 : 
            (10 * peso) + (6.25 * altura) - (5 * idade) - 161;
    } else {
        // Idosos - ajuste para metabolismo mais lento
        const tmbBase = sexo === 'masculino' ? 
            (10 * peso) + (6.25 * altura) - (5 * idade) + 5 : 
            (10 * peso) + (6.25 * altura) - (5 * idade) - 161;
        tmb = tmbBase * 0.95; // Redução de 5% para idosos
    }
    
    const caloriasTotal = tmb * atividade;
    
    document.getElementById('cal-tmb').textContent = formatNumber(tmb, 0);
    document.getElementById('cal-calorias-total').textContent = formatNumber(caloriasTotal, 0);
    
    const resultadoDiv = document.getElementById('calorias-faixa-etaria-result');
    resultadoDiv.innerHTML = `
        <div class="calculator-result">
            <div class="result-header">
                <div class="icon">🎂</div>
                <h3>Necessidades Calóricas - ${idade} anos</h3>
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
                    <h5>🔥 Total Diário</h5>
                    <div class="result-value" style="margin: 1rem 0;">
                        <span class="number" style="font-size: 1.8rem;">${formatNumber(caloriasTotal, 0)}</span>
                        <span class="unit">kcal/dia</span>
                    </div>
                    <p style="font-size: 0.9rem; color: #666;">Com atividade física</p>
                </div>
            </div>
            
            ${gerarRecomendacoesPorIdade(caloriasTotal, tmb, idade, sexo, peso)}
        </div>
    `;
    
    showResult('calorias-faixa-etaria');
});

function gerarRecomendacoesPorIdade(calorias, tmb, idade, sexo, peso) {
    let faixaEtaria, caracteristicas, recomendacoes;
    
    if (idade <= 3) {
        faixaEtaria = "Primeira Infância";
        caracteristicas = "Crescimento rápido, desenvolvimento cerebral intenso";
        recomendacoes = {
            distribuicao: "6-8 refeições pequenas por dia",
            macros: "45-65% carboidratos, 10-30% proteínas, 30-40% gorduras",
            especiais: ["Leite materno ou fórmula", "Introdução gradual de alimentos", "Evitar mel antes de 1 ano"]
        };
    } else if (idade <= 12) {
        faixaEtaria = "Infância";
        caracteristicas = "Crescimento constante, alta atividade física";
        recomendacoes = {
            distribuicao: "3 refeições principais + 2-3 lanches",
            macros: "45-65% carboidratos, 10-30% proteínas, 25-35% gorduras",
            especiais: ["Cálcio para ossos", "Ferro para crescimento", "Variedade de alimentos"]
        };
    } else if (idade <= 18) {
        faixaEtaria = "Adolescência";
        caracteristicas = "Estirão de crescimento, mudanças hormonais";
        recomendacoes = {
            distribuicao: "3 refeições principais + 2 lanches nutritivos",
            macros: "45-65% carboidratos, 10-30% proteínas, 25-35% gorduras",
            especiais: ["Aumento das necessidades calóricas", "Ferro (especialmente meninas)", "Cálcio para pico de massa óssea"]
        };
    } else if (idade <= 30) {
        faixaEtaria = "Adulto Jovem";
        caracteristicas = "Metabolismo acelerado, vida ativa";
        recomendacoes = {
            distribuicao: "3 refeições principais + 1-2 lanches",
            macros: "45-65% carboidratos, 10-35% proteínas, 20-35% gorduras",
            especiais: ["Estabelecer hábitos saudáveis", "Prevenção de doenças futuras", "Equilíbrio trabalho-vida"]
        };
    } else if (idade <= 60) {
        faixaEtaria = "Adulto";
        caracteristicas = "Metabolismo estável, responsabilidades familiares";
        recomendacoes = {
            distribuicao: "3 refeições equilibradas + 1 lanche",
            macros: "45-65% carboidratos, 10-35% proteínas, 20-35% gorduras",
            especiais: ["Prevenção de doenças crônicas", "Manutenção do peso", "Atividade física regular"]
        };
    } else {
        faixaEtaria = "Idoso";
        caracteristicas = "Metabolismo mais lento, mudanças fisiológicas";
        recomendacoes = {
            distribuicao: "3 refeições menores + 2-3 lanches",
            macros: "45-65% carboidratos, 15-25% proteínas, 20-35% gorduras",
            especiais: ["Mais proteína para preservar músculos", "Vitamina B12 e D", "Hidratação adequada"]
        };
    }
    
    const distribuicaoRefeicoes = {
        'cafe': Math.round(calorias * 0.25),
        'lanche1': Math.round(calorias * 0.10),
        'almoco': Math.round(calorias * 0.30),
        'lanche2': Math.round(calorias * 0.15),
        'jantar': Math.round(calorias * 0.20)
    };
    
    return `
        <div class="recommendations-section">
            <h4>Orientações para ${faixaEtaria}</h4>
            
            <div class="age-specific-info">
                <div class="age-card">
                    <h5>🎯 Características da Faixa Etária</h5>
                    <p>${caracteristicas}</p>
                    <div class="nutrition-basics">
                        <p><strong>Distribuição:</strong> ${recomendacoes.distribuicao}</p>
                        <p><strong>Macronutrientes:</strong> ${recomendacoes.macros}</p>
                    </div>
                </div>
            </div>
            
            <div class="meal-distribution">
                <h5>🍽️ Distribuição Calórica Recomendada</h5>
                <div class="meals-grid">
                    <div class="meal-item">
                        <h6>🌅 Café da Manhã</h6>
                        <p><strong>${distribuicaoRefeicoes.cafe} kcal</strong> (25%)</p>
                    </div>
                    <div class="meal-item">
                        <h6>🍎 Lanche Manhã</h6>
                        <p><strong>${distribuicaoRefeicoes.lanche1} kcal</strong> (10%)</p>
                    </div>
                    <div class="meal-item">
                        <h6>🍽️ Almoço</h6>
                        <p><strong>${distribuicaoRefeicoes.almoco} kcal</strong> (30%)</p>
                    </div>
                    <div class="meal-item">
                        <h6>🥨 Lanche Tarde</h6>
                        <p><strong>${distribuicaoRefeicoes.lanche2} kcal</strong> (15%)</p>
                    </div>
                    <div class="meal-item">
                        <h6>🌙 Jantar</h6>
                        <p><strong>${distribuicaoRefeicoes.jantar} kcal</strong> (20%)</p>
                    </div>
                </div>
            </div>
            
            <div class="recommendation-item priority-high">
                <h5>⭐ Cuidados Especiais para ${faixaEtaria}</h5>
                <ul>
                    ${recomendacoes.especiais.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="recommendation-item priority-medium">
                <h5>💊 Suplementação Recomendada</h5>
                <ul>
                    ${idade <= 3 ? `
                        <li><strong>Vitamina D:</strong> 400 UI/dia</li>
                        <li><strong>Ferro:</strong> Conforme orientação pediátrica</li>
                        <li><strong>Ômega-3:</strong> Para desenvolvimento cerebral</li>
                    ` : idade <= 18 ? `
                        <li><strong>Cálcio:</strong> 1300mg/dia para ossos</li>
                        <li><strong>Ferro:</strong> Especialmente para meninas (15mg/dia)</li>
                        <li><strong>Vitamina D:</strong> 600 UI/dia</li>
                    ` : idade <= 50 ? `
                        <li><strong>Vitamina D:</strong> 600 UI/dia</li>
                        <li><strong>Ômega-3:</strong> Para saúde cardiovascular</li>
                        <li><strong>Multivitamínico:</strong> Se dieta inadequada</li>
                    ` : `
                        <li><strong>Vitamina D:</strong> 800 UI/dia</li>
                        <li><strong>Vitamina B12:</strong> 2.4 mcg/dia</li>
                        <li><strong>Cálcio:</strong> 1200mg/dia</li>
                        <li><strong>Proteína:</strong> Considerar suplemento se ingestão baixa</li>
                    `}
                </ul>
            </div>
            
            <div class="tips-grid">
                <div class="tip-card">
                    <h5>🏃‍♂️ Atividade Física</h5>
                    <p>${idade <= 12 ? 'Brincadeiras ativas, esportes recreativos, pelo menos 60 min/dia' : 
                         idade <= 18 ? 'Esportes, academia, atividades em grupo, 60 min/dia' :
                         idade <= 60 ? '150 min/semana moderado ou 75 min/semana intenso' :
                         'Exercícios de baixo impacto, força, equilíbrio, flexibilidade'}</p>
                </div>
                <div class="tip-card">
                    <h5>💧 Hidratação</h5>
                    <p>${formatNumber(peso * (idade <= 12 ? 40 : idade <= 60 ? 35 : 30), 0)}ml por dia. ${idade >= 60 ? 'Idosos têm menor sensação de sede.' : 'Aumente durante exercícios.'}</p>
                </div>
                <div class="tip-card">
                    <h5>😴 Sono</h5>
                    <p>${idade <= 3 ? '11-14h' : idade <= 12 ? '9-11h' : idade <= 18 ? '8-10h' : idade <= 60 ? '7-9h' : '7-8h'} por noite para recuperação adequada.</p>
                </div>
            </div>
        </div>
    `;
}

