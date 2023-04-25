import {
  simulate,
  CellValue,
  RangeValue,
  SimulateInputs,
  SimulateOutputs,
} from '@/lib/server/sheetsApi';
import type { NextApiRequest, NextApiResponse } from 'next';
import z from 'zod';

const CellValue: z.ZodType<CellValue> = z.union([z.string(), z.number(), z.boolean(), z.null()]);
const RangeValue: z.ZodType<RangeValue> = CellValue.array().array();

// sheet name => cell or range reference => assignment
const SimulateInputs: z.ZodType<SimulateInputs> = z.record(
  z.string(),
  z.record(z.string(), z.union([CellValue, RangeValue])),
);

// sheet name => list of cell or range references
const SimulateOutputs: z.ZodType<SimulateOutputs> = z.record(z.string(), z.string().array());

const Parameters = z.object({ inputs: SimulateInputs, outputs: SimulateOutputs });

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { workbookId } = req.query;
  if (typeof workbookId !== 'string') {
    res.status(404).send({ message: 'Invalid workbook ID.' });
    return;
  }

  let parameters;
  if (req.method === 'GET') {
    const { inputs, outputs } = req.query;
    if (typeof inputs !== 'string' || typeof outputs !== 'string') {
      return res.status(400).send({
        message:
          'GET parameters are not compatible with schema. Error: inputs and outputs are required',
      });
    }
    try {
      parameters = {
        inputs: SimulateInputs.parse(JSON.parse(inputs)),
        outputs: SimulateOutputs.parse(JSON.parse(outputs)),
      };
    } catch (error) {
      return res.status(400).send({
        message: `GET parameters are not compatible with schema. Error: ${error}`,
      });
    }
  } else if (req.method === 'POST') {
    try {
      parameters = Parameters.parse(req.body);
    } catch (error) {
      return res.status(400).send({
        message: `POST parameters are not compatible with schema. Error: ${error}`,
      });
    }
  } else {
    return res.status(405).send({ message: 'Only GET and POST requests are allowed.' });
  }

  const result = await simulate({ workbookId, ...parameters });
  res.status(200).json(result);
}
