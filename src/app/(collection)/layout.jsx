import CollectionNavBar from "@/components/public/CollectionNavBar";
import Navbar from "@/components/public/Navbar";

export default function PublicLayout({ children }) {
    return (
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden transition-colors duration-300">
        <CollectionNavBar/>
        {children}
      </div>
    );
}
  