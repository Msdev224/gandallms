// "use client";
// import {
//   BookOpenIcon,
//   ChevronDownIcon,
//   Home,
//   LayoutDashboard,
//   LogOutIcon,
// } from "lucide-react";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import Link from "next/link";
// import { useSignOut } from "@/hooks/user-signout";

// interface iAppProps {
//   name: string;
//   email: string;
//   image: string;
// }

// export function UserDropdown({ name, email, image }: iAppProps) {
//   const handleSignOut = useSignOut();

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger>
//           <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
//         <span className="flex items-center gap-2">
//             <Avatar>
//               <AvatarImage src={image} alt="Profile image" />
//               <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
//             </Avatar>
//             <ChevronDownIcon
//               size={16}
//               className="opacity-60"
//               aria-hidden="true"
//             />
//         </span>
//           </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="max-w-64">
//         <DropdownMenuLabel className="flex min-w-0 flex-col">
//           <span className="truncate text-sm font-medium text-foreground">
//             {name}
//           </span>
//           <span className="truncate text-xs font-normal text-muted-foreground">
//             {email}
//           </span>
//         </DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuGroup>
//           <DropdownMenuItem asChild>
//             <Link href="/">
//               <Home size={16} className="opacity-60" aria-hidden="true" />
//               <span>Home</span>
//             </Link>
//           </DropdownMenuItem>
//           <DropdownMenuItem asChild>
//             <Link href="/admin/courses">
//               <BookOpenIcon
//                 size={16}
//                 className="opacity-60"
//                 aria-hidden="true"
//               />
//               <span>Cours</span>
//             </Link>
//           </DropdownMenuItem>
//           <DropdownMenuItem asChild>
//             <Link href="/admin">
//               <LayoutDashboard
//                 size={16}
//                 className="opacity-60"
//                 aria-hidden="true"
//               />
//               <span>Dashboard</span>
//             </Link>
//           </DropdownMenuItem>
//         </DropdownMenuGroup>
//         <DropdownMenuSeparator />

//         <DropdownMenuItem onClick={handleSignOut}>
//           <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
//           <span>Logout</span>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

"use client";

import {
  BookOpenIcon,
  ChevronDownIcon,
  Home,
  LayoutDashboard,
  LogOutIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useSignOut } from "@/hooks/user-signout";

interface iAppProps {
  name: string;
  email: string;
  image: string;
}

export function UserDropdown({ name, email, image }: iAppProps) {
  const handleSignOut = useSignOut();

  return (
    <DropdownMenu>
      {/* ✅ asChild sur le Button pour éviter double <button> */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          {/* ✅ Tous les enfants dans un seul span */}
          <span className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={image} alt="Profile image" />
              <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <ChevronDownIcon
              size={16}
              className="opacity-60"
              aria-hidden="true"
            />
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-foreground">
            {name}
          </span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/" className="flex items-center gap-2">
              <Home size={16} className="opacity-60" aria-hidden="true" />
              <span>Home</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/courses" className="flex items-center gap-2">
              <BookOpenIcon
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Cours</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin" className="flex items-center gap-2">
              <LayoutDashboard
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex items-center gap-2"
        >
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

