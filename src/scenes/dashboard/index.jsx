import { useState } from "react";
import { Box, Button, Typography, useTheme, Avatar, Chip } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [hoveredRow, setHoveredRow] = useState(null);

  const getStatusIcon = (status) => {
    if (status === "Aprovado") return <CheckCircleIcon sx={{ fontSize: 14 }} />;
    if (status === "Pendente") return <PendingIcon sx={{ fontSize: 14 }} />;
    return <CancelIcon sx={{ fontSize: 14 }} />;
  };

  const getStatusColor = (status) => {
    if (status === "Aprovado") return "#10b981";
    if (status === "Pendente") return "#f59e0b";
    return "#ef4444";
  };

  // Função para gerar cor aleatória para avatar
  const getAvatarColor = (name) => {
    const colors = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
      "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="30px">
        <Header title="PAINEL" subtitle="Bem vindo ao seu painel" />

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

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
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
            title="12.361"
            subtitle="Notificações"
            progress="0.18"
            increase="+18%"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
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
            title="200.203"
            subtitle="Valores em analise"
            progress="0.21"
            increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
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
            title="29.302"
            subtitle="Novos Clientes"
            progress="0.50"
            increase="+15%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
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
            title="890.212"
            subtitle="Tráfego Recebido"
            progress="0.70"
            increase="+76%"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

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
            <Box flex="2.5">
              <Typography
                color={colors.grey[100]}
                variant="subtitle2"
                fontWeight="700"
                textTransform="uppercase"
                fontSize="11px"
                letterSpacing="1.2px"
              >
                Nome
              </Typography>
            </Box>
            <Box flex="1.5">
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
            <Box flex="1.2">
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
            <Box flex="1.2">
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
            <Box flex="1">
              <Typography
                color={colors.grey[100]}
                variant="subtitle2"
                fontWeight="700"
                textTransform="uppercase"
                fontSize="11px"
                letterSpacing="1.2px"
              >
                Tipo
              </Typography>
            </Box>
            <Box flex="1.8">
              <Typography
                color={colors.grey[100]}
                variant="subtitle2"
                fontWeight="700"
                textTransform="uppercase"
                fontSize="11px"
                letterSpacing="1.2px"
              >
                Método
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
            {mockTransactions.map((transaction, i) => (
              <Box
                key={`${transaction.txId}-${i}`}
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
                <Box flex="2.5" display="flex" alignItems="center" gap="15px">
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      fontSize: "15px",
                      fontWeight: "bold",
                      background: getAvatarColor(transaction.user),
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {transaction.user.substring(0, 2).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography
                      color={colors.greenAccent[400]}
                      variant="body1"
                      fontWeight="600"
                      fontSize="15px"
                    >
                      {transaction.user}
                    </Typography>
                    <Typography
                      color={colors.grey[300]}
                      variant="caption"
                      fontSize="11px"
                    >
                      ID: {transaction.txId}
                    </Typography>
                  </Box>
                </Box>


                <Box flex="1.5">
                  <Typography 
                    color={colors.grey[200]} 
                    variant="body2"
                    fontSize="14px"
                  >
                    {transaction.date}
                  </Typography>
                </Box>

                <Box flex="1.2">
                  <Typography
                    color={colors.greenAccent[400]}
                    variant="h6"
                    fontWeight="700"
                    fontSize="16px"
                  >
                    ${transaction.cost}
                  </Typography>
                </Box>

                <Box flex="1.2">
                  <Chip
                    icon={getStatusIcon(transaction.status || "Aprovado")}
                    label={transaction.status || "Aprovado"}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(transaction.status || "Aprovado"),
                      color: "white",
                      fontWeight: "600",
                      fontSize: "11px",
                      height: "28px",
                      borderRadius: "14px",
                      "& .MuiChip-icon": {
                        color: "white",
                        marginLeft: "4px",
                      },
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s",
                    }}
                  />
                </Box>

                <Box flex="1" display="flex" alignItems="center" gap="8px">
                  <ShoppingCartIcon sx={{ fontSize: 16, color: colors.grey[400] }} />
                  <Typography 
                    color={colors.grey[200]} 
                    variant="body2"
                    fontSize="13px"
                  >
                    {transaction.tipo || "Compra"}
                  </Typography>
                </Box>

                <Box flex="1.8" display="flex" alignItems="center" gap="8px">
                  <CreditCardIcon sx={{ fontSize: 16, color: colors.grey[400] }} />
                  <Typography 
                    color={colors.grey[200]} 
                    variant="body2"
                    fontSize="13px"
                  >
                    {transaction.metodo || "Cartão de Crédito"}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;