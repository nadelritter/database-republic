import Image from "next/image";
import Link from "next/link";

const Sidebar = () => {
  return (
    // Replaced invalid "w-30" with "w-48" for a narrower, valid width
    <aside className="sticky top-0 h-screen w-48 flex-col border-r border-gray-700 bg-[#181818] p-6 flex">
      <div className="flex items-center gap-3">
        <Image
          src="/database-logo.png"
          alt="Database Republic Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        {/* Added 'truncate' to prevent the title from overflowing */}
        <h1 className="text-xl font-bold truncate">Database Republic</h1>
      </div>
      <nav className="mt-10 flex flex-col gap-4">
        <Link href="/" className="text-lg text-gray-300 hover:text-white">
          Home
        </Link>
      </nav>
      <div className="mt-auto">
        <h2 className="text-sm font-semibold text-gray-500">LEGAL</h2>
        <div className="mt-2 flex flex-col gap-2">
          <Link href="/privacy" className="text-gray-400 hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-gray-400 hover:text-white">
            Terms of Service
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;


