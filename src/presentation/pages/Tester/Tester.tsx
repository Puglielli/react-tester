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
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import {
  expandedPanel,
  ExpandedProps
} from '../../components/Expanded/ExpandedUtils';
import { post } from '../../../config/Client';

export function Tester() {
  const [schemaCode, setSchemaCode] = useState('{}');
  const [dataCode, setDataCode] = useState('{}');
  const [headerCode, setHeaderCode] = useState('{}');
  const [responseCode, setResponseCode] = useState(' ');
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
          setExpanded(expandedPanel(expanded, 'schema-panel', true));
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

  const [expanded, setExpanded] = useState<Array<ExpandedProps>>([
    {
      id: 'schema-panel',
      enabled: false
    },
    {
      id: 'request-panel',
      enabled: false
    },
    {
      id: 'header-panel',
      enabled: false
    },
    {
      id: 'response-panel',
      enabled: false
    }
  ]);

  const handleChange =
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (id: string) => (event: SyntheticEvent, isExpanded: boolean) =>
      setExpanded(expandedPanel(expanded, id));

  const sendRequest = () => {
    const data = {
      cluster: cluster,
      environment: environment,
      topic: topic,
      schema: schemaCode,
      payload: dataCode,
      headers: headerCode
    };

    post('/send', data)
      .then((response) => {
        const json = JSON.stringify(response.data);
        setResponseCode(json);
        setSnackBarProps({
          message: 'Event produced successfully!',
          severity: 'success'
        });
      })
      .catch((err) => {
        setSnackBarProps({ message: 'Error found!', severity: 'error' });
        setResponseCode(err);
        console.error(err);
      })
      .finally(() => {
        setOpen(true);
        setExpanded(expandedPanel(expanded, 'response-panel', true));
      });
  };

  return (
    <MainTemplate>
      <h1>Tester</h1>
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
          {/* Requests Panel */}
          <Grid item xs={3} md={6} lg={12}>
            {/* Schema Panel */}
            <Accordion
              expanded={
                expanded.filter((item) => item.id === 'schema-panel')[0].enabled
              }
              onChange={handleChange('schema-panel')}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="schema-panel-content"
                id="schema-panel-id"
              >
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                  Schema Avro
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  Json from schema avro selected
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 400
                  }}
                >
                  <CodeEditor
                    value={schemaCode}
                    language="js"
                    placeholder="Please enter Json code."
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
              </AccordionDetails>
            </Accordion>
            {/* Request Panel */}
            <Accordion
              expanded={
                expanded.filter((item) => item.id === 'request-panel')[0]
                  .enabled
              }
              onChange={handleChange('request-panel')}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="request-panel-content"
                id="request-panel-id"
              >
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                  Request Schema Data
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  Request Json from producer event
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 400
                  }}
                >
                  <CodeEditor
                    value={dataCode}
                    language="js"
                    placeholder="Please enter Json code."
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
              </AccordionDetails>
            </Accordion>
            {/* Header Panel */}
            <Accordion
              expanded={
                expanded.filter((item) => item.id === 'header-panel')[0].enabled
              }
              onChange={handleChange('header-panel')}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="header-panel-content"
                id="header-panel-id"
              >
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                  Headers
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  header attributes for request
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 400
                  }}
                >
                  <CodeEditor
                    value={headerCode}
                    language="js"
                    placeholder="Please enter Json code."
                    onChange={(evn) => setHeaderCode(evn.target.value)}
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
              </AccordionDetails>
            </Accordion>
            {/* Response Panel */}
            <Accordion
              expanded={
                expanded.filter((item) => item.id === 'response-panel')[0]
                  .enabled
              }
              onChange={handleChange('response-panel')}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="response-panel-content"
                id="response-panel-id"
              >
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                  Response
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  request return
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 400
                  }}
                >
                  <CodeEditor
                    value={responseCode}
                    language="js"
                    placeholder="Please enter Json code."
                    onChange={(evn) => setResponseCode(evn.target.value)}
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
              </AccordionDetails>
            </Accordion>
          </Grid>
          {/* Actions Buttons */}
          <Grid item xs={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Button onClick={sendRequest}>Send Request</Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </MainTemplate>
  );
}
