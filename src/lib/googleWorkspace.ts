/**
 * Google Workspace APIs Integration for MADAR
 * Supports Google Drive, Google Sheets, and Gmail using client-side OAuth Bearer token
 */

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
}

// 1. GOOGLE DRIVE APIS
export async function listDriveFiles(accessToken: string): Promise<DriveFileItem[]> {
  const res = await fetch(
    'https://www.googleapis.com/drive/v3/files?pageSize=15&fields=files(id,name,mimeType,modifiedTime,size,webViewLink)&orderBy=modifiedTime desc',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to fetch Drive files (${res.status})`);
  }

  const data = await res.json();
  return data.files || [];
}

export async function uploadJsonToDrive(
  accessToken: string,
  fileName: string,
  jsonData: any
): Promise<{ id: string; name: string }> {
  const fileContent = JSON.stringify(jsonData, null, 2);
  const metadata = {
    name: fileName,
    mimeType: 'application/json',
    description: 'MADAR Ecosystem Data Backup',
  };

  const boundary = '-------madar_backup_boundary';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    fileContent +
    closeDelimiter;

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to upload file to Google Drive (${res.status})`);
  }

  return await res.json();
}

// 2. GOOGLE SHEETS APIS
export async function createGoogleSheet(
  accessToken: string,
  title: string,
  headers: string[],
  rows: (string | number)[][]
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  // 1. Create spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: title,
      },
      sheets: [
        {
          properties: {
            title: 'MADAR Data',
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create Google Sheet (${createRes.status})`);
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl;

  // 2. Insert headers and rows
  const allValues = [headers, ...rows];
  const updateRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/MADAR Data!A1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: 'MADAR Data!A1',
        majorDimension: 'ROWS',
        values: allValues,
      }),
    }
  );

  if (!updateRes.ok) {
    console.warn('Created sheet but row append returned non-ok status');
  }

  return { spreadsheetId, spreadsheetUrl };
}

// 3. GMAIL APIS
export async function sendGmailMessage(
  accessToken: string,
  recipientEmail: string,
  subject: string,
  bodyText: string
): Promise<{ id: string; threadId: string }> {
  // Construct RFC 2822 email message
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const emailLines = [
    `To: ${recipientEmail}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    bodyText,
  ];

  const emailRaw = emailLines.join('\r\n');
  // Base64URL encoding (RFC 4648)
  const base64Encoded = btoa(unescape(encodeURIComponent(emailRaw)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: base64Encoded,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to send email via Gmail (${res.status})`);
  }

  return await res.json();
}
