import CollectionNavBar from "@/components/public/CollectionNavBar";
import Navbar from "@/components/public/Navbar";

export default function PublicLayout({ children }) {
    return (
      <div className="min-h-screen bg-white text-black">
        {/* <CollectionNavBar/> */}
        <main className="flex-grow">{children}</main>
      </div>
    );
}
  