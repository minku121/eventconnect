import { Readable } from 'stream';

// Replace pdfkit with a simpler approach - generate HTML instead
export interface CertificateData {
  recipientName: string;
  eventName: string;
  eventDate: Date;
  issueDate: Date;
  issuerName: string;
  templateId: number;
}

export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  try {
    // Generate HTML string for certificate
    const html = generateCertificateHTML(data);
    
    // Simple solution for now - return the HTML as a buffer
    // In production, you'd use a library like puppeteer to convert HTML to PDF
    return Buffer.from(html);
  } catch (error) {
    console.error("Error generating certificate:", error);
    throw error;
  }
}

function generateCertificateHTML(data: CertificateData): string {
  const { recipientName, eventName, eventDate, issueDate, issuerName, templateId } = data;
  
  // Format dates
  const formattedEventDate = formatDate(eventDate);
  const formattedIssueDate = formatDate(issueDate);
  
  // Select template colors and styling based on templateId
  const template = getTemplateStyles(templateId);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Certificate of Participation - ${eventName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f5f5f5;
        }
        .certificate {
          width: 800px;
          height: 600px;
          background-color: ${template.backgroundColor};
          border: 20px solid ${template.borderColor};
          padding: 40px;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
          text-align: center;
          position: relative;
        }
        .header {
          font-size: 28px;
          color: ${template.headerColor};
          margin-bottom: 30px;
          font-weight: bold;
        }
        .title {
          font-size: 40px;
          color: ${template.titleColor};
          margin-bottom: 20px;
          font-weight: bold;
        }
        .recipient {
          font-size: 36px;
          color: ${template.recipientColor};
          margin-bottom: 20px;
          font-weight: bold;
        }
        .description {
          font-size: 18px;
          color: ${template.textColor};
          margin-bottom: 30px;
        }
        .event-name {
          font-size: 24px;
          color: ${template.highlightColor};
          margin-bottom: 10px;
          font-style: italic;
          font-weight: bold;
        }
        .date {
          font-size: 18px;
          color: ${template.textColor};
          margin-bottom: 40px;
        }
        .signature {
          margin-top: 60px;
        }
        .signature-line {
          margin: 0 auto;
          width: 200px;
          border-bottom: 2px solid ${template.signatureColor};
          margin-bottom: 10px;
        }
        .issuer {
          font-size: 18px;
          color: ${template.highlightColor};
          font-weight: bold;
        }
        .issuer-title {
          font-size: 14px;
          color: ${template.textColor};
          margin-bottom: 20px;
        }
        .footer {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 12px;
          color: ${template.footerColor};
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="header">CERTIFICATE OF PARTICIPATION</div>
        <div class="title">This certifies that</div>
        <div class="recipient">${recipientName}</div>
        <div class="description">has successfully participated in</div>
        <div class="event-name">${eventName}</div>
        <div class="date">held on ${formattedEventDate}</div>
        
        <div class="signature">
          <div class="signature-line"></div>
          <div class="issuer">${issuerName}</div>
          <div class="issuer-title">Event Organizer</div>
        </div>
        
        <div class="footer">
          Certificate issued on: ${formattedIssueDate}
        </div>
      </div>
    </body>
    </html>
  `;
}

function getTemplateStyles(templateId: number) {
  // Define different style templates
  const templates = {
    1: {
      backgroundColor: '#ffffff',
      borderColor: '#d4af37',
      headerColor: '#2c3e50',
      titleColor: '#2c3e50',
      recipientColor: '#d4af37',
      textColor: '#555555',
      highlightColor: '#2c3e50',
      signatureColor: '#555555',
      footerColor: '#888888'
    },
    2: {
      backgroundColor: '#f9f9f9',
      borderColor: '#3498db',
      headerColor: '#2980b9',
      titleColor: '#2980b9',
      recipientColor: '#3498db',
      textColor: '#555555',
      highlightColor: '#2980b9',
      signatureColor: '#555555',
      footerColor: '#888888'
    },
    3: {
      backgroundColor: '#ffffff',
      borderColor: '#27ae60',
      headerColor: '#166639',
      titleColor: '#166639',
      recipientColor: '#27ae60',
      textColor: '#555555',
      highlightColor: '#166639',
      signatureColor: '#555555',
      footerColor: '#888888'
    },
    4: {
      backgroundColor: '#ffffff',
      borderColor: '#8e44ad',
      headerColor: '#6c3483',
      titleColor: '#6c3483',
      recipientColor: '#8e44ad',
      textColor: '#555555',
      highlightColor: '#6c3483',
      signatureColor: '#555555',
      footerColor: '#888888'
    }
  };
  
  // Default to template 1 if templateId not found
  return templates[templateId as keyof typeof templates] || templates[1];
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
