"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/sidebar/themeToggle";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { UserDropdown } from "./UserDropdown";
import dynamic from "next/dynamic";

// Charger ThemeToggle côté client uniquement
const ThemeToggleDynamic = dynamic(
  () =>
    import("@/components/sidebar/themeToggle").then((mod) => mod.ThemeToggle),
  { ssr: false }
);

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/admin/courses" },
  { name: "Dashboard", href: "/admin" },
    // { name: "Contact", href: "/contact" },
];


export function NavBar() {
  const { data: session, isPending } = authClient.useSession();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 bacdrop-blur-[backdrop-filter]:bg-background/60">
      <div className="container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 mr-4">
          <Image src={Logo} alt="logo" className="size-9" />
          <span>GandalLMS </span>
        </Link>
        {/* Desktop navigation  */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isPending ? null : session ? (
              <UserDropdown
                email={session.user.email}
                image={session.user.image || ""}
                name={session.user.name}
              />
            ) : (
              <>
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "secondary" })}
                >
                  Login
                </Link>
                <Link href="/login" className={buttonVariants()}>
                  Commencez
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
