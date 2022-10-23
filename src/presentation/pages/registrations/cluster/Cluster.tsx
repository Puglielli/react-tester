import {
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Paper
} from '@mui/material';
import MainTemplate from '../../../components/templates/MainTemplate/MainTemplate';

export function Cluster() {
  return (
    <MainTemplate>
      <h1>Cluster</h1>
      <Container sx={{ mt: 4, mb: 4 }} maxWidth={false}>
        <Grid container spacing={3}>
          {/* Select Properties */}
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
                {/* Todo Registration cluster */}
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <InputLabel required id="cluster-label">
                    Cluster
                  </InputLabel>
                  <label>TODO</label>
                  <FormHelperText>...</FormHelperText>
                </FormControl>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </MainTemplate>
  );
}
