export function Card({ children, className = "", ...props }: any) {
  return <div className={`rounded-lg border bg-white ${className}`} {...props}>{children}</div>;
}

export function CardContent({ children, className = "", ...props }: any) {
  return <div className={`p-6 ${className}`} {...props}>{children}</div>;
}
