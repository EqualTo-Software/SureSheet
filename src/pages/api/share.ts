import prisma from '@/lib/server/prisma';
import { createWorkbook } from '@/lib/server/sheetsApi';
import type { NextApiRequest, NextApiResponse } from 'next';
import z from 'zod';

const PostParameters = z.union([
  z.object({
    workbookId: z.string(),
  }),
  z.object({
    workbookJson: z.string(),
  }),
]);

type PostParameters = z.infer<typeof PostParameters>;

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests are allowed.' });
    return;
  }

  const parsedBody = PostParameters.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).send({
      message: `POST parameters are not compatible with schema. Error: ${parsedBody.error}`,
    });
    return;
  }

  const postParameters = parsedBody.data;

  let workbookId;
  if ('workbookJson' in postParameters) {
    const { id } = await createWorkbook({
      json: postParameters.workbookJson,
    });
    workbookId = id;
  } else {
    workbookId = postParameters.workbookId;
  }

  let workbookName = 'Book';
  await prisma.workbook.create({
    data: {
      name: workbookName,
      workbookId,
    },
  });

  res.status(200).json({
    workbookName,
    workbookId,
  });
}
