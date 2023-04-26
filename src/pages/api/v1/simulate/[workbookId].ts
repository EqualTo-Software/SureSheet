import { getSheetsApiHost, getSheetsApiLicenseId } from '@/lib/server/sheetsApi';
import httpProxy from 'http-proxy';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
  const { workbookId } = req.query;

  return new Promise((resolve, reject) => {
    if (req.url) {
      req.url = req.url.replace(
        `/api/v1/simulate/${workbookId}`,
        `/api/v1/workbooks/${workbookId}/simulate`,
      );
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
