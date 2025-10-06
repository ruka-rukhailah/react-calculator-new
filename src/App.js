import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');

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

    if (val === '=') {
      // Prevent evaluation if input ends with operator or is empty
      if (!input || isOperator(input[input.length - 1])) {
        setInput('Error');
        return;
      }
      try {
        const result = math.evaluate(input);
        setInput(result.toString());
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
    <div className="App calculator-bg">
      <h1 className="calc-title">React Calculator</h1>
      <div className="calc-container">
        <input className="calc-display" value={input} readOnly />
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

