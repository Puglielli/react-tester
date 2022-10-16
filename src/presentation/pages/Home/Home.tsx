import {
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
  TextField
} from '@mui/material';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { ChangeEvent, useState } from 'react';
import MainTemplate from '../../components/templates/MainTemplate/MainTemplate';
import axios from 'axios';

export function Home() {
  const [schemaCode, setSchemaCode] = useState(`{}`);
  const [dataCode, setDataCode] = useState(`{}`);
  const [topic, setTopic] = useState('');
  const [schema, setSchema] = useState('');
  const [cluster, setCluster] = useState('');
  const [environment, setEnvironment] = useState('');

  const textChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;

    if (target.name === 'topic') {
      setTopic(target.value);
    }
  };

  const selectChange = (event: SelectChangeEvent) => {
    const target = event.target;

    if (target.name === 'schema') {
      setSchema(target.value);
    } else if (target.name === 'cluster') {
      setCluster(target.value);
    } else if (target.name === 'environment') {
      setEnvironment(target.value);
    }
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
                {/* Topic */}
                <FormControl sx={{ m: 1, minWidth: 400 }}>
                  <TextField
                    required
                    error={false}
                    value={topic}
                    name={'topic'}
                    id="topic-text"
                    label="Topic"
                    variant="outlined"
                    onChange={textChange}
                  />
                </FormControl>
                {/* Schema */}
                <FormControl sx={{ m: 1, minWidth: 600 }}>
                  <InputLabel id="schema-label">Schema</InputLabel>
                  <Select
                    name={'schema'}
                    labelId="schema-label"
                    id="schema-select"
                    value={schema}
                    label="schema"
                    onChange={selectChange}
                  >
                    <MenuItem value="">
                      <em></em>
                    </MenuItem>
                    <MenuItem value={'solicitar-debito'}>
                      solicitarDebito
                    </MenuItem>
                    <MenuItem value={'solicitar-credito'}>
                      solicitarCredito
                    </MenuItem>
                  </Select>
                  <FormHelperText>select the desired event.</FormHelperText>
                </FormControl>
                {/* Cluster */}
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <InputLabel id="cluster-label">Cluster</InputLabel>
                  <Select
                    name={'cluster'}
                    labelId="cluster-label"
                    id="cluster-select"
                    value={cluster}
                    label="cluster"
                    onChange={selectChange}
                  >
                    <MenuItem value="">
                      <em></em>
                    </MenuItem>
                    <MenuItem value={'events-publico'}>Events Publico</MenuItem>
                    <MenuItem value={'autorizadorcontas'}>
                      Autorizador Contas
                    </MenuItem>
                  </Select>
                  <FormHelperText>select the desired cluster.</FormHelperText>
                </FormControl>
                {/* Environment */}
                <FormControl sx={{ m: 1, minWidth: 100 }}>
                  <InputLabel id="environment-label">Environment</InputLabel>
                  <Select
                    name={'environment'}
                    labelId="environment-label"
                    id="environment-select"
                    value={environment}
                    label="environment"
                    onChange={selectChange}
                  >
                    <MenuItem value="">
                      <em></em>
                    </MenuItem>
                    <MenuItem value={'development'}>Development</MenuItem>
                    <MenuItem value={'homologation'}>Homologation</MenuItem>
                    <MenuItem value={'production'}>Production (Shit!)</MenuItem>
                  </Select>
                  <FormHelperText>
                    select the desired environment.
                  </FormHelperText>
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
