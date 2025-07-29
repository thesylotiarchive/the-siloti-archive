import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";

export default function AdminLayout({ children }) {
    return (
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <div className="flex-1 md:ml-64 flex flex-col">
          <Navbar />
          <main className="flex-1 p-4 md:p-8 w-full">
            {children}
          </main>
        </div>
      </div>
    );
}
