import { Languages } from "lucide-react";
import Link from "next/link";
import React from "react";

const links = [
  ["FAQ", "Help Centre", "Account", "Media Centre"],
  ["Investor Relations", "Jobs", "Ways to Watch", "Terms of Use"],
  ["Privacy", "Cookie Preferences", "Corporate Information", "Contact Us"],
  ["Speed Test", "Legal Notices", "Only on Netflix"],
];

function Footer() {
  return (
    <footer className="mt-48 border-t border-white/5 bg-[#141414] px-8 py-12 text-white/40">
      <div className="mx-auto max-w-5xl">
        <p className="mb-6 text-sm">
          Questions? Call{" "}
          <Link
            href="tel:1-844-505-2993"
            className="underline transition-colors hover:text-white/60"
          >
            1-844-505-2993
          </Link>
        </p>

        <ul className="mb-8 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 md:grid-cols-4">
          {links.flat().map((label) => (
            <li key={label}>
              <Link
                href="#"
                className="text-xs underline transition-colors hover:text-white/60"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mb-6 flex items-center gap-3">
          <button className="flex items-center gap-2 border border-white/25 px-3 py-1.5 text-xs transition-colors hover:border-white/40">
            <Languages size={16} />
            English
          </button>
        </div>

        <p className="text-xs">
          Netflix Clone &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
