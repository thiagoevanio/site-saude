# Planejamento do Site de Calculadoras de Saúde

## Estrutura do Site

### Página Principal (index.html)
- Header com logo e navegação principal
- Hero section com descrição do site
- Grid de categorias de calculadoras
- Footer com informações

### Categorias de Calculadoras

#### 🧍‍♂️ Calculadoras Corporais e de Saúde
1. IMC (Índice de Massa Corporal)
2. Taxa Metabólica Basal (TMB)
3. Gordura Corporal (%)
4. Massa Magra e Massa Gorda
5. Peso Ideal
6. Relação Cintura-Quadril (RCQ)
7. Idade Metabólica (estimada)
8. Índice de Adiposidade Corporal (IAC)

#### 🍽️ Calculadoras Nutricionais
1. Necessidade diária de Calorias
2. Necessidade diária de Proteínas
3. Necessidade diária de Carboidratos e Gorduras
4. Macronutrientes (em gramas e %)
5. Gasto Calórico em Atividades Físicas
6. Quantidade de Água por Dia
7. Índice Glicêmico de Alimentos
8. Quantidade ideal de Fibras

#### 💪 Calculadoras Fitness
1. 1RM (carga máxima em 1 repetição)
2. IMC Atlético (para fisiculturistas)
3. Consumo Calórico por Exercício (corrida, caminhada, etc)
4. VO2 Máximo (capacidade cardiorrespiratória)
5. Tempo de Recuperação Muscular Ideal
6. Frequência Cardíaca Ideal para Treino

#### 👶 Calculadoras Específicas
1. Gestacional (semanas, data provável de parto)
2. Ovulação / Fertilidade
3. Índice de Massa Corporal Infantil
4. Necessidades Calóricas por Faixa Etária (crianças e idosos)

#### 🧠 Bem-estar e estilo de vida
1. Qualidade do Sono (estimativa de ciclos)
2. Nível de Estresse (com base em sintomas)
3. Risco de Sedentarismo
4. Consumo de Cafeína Diário Seguro

## Estrutura de Arquivos
```
calculadoras-site/
├── index.html
├── css/
│   ├── style.css
│   └── calculadoras.css
├── js/
│   ├── main.js
│   ├── corporais.js
│   ├── nutricionais.js
│   ├── fitness.js
│   ├── especificas.js
│   └── bem-estar.js
├── images/
│   └── (ícones e imagens)
└── calculadoras/
    ├── corporais.html
    ├── nutricionais.html
    ├── fitness.html
    ├── especificas.html
    └── bem-estar.html
```

## Paleta de Cores
- Primária: #2563eb (azul profissional)
- Secundária: #10b981 (verde saúde)
- Accent: #f59e0b (laranja energia)
- Neutro escuro: #1f2937
- Neutro claro: #f9fafb
- Branco: #ffffff

## Design e Layout
- Design responsivo (mobile-first)
- Tipografia moderna (Inter ou similar)
- Cards com sombras suaves
- Animações CSS suaves
- Ícones SVG ou Font Awesome
- Grid layout para organização
- Formulários estilizados
- Botões com hover effects

## SEO e Performance
- Meta tags otimizadas
- Structured data (JSON-LD)
- Títulos hierárquicos (H1, H2, H3)
- Alt text em imagens
- URLs semânticas
- Sitemap
- Performance otimizada
- Acessibilidade (ARIA labels)

## Funcionalidades JavaScript
- Validação de formulários
- Cálculos em tempo real
- Armazenamento local de resultados
- Compartilhamento de resultados
- Modo escuro/claro
- Navegação suave entre seções

