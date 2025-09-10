import CollectionNavBar from "@/components/public/CollectionNavBar";
import Navbar from "@/components/public/Navbar";

export default function CollectionLayout({ children }) {
    return (
      <div className="min-h-screen bg-white text-black">
        <main className="mx-auto p-4">{children}</main>
      </div>
    );
}
  