import 'regenerator-runtime/runtime'

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initContract } from "./configs/near/utils";
import reportWebVitals from "./reportWebVitals";

import * as buffer from "buffer"

declare global {
  interface Window { nearInitPromise: any; walletConnection: any, contract: any}
}

window.Buffer = buffer.Buffer;

const root = ReactDOM.createRoot(
  document.getElementById("root")! as HTMLElement
);

// root.render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );

const APP_TO_RENDER = () => {
  return (
    <StrictMode>
        <App />
  </StrictMode>
  )
}


window.nearInitPromise = initContract()
  .then(() => {
    <APP_TO_RENDER />
    root.render(<APP_TO_RENDER />)
  })
  .catch(console.error)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
