"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { GithubIcon, Loader, Mail, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [githubPending, startGithubTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const [email, setEmail] = useState("");
  async function signInWithGithub() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Connexion avec Github, vous serez redirigé...");
          },
          onError: (error) => {
            toast.error("Erreur interne du Server");
          },
        },
      });
    });
  }

  function signInWithEmail() {
    if (!email || !email.trim()) {
      toast.error("Veuillez saisir une adresse email valide !");
      return;
    }

    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email de connexion envoyé"),
              router.push(`/verify-request?email=${email}`);
          },
          onError: () => {
            toast.error("L'adresse email n'existe pas ou incorrect");
          },
        },
      });
    });
  }

  return (
    <Card className="flex flex-col gap-8">
      <CardHeader>
        <CardTitle className="text-xl">Content De Vous Revoir</CardTitle>
        <CardDescription>Connectez-vous avec Github</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          disabled={githubPending}
          onClick={signInWithGithub}
          className="w-full cursor-pointer hover:bg-orange-500 hover:text-white"
          variant={"outline"}
        >
          {githubPending ? (
            <>
              <Loader className="size-4 animate-spin" />
              <span>Chargement...</span>
            </>
          ) : (
            <>
              <GithubIcon className="size-4" />
              Se Connectez avec Github
            </>
          )}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:felx after:items-center after:border-t after:border-border my-4">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="ms@example.com"
              required
            />
          </div>
          <Button
            className="w-full cursor-pointer hover:bg-orange-500 hover:text-white"
            variant={"outline"}
            onClick={signInWithEmail}
            disabled={emailPending}
          >
            {emailPending ? (
              <>
                <Loader className="size-4 animate-spin" />
                <span>Envoie en cours ...</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                Continuez avec votre Email
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
