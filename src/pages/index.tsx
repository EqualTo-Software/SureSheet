import EditorView from '@/components/editorView';
import { useToast } from '@/components/toastProvider';
import { Button, Paper, Stack, Typography, styled } from '@mui/material';
import clsx from 'clsx';
import { File, Upload } from 'lucide-react';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import styles from './index.module.css';
import MainLayout, { InfoBar, LogoStack } from '@/components/mainLayout';

const { publicRuntimeConfig } = getConfig();

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {},
  };
};

export default function Home(properties: {}) {
  const [workbookId, setWorkbookId] = useState<string | null>(null);

  return (
    <>
      <Head>
        <title>EqualTo SureSheet</title>
      </Head>
      {workbookId === null ? (
        <NewWorkbookChoice setWorkbookId={setWorkbookId} />
      ) : (
        <MainLayout>
          <EditorView workbookId={workbookId} onNew={() => setWorkbookId(null)} />
        </MainLayout>
      )}
    </>
  );
}

function NewWorkbookChoice(properties: { setWorkbookId: (workbookId: string) => void }) {
  const { setWorkbookId } = properties;
  const { pushToast } = useToast();

  const onNew = () => {
    createEmptyWorkbook().then(
      ({ workbookId }) => setWorkbookId(workbookId),
      () => {
        pushToast({
          type: 'error',
          message: 'Could not create a new workbook.',
        });
      },
    );
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      throw new Error('There are no accepted files.');
    }

    const firstFile = acceptedFiles[0];
    uploadXlsxWorkbook(firstFile).then(
      ({ workbookId }) => {
        setWorkbookId(workbookId);
      },
      () => {
        pushToast({
          type: 'error',
          message:
            'Could not create workbook from XLSX file. ' +
            'Please make sure it was exported from Microsoft Excel.',
        });
      },
    );
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    onDrop,
  });

  return (
    <div className={styles.newWorkbookLayout}>
      <InfoBar />
      <div className={styles.newWorkbookContainer}>
        <Paper className={styles.newWorkbookPaper}>
          <LogoStack />
          <div className={styles.newWorkbookSection}>
            <Typography>
              A <b>SureSheet</b> is a spreadsheet that always {'"'}resets{'"'} when it{"'"}s
              reloaded. When you share a SureSheet, recipients can edit it, but their changes are
              not saved. Reloading the SureSheet will always reset it to what was originally shared.
            </Typography>
            <Typography>
              The benefit of EqualTo SureSheet compared to e.g. Google Sheets, is that you can share
              or embed spreadsheets that won{"'"}t change or break over time.
            </Typography>
            <Typography>
              {'Here are some sample SureSheets: '}
              <a
                className={styles.simpleLink}
                href="https://www.equalto.com/suresheet/view/6433843c-ecb4-4533-a14e-e30445648d4c"
              >
                Tesla running cost calculator
              </a>
              {', '}
              <a
                className={styles.simpleLink}
                href="https://www.equalto.com/suresheet/view/0e1fbb42-1b69-49f1-aa69-e1d804f28b9c"
              >
                Investment growth calculator
              </a>
              .
            </Typography>
          </div>
          <div className={styles.createNewRow}>
            <div className={styles.createNewEmpty}>
              <NewEmptyButton type="button" onClick={onNew} fullWidth>
                <Stack alignItems="center" component="span" spacing={1}>
                  <File size={15} />
                  <span>Start with a blank workbook</span>
                </Stack>
              </NewEmptyButton>
            </div>
            <div className={styles.orText}>
              <Typography className={styles.dividerText}>OR</Typography>
            </div>
            <div
              {...getRootProps({
                className: clsx(styles.dropzone, isDragActive && styles.active),
              })}
            >
              <input {...getInputProps()} />
              <Stack direction="column" spacing={1} alignItems="center">
                <Upload size={15} />
                <Typography>Upload a workbook (.xlsx)</Typography>
              </Stack>
            </div>
          </div>
          <div className={styles.consentText}>
            <Typography fontSize="11px">
              {'By creating or uploading a spreadsheet, I consent to the '}
              <a className={styles.simpleLink} href="https://www.equalto.com/tos" target="_blank">
                Terms of Service
              </a>
              {' and '}
              <a
                className={styles.simpleLink}
                href="https://www.equalto.com/privacy-policy"
                target="_blank"
              >
                Privacy Policy
              </a>
              .
            </Typography>
          </div>
          <div className={styles.sharingSection}>
            <Typography fontWeight={500}>How do I share SureSheet?</Typography>
            <ul>
              <li>
                <Image
                  src={`${publicRuntimeConfig.basePath}/images/share.svg`}
                  width={15}
                  height={15}
                  alt="Share"
                />
                <Typography component="span">Directly share a link to a SureSheet</Typography>
              </li>
              <li>
                <Image
                  src={`${publicRuntimeConfig.basePath}/images/notion.svg`}
                  width={15}
                  height={15}
                  alt="Share"
                />
                <Typography component="span">
                  Insert into a Notion document using <code>/embed</code>
                </Typography>
              </li>
              <li>
                <Image
                  src={`${publicRuntimeConfig.basePath}/images/code.svg`}
                  width={15}
                  height={15}
                  alt="Share"
                />
                <Typography component="span">
                  Insert into a website using an <code>IFRAME</code>
                </Typography>
              </li>
            </ul>
          </div>
        </Paper>
      </div>
    </div>
  );
}

const NewEmptyButton = styled(Button)({
  color: '#21243A',
  padding: '5px',
  minWidth: 0,
  height: '100%',
  fontWeight: 400,
  fontSize: 14,
  '&:hover': {
    background: '#F4F4F4',
  },
});

async function createEmptyWorkbook() {
  const response = await fetch(
    `${publicRuntimeConfig.basePath}/api/sheets-proxy/api/v1/workbooks`,
    {
      method: 'POST',
    },
  );
  const json = await response.json();
  return { workbookId: json['id'] as string };
}

async function uploadXlsxWorkbook(xlsxFile: File) {
  const body = new FormData();
  body.append('xlsx-file', xlsxFile);

  const response = await fetch(
    `${publicRuntimeConfig.basePath}/api/sheets-proxy/create-workbook-from-xlsx`,
    {
      method: 'POST',
      body,
    },
  );

  // TODO: Endpoint should return JSON to avoid this parsing.
  const text = await response.text();
  const regex = /^Workbook Id: (.*)$/gm;
  const matches = regex.exec(text);
  if (matches && matches.length == 2) {
    const workbookId = matches[1];
    return { workbookId };
  }

  throw new Error('Could not parse the response.');
}
