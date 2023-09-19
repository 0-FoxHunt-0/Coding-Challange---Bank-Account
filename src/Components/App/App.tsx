import { useReducer } from "react";
import "./App.css";
import Modal from "../Modal/Modal";

export enum ReducerActionType {
  Start = "start",
  Error = "error",
  CloseError = "closeError",
  OpenAccount = "openAccount",
  Deposit = "deposit",
  Withdraw = "withdraw",
  RequestLoan = "requestLoan",
  PayLoan = "payLoan",
  CloseAccount = "closeAccount",
}

type ReducerAction =
  | { type: ReducerActionType.Start }
  | { type: ReducerActionType.Error }
  | { type: ReducerActionType.CloseError }
  | { type: ReducerActionType.OpenAccount }
  | { type: ReducerActionType.Deposit; payload: number }
  | { type: ReducerActionType.Withdraw; payload: number }
  | { type: ReducerActionType.RequestLoan; payload: number }
  | { type: ReducerActionType.PayLoan }
  | { type: ReducerActionType.CloseAccount };

interface State {
  balance: number;
  loan: number;
  errorMessage: string;
  isActive: boolean;
  loanActive: boolean;
  showModal: boolean;
}

const initialState: State = {
  balance: 0,
  loan: 0,
  errorMessage: "",
  isActive: false,
  loanActive: false,
  showModal: false,
};

function reducer(state: State, action: ReducerAction): State {
  switch (action.type) {
    case ReducerActionType.Start:
      return initialState;
    case ReducerActionType.Error:
      return {
        ...state,
        showModal: true,
      };
    case ReducerActionType.CloseError:
      return {
        ...state,
        showModal: false,
      };
    case ReducerActionType.OpenAccount:
      return {
        ...state,
        isActive: true,
        balance: 500,
      };
    case ReducerActionType.Deposit:
      return {
        ...state,
        balance: state.balance + action.payload,
      };

    case ReducerActionType.Withdraw:
      return {
        ...state,
        balance: state.balance - action.payload,
      };

    case ReducerActionType.RequestLoan:
      if (!state.loanActive)
        return {
          ...state,
          loanActive: true,
          balance: state.balance + action.payload,
          loan: action.payload,
        };
      else {
        return {
          ...state,
          showModal: true,
          errorMessage: "You must pay your loan first!",
        };
      }

    case ReducerActionType.PayLoan:
      if (state.loanActive)
        return {
          ...state,
          balance: state.balance - state.loan,
          loan: 0,
          loanActive: false,
        };
      else {
        return {
          ...state,
          showModal: true,
          errorMessage: "There is no active loan to pay off",
        };
      }

    case ReducerActionType.CloseAccount:
      if (state.balance === 0)
        return {
          ...initialState,
        };
      else {
        return {
          ...state,
          showModal: true,
          errorMessage:
            "You're bank account must be empty before closing your account",
        };
      }

    default:
      return {
        ...state,
        showModal: true,
        errorMessage: "Unknown action!",
      };
  }
}

function App(): JSX.Element {
  const [{ balance, isActive, loan, showModal, errorMessage }, dispatch] =
    useReducer(reducer, initialState);

  return (
    <div className="App">
      <h1>useReducer Bank Account</h1>
      <p>Balance: {balance}</p>
      <p>Loan: {loan}</p>

      <p>
        <button
          onClick={() => {
            dispatch({ type: ReducerActionType.OpenAccount });
          }}
          disabled={isActive}
        >
          Open account
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: ReducerActionType.Deposit, payload: 150 });
          }}
          disabled={!isActive}
        >
          Deposit 150
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: ReducerActionType.Withdraw, payload: 50 });
          }}
          disabled={!isActive}
        >
          Withdraw 50
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: ReducerActionType.RequestLoan, payload: 5000 });
          }}
          disabled={!isActive}
        >
          Request a loan of 5000
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: ReducerActionType.PayLoan });
          }}
          disabled={!isActive}
        >
          Pay loan
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: ReducerActionType.CloseAccount });
          }}
          disabled={!isActive}
        >
          Close account
        </button>
      </p>

      {showModal && (
        <Modal
          dispatch={dispatch}
          showModal={showModal}
          errorText={
            errorMessage === "" ? "An error has occurred" : errorMessage
          }
        />
      )}
    </div>
  );
}

/* 
INSTRUCTIONS / CONSIDERATIONS:

TODO 1. Let's implement a simple bank account! It's similar to the example that I used as an analogy to explain how useReducer works, but it's simplified (we're not using account numbers here)

TODO 2. Use a reducer to model the following state transitions: openAccount, deposit, withdraw, requestLoan, payLoan, closeAccount. Use the `initialState` below to get started.

TODO 3. All operations (expect for opening account) can only be performed if isActive is true. If it's not, just return the original state object. You can check this right at the beginning of the reducer

TODO 4. When the account is opened, isActive is set to true. There is also a minimum deposit amount of 500 to open an account (which means that the balance will start at 500)

TODO 5. Customer can only request a loan if there is no loan yet. If that condition is met, the requested amount will be registered in the 'loan' state, and it will be added to the balance. If the condition is not met, just return the current state

TODO 6. When the customer pays the loan, the opposite happens: the money is taken from the balance, and the 'loan' will get back to 0. This can lead to negative balances, but that's no problem, because the customer can't close their account now (see next point)

TODO 7. Customer can only close an account if there is no loan, AND if the balance is zero. If this condition is not met, just return the state. If the condition is met, the account is deactivated and all money is withdrawn. The account basically gets back to the initial state
*/

export default App;
