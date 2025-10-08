import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Header title="FAQ" subtitle="Frequently Asked Questions Page" />

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
           Como identificar rapidamente transações suspeitas?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Utilize os filtros avançados do sistema para visualizar transações fora do padrão, como valores acima da média, transações em horários incomuns ou originadas de novos dispositivos. Priorize transações com alertas de risco alto ou com discrepâncias em dados do cliente
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Como revisar o histórico de transações de um cliente?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Acesse o perfil do cliente e visualize o histórico completo. O sistema permite filtrar por data, valor, canal de transação e tipo de operação. Observe padrões repetitivos e compare com o comportamento usual do cliente para identificar anomalias.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Quais indicadores sinalizam fraude?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Alguns indicadores comuns incluem:

Transações em locais diferentes em curto intervalo de tempo.

Alterações frequentes nos dados do cliente (e-mail, telefone, endereço).

Transações de valores elevados sem histórico prévio.

Tentativas repetidas de pagamento recusadas.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Como registrar notas sobre transações suspeitas?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Cada transação permite adicionar observações ou comentários. Registre todas as análises feitas, incluindo motivos para suspeita, evidências coletadas e ações recomendadas. Isso ajuda a manter rastreabilidade e facilita auditorias futuras.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            O que fazer após identificar uma transação fraudulenta?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Marque a transação como suspeita ou bloqueada no sistema.

Informe ao time de compliance ou ao gerente responsável.

Notifique o cliente se necessário, seguindo o protocolo interno.

Documente todas as ações no histórico da transação para auditoria.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FAQ;
