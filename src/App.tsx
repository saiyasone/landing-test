import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import "./App.css";

const emotionCache = createCache({ key: "css" });

function App() {
  const [title, setTitle] = useState("");
  return (
    <CacheProvider value={emotionCache}>
      <div>test</div>
    </CacheProvider>
  );
}

export default App;
