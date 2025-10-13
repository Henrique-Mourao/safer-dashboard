import { useState, useEffect } from "react";
import { Box, Button, Typography, useTheme, Chip, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
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
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
  const [stats, setStats] = useState({
    totalNotificacoes: 0,
    valoresAnalise: 0,
    totalTransacoes: 0,
    trafego: 0,
    aprovadas: 0,
    pendentes: 0,
  });
  const [reportConfig, setReportConfig] = useState({
    format: "pdf",
    includeAll: true,
    includeStats: true,
    includeTransactions: true,
    filterStatus: "all",
  });

  const TRANSACTIONS_API = "http://localhost:8080/transacoes";

  const maskCPF = (cpf) => {
    if (!cpf) return "-";
    const digits = String(cpf).replace(/\D/g, "");
    if (digits.length === 11) {
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return cpf;
  };

  const formatCurrency = (value) => {
    const n = Number(value ?? 0);
    if (Number.isNaN(n)) return "0,00";
    return n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

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

      setTransactions(list.slice(0, 12));

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

  const filterTransactions = () => {
    if (reportConfig.filterStatus === "all") return transactions;
    if (reportConfig.filterStatus === "approved") {
      return transactions.filter((t) => t.transacaoAnalisada === true);
    }
    return transactions.filter((t) => t.transacaoAnalisada === false);
  };

  const generateCSV = () => {
    const filtered = filterTransactions();
    const headers = ["CPF Origem", "Meio Pagamento", "Valor", "Score", "Dispositivo", "Data", "Status"];
    const rows = filtered.map((t) => [
      maskCPF(t.cpfOrigem),
      t.meioPagamento || "-",
      formatCurrency(t.valor),
      t.scoreTransacao || "-",
      t.dispositivo || "-",
      formatDateShort(t.dataHoraOperacao),
      t.transacaoAnalisada ? "Aprovada" : "Pendente",
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach((row) => {
      csv += row.map((cell) => `"${cell}"`).join(",") + "\n";
    });

    return csv;
  };

  const generateExcel = async () => {
    const csv = generateCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_transacoes_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const generatePDF = () => {
    const filtered = filterTransactions();
    const docContent = [];
    
    docContent.push("RELATÓRIO DE TRANSAÇÕES");
    docContent.push(`Data de Geração: ${new Date().toLocaleDateString("pt-BR")}`);
    docContent.push("");
    
    if (reportConfig.includeStats) {
      docContent.push("=== ESTATÍSTICAS ===");
      docContent.push(`Total de Transações: ${stats.totalNotificacoes}`);
      docContent.push(`Transações Aprovadas: ${stats.aprovadas}`);
      docContent.push(`Transações Pendentes: ${stats.pendentes}`);
      docContent.push(`Valores em Análise: R$ ${formatCurrency(stats.valoresAnalise)}`);
      docContent.push(`Score Médio: ${stats.trafego}`);
      docContent.push("");
    }

    if (reportConfig.includeTransactions) {
      docContent.push("=== TRANSAÇÕES ===");
      filtered.forEach((t, i) => {
        docContent.push(`${i + 1}. CPF: ${maskCPF(t.cpfOrigem)} | Valor: R$ ${formatCurrency(t.valor)} | Status: ${t.transacaoAnalisada ? "Aprovada" : "Pendente"}`);
      });
    }

    const text = docContent.join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_transacoes_${new Date().toISOString().split("T")[0]}.txt`;
    link.click();
  };

  const handleDownload = async () => {
    setDownloadLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      if (reportConfig.format === "pdf") {
        generatePDF();
      } else if (reportConfig.format === "excel") {
        generateExcel();
      } else {
        const csv = generateCSV();
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `relatorio_transacoes_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
      }
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
    } finally {
      setDownloadLoading(false);
      setOpenDownloadDialog(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="30px">
        <Header title="PAINEL" subtitle="Bem vindo ao seu painel de controle" />

        <Button
          onClick={() => setOpenDownloadDialog(true)}
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

      {/* DIALOG DE DOWNLOAD */}
      <Dialog
        open={openDownloadDialog}
        onClose={() => !downloadLoading && setOpenDownloadDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: colors.primary[400],
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: colors.grey[100],
            fontWeight: "bold",
            borderBottom: `1px solid ${colors.primary[500]}`,
            backgroundColor: colors.primary[500],
          }}
        >
          Configurar Download de Relatório
        </DialogTitle>

        <DialogContent sx={{ pt: "20px" }}>
          <Box display="flex" flexDirection="column" gap="20px">
            {/* Formato */}
            <FormControl fullWidth>
              <InputLabel sx={{ color: colors.grey[100] }}>Formato</InputLabel>
              <Select
                value={reportConfig.format}
                label="Formato"
                onChange={(e) =>
                  setReportConfig({ ...reportConfig, format: e.target.value })
                }
                sx={{
                  color: colors.grey[100],
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.primary[500],
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.greenAccent[500],
                  },
                }}
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="excel">Excel (CSV)</MenuItem>
                <MenuItem value="csv">CSV Puro</MenuItem>
              </Select>
            </FormControl>

            {/* Filtro */}
            <FormControl fullWidth>
              <InputLabel sx={{ color: colors.grey[100] }}>Filtrar por Status</InputLabel>
              <Select
                value={reportConfig.filterStatus}
                label="Filtrar por Status"
                onChange={(e) =>
                  setReportConfig({ ...reportConfig, filterStatus: e.target.value })
                }
                sx={{
                  color: colors.grey[100],
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.primary[500],
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.greenAccent[500],
                  },
                }}
              >
                <MenuItem value="all">Todas</MenuItem>
                <MenuItem value="approved">Aprovadas</MenuItem>
                <MenuItem value="pending">Pendentes</MenuItem>
              </Select>
            </FormControl>

            {/* Checkboxes */}
            <Box sx={{ borderTop: `1px solid ${colors.primary[500]}`, pt: "15px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={reportConfig.includeStats}
                    onChange={(e) =>
                      setReportConfig({
                        ...reportConfig,
                        includeStats: e.target.checked,
                      })
                    }
                    sx={{ color: colors.greenAccent[500] }}
                  />
                }
                label={
                  <Typography sx={{ color: colors.grey[100] }}>
                    Incluir Estatísticas
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={reportConfig.includeTransactions}
                    onChange={(e) =>
                      setReportConfig({
                        ...reportConfig,
                        includeTransactions: e.target.checked,
                      })
                    }
                    sx={{ color: colors.greenAccent[500] }}
                  />
                }
                label={
                  <Typography sx={{ color: colors.grey[100] }}>
                    Incluir Transações
                  </Typography>
                }
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            backgroundColor: colors.primary[500],
            borderTop: `1px solid ${colors.primary[500]}`,
            padding: "15px",
            gap: "10px",
          }}
        >
          <Button
            onClick={() => setOpenDownloadDialog(false)}
            disabled={downloadLoading}
            sx={{
              color: colors.grey[100],
              borderColor: colors.grey[100],
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDownload}
            disabled={downloadLoading}
            sx={{
              backgroundColor: colors.greenAccent[500],
              color: colors.grey[900],
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: colors.greenAccent[600],
              },
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {downloadLoading ? (
              <>
                <CircularProgress size={20} sx={{ color: colors.grey[900] }} />
                Gerando...
              </>
            ) : (
              <>
                <DownloadOutlinedIcon />
                Download
              </>
            )}
          </Button>
        </DialogActions>
      </Dialog>

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

                  <Box flex="1.2">
                    <Typography
                      color={colors.grey[200]}
                      variant="body2"
                      fontSize="14px"
                    >
                      {transaction.meioPagamento || "-"}
                    </Typography>
                  </Box>

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

                  <Box flex="1.1">
                    <Typography
                      color={colors.grey[200]}
                      variant="body2"
                      fontSize="14px"
                    >
                      {transaction.dispositivo || "-"}
                    </Typography>
                  </Box>

                  <Box flex="1">
                    <Typography
                      color={colors.grey[300]}
                      variant="body2"
                      fontSize="13px"
                    >
                      {formatDateShort(transaction.dataHoraOperacao)}
                    </Typography>
                  </Box>

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