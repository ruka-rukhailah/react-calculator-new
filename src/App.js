import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);

  // Original calculator button layout
  const buttons = [
    '7', '8', '9', '÷',
    '4', '5', '6', '×',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
    'C'
  ];

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
    } else if (val === 'C') {
      setInput('');
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
    <div className={`App calculator-bg${darkMode ? ' dark-mode' : ''}`}>
      <button
        style={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}
        onClick={() => setDarkMode((prev) => !prev)}
        aria-label="Toggle dark mode"
      >
        {darkMode ? '🌙 Dark' : '☀️ Light'}
      </button>
      <h1 className="calc-title">React Calculator</h1>
      <div className={`calc-container${darkMode ? ' dark-mode' : ''}`}>
  <input className="calc-display" value={input} readOnly aria-label="Calculator display" />
        {/* History Section - iPhone style */}
        <div className="calc-history-container">
          <div className="calc-history-label">History</div>
          <div className="calc-history-list">
            {history.length === 0 ? (
              <div className="calc-history-empty">No history yet</div>
            ) : (
              <ul>
                {history.slice(0, 10).map((item, idx) => (
                  <li key={idx} className="calc-history-item">{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="buttons">
          {buttons.map((btn, i) => (
            <button
              key={i}
              className={`calc-btn ${btn === 'C' ? 'btn-clear' : btn === '=' ? 'btn-equals' : isOperator(btn) ? 'btn-operator' : ''}`}
              onClick={() => handleClick(btn)}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

