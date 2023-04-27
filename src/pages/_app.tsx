import { ToastProvider } from '@/components/toastProvider';
import '@/styles/globals.css';
import '@/styles/dracula-prism.css';
import '@fontsource/fira-mono/400.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import Head from 'next/head';

const theme = createTheme({
  spacing: 5,
  palette: {
    secondary: { main: '#21243A' },
    info: { main: '#4E5161' },
  },
  typography: {
    fontFamily: 'Inter',
    button: {
      textTransform: 'none',
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </ThemeProvider>
    </>
  );
}
