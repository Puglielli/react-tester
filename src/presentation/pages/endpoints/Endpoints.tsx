import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  Snackbar
} from '@mui/material';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { SyntheticEvent, useEffect, useState } from 'react';
import MainTemplate from '../../components/templates/MainTemplate/MainTemplate';
import {
  getClusters,
  getSchemaAvro,
  getSchemaNames,
  getTopicNames,
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
import { TopicDTO } from '../../../controllers/dto/TopicDTO';
import { ClusterDTO } from '../../../controllers/dto/ClusterDTO';
import { SchemaDTO } from '../../../controllers/dto/SchemaDTO';
import { VersionDTO } from '../../../controllers/dto/VersionDTO';

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
  const [topic, setTopic] = useState('');
  const [topics, setTopics] = useState<Array<TopicDTO>>([]);
  const [schema, setSchema] = useState('');
  const [schemas, setSchemas] = useState<Array<SchemaDTO>>([]);
  const [version, setVersion] = useState('');
  const [versions, setVersions] = useState<Array<VersionDTO>>([]);
  const [cluster, setCluster] = useState('');
  const [clusters, setClusters] = useState<Array<ClusterDTO>>([]);
  const [panels, setPanels] = useState<Array<Panel>>(initialPanels);
  const [snackBarProps, setSnackBarProps] = useState<SnackBarProps>(initialize);

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

    if (eventName === 'cluster') {
      setCluster(value);
      getAllTopics(value);
    } else if (eventName === 'topic') {
      setTopic(value);
      getAllSchemas(value);
    } else if (eventName === 'schema') {
      setSchema(value);
      getAllVersions(topic, value);
    } else if (eventName === 'version') {
      setVersion(value);
      getAvro(topic, schema, value);
    }
  };

  const getAllTopics = (cluster: string) => {
    getTopicNames(cluster)
      .then((topics) => setTopics(topics))
      .catch((throwable) => callSnackBar(defaultError, throwable));
  };

  const getAllSchemas = (topic: string) => {
    getSchemaNames(topic)
      .then((schemas) => {
        if (schemas.length <= 0) {
          callSnackBar({
            message: 'Not found schemas!',
            severity: 'warning'
          });
        }
        setSchema('');
        setSchemas(schemas);
      })
      .catch((throwable) => callSnackBar(defaultError, throwable));
  };

  const getAllVersions = (topic: string, schema: string) => {
    getVersions(topic, schema)
      .then((versions) => setVersions(versions))
      .catch((throwable) => callSnackBar(defaultError, throwable));
  };

  const getAvro = (topic: string, schema: string, version: string) => {
    getSchemaAvro(topic, schema, version)
      .then((response) => {
        const { avro, data } = response;

        console.log(response);

        setSchemaCode(avro ?? '');
        setDataCode(data ?? '');
        setPanelExpand(panels, 'schema-panel', true, setPanels);
      })
      .catch((throwable) => callSnackBar(defaultError, throwable));
  };

  const handleChange = (id: string): void =>
    setPanelExpand(panels, id, undefined, setPanels);

  const sendRequest = () => {
    const data = {
      cluster: cluster,
      topic: topic,
      schema: schemaCode,
      payload: dataCode,
      headers: headerCode
    };

    console.log(`Data: `, data);

    sendEvent(data)
      .then((response: any) => {
        console.log(`response: ${response}`);
        const json = JSON.stringify(response);
        setResponseCode(json);
        setSnackBarProps({
          message: 'Event produced successfully!',
          severity: 'success'
        });
      })
      .catch((throwable: any) => callSnackBar(defaultError, throwable))
      .finally(() => {
        setShowSnackBar(true);
        setPanelExpand(panels, 'response-panel', true, setPanels);
      });
  };

  return (
    <MainTemplate>
      <h1>{pageName}</h1>
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
                {/* Clusters */}
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <InputLabel required id="cluster-label">
                    Cluster
                  </InputLabel>
                  <Select
                    name={'cluster'}
                    labelId="cluster-label"
                    id="cluster-select"
                    value={cluster}
                    label="cluster"
                    onChange={selectChange}
                  >
                    {clusters.map(({ id, name }) => {
                      return (
                        <MenuItem key={id} value={id}>
                          {name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText>select the desired cluster.</FormHelperText>
                </FormControl>

                {/* Topics */}
                <FormControl
                  sx={{ m: 1, minWidth: { xs: 100, sm: 500 } }}
                  disabled={cluster === ''}
                >
                  <InputLabel required id="topic-label">
                    Topic
                  </InputLabel>
                  <Select
                    name={'topic'}
                    labelId="topic-label"
                    id="topic-select"
                    value={topic}
                    label="topic"
                    onChange={selectChange}
                  >
                    {topics.map(({ name }) => {
                      return (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText>select the topic name.</FormHelperText>
                </FormControl>

                {/* Schemas */}
                <FormControl
                  sx={{ m: 1, minWidth: { xs: 50, sm: 600 } }}
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
                    {schemas.map(({ name }) => {
                      return (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText>select the desired event.</FormHelperText>
                </FormControl>

                {/* Versions */}
                <FormControl
                  sx={{ m: 1, minWidth: { xs: 50, sm: 100 } }}
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
                    {versions.map(({ number }) => {
                      return (
                        <MenuItem key={number} value={number}>
                          {number}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText>select the schema version.</FormHelperText>
                </FormControl>
              </div>
            </Paper>
          </Grid>

          {/* Requests panel */}
          <Grid item xs={3} md={6} lg={12}>
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
                display: responseCode !== '' ? 'show' : 'none'
              }}
              onChange={() => handleChange('response-panel')}
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
          <Grid item xs={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Button onClick={sendRequest}>Send Request</Button>
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
