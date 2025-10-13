import { useState, useEffect } from "react";
import { Box, Button, Typography, useTheme, Chip, CircularProgress } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalNotificacoes: 0,
    valoresAnalise: 0,
    totalTransacoes: 0,
    trafego: 0,
    aprovadas: 0,
    pendentes: 0,
  });

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

  // Formata moeda
  const formatCurrency = (value) => {
    const n = Number(value ?? 0);
    if (Number.isNaN(n)) return "0,00";
    return n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Formata data curta
  const formatDateShort = (iso) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("pt-BR", { month: "short", day: "numeric" });
    } catch {
      return iso;
    }
  };

  const getStatusIcon = (status) => {
    if (status === "Aprovada") return <CheckCircleIcon sx={{ fontSize: 14 }} />;
    if (status === "Pendente") return <PendingIcon sx={{ fontSize: 14 }} />;
    return <CancelIcon sx={{ fontSize: 14 }} />;
  };

  const getStatusColor = (status) => {
    if (status === "Aprovada") return colors.greenAccent[500];
    if (status === "Pendente") return colors.orangeAccent?.[500] || "#f59e0b";
    return colors.redAccent?.[500] || "#ef4444";
  };

  const getScoreColor = (score) => {
    const s = Number(score ?? 0);
    if (s >= 8) return colors.greenAccent[500];
    if (s >= 5) return colors.orangeAccent?.[500] || "#f59e0b";
    return colors.redAccent?.[500] || "#ef4444";
  };

  // Busca transações da API
  const fetchTransactions = async () => {
    setLoading(true);
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
      console.log("Dados recebidos:", data);

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

      setTransactions(list.slice(0, 12)); // Pega apenas as primeiras 12

      // Calcula estatísticas
      const totalTransacoes = list.length;
      const aprovadas = list.filter((t) => t.transacaoAnalisada === true).length;
      const pendentes = list.filter((t) => t.transacaoAnalisada === false).length;
      const valoresAnalise = list.reduce((acc, t) => acc + (Number(t.valor) || 0), 0);
      const scoreMedia = (
        list.reduce((acc, t) => acc + (Number(t.scoreTransacao) || 0), 0) / totalTransacoes
      ).toFixed(1);

      setStats({
        totalNotificacoes: totalTransacoes,
        valoresAnalise: valoresAnalise,
        totalTransacoes: totalTransacoes,
        trafego: scoreMedia,
        aprovadas: aprovadas,
        pendentes: pendentes,
      });
    } catch (err) {
      console.error("Erro ao buscar transações:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="30px">
        <Header title="PAINEL" subtitle="Bem vindo ao seu painel de controle" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: colors.blueAccent[800],
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Relatórios
          </Button>
        </Box>
      </Box>

      {/* STAT BOXES */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* Notificações */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="12px"
          sx={{
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 12px 24px rgba(0, 0, 0, 0.4)",
            },
          }}
        >
          <StatBox
            title={String(stats.totalNotificacoes)}
            subtitle="Total de Transações"
            progress={Math.min(stats.totalNotificacoes / 500, 1)}
            increase={`+${stats.aprovadas} aprovadas`}
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* Valores em Análise */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="12px"
          sx={{
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 12px 24px rgba(0, 0, 0, 0.4)",
            },
          }}
        >
          <StatBox
            title={`R$ ${formatCurrency(stats.valoresAnalise)}`}
            subtitle="Valores em Análise"
            progress={Math.min(stats.valoresAnalise / 100000, 1)}
            increase={`${stats.pendentes} pendentes`}
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* Aprovadas */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="12px"
          sx={{
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 12px 24px rgba(0, 0, 0, 0.4)",
            },
          }}
        >
          <StatBox
            title={String(stats.aprovadas)}
            subtitle="Transações Aprovadas"
            progress={Math.min(stats.aprovadas / stats.totalTransacoes || 0, 1)}
            increase={`${((stats.aprovadas / stats.totalTransacoes) * 100 || 0).toFixed(1)}%`}
            icon={
              <CheckCircleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* Score Médio */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="12px"
          sx={{
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 12px 24px rgba(0, 0, 0, 0.4)",
            },
          }}
        >
          <StatBox
            title={String(stats.trafego)}
            subtitle="Score Médio de Transações"
            progress={Math.min(stats.trafego / 10, 1)}
            increase="+0.5 pontos"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* TABELA DE TRANSAÇÕES */}
        <Box
          gridColumn="span 12"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          borderRadius="12px"
          overflow="hidden"
          sx={{
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* HEADER DA TABELA */}
          <Box
            display="flex"
            alignItems="center"
            backgroundColor={colors.primary[500]}
            p="20px 25px"
            gap="15px"
          >
            <Box flex="1.5">
              <Typography
                color={colors.grey[100]}
                variant="subtitle2"
                fontWeight="700"
                textTransform="uppercase"
                fontSize="11px"
                letterSpacing="1.2px"
              >
                CPF Origem
              </Typography>
            </Box>
            <Box flex="1.2">
              <Typography
                color={colors.grey[100]}
                variant="subtitle2"
                fontWeight="700"
                textTransform="uppercase"
                fontSize="11px"
                letterSpacing="1.2px"
              >
                Meio Pagamento
              </Typography>
            </Box>
            <Box flex="1">
              <Typography
                color={colors.grey[100]}
                variant="subtitle2"
                fontWeight="700"
                textTransform="uppercase"
                fontSize="11px"
                letterSpacing="1.2px"
              >
                Valor
              </Typography>
            </Box>
            <Box flex="0.9">
              <Typography
                color={colors.grey[100]}
                variant="subtitle2"
                fontWeight="700"
                textTransform="uppercase"
                fontSize="11px"
                letterSpacing="1.2px"
              >
                Score
              </Typography>
            </Box>
            <Box flex="1.1">
              <Typography
                color={colors.grey[100]}
                variant="subtitle2"
                fontWeight="700"
                textTransform="uppercase"
                fontSize="11px"
                letterSpacing="1.2px"
              >
                Dispositivo
              </Typography>
            </Box>
            <Box flex="1">
              <Typography
                color={colors.grey[100]}
                variant="subtitle2"
                fontWeight="700"
                textTransform="uppercase"
                fontSize="11px"
                letterSpacing="1.2px"
              >
                Data
              </Typography>
            </Box>
            <Box flex="0.8">
              <Typography
                color={colors.grey[100]}
                variant="subtitle2"
                fontWeight="700"
                textTransform="uppercase"
                fontSize="11px"
                letterSpacing="1.2px"
              >
                Status
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              maxHeight: "400px",
              overflow: "auto",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: colors.primary[400],
              },
              "&::-webkit-scrollbar-thumb": {
                background: colors.greenAccent[500],
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: colors.greenAccent[600],
              },
            }}
          >
            {loading ? (
              <Box display="flex" alignItems="center" justifyContent="center" p={4}>
                <CircularProgress sx={{ color: colors.greenAccent[500] }} />
              </Box>
            ) : transactions.length === 0 ? (
              <Box p={3}>
                <Typography color={colors.grey[200]}>
                  Nenhuma transação encontrada.
                </Typography>
              </Box>
            ) : (
              transactions.map((transaction, i) => (
                <Box
                  key={`${transaction.cpfOrigem}-${i}`}
                  display="flex"
                  alignItems="center"
                  p="18px 25px"
                  gap="15px"
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    backgroundColor: hoveredRow === i
                      ? colors.primary[500]
                      : "transparent",
                    borderLeft: hoveredRow === i
                      ? `4px solid ${colors.greenAccent[500]}`
                      : "4px solid transparent",
                    "&:hover": {
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {/* CPF Origem */}
                  <Box flex="1.5">
                    <Typography
                      color={colors.greenAccent[400]}
                      variant="body1"
                      fontWeight="600"
                      fontSize="15px"
                    >
                      {maskCPF(transaction.cpfOrigem)}
                    </Typography>
                  </Box>

                  {/* Meio Pagamento */}
                  <Box flex="1.2">
                    <Typography
                      color={colors.grey[200]}
                      variant="body2"
                      fontSize="14px"
                    >
                      {transaction.meioPagamento || "-"}
                    </Typography>
                  </Box>

                  {/* Valor */}
                  <Box flex="1">
                    <Typography
                      color={colors.greenAccent[400]}
                      variant="h6"
                      fontWeight="700"
                      fontSize="15px"
                    >
                      R$ {formatCurrency(transaction.valor)}
                    </Typography>
                  </Box>

                  {/* Score */}
                  <Box flex="0.9">
                    <Box
                      sx={{
                        backgroundColor: getScoreColor(transaction.scoreTransacao),
                        color: colors.grey[900],
                        padding: "4px 8px",
                        borderRadius: "4px",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "13px",
                      }}
                    >
                      {transaction.scoreTransacao || "-"}
                    </Box>
                  </Box>

                  {/* Dispositivo */}
                  <Box flex="1.1">
                    <Typography
                      color={colors.grey[200]}
                      variant="body2"
                      fontSize="14px"
                    >
                      {transaction.dispositivo || "-"}
                    </Typography>
                  </Box>

                  {/* Data */}
                  <Box flex="1">
                    <Typography
                      color={colors.grey[300]}
                      variant="body2"
                      fontSize="13px"
                    >
                      {formatDateShort(transaction.dataHoraOperacao)}
                    </Typography>
                  </Box>

                  {/* Status */}
                  <Box flex="0.8">
                    <Chip
                      icon={getStatusIcon(transaction.transacaoAnalisada ? "Aprovada" : "Pendente")}
                      label={transaction.transacaoAnalisada ? "Aprovada" : "Pendente"}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(
                          transaction.transacaoAnalisada ? "Aprovada" : "Pendente"
                        ),
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
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;