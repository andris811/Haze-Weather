"use client";

import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-auto w-full py-4 px-4 text-center text-sm text-gray-500 bg-white">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
        <p>
          © {new Date().getFullYear()}{" "}
          <a
            href="https://andris811.github.io/avdev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#014565] font-semibold hover:underline"
          >
            AVDev
          </a>
        </p>

        <div className="flex gap-4 text-lg">
          <a
            href="https://github.com/andris811"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#014565]"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>

          <a
            href="https://www.linkedin.com/in/andrasv89/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#014565]"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
}
