import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
} from '@mui/icons-material';

const Report = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('income');
  const [combinedFilterType, setCombinedFilterType] = useState('income');
  const [data, setData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('original');
  const [startDate, setStartDate] = useState(moment().startOf('year').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));

  const fetchOriginalData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/reports/reports', {
        params: {
          type: filterType,
          startDate,
          endDate,
        },
      });
      setData(response.data.records);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCombinedData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/reports/aggregated-reports', {
        params: {
          type: combinedFilterType,
          startDate,
          endDate,
        },
      });
      setCombinedData(response.data.aggregatedData);
    } catch (error) {
      console.error('Error fetching combined data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'original') {
      fetchOriginalData();
    } else {
      fetchCombinedData();
    }
  }, [activeSection, filterType, combinedFilterType, startDate, endDate]);

  const handleDownload = async (format) => {
    try {
      const endpoint = activeSection === 'original' ? '/api/reports/download-report' : '/api/reports/download-aggregated-report';
      const type = activeSection === 'original' ? filterType : combinedFilterType;
      
      const response = await axios.get(endpoint, {
        params: {
          type,
          format,
          startDate,
          endDate,
        },
        responseType: 'blob',
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_${activeSection}_report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reports
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Button
              variant={activeSection === 'original' ? 'contained' : 'outlined'}
            onClick={() => setActiveSection('original')}
              fullWidth
          >
            Original Data
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant={activeSection === 'combined' ? 'contained' : 'outlined'}
            onClick={() => setActiveSection('combined')}
              fullWidth
          >
            Combined Data
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={activeSection === 'original' ? filterType : combinedFilterType}
                    onChange={(e) => {
                  if (activeSection === 'original') {
                    setFilterType(e.target.value);
                  } else {
                    setCombinedFilterType(e.target.value);
                  }
                }}
                label="Report Type"
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expenditure">Expenditure</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Download PDF">
                <IconButton onClick={() => handleDownload('pdf')} color="primary">
                  <PdfIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download Excel">
                <IconButton onClick={() => handleDownload('xlsx')} color="primary">
                  <ExcelIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>

        {activeSection === 'original' ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>{filterType === 'income' ? 'Revenue Source' : 'Votehead'}</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>{moment(record.createdAt).format('MMM D, YYYY')}</TableCell>
                    <TableCell>
                      {filterType === 'income'
                        ? record.revenueSource?.name || 'N/A'
                        : record.votehead?.name || 'N/A'}
                    </TableCell>
                    <TableCell>{record.amount.toFixed(2)}</TableCell>
                    <TableCell>{record.description || 'N/A'}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} />
                  <TableCell>
                    <strong>
                      Total: {data.reduce((sum, record) => sum + record.amount, 0).toFixed(2)}
                    </strong>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{combinedFilterType === 'income' ? 'Revenue Source' : 'Votehead'}</TableCell>
                  <TableCell>Total Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {combinedData.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.totalAmount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell>
                    <strong>
                      {combinedData.reduce((sum, item) => sum + item.totalAmount, 0).toFixed(2)}
                    </strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default Report;
