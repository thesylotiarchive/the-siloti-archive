
 import CollectionNavBar from "@/components/public/CollectionNavBar";
 import Navbar from "@/components/public/Navbar";

 export default function MediaLayout({ children }) {
     return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white text-black">
         <main className="mt-20 max-w-4xl mx-auto p-4">{children}</main>
       </div>
     );
 }