import reactLogo from "./react.svg";
import { Button } from "./Button.tsx";
import "./App.css";

export const App = () => (
  <div className="App">
    <div style={{ position: "fixed", right: 40, top: 40 }}>Top right</div>
    <div className="full-height">Full height</div>
    <div>
      <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
        <img src="/vite.svg" className="logo" alt="Vite logo" />
      </a>
      <a href="https://reactjs.org" target="_blank" rel="noreferrer">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
    </div>
    <h1>Vite + React</h1>
    <div className="card">
      <Button />
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
    </div>
    <p className="read-the-docs">
      Click on the Vite and React logos to learn more
    </p>
  </div>
);
