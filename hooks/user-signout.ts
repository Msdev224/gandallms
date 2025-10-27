"use client"

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignOut(){
    const router = useRouter()
    const handleSignout = async function Signout() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                    toast.success("Déconnexion");
                },
                onError: () => {
                    toast.error("Erreur de deconnexion");
                },
            },
        });
    }

    return handleSignout
}