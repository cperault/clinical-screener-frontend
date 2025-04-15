import { Screener } from "./components/Screener";
import { Box, Typography, Container } from "@mui/material";

export const App = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Box 
          component="header" 
          sx={{ 
            py: 3,
            borderBottom: 1,
            borderColor: "divider",
            mb: 4
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            color="primary"
            sx={{ 
              fontWeight: 500,
              textAlign: "center"
            }}
          >
            Clinical Screener
          </Typography>
        </Box>
        <main>
          <Screener />
        </main>
      </Container>
    </Box>
  );
};
