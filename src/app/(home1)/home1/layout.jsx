// import Navbar from "@/components/public/Navbar";

import Navbar from "@/components/public/Navbar";

export default function Home1Layout({ children }) {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      {children} {/* No max-width wrapper */}
    </div>
  );
}
