"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { Loader2, Send, SendHorizonal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

const VerifyResuest = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string>("");
  const searchParams = useSearchParams();
  const email = searchParams.get("email") as string;
  const [emailPending, startTransition] = useTransition();
  const isOtpCompleted = otp.length === 6;
  
  
  function verifyOtp() {
    startTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email vérifié");
            router.push("/");
          },
          onError: () => {
            toast.success("Erreur de vérification Email/OTP");
          },
        },
      });
    });
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Veuillez vérifier votre email</CardTitle>
        <CardDescription>
          Nous vous avons envoyé un code de vérification à votre adresse e-mail.
          Veuillez l'ouvrir et coller le code ci-dessous.
        </CardDescription>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-2">
            <InputOTP
              value={otp}
              onChange={(value) => setOtp(value)}
              maxLength={6}
              className="gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              {/* <Separator className="w-4" /> */}
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <p className="text-sm text-muted-foreground">
              Saisissez le code à 6 chiffres envoyé à votre adresse e-mail
            </p>
          </div>
          <Button
            onClick={verifyOtp}
            disabled={emailPending || !isOtpCompleted}
            className="w-full"
            variant={"outline"}
          >
            {emailPending ? (
              <>
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Vérification en cours ...</span>
                </>
              </>
            ) : (
              <>
                <SendHorizonal className="size-4" />
                Demander la vérification
              </>
            )}
          </Button>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default VerifyResuest;
