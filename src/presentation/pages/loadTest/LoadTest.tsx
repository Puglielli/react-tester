import {
  Container,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  TextField
} from '@mui/material';
import MainTemplate from '../../components/templates/MainTemplate/MainTemplate';

export function LoadTest() {
  return (
    <MainTemplate>
      <h1>Load Test</h1>
      <Container sx={{ mt: 4, mb: 4 }} maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={3} md={6} lg={12}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'row',
                height: 240
              }}
            >
              <div>
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <TextField required id="id-label"></TextField>
                  <FormHelperText>Todo create page.</FormHelperText>
                </FormControl>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </MainTemplate>
  );
}
