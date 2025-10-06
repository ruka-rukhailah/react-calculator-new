import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('calc-history');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist history to localStorage
  useEffect(() => {
    localStorage.setItem('calc-history', JSON.stringify(history));
  }, [history]);

  // Professional calculator button layout
  const buttons = [
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['±', '0', '.', '='],
    ['←', 'AC']
  ];

  // Scientific buttons
  const sciButtons = [
    ['(', ')', '√', '^'],
    ['π', 'e']
  ];

  const [sciOpen, setSciOpen] = useState(false);

  const math = require('mathjs');
  const isOperator = (char) => ['+', '-', '*', '/'].includes(char);
  const handleClick = (value) => {
    let val = value;
    if (value === '×') val = '*';
    if (value === '÷') val = '/';

    // Clear error state if user starts new calculation
    if (input === 'Error' && val !== 'C') {
      setInput('');
    }

    if (val === '=') {
      // Prevent evaluation if input ends with operator or is empty
      if (!input || isOperator(input[input.length - 1])) {
        setInput('Error');
        return;
      }
      try {
        const result = math.evaluate(input);
        setInput(result.toString());
        setHistory(prev => [input + ' = ' + result, ...prev]);
      } catch {
        setInput('Error');
      }
    } else if (val === 'C' || val === 'AC') {
      setInput('');
    } else if (val === '←') {
      setInput(input.slice(0, -1));
    } else {
      // Prevent consecutive operators and starting with operator except minus
      if (isOperator(val)) {
        if (!input && val !== '-') return;
        if (isOperator(input[input.length - 1])) return;
      }
      setInput(input + val);
    }
  };

  return (
  <Box sx={{ minHeight: '100vh', bgcolor: '#232323', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: { xs: 1, sm: 4 }, px: { xs: 1, sm: 0 } }}>
  <Paper elevation={8} sx={{ borderRadius: 6, p: { xs: 2, sm: 4 }, width: { xs: '100%', sm: 400, md: 420 }, maxWidth: 420, bgcolor: '#232323', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 12px 48px rgba(200,180,255,0.22)', mb: 4 }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mb: 3 }}>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, letterSpacing: 2, textAlign: 'center', mb: 3, textShadow: '0 2px 8px #222' }}>
              Calculator
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1, maxWidth: 480, mx: 'auto' }}>
              <TextField
                className="calc-display"
                value={input}
                InputProps={{ readOnly: true, sx: { fontSize: '2.4rem', color: '#fff', background: '#232323', borderRadius: 2, textAlign: 'right', padding: '32px 32px', boxShadow: '0 2px 8px #222' } }}
                sx={{ width: '100%', maxWidth: 480 }}
                aria-label="Calculator display"
                variant="filled"
                inputProps={{ 'aria-label': 'Calculator display', style: { textAlign: 'right' } }}
              />
              <Button
                variant="contained"
                sx={{ minWidth: 36, height: 36, fontSize: '0.9rem', borderRadius: 1, background: '#cce7ff', color: '#2575fc', p: 0, boxShadow: 2 }}
                onClick={() => {
                  if (input) {
                    navigator.clipboard.writeText(input);
                  }
                }}
                aria-label="Copy result"
              >
                Copy
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                sx={{ flex: 1, color: '#90caf9', borderColor: '#90caf9', fontWeight: 600, letterSpacing: 1, borderRadius: 2, boxShadow: 1 }}
                onClick={() => setHistoryOpen(true)}
                aria-label="View calculation history"
              >
                View History
              </Button>
              <Button
                variant="outlined"
                sx={{ flex: 1, color: '#90caf9', borderColor: '#90caf9', fontWeight: 600, letterSpacing: 1, borderRadius: 2, boxShadow: 1 }}
                onClick={() => setSciOpen(true)}
                aria-label="Show scientific functions"
              >
                Scientific
              </Button>
            </Box>
          </Box>
          <Box className="buttons" sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(4, 1fr)', sm: 'repeat(4, 80px)' }, gap: { xs: 1.5, sm: 2.5 }, justifyContent: 'center', mb: 2 }}>
            {/* Responsive button sizing */}
            {buttons.flat().map((btn, i) => (
              <Button
                key={btn + i}
                variant={['AC', '=', '←'].includes(btn) ? 'contained' : 'outlined'}
                color={['÷', '×', '-', '+', '%'].includes(btn) ? 'primary' : 'inherit'}
                sx={{ fontSize: { xs: '1.5rem', sm: '2.2rem' }, width: { xs: '100%', sm: '80px' }, height: { xs: 56, sm: 80 }, minWidth: 0, borderRadius: 3, background: btn === 'AC' ? '#f44336' : btn === '=' ? '#1976d2' : btn === '←' ? '#ff9800' : '#fff', color: btn === '=' ? '#fff' : '#232323', boxShadow: btn === '=' ? 4 : 1, fontWeight: 600, letterSpacing: 1, '&:hover': { background: btn === 'AC' ? '#d32f2f' : btn === '=' ? '#1565c0' : btn === '←' ? '#fb8c00' : '#f5f5f5' }, outline: 'none' }}
                onClick={() => handleClick(btn)}
                disableRipple
                aria-label={`Calculator button ${btn}`}
              >
                {btn}
              </Button>
            ))}
          </Box>
        </Box>
      </Paper>
      <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: '#222', color: '#90caf9', fontWeight: 700, textAlign: 'center' }}>History</DialogTitle>
        <DialogContent sx={{ bgcolor: '#222', minHeight: 200 }}>
          {history.length === 0 ? (
            <Box sx={{ color: '#aaa', fontSize: '1.1rem', py: 1, textAlign: 'center' }}>No history yet</Box>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {history.slice(0, 50).map((item, idx) => (
                <li key={idx} style={{ fontSize: '1.1rem', color: '#fff', padding: '8px 0', borderBottom: '1px solid #333' }}>{item}</li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>

      {/* Scientific Functions Dialog */}
      <Dialog open={sciOpen} onClose={() => setSciOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: '#222', color: '#90caf9', fontWeight: 700, textAlign: 'center' }}>Scientific Functions</DialogTitle>
        <DialogContent sx={{ bgcolor: '#222', minHeight: 120 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            {sciButtons.flat().map((btn, i) => (
              <Button
                key={btn + i}
                variant="outlined"
                color="primary"
                sx={{ fontSize: '1.4rem', minWidth: 0, borderRadius: 2, background: '#fff', color: '#232323', fontWeight: 600, letterSpacing: 1, outline: 'none', transition: 'background 0.2s, box-shadow 0.2s', '&:hover': { background: '#e3e3e3' } }}
                onClick={() => {
                  setInput(input + btn);
                  setSciOpen(false);
                }}
                aria-label={`Scientific button ${btn}`}
              >
                {btn}
              </Button>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
      
  );
}

export default App;

