import React from "react";
import { Route, Routes } from "react-router-dom";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import routes from "./router";

const App = () => {
  return (
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
  );
};

export default App;
