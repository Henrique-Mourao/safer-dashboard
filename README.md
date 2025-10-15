# 🛡️ Dashboard Anti-Fraude

> Sistema de monitoramento e análise de fraudes em tempo real

[![React](https://img.shields.io/badge/React-18.x-61dafb?logo=react)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.x-007FFF?logo=mui)](https://mui.com/)
[![Nivo](https://img.shields.io/badge/Nivo-Charts-ff6b6b)](https://nivo.rocks/)

## 📋 Sobre

Dashboard interativo para detecção e análise de padrões fraudulentos, com visualizações em tempo real e ferramentas de gestão para equipes de prevenção.

### ✨ Funcionalidades

- 📊 Dashboard com KPIs e alertas críticos
- 👥 Gestão de equipe e permissões
- 📇 Registro de contatos e entidades monitoradas
- 📈 Análise geográfica de fraudes
- 💰 Monitoramento de transações suspeitas
- 📉 Gráficos interativos (Linha, Barra)
- ❓ FAQ integrado
- 📝 Formulários com validação

## 🚀 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/react-admin.git
cd react-admin

# Instale as dependências
npm install

# Configure o ambiente
cp .env.example .env

# Inicie o projeto
npm start
```

Acesse `http://localhost:3000`

## 📁 Estrutura

```
react-admin/
├── 📁 public/
│   └── 📁 assets/              # Imagens e recursos
├── 📁 src/
│   ├── 📁 components/          # Componentes reutilizáveis
│   │   ├── BarChart.jsx
│   │   ├── GeographyChart.jsx
│   │   ├── Header.jsx
│   │   ├── LineChart.jsx
│   │   ├── PieChart.jsx
│   │   ├── ProgressCircle.jsx
│   │   └── StatBox.jsx
│   ├── 📁 data/                # Dados mockados
│   │   ├── mockData.js
│   │   └── mockGeoFeatures.js
│   ├── 📁 scenes/              # Páginas
│   │   ├── 📁 bar/
│   │   ├── 📁 calendar/
│   │   ├── 📁 contacts/
│   │   ├── 📁 dashboard/
│   │   ├── 📁 faq/
│   │   ├── 📁 form/
│   │   ├── 📁 geography/
│   │   ├── 📁 global/          # Sidebar, Topbar
│   │   ├── 📁 invoices/
│   │   ├── 📁 line/
│   │   ├── 📁 pie/
│   │   └── 📁 team/
│   ├── 📁 service/             # APIs
│   │   └── api.js
│   ├── App.js
│   ├── index.js
│   ├── index.css
│   └── theme.js                # Configuração de tema
└── package.json
```

## 🛠️ Tecnologias

- **React 18** - Framework principal
- **Material-UI** - Componentes UI
- **Nivo Charts** - Visualizações de dados
- **React Router** - Navegação
- **Emotion** - Estilização

## 🎨 Temas

Suporta modo claro e escuro com paleta personalizável configurada em `theme.js`.

## 📦 Build

```bash
# Build de produção
npm run build

# Testes
npm test
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido com ❤️ para combater fraudes*