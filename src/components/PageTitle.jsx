export default function PageTitle({ children, className = '' }) {
  return (
    <div className={`mb-6 mt-4 text-center ${className}`}>
      <h2 className="text-primary inline-block text-3xl font-bold tracking-tight">
        {children}

        <div className="bg-primary/80 mx-auto mt-2 h-0.5 w-full rounded-full" />
      </h2>
    </div>
  );
}
