import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export const requireAdmin = cache( async () =>{
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
            return redirect("/not-admin");
        }

        return session;
}
)
// export async function requireAdmin(){
//     const session = await auth.api.getSession({
//         headers: await headers()
//     });

//     if (!session?.user) {
//         return redirect("/login")
//     }

//     const userRole = session.user.role as string;
//     // if (session.user.role !== "admin"){
//     //     return redirect("/not-admin")
//     // }
//     if (!['admin'].includes(userRole)) {
//         return redirect("/not-admin");
//     }

//     return session;
// }