import '../globals.css';

export default function FullscreenLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}
