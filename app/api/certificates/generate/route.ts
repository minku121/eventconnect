import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import PDFDocument from 'pdfkit';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('event');
  const userId = searchParams.get('user');

  // Verify certificate exists
  const certificate = await prisma.certificate.findFirst({
    where: {
      eventId: Number(eventId),
      userId: Number(userId)
    }
  });

  if (!certificate) {
    return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
  }

  // Add after certificate validation
  if (certificate.isPaid && !certificate.price) {
    return NextResponse.json(
      { error: "Payment required for this certificate" },
      { status: 402 }
    );
  }

  // Add payment check logic here if using a payment system
  // For now just check if marked as paid
  if (certificate.isPaid) {
    return NextResponse.json(
      { error: "Certificate requires payment" },
      { status: 402 }
    );
  }

  // Add PDF generation function
  async function generateCertificatePDF(certificateData: any) {
    return new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      
      // Certificate content
      doc.fontSize(25).text('Certificate of Participation', { align: 'center' });
      doc.moveDown();
      doc.fontSize(18).text(`Awarded to: User #${certificateData.userId}`);
      doc.text(`For participation in event #${certificateData.eventId}`);
      
      doc.end();
    });
  }

  // Generate PDF logic here (using pdfkit, @react-pdf/renderer, etc.)
  const pdfBuffer = await generateCertificatePDF({
    userId,
    eventId,
    // Add any additional certificate data you need
  });

  // Return generated PDF as download
  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="certificate-${eventId}.pdf"`
    }
  });
} 