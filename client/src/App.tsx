import React, { useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap";
import routes from "./router";
import { Notifier } from "./components/Notifier";
import { Spinner } from "react-bootstrap";
import ErrorAlert from "./components/Alerts/ErrorAlert";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const spinnerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const enableSpinner = (enable: boolean) => {
    if (spinnerRef.current) {
      spinnerRef.current.hidden = !enable;
    }
  };

  const showError = (message: string) => setError(message);

  return (
    <Notifier notifyBusy={enableSpinner} showError={showError}>
      <div className="spinner" ref={spinnerRef} hidden={true}>
        <Spinner />
      </div>
      {error && <ErrorAlert message={error} show={true} />}
      <main className="app-body">
        <Routes>
          {routes.map((route, idx) => (
            <Route
              key={idx}
              path={route.path}
              element={
                <React.Suspense fallback={<>...</>}>
                  <route.element />
                </React.Suspense>
              }
            />
          ))}
        </Routes>
      </main>
    </Notifier>
  );
};

export default App;
