// import { AppSidebar } from "@/components/sidebar/app-sidebar";
// import { SiteHeader } from "@/components/sidebar/site-header";
// import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// import { useEffect, useState } from "react";
// import { requireAdmin } from "../data/admin/require-admin";

// export default async function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   await requireAdmin()
//   const [hasMounted, setHasMounted] = useState(false);

//   useEffect(() => {
//     setHasMounted(true);
//   }, []);

//   // Ne rien rendre côté serveur pour éviter les erreurs d'hydratation
//   if (!hasMounted) return null;

//   return (
//     <SidebarProvider
//       style={
//         {
//           "--sidebar-width": "calc(var(--spacing) * 72)",
//           "--header-height": "calc(var(--spacing) * 12)",
//         } as React.CSSProperties
//       }
//     >
//       <AppSidebar variant="inset" />
//       <SidebarInset>
//         <SiteHeader />
//         <div className="flex flex-1 flex-col">
//           <div className="@container/main flex flex-1 flex-col gap-2">
//             <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
//               {children}
//             </div>
//           </div>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }


"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
