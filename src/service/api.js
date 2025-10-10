// src/services/api.js
import axios from 'axios';

// Configuração base da API
const api = axios.create({
  baseURL: 'https://viacep.com.br/ws', // SUBSTITUA pela URL da sua API real
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para adicionar token de autenticação (se necessário)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Erro na resposta:', error.response.status);
      
      if (error.response.status === 401) {
        localStorage.removeItem('token');
      }
    } else if (error.request) {
      console.error('Sem resposta do servidor');
    } else {
      console.error('Erro na configuração:', error.message);
    }
    return Promise.reject(error);
  }
);

// Serviço de transações
export const transacoesService = {
  // Listar todas as transações
  listar: async (params) => {
    try {
      // DADOS MOCKADOS - substitua pela chamada real da sua API
      // const response = await api.get('/transacoes', { params });
      // return response.data;
      
      // Simulando dados enquanto você não configura a API real:
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              txId: "01e4dsa",
              user: "João Silva",
              date: "2024-01-15",
              cost: "150.00"
            },
            {
              txId: "0315dsaa",
              user: "Maria Santos",
              date: "2024-01-14",
              cost: "200.50"
            },
            {
              txId: "01e4dsa",
              user: "Pedro Costa",
              date: "2024-01-13",
              cost: "89.99"
            },
            {
              txId: "51034szv",
              user: "Ana Paula",
              date: "2024-01-12",
              cost: "320.00"
            },
            {
              txId: "0a123sb",
              user: "Carlos Eduardo",
              date: "2024-01-11",
              cost: "75.50"
            }
          ]);
        }, 1000); // Simula delay de rede
      });
    } catch (error) {
      console.error('Erro ao listar transações:', error);
      throw error;
    }
  },

  // Buscar transação por ID
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/transacoes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar transação ${id}:`, error);
      throw error;
    }
  },

  // Criar nova transação
  criar: async (dados) => {
    try {
      const response = await api.post('/transacoes', dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      throw error;
    }
  },

  // Atualizar transação
  atualizar: async (id, dados) => {
    try {
      const response = await api.put(`/transacoes/${id}`, dados);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar transação ${id}:`, error);
      throw error;
    }
  },

  // Deletar transação
  deletar: async (id) => {
    try {
      const response = await api.delete(`/transacoes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar transação ${id}:`, error);
      throw error;
    }
  }
};

export default api;