import EditorView from '@/components/editorView';
import prisma from '@/lib/server/prisma';
import { Stack, Typography } from '@mui/material';
import { Slash } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from './id.module.css';
import MainLayout from '@/components/mainLayout';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const workbookId = (params?.['id'] ?? null) as string | null;

  const workbook = workbookId
    ? await prisma.workbook.findUnique({
        where: {
          workbookId,
        },
      })
    : null;

  return {
    props: {
      workbook:
        workbook !== null
          ? {
              id: workbook.workbookId,
              name: workbook.name,
            }
          : null,
    },
  };
};

export default function ViewWorkbookById(properties: {
  workbook: { id: string; name: string } | null;
}) {
  const { workbook } = properties;
  const router = useRouter();

  if (workbook === null) {
    return (
      <>
        <Head>
          <title>{`Not found - EqualTo SureSheet`}</title>
        </Head>
        <MainLayout>
          <div className={styles.notFoundContainer}>
            <Stack direction="column" spacing={1} alignItems="center">
              <Slash />
              <Typography>{'Workbook not found.'}</Typography>
            </Stack>
          </div>
        </MainLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`EqualTo SureSheet`}</title>
      </Head>
      <MainLayout canHideMenuBar>
        <EditorView workbookId={workbook.id} onNew={() => router.push('/')} />
      </MainLayout>
    </>
  );
}
