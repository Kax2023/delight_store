import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?redirect=/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="min-w-0 flex-1 pt-6 pb-12 lg:pl-6">
          <div className="mx-auto max-w-4xl px-4 lg:px-8">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
