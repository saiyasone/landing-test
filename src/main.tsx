import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "stores/index.ts";
import App from "./App.tsx";
import "./index.css";
import { ENV_KEYS } from "constants/env.constant.ts";
import { setContext } from "@apollo/client/link/context";

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(
    ENV_KEYS.REACT_APP_ACCESS_TOKEN_KEY as string,
  );

  return {
    headers: {
      ...headers,
      authorization: token,
    },
  };
});

const client = new ApolloClient({
  link: from([
    authLink.concat(
      createHttpLink({
        uri: ENV_KEYS.REACT_APP_API_URL,
      }),
    ),
  ]),
  cache: new InMemoryCache({
    addTypename: false,
  }),
  connectToDevTools: false,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ApolloProvider>
    </Provider>
  </React.StrictMode>,
);
