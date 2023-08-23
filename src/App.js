import { useReducer } from 'react';
import './App.css';
import DigitButton from './components/DigitButton';
import OperationButton from './components/OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  EVALUATE: 'evaluate'
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT: {
      if (state.overwrite) return { ...state, currentOperand: payload.digit, overwrite: false }
      if (payload.digit === '0' && state.currentOperand === '0') return state;
      if (payload.digit === "." && state.currentOperand == null) { return state }
      if (payload.digit === '.' && state.currentOperand.includes('.')) return state;
      if (state.currentOperand === '0' && payload.digit !== '.' && state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: `${payload.digit}`
        }
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`
      }
    }
    case ACTIONS.CHOOSE_OPERATION: {
      if (state.currentOperand.endsWith('.')) return state;
      if (state.currentOperand == null && state.previusOperand == null) return state;
      if (state.previusOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previusOperand: state.currentOperand,
          currentOperand: null,
        }
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }
      return {
        ...state,
        previusOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
    }
    case ACTIONS.EVALUATE: {
      if (state.operation == null | state.currentOperand == null || state.previusOperand == null) return state;
      return {
        ...state,
        overwrite: true,
        previusOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }
    }
    case ACTIONS.DELETE_DIGIT: {
      if (state.overwrite) return { ...state, overwrite: false, currentOperand: null };
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) return { ...state, currentOperand: '0' }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    }
    case ACTIONS.CLEAR: {
      return {
        ...state,
        currentOperand: '0',
        previusOperand: null,
        operation: null
      }
    }
  }
}

function evaluate({ currentOperand, previusOperand, operation }) {
  const prev = parseFloat(previusOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ''
  let computation = ""
  switch (operation) {
    case '+':
      computation = prev + current
      break;
    case '-':
      computation = prev - current
      break;
    case '*':
      computation = prev * current
      break;
    case '÷':
      computation = prev / current
      break;
  }
  return computation.toString()
}

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOperand, previusOperand, operation }, dispatch] = useReducer(reducer, { currentOperand: '0' });
  return (
    <div className='container'>
      <div className='grid-layout'>
        <div className='result'>
          <div className='previus-operand'>{formatOperand(previusOperand)} {operation}</div>
          <div className='current-operand'>{formatOperand(currentOperand)}</div>
        </div>
        <button className='spam-two' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
        <OperationButton operation='÷' dispatch={dispatch} />
        <DigitButton digit='7' dispatch={dispatch} />
        <DigitButton digit='8' dispatch={dispatch} />
        <DigitButton digit='9' dispatch={dispatch} />
        <OperationButton operation='*' dispatch={dispatch} />
        <DigitButton digit='4' dispatch={dispatch} />
        <DigitButton digit='5' dispatch={dispatch} />
        <DigitButton digit='6' dispatch={dispatch} />
        <OperationButton operation='+' dispatch={dispatch} />
        <DigitButton digit='1' dispatch={dispatch} />
        <DigitButton digit='2' dispatch={dispatch} />
        <DigitButton digit='3' dispatch={dispatch} />
        <OperationButton operation='-' dispatch={dispatch} />
        <DigitButton digit='0' dispatch={dispatch} />
        <DigitButton digit='.' dispatch={dispatch} />
        <button className='spam-two bg-red' onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
      </div>
    </div>
  );
}

export default App;
