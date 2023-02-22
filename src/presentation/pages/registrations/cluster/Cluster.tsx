import { Container, FormControl, Grid, Paper, TextField } from '@mui/material';
import MainTemplate from '../../../components/templates/MainTemplate/MainTemplate';

export function Cluster() {
  return (
    <MainTemplate>
      <h1>Cluster</h1>
      <Container sx={{ mt: 4, mb: 4 }} maxWidth={false}>
        <Grid container spacing={3}>
          {/* Register Properties */}
          <Grid item xs={3} md={6} lg={12}>
            <Paper sx={{ p: 2 }}>
              <div style={{ display: 'flex' }}>
                {/* Cluster name */}
                <FormControl sx={{ m: 1, flex: 1 }}>
                  <TextField label="Name" variant="standard" />
                </FormControl>

                {/* Cluster Hostname */}
                <FormControl sx={{ m: 1, flex: 1 }}>
                  <TextField label="Hostname" variant="standard" />
                </FormControl>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </MainTemplate>
  );
}
