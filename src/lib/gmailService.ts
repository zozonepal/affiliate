// Gmail API Service for sending deal notifications directly to user's Gmail inbox

function createRawEmail(to: string, subject: string, bodyHtml: string): string {
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const messageParts = [
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    bodyHtml
  ];
  const message = messageParts.join('\r\n');
  return btoa(unescape(encodeURIComponent(message)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export interface SendGmailNotificationParams {
  accessToken?: string | null;
  toEmail: string;
  subject: string;
  dealTitle?: string;
  dealPrice?: number;
  originalPrice?: number;
  dealUrl?: string;
  imageUrl?: string;
  messageText?: string;
}

/**
 * Sends a real Gmail notification email directly to the recipient's Gmail inbox using Google's Gmail API.
 */
export async function sendGmailNotification({
  accessToken,
  toEmail,
  subject,
  dealTitle,
  dealPrice,
  originalPrice,
  dealUrl,
  imageUrl,
  messageText
}: SendGmailNotificationParams) {
  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #ea580c, #f97316); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; tracking-tight: -0.025em;">🔥 DealFinder Nepal Alert</h1>
        <p style="color: #ffedd5; margin: 4px 0 0 0; font-size: 13px;">Automated Daraz Nepal Price Drop Notification</p>
      </div>

      <div style="padding: 24px 20px; color: #1e293b;">
        <h2 style="margin-top: 0; color: #0f172a; font-size: 18px; font-weight: 700;">${subject}</h2>
        ${messageText ? `<p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 20px;">${messageText}</p>` : ''}
        
        ${dealTitle ? `
          <div style="border: 1px solid #fed7aa; background-color: #fff7ed; padding: 18px; border-radius: 10px; margin: 20px 0;">
            ${imageUrl ? `<img src="${imageUrl}" alt="${dealTitle}" style="max-width: 100%; height: 180px; object-fit: contain; display: block; margin: 0 auto 16px; border-radius: 8px; background-color: #ffffff; padding: 8px;" />` : ''}
            <h3 style="margin: 0 0 8px; color: #9a3412; font-size: 16px; font-weight: 700;">${dealTitle}</h3>
            <p style="margin: 0; font-size: 18px; font-weight: 800; color: #ea580c;">
              Deal Price: Rs. ${Number(dealPrice || 0).toLocaleString('ne-NP')}
              ${originalPrice && originalPrice > (dealPrice || 0) ? `<span style="text-decoration: line-through; color: #94a3b8; font-size: 13px; font-weight: normal; margin-left: 8px;">Rs. ${Number(originalPrice).toLocaleString('ne-NP')}</span>` : ''}
            </p>
            ${dealUrl ? `
              <div style="margin-top: 16px; text-align: center;">
                <a href="${dealUrl}" target="_blank" style="display: inline-block; background: #ea580c; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.2);">
                  Claim Deal on Daraz Nepal →
                </a>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; text-align: center; color: #64748b; font-size: 12px;">
          <p style="margin: 0;">This notification was sent directly to your Gmail inbox (<strong>${toEmail}</strong>) via DealFinder Nepal.</p>
        </div>
      </div>
    </div>
  `;

  const raw = createRawEmail(toEmail, subject, htmlBody);

  if (!accessToken) {
    console.log('Sending notification email to Gmail:', toEmail);
    return { success: true, simulated: true };
  }

  try {
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw })
    });

    if (!response.ok) {
      const errData = await response.json();
      console.warn('Gmail API error:', errData);
      return { success: false, error: errData.error?.message };
    }

    const data = await response.json();
    return { success: true, messageId: data.id };
  } catch (err: any) {
    console.warn('Failed to call Gmail API directly:', err);
    return { success: false, error: err?.message };
  }
}
