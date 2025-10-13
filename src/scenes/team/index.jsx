import { Box, Typography, useTheme, Chip, CircularProgress, TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";

const Transacoes = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cpfFilter, setCpfFilter] = useState("");
  const [allData, setAllData] = useState([]);

  const TRANSACOES_API = "http://localhost:8080/transacoes";

  // Formata CPF
  const maskCPF = (cpf) => {
    if (!cpf) return "-";
    const digits = String(cpf).replace(/\D/g, "");
    if (digits.length === 11) {
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return cpf;
  };

  // Remove formatação do CPF para comparação
  const cleanCPF = (cpf) => {
    if (!cpf) return "";
    return String(cpf).replace(/\D/g, "");
  };

  // Formata moeda
  const formatCurrency = (value) => {
    const n = Number(value ?? 0);
    if (Number.isNaN(n)) return String(value);
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  // Formata data
  const formatDate = (iso) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR");
    } catch {
      return iso;
    }
  };

  // Mapeia dados da API para rows da DataGrid
  const mapTransacaoToRow = (tx, idx) => {
    return {
      id: tx.id || idx,
      meioPagamento: tx.meioPagamento || "-",
      cpfOrigem: maskCPF(tx.cpfOrigem),
      cpfOrigemRaw: cleanCPF(tx.cpfOrigem),
      score: tx.scoreTransacao || tx.score || "-",
      dispositivo: tx.dispositivo || "-",
      valor: formatCurrency(tx.valor),
      dataOperacao: formatDate(tx.dataHoraOperacao),
      status: tx.transacaoAnalisada ? "Aprovada" : "Pendente",
      statusRaw: tx.transacaoAnalisada,
      cpfDestino: maskCPF(tx.cpfCnpjDestino),
      local: tx.local ? `${tx.local[0]}, ${tx.local[1]}` : "-",
      raw: tx,
    };
  };

  // Busca dados da API
  const fetchTransacoes = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Buscando transações...");

      const opts = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      };

      const res = await fetch(TRANSACOES_API, opts);

      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status} - ${res.statusText}`);
      }

      const data = await res.json();
      console.log("Dados recebidos:", data);

      // Normaliza resposta (pode vir em diferentes formatos)
      let list = Array.isArray(data)
        ? data
        : Array.isArray(data?.transacoes)
        ? data.transacoes
        : Array.isArray(data?.transactions)
        ? data.transactions
        : Array.isArray(data?.content)
        ? data.content
        : Array.isArray(data?.data)
        ? data.data
        : [];

      const mapped = (Array.isArray(list) ? list : []).map(mapTransacaoToRow);
      setAllData(mapped);
      setRows(mapped);
    } catch (err) {
      console.error("Erro ao carregar transações:", err);
      setError(err.message);
      setRows([]);
      setAllData([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtra por CPF
  const handleFilterByCPF = () => {
    if (!cpfFilter.trim()) {
      setRows(allData);
      return;
    }

    const cpfLimpo = cleanCPF(cpfFilter);
    const filtered = allData.filter((row) =>
      row.cpfOrigemRaw.includes(cpfLimpo)
    );

    setRows(filtered);
  };

  // Limpa filtro
  const handleClearFilter = () => {
    setCpfFilter("");
    setRows(allData);
  };

  // Busca ao montar o componente
  useEffect(() => {
    fetchTransacoes();
  }, []);

  const columns = [
    {
      field: "meioPagamento",
      headerName: "Meio de Pagamento",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "cpfOrigem",
      headerName: "CPF Origem",
      flex: 1.1,
    },
    {
      field: "score",
      headerName: "Score",
      flex: 0.7,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: params.value >= 8 ? colors.greenAccent[500] : params.value >= 5 ? colors.orangeAccent?.[500] : colors.redAccent?.[500],
            color: colors.grey[900],
            padding: "5px 10px",
            borderRadius: "4px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "dispositivo",
      headerName: "Dispositivo",
      flex: 0.9,
    },
    {
      field: "valor",
      headerName: "Valor",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[400]} fontWeight="bold">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "dataOperacao",
      headerName: "Data/Hora",
      flex: 1.3,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.9,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: params.row.statusRaw ? colors.greenAccent[500] : colors.orangeAccent?.[500] || "#f6a",
            color: colors.grey[900],
            fontWeight: "bold",
          }}
        />
      ),
    },
    {
      field: "cpfDestino",
      headerName: "CPF Destino",
      flex: 1.1,
    },
  ];

  return (
    <Box m="20px">
      <Header title="TRANSAÇÕES" subtitle="Listagem de Transações Bancárias" />

      {/* Filtro por CPF */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          backgroundColor: colors.primary[400],
          borderRadius: 1,
          display: "flex",
          gap: 2,
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Filtrar por CPF"
          placeholder="Ex: 123.456.789-00"
          value={cpfFilter}
          onChange={(e) => setCpfFilter(e.target.value)}
          variant="outlined"
          size="small"
          sx={{
            flex: 1,
            minWidth: 250,
            "& .MuiOutlinedInput-root": {
              color: colors.grey[100],
              "& fieldset": {
                borderColor: colors.blueAccent[700],
              },
              "&:hover fieldset": {
                borderColor: colors.blueAccent[500],
              },
            },
            "& .MuiInputBase-input::placeholder": {
              color: colors.grey[300],
              opacity: 1,
            },
            "& .MuiInputLabel-root": {
              color: colors.grey[300],
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleFilterByCPF}
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            padding: "10px 20px",
            "&:hover": {
              backgroundColor: colors.blueAccent[500],
            },
          }}
        >
          🔍 Filtrar
        </Button>
        <Button
          variant="outlined"
          onClick={handleClearFilter}
          sx={{
            borderColor: colors.blueAccent[700],
            color: colors.blueAccent[700],
            padding: "10px 20px",
            "&:hover": {
              borderColor: colors.blueAccent[500],
              backgroundColor: "rgba(33, 150, 243, 0.04)",
            },
          }}
        >
          ✕ Limpar
        </Button>
        <Typography variant="body2" color={colors.grey[300]}>
          Total: {rows.length} / {allData.length}
        </Typography>
      </Box>

      {error && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: "rgba(255, 0, 0, 0.1)",
            borderLeft: `4px solid ${colors.redAccent?.[500]}`,
            borderRadius: 1,
          }}
        >
          <Typography color={colors.redAccent?.[500]} fontWeight="bold">
            ❌ Erro: {error}
          </Typography>
        </Box>
      )}

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
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
        {loading ? (
          <Box height="75vh" display="flex" alignItems="center" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : rows.length === 0 ? (
          <Box height="75vh" display="flex" alignItems="center" justifyContent="center">
            <Typography>Nenhuma transação encontrada</Typography>
          </Box>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            checkboxSelection
            pageSizeOptions={[50, 100]}
            initialState={{
              pagination: { paginationModel: { pageSize: 50 } },
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default Transacoes;