import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

type AdminShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AdminShell({ title, subtitle, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900">
      <div className="relative">
        <div className="relative flex min-h-screen">
          <AdminSidebar />
          <div className="flex min-h-screen w-full flex-1 flex-col md:w-auto">
            <AdminTopbar />
            <main className="flex-1 px-3 pb-6 pt-4 sm:px-4 sm:pb-8 sm:pt-5 md:px-6 md:pb-10 md:pt-6 lg:px-10">
              <div className="mb-4 sm:mb-6 md:mb-8">
                <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
                  {title}
                </h1>
                {subtitle ? (
                  <p className="mt-1 text-xs text-slate-600 sm:mt-1.5 sm:text-sm md:mt-2">{subtitle}</p>
                ) : null}
              </div>
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
