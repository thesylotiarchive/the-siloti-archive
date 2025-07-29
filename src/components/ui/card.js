// File: src/components/ui/card.js
export function Card({ className = "", children }) {
    return (
      <div className={`rounded-xl border border-border bg-card text-card-foreground shadow ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardContent({ className = "", children }) {
    return <div className={`p-6 ${className}`}>{children}</div>;
  }
  