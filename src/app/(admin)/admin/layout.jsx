export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {children}
    </div>
  );
}