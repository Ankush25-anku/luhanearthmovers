"use client";

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsApp() {
  return (
    <Link
      href="https://wa.me/919611222555"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="
        fixed
        bottom-6
        right-6
        z-[999]
        flex
        h-16
        w-16
        items-center
        justify-center
        rounded-full
        bg-[#25D366]
        text-white
        shadow-2xl
        transition-all
        duration-300
        hover:scale-110
        hover:shadow-[0_0_40px_rgba(37,211,102,0.5)]
        active:scale-95
      "
    >
      <FaWhatsapp className="h-8 w-8" />
    </Link>
  );
}
