
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ certificateId: string }> }
) {
    try {
        const { certificateId } = await params;

        // For now, if the ID doesn't exist in the 'Certificate' table (since we haven't migrated/created them yet),
        // we can fallback to checking Enrollment for testing if the user passes an Enrollment ID or similar.
        // However, the standard flow is: Verify Certificate ID -> Show.

        // Let's assume we are generating it on the fly for an enrollment if a direct Certificate record doesn't exist?
        // Or just look up the Certificate record.
        // Since we know the user has NO certificates yet, this route will fail unless we create one.
        // BUT the user wants to DOWNLOAD it.

        // Let's handle two cases: 
        // 1. Logic to finding the certificate data.
        //    For testing, we might want to allow generating a preview.

        // Let's stick to the Schema: Certificate table.
        // If the user hasn't generated them, they won't be there.
        // Should we auto-generate if 100% progress?

        // Let's just implement the 'view/download' logic based on finding a Certificate record.

        // Mock for development if needed? No, let's use real DB.
        // But since DB is empty, I'll add a check: if 'certificateId' matches a specific test pattern or just standard lookup.

        let certificate = await prisma.certificate.findUnique({
            where: { id: certificateId },
            include: {
                user: true,
                // We need course name. Certificate model currently has 'courseId'.
                // We need to fetch course details manually or update schema relation if possible.
                // Schema: certificate -> user. Does it relate to Course?
                // Checking schema in memory: Certificate { userId, courseId ... }
                // Relationships: user User, but 'course Course' might be missing in relation definition?
                // Let's check relation in code below.
            }
        });

        // If relation is missing in Prisma Client include, we fetch course separately.
        let courseName = "Course Name";
        let studentName = "Student Name";
        let issueDate = new Date(); // default
        let certUuid = certificateId;

        if (certificate) {
            studentName = certificate.user.name || "Student";
            issueDate = certificate.issuedAt;

            const course = await prisma.course.findUnique({ where: { id: certificate.courseId } });
            if (course) courseName = course.title;
        } else {
            // Fallback for testing/preview if ID is not found but we want to show *something* 
            // OR return 404.
            // Let's strict return 404 for production, but for this "show me" phase, 
            // maybe we interpret the ID as a "course enrollment ID" for testing?
            // Let's stick to strict 404 unless it's a special test ID.
            if (certificateId !== 'preview') {
                return new NextResponse('Certificate not found', { status: 404 });
            }
            studentName = "Eligio Fernández Blanco";
            courseName = "Team Leader en Protección Ejecutiva";
            certUuid = "PREVIEW-123456";
        }

        // 1. Load Template
        const templatePath = path.join(process.cwd(), 'public', 'certificate-template.png');
        const templateBytes = fs.readFileSync(templatePath);

        // 2. Create PDF
        const pdfDoc = await PDFDocument.create();
        pdfDoc.registerFontkit(fontkit);

        // Embed Image
        const image = await pdfDoc.embedPng(templateBytes);
        const { width, height } = image.scale(1);

        // Create Page (Landscape usually matches certificate)
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(image, {
            x: 0,
            y: 0,
            width: width,
            height: height,
        });

        // 3. Fonts
        // Standard font for basic text
        const sansFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const serifFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

        // For the Script font (Name), we'd ideally load a custom font file. 
        // Since we don't have one handy in the repo, we'll use TimesRomanItalic or standard TimesBold for now to look "formal".
        // Or we could try to find a system font if really needed.
        const nameFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);

        // 4. Content Coordinates (Guesses based on visual)
        // Image size: likely around 2000x1400 based on standard high-res templates.
        // Let's assume standard A4 landscape ratio if not.
        // We'll calculate center based on 'width'.

        const centerX = width / 2;

        // Draw Student Name (Big, Center)
        const nameSize = 50;
        const nameWidth = nameFont.widthOfTextAtSize(studentName, nameSize);
        page.drawText(studentName, {
            x: centerX - (nameWidth / 2),
            y: height / 2 - 15, // Was +20, moving DOWN (smaller Y)
            size: nameSize,
            font: nameFont,
            color: rgb(0, 0, 0),
        });

        // Label Removed as requested

        // Course Name (Big, below Name)
        const courseSize = 30;
        const courseWidth = serifFont.widthOfTextAtSize(courseName, courseSize);
        page.drawText(courseName, {
            x: centerX - (courseWidth / 2),
            y: height / 2 - 110, // Slightly lower
            size: courseSize,
            font: serifFont,
            color: rgb(0, 0, 0),
        });

        // Duration/Details
        const details = "10hrs 13min 00seg Online";
        const detailSize = 12;
        const detailW = sansFont.widthOfTextAtSize(details, detailSize);

        page.drawText(details, {
            x: centerX - (detailW / 2),
            y: height / 2 - 140, // Adjusted relative to course
            size: detailSize,
            font: sansFont,
            color: rgb(0.3, 0.3, 0.3),
        });


        // 5. QR Code
        // To cover the placeholder, it likely needs to be slightly larger or positioned differently.
        // Assuming placeholder is in similar spot (bottom left).
        const verificationUrl = process.env.NEXTAUTH_URL
            ? `${process.env.NEXTAUTH_URL}/verify/${certUuid}`
            : `https://ivanivanovich.com/verify/${certUuid}`;

        const qrDataUrl = await QRCode.toDataURL(verificationUrl);
        const qrImage = await pdfDoc.embedPng(qrDataUrl);

        const qrDim = 110; // Increased from 80 to cover better
        page.drawImage(qrImage, {
            x: 160, // Moving Right (was 135)
            y: 110,  // Adjusted Y
            width: qrDim,
            height: qrDim
        });

        // ID text below QR
        const idText = certUuid;
        const idSize = 10;
        const idWidth = sansFont.widthOfTextAtSize(idText, idSize);
        const qrCenterX = 160 + (qrDim / 2); // 160 is QR x, qrDim is width

        page.drawText(idText, {
            x: qrCenterX - (idWidth / 2),
            y: 95,
            size: idSize,
            font: sansFont,
            color: rgb(0, 0, 0)
        });

        // Date (Bottom Center)
        const dateStr = issueDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const dateW = sansFont.widthOfTextAtSize(dateStr, 14);

        page.drawText(dateStr, {
            x: centerX - (dateW / 2),
            y: 115, // Was 85, moving UP
            size: 14,
            font: sansFont,
            color: rgb(0, 0, 0)
        });


        // Serialize
        const pdfBytes = await pdfDoc.save();

        return new NextResponse(Buffer.from(pdfBytes), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="certificate-${certUuid}.pdf"`,
            },
        });

    } catch (error) {
        console.error('Certificate Generation Error:', error);
        return new NextResponse('Error generating certificate', { status: 500 });
    }
}
