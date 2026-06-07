import CollectionNavBar from "@/components/public/CollectionNavBar";
import Navbar from "@/components/public/Navbar";

export default function PublicLayout({ children }) {
    return (
      <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
        <CollectionNavBar/>
        {children}
      </div>
    );
}
  