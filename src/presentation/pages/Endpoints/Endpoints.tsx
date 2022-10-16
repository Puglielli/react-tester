import {
  Alert,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Snackbar,
  TextField
} from '@mui/material';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import MainTemplate from '../../components/templates/MainTemplate/MainTemplate';
import SendIcon from '@mui/icons-material/Send';
import {
  getSchemasByName,
  getSchemasByTopic
} from '../../../controllers/SchemaController';
import { SnackBarProps } from '../../components/snackbar/SnackBar';

export function Endpoints() {
  const [schemaCode, setSchemaCode] = useState('{}');
  const [dataCode, setDataCode] = useState('{}');
  const [topic, setTopic] = useState('');
  const [schema, setSchema] = useState('');
  const [schemas, setSchemas] = useState([]);
  const [cluster, setCluster] = useState('');
  const [environment, setEnvironment] = useState('');
  const [snackBarProps, setSnackBarProps] = useState<SnackBarProps>({
    message: 'Successful event!',
    severity: 'success'
  });

  const [open, setOpen] = useState(false);
  const handleClose = (event?: SyntheticEvent | Event, reason?: string) =>
    reason !== 'clickaway' ? setOpen(false) : undefined;

  const textChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === 'topic') setTopic(value);
  };

  const selectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;

    if (name === 'schema') {
      setSchema(value);
      getSchemasByName(value)
        .then((response) => {
          const { schema, payload } = response.data;

          setSchemaCode(schema);
          setDataCode(payload);
          setSnackBarProps({
            message: 'Schemas found successfully!',
            severity: 'success'
          });
        })
        .catch((err) => {
          setSnackBarProps({ message: 'Error found!', severity: 'error' });
          console.error(err.error);
        });
    } else if (name === 'cluster') setCluster(value);
    else if (name === 'environment') setEnvironment(value);
  };

  const getSchemas = () => {
    getSchemasByTopic(topic)
      .then((response) => {
        const { schemas } = response.data;

        if (schemas.length > 0) {
          setSnackBarProps({
            message: 'Schemas found successfully!',
            severity: 'success'
          });
        } else {
          setSnackBarProps({
            message: 'Not found schemas!',
            severity: 'warning'
          });
        }

        setSchemas(schemas);
      })
      .catch((err) => {
        setSnackBarProps({ message: 'Error found!', severity: 'error' });
        console.error(err);
      })
      .finally(() => setOpen(true));
  };

  return (
    <MainTemplate>
      <h1>Endpoints</h1>
      <Container sx={{ mt: 4, mb: 4 }} style={{ width: '1200px' }}>
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
                {/* Cluster */}
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <InputLabel required id="cluster-label">
                    Cluster
                  </InputLabel>
                  <Select
                    error={cluster === ''}
                    name={'cluster'}
                    labelId="cluster-label"
                    id="cluster-select"
                    value={cluster}
                    label="cluster"
                    onChange={selectChange}
                  >
                    <MenuItem value={'events-publico'}>Events Publico</MenuItem>
                    <MenuItem value={'autorizadorcontas'}>
                      Autorizador Contas
                    </MenuItem>
                  </Select>
                  <FormHelperText>select the desired cluster.</FormHelperText>
                </FormControl>
                {/* Environment */}
                <FormControl sx={{ m: 1, minWidth: 100 }}>
                  <InputLabel required id="environment-label">
                    Environment
                  </InputLabel>
                  <Select
                    error={environment === ''}
                    name={'environment'}
                    labelId="environment-label"
                    id="environment-select"
                    value={environment}
                    label="environment"
                    onChange={selectChange}
                  >
                    <MenuItem value={'development'}>Development</MenuItem>
                    <MenuItem value={'homologation'}>Homologation</MenuItem>
                    <MenuItem value={'production'}>Production (Shit!)</MenuItem>
                  </Select>
                  <FormHelperText>
                    select the desired environment.
                  </FormHelperText>
                </FormControl>
                {/* Topic */}
                <FormControl sx={{ m: 1, minWidth: 400 }}>
                  <TextField
                    required
                    error={topic === ''}
                    value={topic}
                    name={'topic'}
                    id="topic-text"
                    label="Topic"
                    variant="outlined"
                    onChange={textChange}
                  />
                  <FormHelperText>enter the topic name.</FormHelperText>
                </FormControl>

                <FormControl sx={{ m: 1, minWidth: 50, top: '10px' }}>
                  <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={getSchemas}
                  >
                    Get Schemas
                  </Button>
                  <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                  >
                    <Alert
                      onClose={handleClose}
                      severity={snackBarProps.severity}
                      sx={{ width: '100%' }}
                    >
                      {snackBarProps.message}
                    </Alert>
                  </Snackbar>
                </FormControl>
                {/* Schema */}
                <FormControl
                  sx={{ m: 1, minWidth: 600 }}
                  disabled={schemas.length == 0}
                >
                  <InputLabel id="schema-label">Schema</InputLabel>
                  <Select
                    name={'schema'}
                    labelId="schema-label"
                    id="schema-select"
                    value={schema}
                    label="schema"
                    onChange={selectChange}
                  >
                    {schemas.map((name) => {
                      return (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText>select the desired event.</FormHelperText>
                </FormControl>
              </div>
            </Paper>
          </Grid>
          {/* Json Schema Avro */}
          <Grid item xs={12} md={6} lg={6}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 400
              }}
            >
              <p>Schema Avro</p>
              <CodeEditor
                value={schemaCode}
                language="js"
                placeholder="Please enter JS code."
                onChange={(evn) => setSchemaCode(evn.target.value)}
                padding={15}
                style={{
                  fontSize: 12,
                  backgroundColor: '#0d1a26',
                  fontFamily:
                    'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                  height: 380,
                  overflow: 'auto'
                }}
              />
            </Paper>
          </Grid>
          {/* Json Data Avro */}
          <Grid item xs={12} md={6} lg={6}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 400
              }}
            >
              <p>Request Avro Data</p>
              <CodeEditor
                value={dataCode}
                language="js"
                placeholder="Please enter JS code."
                onChange={(evn) => setDataCode(evn.target.value)}
                padding={15}
                style={{
                  fontSize: 12,
                  backgroundColor: '#0d1a26',
                  fontFamily:
                    'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                  height: 380,
                  overflow: 'auto'
                }}
              />
            </Paper>
          </Grid>
          {/* Actions Buttons */}
          <Grid item xs={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Button>Send Request</Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </MainTemplate>
  );
}
