// import Navbar from "@/components/public/Navbar";

import Footer from "@/components/public/Footer";
import SponsorStrip from "@/components/public/SponsorStrip";
import TransparentNavbar from "@/components/public/TransparentNavbar";

export default function Home2Layout({ children }) {
  return (
    <div className="min-h-screen bg-white text-black">
      <TransparentNavbar />
      <main className="flex-grow">{children}</main>
      <SponsorStrip />
      <Footer />
    </div>
  );
}
