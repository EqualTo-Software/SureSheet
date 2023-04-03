export function getSheetsApiHost(): string {
  const sheetsHost = process.env.EQUALTO_SHEETS_HOST;
  if (!sheetsHost) {
    throw new Error('EqualTo Sheets host is not set.');
  }
  return sheetsHost;
}

export function getSheetsApiLicenseId(): string {
  const licenseId = process.env.EQUALTO_SHEETS_LICENSE_KEY;
  if (!licenseId) {
    throw new Error('EqualTo Sheets license key is not set.');
  }
  return licenseId;
}

export async function createWorkbook(options?: { json: string }): Promise<{
  id: string;
}> {
  let body;
  if (options) {
    body = JSON.stringify({
      version: '1',
      workbook_json: options.json,
    });
  }

  let response = await fetch(`${getSheetsApiHost()}api/v1/workbooks`, {
    method: 'POST',
    body,
    headers: new Headers({
      Authorization: `Bearer ${getSheetsApiLicenseId()}`,
      'Content-Type': 'application/json',
    }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Request failed. Code=' + response.status + ' Text=' + response.statusText);
  }

  return (await response.json()) as { id: string };
}
