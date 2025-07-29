import CollectionNavBar from "@/components/public/CollectionNavBar";
import Navbar from "@/components/public/Navbar";

export default function PublicLayout({ children }) {
    return (
      <div className="min-h-screen bg-white text-black">
        <CollectionNavBar/>
        <main className="mt-20 max-w-4xl mx-auto p-4">{children}</main>
      </div>
    );
}
  