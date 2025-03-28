import { Provider } from "react-redux";

import ReactDOM from "react-dom/client";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { persistor, store } from "./redux/store";
import LoaderHeartBit from "./regular/loaders/LoaderHeartBit";

import "./i18n";
import "./index.css";
import "./styles/global.scss";
import { BrowserRouter, Route, Routes } from "react-router";
import Settings from "./settings/Settings";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Provider store={store}>
    <PersistGate loading={<LoaderHeartBit />} persistor={persistor}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
