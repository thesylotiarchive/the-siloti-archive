import GeneralNavBar from "@/components/public/GeneralNavBar";
import Navbar from "@/components/public/Navbar";
import TransparentNavbar from "@/components/public/TransparentNavbar";
import Footer from "@/components/public/Footer";
import { Toaster } from 'react-hot-toast';

export default function PublicLayout({ children }) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        <GeneralNavBar/>
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: '#111827',
              color: '#fff',
              fontSize: '14px',
              padding: '12px 16px',
              borderRadius: '8px',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 3000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
      </div>
    );
}