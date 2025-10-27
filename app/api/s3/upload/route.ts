import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { v4 as uuid4 } from "uuid";
import z from "zod"
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { S3 } from "@/lib/S3Client";
import { arcjetInstance, detectBot, fixedWindow } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { requireAdmin } from "@/app/data/admin/require-admin";


const aj = arcjetInstance.withRule(
    detectBot({
        mode: 'LIVE',
        allow: [],
    })
).withRule(
    fixedWindow({
        mode: 'LIVE',
        window: "1m",
        max: 5
    })
)

export const fileUploadSchema = z.object({
    fileName: z.string().min(1, { message: "Nom du fichier requis !" }),
    contentType: z.string().min(1, { message: "Type de contenue requis !" }),
    size: z.number().min(1, { message: "Taille requise !" }),
    isImage: z.boolean()
})

export async function POST(request: Request) {
    const session = await requireAdmin();
    
    try {
        const decision = await aj.protect(request, {
            fingerprint: session?.user.id as string
        })

        // if (decision.isDenied()){
        //     return NextResponse.json({ error: "Activité suspecte détectée. Accès refusé." },{status: 429})
        // }

        if (decision.isDenied()) {
            if (decision.reason.isBot()) {
                return NextResponse.json(
                    { error: "Activité suspecte détectée. Accès refusé." },
                    { status: 403 }
                );
            }
            if (decision.reason.isRateLimit()) {
                return NextResponse.json(
                    { error: "Trop de requêtes. Veuillez réessayer plus tard." },
                    { status: 429 }
                );
            }
            // cas général
            return NextResponse.json(
                { error: "Requête refusée. Merci de réessayer plus tard." },
                { status: 403 }
            );
        }

        const body = await request.json();
        const validation = fileUploadSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Requête invalide" },
                { status: 400 }
            )
        }

        const { fileName, contentType, size } = validation.data
        const uniqueKey = `${uuid4()}-${fileName}`
        const command = new PutObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            ContentType: contentType,
            ContentLength: size,
            Key: uniqueKey
        })

        const presigneUrl = await getSignedUrl(S3, command, {
            expiresIn: 360, // l'url expire en 6minutes
        });

        const response = {
            presigneUrl,
            key: uniqueKey,
        }

        return NextResponse.json(response)

    } catch (error) {
        return NextResponse.json({
            error: "Failed to generate presigned URL"
        },
            { status: 500 }
        )
    }
}