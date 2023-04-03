import prisma from '@/lib/server/prisma';
import { getSheetsApiHost, getSheetsApiLicenseId } from '@/lib/server/sheetsApi';
import httpProxy from 'http-proxy';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
  const { slug } = req.query;

  const isProxyAllowed = async () => {
    if (Array.isArray(slug)) {
      if (slug.length > 1 && slug[0] === 'static') {
        return true;
      }

      if (slug.length > 1 && slug[0] === 'get-updated-workbook') {
        return true;
      }

      if (slug.length === 1 && slug[0] === 'create-workbook-from-xlsx' && req.method === 'POST') {
        return true;
      }

      if (slug.length > 1 && slug[0] === 'api') {
        if (slug.length > 2 && slug[1] === 'v1') {
          if (slug.length >= 3 && slug[2] === 'workbooks') {
            if (slug.length === 3 && req.method === 'POST') {
              // Allow to create workbooks.
              return true;
            }
            if (slug.length > 4) {
              // Allow to access published workbooks only.
              const workbookId = slug[3];
              const workbook = await prisma.workbook.findUnique({ where: { workbookId } });
              return workbook !== null;
            }
          }
        }

        return false;
      }
    } else {
      return false;
    }
  };

  if (!(await isProxyAllowed())) {
    res.status(403 /* Forbidden */).send('Proxying the request was denied.');
    return;
  }

  return new Promise((resolve, reject) => {
    if (req.url) {
      // Note: baseUrl is already handled by next.
      req.url = req.url.replace('/api/sheets-proxy', '');
    }

    const proxy = httpProxy.createProxy();
    proxy
      .once('proxyRes', resolve)
      .once('error', reject)
      .web(req, res, {
        changeOrigin: true,
        target: `${getSheetsApiHost()}`,
        headers: {
          Authorization: `Bearer ${getSheetsApiLicenseId()}`,
        },
      });
  });
}
