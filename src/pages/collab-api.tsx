import { InfoBar } from '@/components/infoBar';
import { GetStaticProps } from 'next';
import styles from './collab-api.module.css';
import { LogoStack } from '@/components/logoStack';
import { Button, Stack } from '@mui/material';
import { ArrowUpRight, Book, Github, Info } from 'lucide-react';
import { readFileSync } from 'fs';
import path from 'path';
import getConfig from 'next/config';
import Prism from 'prismjs';

const { publicRuntimeConfig } = getConfig();

export const getStaticProps: GetStaticProps = async () => {
  const htmlPath = path.join(process.cwd(), 'public', 'html', 'collab-demo.html');
  const demoHtml = readFileSync(htmlPath, 'utf-8');

  const highlighted = Prism.highlight(demoHtml, Prism.languages.html, 'html');

  return {
    props: {
      demoHtml: highlighted,
    },
  };
};

export default function CollabApi(properties: { demoHtml: string }) {
  return (
    <div className={styles.grid}>
      <InfoBar className={styles.infoBar} />
      <Stack
        className={styles.menuBar}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <LogoStack siteName="SureSheet {Collab API}" />
        <Stack direction="row" spacing={2}>
          <Button
            type="button"
            variant="contained"
            color="info"
            href="https://suresheet-docs.equalto.com/"
            target="_blank"
            startIcon={<Book />}
            title="API docs"
          >
            <span className={styles.wideOnly}>API docs</span>
          </Button>
          <Button
            type="button"
            variant="contained"
            color="info"
            href="https://github.com/EqualTo-Software/SureSheet"
            target="_blank"
            startIcon={<Github />}
            title="GitHub"
          >
            <span className={styles.wideOnly}>GitHub</span>
          </Button>
        </Stack>
      </Stack>
      <div className={styles.leftPanel}>
        <WelcomeCopy />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Info className={styles.infoIcon} size={14} fontSize={14} />
            <span>This snippet is read-only.</span>
          </Stack>
          <a className={styles.fiddleLink} href="https://jsfiddle.net/471hcjsm/1/" target="_blank">
            Edit in JsFiddle
            <ArrowUpRight size={14} fontSize={14} />
          </a>
        </Stack>
        <div className={styles.divider} />
        <pre className="language-html" dangerouslySetInnerHTML={{ __html: properties.demoHtml }} />
      </div>
      <iframe
        className={styles.demoIframe}
        frameBorder="0"
        src={`${publicRuntimeConfig.basePath}/html/collab-demo.html`}
      ></iframe>
      <footer className={styles.footer}>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
          <div>Made in Berlin and Warsaw by the EqualTo team</div>
          <div className={styles.divider} />
          <a href="https://www.equalto.com/" target="_blank">
            equalto.com
          </a>
        </Stack>
      </footer>
    </div>
  );
}

function WelcomeCopy() {
  return (
    <div className={styles.welcomeCopy}>
      <h1>Welcome to SureSheet Collab API!</h1>
      <p>
        The easiest way for developers to collaborate with business users via spreadsheets. The demo
        below covers this scenario:
      </p>
      <ol>
        <li>
          Business user creates a simple{' '}
          <a
            href="https://www.equalto.com/suresheet/view/0e1fbb42-1b69-49f1-aa69-e1d804f28b9c"
            target="_blank"
          >
            financial calculator workbook
          </a>
          , sharing the URL with the developer.
        </li>
        <li>
          Developer builds a simple web app, which sends inputs to the financial model and displays
          the results using the Simulation API.
        </li>
      </ol>
      <p>
        Note that the workbook accessed via the URL is immutable, so it’s “safe” for a developer to
        integrate against.
      </p>
    </div>
  );
}
