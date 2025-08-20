// app/events/layout.tsx
export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Events</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
