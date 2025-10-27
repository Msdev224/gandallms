import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAdmin(){
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return redirect("/login")
    }

    const userRole = session.user.role as string;
    // if (session.user.role !== "admin"){
    //     return redirect("/not-admin")
    // }
    if (!['admin'].includes(userRole)) {
        console.log("❌ Rôle non autorisé, redirection vers /not-admin");
        console.log(session)
        return redirect("/not-admin");
    }

    return session;
}