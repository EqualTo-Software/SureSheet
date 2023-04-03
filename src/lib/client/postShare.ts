import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export async function postShareWorkbook(body: { workbookId: string } | { workbookJson: string }) {
  const response = await fetch(`${publicRuntimeConfig.basePath}/api/share`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Response not ok, status=${response.status}`);
  }

  const json = await response.json();
  return {
    id: json['workbookId'],
    name: json['workbookName'],
  };
}
