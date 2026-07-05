import CollectionNavBar from "@/components/public/CollectionNavBar";
import Navbar from "@/components/public/Navbar";

export default function PublicLayout({ children }) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* <CollectionNavBar/> */}
        <main className="flex-grow">{children}</main>
      </div>
    );
}
  