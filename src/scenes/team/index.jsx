import { useState, useEffect } from "react";
import { Box, Button, Typography, useTheme, Chip, CircularProgress, TextField, MenuItem } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";

const Transacoes = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cpfFilter, setCpfFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [hoveredRow, setHoveredRow] = useState(null);

  const TRANSACTIONS_API = "http://localhost:8080/transacoes";

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
    if (Number.isNaN(n)) return "0,00";
    return n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Formata data
  const formatDate = (iso) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return iso;
    }
  };

  // Cor do score baseada na regra: 0-30 verde (ótimo), 31-49 amarelo (atenção), 50+ vermelho (reprovado)
  const getScoreColor = (score) => {
    const s = Number(score ?? 0);
    // Verde: 0-30 (baixo risco - ótimo)
    if (s <= 30) return colors.greenAccent[500];
    // Amarelo/Laranja: 31-49 (risco moderado - atenção)
    if (s <= 49) return colors.orangeAccent?.[500] || "#f59e0b";
    // Vermelho: 50+ (alto risco - reprovado)
    return colors.redAccent?.[500] || "#ef4444";
  };

  // Ícone de status baseado no score
  const getStatusIcon = (score) => {
    const s = Number(score ?? 0);
    if (s >= 50) return <CancelIcon sx={{ fontSize: 14 }} />;
    if (s <= 30) return <CheckCircleIcon sx={{ fontSize: 14 }} />;
    return <PendingIcon sx={{ fontSize: 14 }} />;
  };

  // Cor do status baseado no score
  const getStatusColor = (score) => {
    const s = Number(score ?? 0);
    if (s >= 50) return colors.redAccent?.[500] || "#ef4444";
    if (s <= 30) return colors.greenAccent[500];
    return colors.orangeAccent?.[500] || "#f59e0b";
  };

  // Label do status baseado no score
  const getStatusLabel = (score) => {
    const s = Number(score ?? 0);
    if (s >= 50) return "Reprovada";
    if (s <= 30) return "Aprovada";
    return "Atenção";
  };

  // Busca dados da API
  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const opts = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      };

      const res = await fetch(TRANSACTIONS_API, opts);

      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }

      const data = await res.json();

      // Normaliza resposta
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

      // Ordena por data mais recente primeiro
      const sortedList = list.sort((a, b) => {
        const dateA = new Date(a.dataHoraOperacao || 0);
        const dateB = new Date(b.dataHoraOperacao || 0);
        return dateB - dateA; // Ordem decrescente (mais recente primeiro)
      });

      setAllTransactions(sortedList);
      setCurrentPage(1);
    } catch (err) {
      console.error("Erro ao carregar transações:", err);
      setError(err.message);
      setAllTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtra por CPF
  const getFilteredTransactions = () => {
    if (!cpfFilter.trim()) {
      return allTransactions;
    }

    const cpfLimpo = cleanCPF(cpfFilter);
    return allTransactions.filter((tx) =>
      cleanCPF(tx.cpfOrigem).includes(cpfLimpo)
    );
  };
  
  const filteredTransactions = getFilteredTransactions();

  // Paginação
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setHoveredRow(null);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setHoveredRow(null);
    }
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

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
          onChange={(e) => {
            setCpfFilter(e.target.value);
            setCurrentPage(1);
          }}
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
            },
            "& .MuiInputLabel-root": {
              color: colors.grey[300],
            },
          }}
        />
        <Button
          variant="contained"
          onClick={() => setCurrentPage(1)}
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
          onClick={() => {
            setCpfFilter("");
            setCurrentPage(1);
          }}
          sx={{
            borderColor: colors.blueAccent[700],
            color: colors.blueAccent[700],
            padding: "10px 20px",
          }}
        >
          ✕ Limpar
        </Button>
      </Box>

      {/* Legenda de Scores */}
      <Box
        sx={{
          mt: 2,
          p: 2,
          backgroundColor: colors.primary[400],
          borderRadius: 1,
          display: "flex",
          gap: 3,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Typography variant="subtitle2" color={colors.grey[100]} fontWeight="bold">
          Legenda de Scores:
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: colors.greenAccent[500],
              borderRadius: 1,
            }}
          />
          <Typography variant="body2" color={colors.grey[200]}>
            0-30: Ótimo (Aprovada)
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: colors.orangeAccent?.[500] || "#f59e0b",
              borderRadius: 1,
            }}
          />
          <Typography variant="body2" color={colors.grey[200]}>
            31-49: Atenção
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: colors.redAccent?.[500] || "#ef4444",
              borderRadius: 1,
            }}
          />
          <Typography variant="body2" color={colors.grey[200]}>
            50+: Reprovada
          </Typography>
        </Box>
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

      {/* TABELA */}
      <Box
        m="5px 0 0 0"
        backgroundColor={colors.primary[400]}
        borderRadius="12px"
        overflow="hidden"
        sx={{
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 400px)",
        }}
      >
        {/* HEADER */}
        <Box
          display="flex"
          alignItems="center"
          backgroundColor={colors.primary[500]}
          p="20px 25px"
          gap="15px"
        >
          <Box flex="1.5">
            <Typography color={colors.grey[100]} variant="subtitle2" fontWeight="700" textTransform="uppercase" fontSize="11px">
              CPF Origem
            </Typography>
          </Box>
          <Box flex="1.2">
            <Typography color={colors.grey[100]} variant="subtitle2" fontWeight="700" textTransform="uppercase" fontSize="11px">
              Meio Pagamento
            </Typography>
          </Box>
          <Box flex="1">
            <Typography color={colors.grey[100]} variant="subtitle2" fontWeight="700" textTransform="uppercase" fontSize="11px">
              Valor
            </Typography>
          </Box>
          <Box flex="0.9">
            <Typography color={colors.grey[100]} variant="subtitle2" fontWeight="700" textTransform="uppercase" fontSize="11px">
              Score
            </Typography>
          </Box>
          <Box flex="1.1">
            <Typography color={colors.grey[100]} variant="subtitle2" fontWeight="700" textTransform="uppercase" fontSize="11px">
              Dispositivo
            </Typography>
          </Box>
          <Box flex="1.3">
            <Typography color={colors.grey[100]} variant="subtitle2" fontWeight="700" textTransform="uppercase" fontSize="11px">
              Data/Hora
            </Typography>
          </Box>
          <Box flex="1">
            <Typography color={colors.grey[100]} variant="subtitle2" fontWeight="700" textTransform="uppercase" fontSize="11px">
              Status
            </Typography>
          </Box>
        </Box>

        {/* CORPO DA TABELA */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            "&::-webkit-scrollbar": { width: "8px" },
            "&::-webkit-scrollbar-track": { background: colors.primary[400] },
            "&::-webkit-scrollbar-thumb": { background: colors.greenAccent[500], borderRadius: "4px" },
          }}
        >
          {loading ? (
            <Box display="flex" alignItems="center" justifyContent="center" height="100%">
              <CircularProgress sx={{ color: colors.greenAccent[500] }} />
            </Box>
          ) : currentTransactions.length === 0 ? (
            <Box display="flex" alignItems="center" justifyContent="center" height="100%">
              <Typography color={colors.grey[200]}>Nenhuma transação encontrada.</Typography>
            </Box>
          ) : (
            currentTransactions.map((tx, i) => (
              <Box
                key={`${tx.cpfOrigem}-${i}`}
                display="flex"
                alignItems="center"
                p="18px 25px"
                gap="15px"
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  backgroundColor: hoveredRow === i ? colors.primary[500] : "transparent",
                  borderLeft: hoveredRow === i ? `4px solid ${colors.greenAccent[500]}` : "4px solid transparent",
                  "&:hover": {
                    transform: "translateX(4px)",
                  },
                }}
              >
                <Box flex="1.5">
                  <Typography color={colors.greenAccent[400]} fontWeight="600" fontSize="15px">
                    {maskCPF(tx.cpfOrigem)}
                  </Typography>
                </Box>
                <Box flex="1.2">
                  <Typography color={colors.grey[200]} fontSize="14px">
                    {tx.meioPagamento || "-"}
                  </Typography>
                </Box>
                <Box flex="1">
                  <Typography color={colors.greenAccent[400]} fontWeight="700" fontSize="15px">
                    R$ {formatCurrency(tx.valor)}
                  </Typography>
                </Box>
                <Box flex="0.9">
                  <Box
                    sx={{
                      backgroundColor: getScoreColor(tx.scoreTransacao),
                      color: colors.grey[900],
                      padding: "4px 8px",
                      borderRadius: "4px",
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "13px",
                    }}
                  >
                    {tx.scoreTransacao || "-"}
                  </Box>
                </Box>
                <Box flex="1.1">
                  <Typography color={colors.grey[200]} fontSize="14px">
                    {tx.dispositivo || "-"}
                  </Typography>
                </Box>
                <Box flex="1.3">
                  <Typography color={colors.grey[300]} fontSize="13px">
                    {formatDate(tx.dataHoraOperacao)}
                  </Typography>
                </Box>
                <Box flex="1">
                  <Chip
                    icon={getStatusIcon(tx.scoreTransacao)}
                    label={getStatusLabel(tx.scoreTransacao)}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(tx.scoreTransacao),
                      color: colors.grey[900],
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  />
                </Box>
              </Box>
            ))
          )}
        </Box>

        {/* FOOTER - PAGINAÇÃO */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p="15px 25px"
          backgroundColor={colors.primary[500]}
          borderTop={`1px solid ${colors.primary[400]}`}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2" color={colors.grey[300]}>
              Linhas por página:
            </Typography>
            <TextField
              select
              size="small"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              sx={{
                width: 80,
                "& .MuiOutlinedInput-root": {
                  color: colors.grey[100],
                  "& fieldset": {
                    borderColor: colors.blueAccent[700],
                  },
                },
              }}
            >
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </TextField>
          </Box>

          <Typography variant="body2" color={colors.grey[300]} sx={{ flex: 1, textAlign: "center" }}>
            {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} de {filteredTransactions.length}
          </Typography>

          <Box display="flex" alignItems="center" gap={1}>
            <Button
              disabled={currentPage === 1}
              onClick={handlePreviousPage}
              sx={{
                minWidth: "40px",
                backgroundColor: currentPage === 1 ? colors.grey[600] : colors.blueAccent[700],
                color: colors.grey[100],
                "&:hover": {
                  backgroundColor: colors.blueAccent[500],
                },
              }}
            >
              <ChevronLeftIcon />
            </Button>

            <Typography variant="body2" color={colors.grey[300]} sx={{ px: 2 }}>
              Página {currentPage} de {totalPages || 1}
            </Typography>

            <Button
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
              sx={{
                minWidth: "40px",
                backgroundColor: currentPage === totalPages ? colors.grey[600] : colors.blueAccent[700],
                color: colors.grey[100],
                "&:hover": {
                  backgroundColor: colors.blueAccent[500],
                },
              }}
            >
              <ChevronRightIcon />
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Transacoes;