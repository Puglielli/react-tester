import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Snackbar,
  Tooltip
} from '@mui/material';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { SyntheticEvent, useEffect, useState } from 'react';
import MainTemplate from '../../components/templates/MainTemplate/MainTemplate';
import {
  getClusters,
  getSchemaAvro,
  getTopicAndSchemas,
  getVersions,
  sendEvent
} from '../../../controllers/KafkaController';
import {
  defaultError,
  initialize,
  SnackBarProps
} from '../../components/snackbar/SnackBar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import { Panel, setPanelExpand } from '../../components/panel/Panel';
import { ClusterDTO } from '../../../controllers/dto/ClusterDTO';
import IconButton from '@mui/material/IconButton';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { ResponseDTO } from '../../../controllers/dto/ResponseDTO';
import LoadingButton from '@mui/lab/LoadingButton';

const pageName = 'Endpoints';

const initialPanels = [
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
];

export function Endpoints() {
  const [schemaCode, setSchemaCode] = useState('{}');
  const [dataCode, setDataCode] = useState('{}');
  const [headerCode, setHeaderCode] = useState('{}');
  const [responseCode, setResponseCode] = useState('');
  const [inputTopic, setInputTopic] = useState('');
  const [topic, setTopic] = useState('');
  const [topics, setTopics] = useState<any>([]);
  const [schema, setSchema] = useState('');
  const [schemas, setSchemas] = useState([]);
  const [topicsAndSchemas, setTopicsAndSchemas] = useState<any | null>(null);
  const [version, setVersion] = useState('');
  const [versions, setVersions] = useState<Array<number>>([]);
  const [inputCluster, setInputCluster] = useState('');
  const [cluster, setCluster] = useState<ClusterDTO | null>(null);
  const [clusters, setClusters] = useState<Array<ClusterDTO>>([]);
  const [panels, setPanels] = useState<Array<Panel>>(initialPanels);
  const [snackBarProps, setSnackBarProps] = useState<SnackBarProps>(initialize);
  const [loadingSendButton, setLoadingSendButton] = useState(false);

  const [showSnackBar, setShowSnackBar] = useState(false);
  const handleClose = (event?: SyntheticEvent | Event, reason?: string) =>
    reason !== 'clickaway' ? setShowSnackBar(false) : undefined;

  const callSnackBar = (
    snackBarProps: SnackBarProps,
    throwable?: any | undefined
  ): void => {
    setSnackBarProps(snackBarProps);
    setShowSnackBar(true);
    throwable ? console.error(throwable.error) : undefined;
  };

  useEffect(() => {
    getClusters()
      .then((clusters) => setClusters(clusters))
      .catch((throwable) => callSnackBar(defaultError, throwable));
  }, []);

  const selectChange = (event: SelectChangeEvent) => {
    const { name: eventName, value } = event.target;

    if (eventName === 'topic') {
      setTopic(value);
      getAllSchemas(value);
    } else if (eventName === 'schema') {
      setSchema(value);
      getAllVersions(cluster!, topic, value);
    } else if (eventName === 'version') {
      setVersion(value);
      getAvro(cluster!, topic, schema, value);
    }
  };

  const selectChange2 = (event: string, value: any) => {
    if (event === 'cluster') {
      setCluster(value);
      setInitialTopicAndSchemas(value);
    } else if (event === 'topic') {
      setTopic(value);
      getAllSchemas(value);
    } else if (event === 'schema') {
      setSchema(value);
      getAllVersions(cluster!, topic, value);
    } else if (event === 'version') {
      setVersion(value);
      getAvro(cluster!, topic, schema, value);
    }
  };

  const setInitialTopicAndSchemas = (cluster: ClusterDTO) => {
    if (cluster == null) {
      setTopicsAndSchemas(null);
      setTopics([]);
    } else {
      getTopicAndSchemas(cluster)
        .then((topicsAndSchemas) => {
          setTopicsAndSchemas(topicsAndSchemas);
          setTopics(Object.keys(topicsAndSchemas ?? {}));
        })
        .catch((throwable) => callSnackBar(defaultError, throwable));
    }
  };

  const getAllSchemas = (topic: string) => {
    const schemas = topicsAndSchemas[topic];
    if (schemas.length <= 0) {
      callSnackBar({
        message: 'Not found schemas!',
        severity: 'warning'
      });
    }
    setSchema('');
    setSchemas(schemas);
  };

  const getAllVersions = (
    cluster: ClusterDTO,
    topic: string,
    schema: string
  ) => {
    getVersions(cluster, topic, schema)
      .then((versions) => setVersions(versions))
      .catch((throwable) => callSnackBar(defaultError, throwable));
  };

  const getAvro = (
    cluster: ClusterDTO,
    topic: string,
    schema: string,
    version: string
  ) => {
    getSchemaAvro(cluster, topic, schema, version)
      .then((schemaDTO) => {
        const { schema, avro } = schemaDTO;

        setSchemaCode(schema ?? '');
        setDataCode(avro ?? '');
        setPanelExpand(panels, 'schema-panel', true, setPanels);
      })
      .catch((throwable) => callSnackBar(defaultError, throwable));
  };

  const handleChange = (id: string): void =>
    setPanelExpand(panels, id, undefined, setPanels);

  const sendRequest = () => {
    setLoadingSendButton(true);
    try {
      const data = {
        cluster: cluster?.id,
        topic: topic,
        schema: JSON.parse(schemaCode),
        payload: JSON.parse(dataCode),
        headers: headerCode === '' ? JSON.parse('{}') : JSON.parse(headerCode)
      };

      sendEvent(data)
        .then((response: ResponseDTO) => {
          setResponseCode(JSON.stringify(response, undefined, 2));
          setSnackBarProps({
            message: 'Event produced successfully!',
            severity: 'success'
          });
        })
        .catch((throwable: any) => callSnackBar(defaultError, throwable))
        .finally(() => {
          setShowSnackBar(true);
          panelJsonFormat('response-panel');
          setPanelExpand(panels, 'response-panel', true, setPanels);
          setLoadingSendButton(false);
        });
    } catch (e) {
      callSnackBar(defaultError, e);
      console.error(e);
      setLoadingSendButton(false);
    }
  };

  const formatJson = (str: string) => {
    try {
      return JSON.stringify(JSON.parse(str), undefined, 4);
    } catch (e) {
      callSnackBar(defaultError, e);
      console.error(e);
      return str;
    }
  };

  const panelJsonFormat = (panelId: string) => {
    handleChange(panelId);
    if (panelId == 'header-panel') setHeaderCode(formatJson(headerCode));
    else if (panelId == 'response-panel')
      setResponseCode(formatJson(responseCode));
  };

  return (
    <MainTemplate>
      <h1>{pageName}</h1>
      <Container sx={{ mt: 4, mb: 4 }} maxWidth={false}>
        <Grid container spacing={3}>
          {/* Select Properties */}
          <Grid item xs={12} md={12} lg={12}>
            <Paper sx={{ p: 2 }}>
              <div style={{ display: 'flex' }}>
                {/* Clusters */}
                <FormControl sx={{ m: 1, flex: 1 }}>
                  <Autocomplete
                    value={cluster}
                    onChange={(_: any, newValue: any) => {
                      selectChange2('cluster', newValue);
                    }}
                    inputValue={inputCluster}
                    onInputChange={(event, newInputValue) =>
                      setInputCluster(newInputValue)
                    }
                    id="cluster-label"
                    options={clusters}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField required {...params} label="Cluster" />
                    )}
                  />
                </FormControl>

                {/* Topics */}
                <FormControl sx={{ m: 1, flex: 1 }}>
                  <Autocomplete
                    disabled={cluster?.id == undefined}
                    value={topic}
                    onChange={(_: any, newValue: any) => {
                      selectChange2('topic', newValue);
                    }}
                    inputValue={inputTopic}
                    onInputChange={(event, newInputValue) =>
                      setInputTopic(newInputValue)
                    }
                    id="topics-label"
                    options={topics}
                    renderInput={(params) => (
                      <TextField required {...params} label="Topics" />
                    )}
                  />
                </FormControl>
              </div>

              <div style={{ display: 'flex' }}>
                {/* Schemas */}
                <FormControl
                  sx={{ m: 1, flex: 1, flexGrow: { xs: 1, sm: 5, md: 10 } }}
                  disabled={schemas?.length <= 0}
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
                    {schemas.map((schema) => {
                      return (
                        <MenuItem key={schema} value={schema}>
                          {schema}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                {/* Versions */}
                <FormControl
                  sx={{ m: 1, flex: 1 }}
                  disabled={schemas?.length <= 0}
                >
                  <InputLabel id="version-label">Versions</InputLabel>
                  <Select
                    name={'version'}
                    labelId="version-label"
                    id="version-select"
                    value={version}
                    label="version"
                    onChange={selectChange}
                  >
                    {versions.map((version) => {
                      return (
                        <MenuItem key={version} value={version}>
                          {version}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
            </Paper>
          </Grid>

          {/* Requests panel */}
          <Grid item xs={12} md={12} lg={12}>
            {/* Schema panel */}
            <Accordion
              expanded={
                panels.filter((item) => item.id === 'schema-panel')[0].enabled
              }
              onChange={() => handleChange('schema-panel')}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="schema-panel-content"
                id="schema-panel-id"
              >
                <Typography sx={{ minWidth: '33%', flexShrink: 0 }}>
                  Schema Avro
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    display: { xs: 'none', sm: 'none', md: 'block' }
                  }}
                >
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
                    language="json"
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

            {/* Request panel */}
            <Accordion
              expanded={
                panels.filter((item) => item.id === 'request-panel')[0].enabled
              }
              onChange={() => handleChange('request-panel')}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="request-panel-content"
                id="request-panel-id"
              >
                <Typography sx={{ minWidth: '33%', flexShrink: 0 }}>
                  Request Schema Data
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    display: { xs: 'none', sm: 'none', md: 'block' }
                  }}
                >
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
                    language="json"
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

            {/* Header panel */}
            <Accordion
              expanded={
                panels.filter((item) => item.id === 'header-panel')[0].enabled
              }
              onChange={() => handleChange('header-panel')}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="header-panel-content"
                id="header-panel-id"
              >
                <Typography sx={{ minWidth: '33%', flexShrink: 0 }}>
                  Headers
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    display: { xs: 'none', sm: 'none', md: 'block' }
                  }}
                >
                  Header attributes for request
                </Typography>
                <Tooltip title="Format Json" placement="top">
                  <IconButton
                    color="primary"
                    size="small"
                    sx={{
                      position: 'absolute',
                      right: 50,
                      display: panels.filter(
                        (item) => item.id === 'header-panel'
                      )[0].enabled
                        ? 'block'
                        : 'none'
                    }}
                    onClick={() => panelJsonFormat('header-panel')}
                  >
                    <FormatAlignCenterIcon />
                  </IconButton>
                </Tooltip>
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
                    language="json"
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

            {/* Response panel */}
            <Accordion
              expanded={
                panels.filter((item) => item.id === 'response-panel')[0].enabled
              }
              style={{
                display: responseCode !== '' ? '' : 'none'
              }}
              onChange={() => handleChange('response-panel')}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="response-panel-content"
                id="response-panel-id"
              >
                <Typography sx={{ minWidth: '33%', flexShrink: 0 }}>
                  Response
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    display: { xs: 'none', sm: 'none', md: 'block' }
                  }}
                >
                  Response return
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
                    language="json"
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
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <LoadingButton
                size="small"
                onClick={sendRequest}
                loading={loadingSendButton}
                variant="outlined"
              >
                Send Request
              </LoadingButton>
            </Paper>
          </Grid>
        </Grid>

        {/* Alerts */}
        <Snackbar
          open={showSnackBar}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={snackBarProps?.severity}
            sx={{ width: '100%' }}
          >
            {snackBarProps?.message}
          </Alert>
        </Snackbar>
      </Container>
    </MainTemplate>
  );
}
