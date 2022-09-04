import "../styles/globals.css";
import type { AppProps } from "next/app";
import TopBar from "../components/TopBar";
import Page from "../components/Page";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div
      style={{
        display: "block",
        overflow: "auto",
      }}
    >
      <TopBar />
      <Page>
        <Component {...pageProps} />
      </Page>
    </div>
  );
}

export default MyApp;
