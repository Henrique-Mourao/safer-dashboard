import { useState, useEffect } from "react";
import { Box, useTheme, CircularProgress, Alert, Button, Switch, FormControlLabel } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const URL = "http://localhost:8080/contas";

// Dados de exemplo para teste
const MOCK_DATA = [
  {
    id: 1,
    cliente: { nome: "João Silva", cpf: "123.456.789-00" },
    numAgencia: "0001",
    numConta: "123456",
    ispb: "00000000",
    dispositivo: { tipo: "Token", status: "Ativo" },
    limiteNoturno: 5000.00,
    dataAbertura: "2023-01-15",
    status: "Ativa"
  },
  {
    id: 2,
    cliente: { nome: "Maria Santos", cpf: "987.654.321-11" },
    numAgencia: "0002",
    numConta: "654321",
    ispb: "00000001",
    dispositivo: { tipo: "Cartão", status: "Ativo" },
    limiteNoturno: 10000.00,
    dataAbertura: "2023-03-20",
    status: "Ativa"
  },
  {
    id: 3,
    cliente: { nome: "Pedro Costa", cpf: "456.789.123-22" },
    numAgencia: "0003",
    numConta: "789123",
    ispb: "00000002",
    dispositivo: { tipo: "App", status: "Inativo" },
    limiteNoturno: 3000.00,
    dataAbertura: "2023-05-10",
    status: "Bloqueada"
  },
];

const Contas = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Iniciando requisição para:", URL);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        mode: "cors",
        credentials: "omit",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("Status da resposta:", response.status);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Dados recebidos:", data);

      if (!Array.isArray(data)) {
        setResults(Array.isArray(data.content) ? data.content : Array.isArray(data.data) ? data.data : [data]);
      } else {
        setResults(data);
      }
      setUseMockData(false);
    } catch (err) {
      console.error("Erro completo:", err);
      
      let errorMsg = "Erro desconhecido";
      if (err.name === "AbortError") {
        errorMsg = "Timeout: A requisição demorou muito tempo. Verifique se o servidor está respondendo.";
      } else if (err instanceof TypeError && err.message === "Failed to fetch") {
        errorMsg = "Erro de conexão: Não foi possível conectar ao servidor. Verifique:\n1. O servidor está rodando em http://localhost:8080?\n2. Há problemas de CORS?\n3. A porta está correta?";
      } else {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      setResults(MOCK_DATA); // Carrega dados de exemplo em caso de erro
      setUseMockData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const rows = results.map((c, index) => ({
    id: c.id || index,
    nome: c.cliente?.nome || "N/A",
    cpf: c.cliente?.cpf || "N/A",
    agencia: c.numAgencia || "N/A",
    conta: c.numConta || "N/A",
    banco: c.ispb || "N/A",
    tipoDispositivo: c.dispositivo?.tipo || "N/A",
    statusDispositivo: c.dispositivo?.status || "N/A",
    limiteNoturno: c.limiteNoturno !== undefined && c.limiteNoturno !== null 
      ? `R$ ${parseFloat(c.limiteNoturno).toFixed(2)}` 
      : "N/A",
    dataAbertura: c.dataAbertura 
      ? new Date(c.dataAbertura).toLocaleDateString("pt-BR") 
      : "N/A",
    statusConta: c.status || "N/A",
  }));

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "nome", headerName: "Nome do Titular", flex: 1 },
    { field: "cpf", headerName: "CPF", flex: 0.8 },
    { field: "agencia", headerName: "Agência", flex: 0.6 },
    { field: "conta", headerName: "Número da Conta", flex: 1 },
    { field: "banco", headerName: "Banco (ISPB)", flex: 0.8 },
    { field: "tipoDispositivo", headerName: "Dispositivo", flex: 0.8 },
    { field: "statusDispositivo", headerName: "Status Dispositivo", flex: 1 },
    { field: "limiteNoturno", headerName: "Limite Noturno", flex: 1 },
    { field: "dataAbertura", headerName: "Data de Abertura", flex: 1 },
    { field: "statusConta", headerName: "Status da Conta", flex: 0.8 },
  ];

  return (
    <Box m="20px">
      <Header title="CONTAS" subtitle="Listagem de Contas Bancárias" />

      {error && (
        <Alert 
          severity={useMockData ? "warning" : "error"}
          sx={{ mt: 2, mb: 2, whiteSpace: "pre-line" }}
          action={
            <Button color="inherit" size="small" onClick={fetchData}>
              Tentar Novamente
            </Button>
          }
        >
          {useMockData 
            ? `⚠️ Usando dados de exemplo. ${error}` 
            : error
          }
        </Alert>
      )}

      {useMockData && (
        <Box sx={{ mb: 2, p: 2, backgroundColor: colors.primary[400], borderRadius: 1 }}>
          <FormControlLabel
            control={<Switch checked={useMockData} disabled />}
            label="🔧 Modo de Demonstração - Dados de Exemplo"
          />
        </Box>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" height="75vh" flexDirection="column" gap={2}>
          <CircularProgress />
          <Box>Carregando contas...</Box>
        </Box>
      )}

      {!loading && results.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Nenhuma conta encontrada.
        </Alert>
      )}

      {!loading && results.length > 0 && (
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "none" },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
          }}
        >
          <DataGrid 
            rows={rows} 
            columns={columns} 
            pageSizeOptions={[50, 100]}
            initialState={{
              pagination: { paginationModel: { pageSize: 50 } },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default Contas;