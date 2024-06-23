import React from "react";
import ReactDOM from "react-dom/client";
import { store, persistor } from "./store.ts";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";
import ThemeProvider from "./context/ThemeProvider.tsx";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PersistGate persistor={persistor}>
      <Provider store={store}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
      </Provider>
    </PersistGate>
  </React.StrictMode>
);
