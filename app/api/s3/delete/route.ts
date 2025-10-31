import { requireAdmin } from "@/app/data/admin/require-admin";
import { arcjetInstance, fixedWindow } from "@/lib/arcjet";

import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const aj = arcjetInstance.withRule(
    fixedWindow({
        mode: 'LIVE',
        window: "1m",
        max: 5,
    })
)



export async function DELETE(request: Request) {
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

        const key = body.key;

        if (!key) {
            return NextResponse.json(
                { error: "Missiong or invalid object key" },
                { status: 400 })
        }

        const command = new DeleteObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            Key: key
        })
        await S3.send(command)

        return NextResponse.json(
            { message: "Fichier supprimé avec succès" },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: "Missiong or invalid object key" },
            { status: 500 })
    }
}