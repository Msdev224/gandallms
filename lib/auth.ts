// import "server-only";

import { betterAuth } from "better-auth";
import { admin, emailOTP } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { env } from "./env";
import { resend } from "./resend";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "student",
                input: false, // L'utilisateur ne peut pas modifier ce champ lors de l'inscription
            }
        }
    },

    socialProviders: {
        github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        }
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp }) {
                const { data, error } = await resend.emails.send({
                    from: 'GANDAL <onboarding@resend.dev>',
                    to: [email],
                    subject: 'GandalLMS - Verifiez votre email',
                    html: `<p> Votre Code est <strong>${otp}</strong> </p>`
                });
            },
        }),
        admin()
    ],
})