import CollectionNavBar from "@/components/public/CollectionNavBar";
import Navbar from "@/components/public/Navbar";

export default function CollectionLayout({ children }) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <main className="max-w-6xl mx-auto p-4">{children}</main>
      </div>
    );
}
  