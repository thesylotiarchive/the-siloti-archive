import GeneralNavBar from "@/components/public/GeneralNavBar";
import Navbar from "@/components/public/Navbar";
import TransparentNavbar from "@/components/public/TransparentNavbar";

export default function PublicLayout({ children }) {
    return (
      <div className="min-h-screen bg-white text-black">
        <GeneralNavBar/>
        <main>{children}</main>
      </div>
    );
}
  