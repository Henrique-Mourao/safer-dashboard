# SAFeR Dashboard - Sistema de Análise de Fraude e Risco

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-5.x-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Nivo](https://img.shields.io/badge/Nivo-Charts-ff6b6b?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

## 📋 Sobre o Projeto

Dashboard interativo para o **SAFeR** - Sistema de Análise de Fraude e Risco. Plataforma desenvolvida para detecção e análise de padrões fraudulentos em tempo real, oferecendo visualizações intuitivas e ferramentas completas de gestão para equipes de prevenção a fraudes.

---

## ✨ Funcionalidades Principais

### 📊 Análise e Monitoramento
- **Dashboard Principal** com KPIs e métricas críticas em tempo real
- **Alertas de Fraude** com notificações para transações suspeitas
- **Análise Geográfica** de fraudes com visualização em mapa
- **Monitoramento de Transações** com histórico detalhado
- **Gráficos Interativos** (Linha, Barra, Pizza) para análise de dados

### 👥 Gestão
- **Gestão de Equipe** com controle de permissões e acessos
- **Registro de Contatos** e entidades monitoradas
- **Sistema de Faturas** para controle financeiro
- **Calendário** para agendamento e acompanhamento

### 🎨 Interface
- **Modo Claro/Escuro** com troca dinâmica de tema
- **FAQ Integrado** com respostas para dúvidas frequentes
- **Formulários Validados** para entrada de dados
- **Design Responsivo** que se adapta a diferentes dispositivos

---

## 🛠️ Tecnologias Utilizadas

### Core
- **React 18** - Biblioteca JavaScript para construção de interfaces
- **React Router** - Gerenciamento de rotas e navegação
- **Material-UI (MUI)** - Componentes UI modernos e acessíveis

### Visualização de Dados
- **Nivo Charts** - Biblioteca para gráficos interativos e responsivos
- **FullCalendar** - Componente de calendário completo

### Estilização
- **Emotion** - Biblioteca CSS-in-JS para estilização
- **Material Icons** - Conjunto de ícones do Material Design

### Gerenciamento
- **Formik** - Gerenciamento de formulários
- **Yup** - Validação de schemas

---

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 16+ 
- npm ou yarn

### Passos para Instalação

```bash
# Clone o repositório
git clone https://github.com/Henrique-Mourao/safer-dashboard.git

# Entre na pasta do projeto
cd safer-dashboard

# Instale as dependências
npm install

# Configure as variáveis de ambiente (opcional)
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm start
```

O dashboard estará disponível em `http://localhost:3000`

---

## 📁 Estrutura do Projeto

```
safer-dashboard/
├── 📁 public/
│   └── 📁 assets/              
│
├── 📁 src/
│   ├── 📁 components/         
│   │   ├── BarChart.jsx        
│   │   ├── GeographyChart.jsx  
│   │   ├── Header.jsx         
│   │   ├── LineChart.jsx       
│   │   ├── PieChart.jsx       
│   │   ├── ProgressCircle.jsx  
│   │   └── StatBox.jsx        
│   │
│   ├── 📁 data/               
│   │   ├── mockData.js        
│   │   └── mockGeoFeatures.js  
│   │
│   ├── 📁 scenes/              
│   │   ├── 📁 dashboard/     
│   │   ├── 📁 team/          
│   │   ├── 📁 contacts/       
│   │   ├── 📁 invoices/      
│   │   ├── 📁 form/           
│   │   ├── 📁 calendar/      
│   │   ├── 📁 faq/            
│   │   ├── 📁 bar/             
│   │   ├── 📁 line/           
│   │   ├── 📁 pie/             
│   │   ├── 📁 geography/     
│   │   └── 📁 global/          
│   │       ├── Sidebar.jsx     
│   │       └── Topbar.jsx     
│   │
│   ├── 📁 service/           
│   │   └── api.js            
│   │
│   ├── App.js                
│   ├── index.js              
│   ├── index.css             
│   └── theme.js              
│
└── package.json              
```

---

## 🎨 Temas

O dashboard suporta **modo claro e escuro** com paleta de cores personalizável. A configuração de temas está centralizada no arquivo `theme.js`, permitindo fácil customização das cores, tipografia e espaçamentos.

### Alternando entre Temas

O usuário pode alternar entre os modos através do botão na barra superior do dashboard.

---

## 📦 Build para Produção

```bash
# Gerar build otimizado
npm run build

# O build estará na pasta 'build/'
```

---

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar testes com coverage
npm test -- --coverage
```

---

## 🔗 Integração com Backend

Este dashboard foi desenvolvido para integrar com o backend do SAFeR.

📚 [Acessar Repositório do Backend](https://github.com/Henrique-Mourao/SAFeR)

### Configurando a API

Edite o arquivo `src/service/api.js` para configurar a URL base da API:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
```

---

## 📸 Screenshots

### Dashboard Principal
Visão geral com KPIs, gráficos e alertas de fraude

### Análise Geográfica
Mapa de calor mostrando distribuição de fraudes por região

### Gestão de Equipe
Interface para gerenciar usuários e permissões

---


## 📝 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm test` - Executa os testes
- `npm run eject` - Ejeta as configurações do Create React App (irreversível)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Equipe

Desenvolvido como parte do projeto SAFeR para o AGI.

---

**Desenvolvido para combater fraudes**
