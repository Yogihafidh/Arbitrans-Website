"use client";
import { usePathname } from "next/navigation";
import { useScrollRange } from "../_hooks/useScrollRange";
import Link from "next/link";

import Button from "./Button";
import Logo from "./Logo";
import { useState } from "react";

type HeaderProps = {
  className?: string;
};

function Header({ className }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Scroll Logic
  const inRange = useScrollRange("about-us", "footer");

  // Pathname Logic
  const pathname = usePathname();
  const getLinkClass = (href: string) => {
    const isActive = pathname === href || pathname.startsWith(href + "/");

    if (pathname === "/" && !inRange) {
      return isActive ? "text-white" : "text-netral-400";
    } else if (pathname === "/" && inRange) {
      return isActive ? "text-primary" : "text-netral-700";
    } else {
      return isActive ? "text-netral-900" : "text-netral-600";
    }
  };

  return (
    <>
      <header
        className={`z-50 py-4 px-6 sm:px-8 md:px-10 lg:px-24 flex items-center transition-all duration-500 justify-between ${className} ${
          inRange && pathname === "/"
            ? `fixed top-5 left-8 right-8 sm:left-16 sm:right-16 lg:left-32 lg:right-32 bg-white/10 backdrop-blur-sm rounded-xl border shadow-sm border-netral-200`
            : "top-0 left-0 right-0 "
        } ${
          pathname === "/"
            ? "bg-primary text-white"
            : "bg-netral-100 text-primary shadow-sm !fixed"
        }`}
      >
        <Logo
          color={pathname === "/" ? `${inRange ? "blue" : "white"}` : "blue"}
        />

        <nav className="hidden md:flex items-center space-x-8 font-medium text-base">
          <Button
            text="Hubungi Kami"
            variant={`${pathname === "/" ? "secondary" : "primary"}`}
            className={`${
              pathname === "/"
                ? `${
                    inRange
                      ? "!bg-primary !text-white "
                      : "bg-white text-primary hover:bg-netral-100"
                  } border-none`
                : "bg-primary text-white "
            }`}
            onClick={() => window.open("https://wa.me/6281542952220", "_blank")}
          />
        </nav>

        <button className="md:hidden p-2 " onClick={() => setIsOpen(true)}>
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.75 5.00007C4.33579 5.00007 4 5.33586 4 5.75007V18.7501C4 19.1643 4.33579 19.5001 4.75 19.5001C5.16421 19.5001 5.5 19.1643 5.5 18.7501V5.75007C5.50272 5.55034 5.42457 5.35799 5.28333 5.21674C5.14208 5.0755 4.94973 4.99735 4.75 5.00007Z"
              fill={inRange ? "#212529" : "#f8f9fa"}
            />
            <path
              d="M11.75 5.00007C11.3358 5.00007 11 5.33586 11 5.75007V18.7501C11 19.1643 11.3358 19.5001 11.75 19.5001C12.1642 19.5001 12.5 19.1643 12.5 18.7501V5.75007C12.5027 5.55034 12.4246 5.35799 12.2833 5.21674C12.1421 5.0755 11.9497 4.99735 11.75 5.00007Z"
              fill={inRange ? "#212529" : "#f8f9fa"}
            />
            <path
              d="M18.75 5.00007C18.3358 5.00007 18 5.33586 18 5.75007V18.7501C18 19.1643 18.3358 19.5001 18.75 19.5001C19.1642 19.5001 19.5 19.1643 19.5 18.7501V5.75007C19.5027 5.55034 19.4246 5.35799 19.2833 5.21674C19.1421 5.0755 18.9497 4.99735 18.75 5.00007Z"
              fill={inRange ? "#212529" : "#f8f9fa"}
            />
          </svg>
        </button>
      </header>

      {isOpen && (
        <div
          className={`fixed inset-0 bg-white/10 backdrop-blur-lg z-50 py-5 px-6 sm:px-8 md:px-24 flex items-center md:hidden transition-all duration-500 justify-between ${
            pathname === "/"
              ? `bg-primary ${inRange ? "!text-primary" : "text-netral-100"}`
              : "bg-netral-100 text-primary shadow-sm !fixed"
          }`}
        >
          <ul
            className={`flex w-full flex-wrap items-center justify-center gap-6 sm:gap-8 font-medium `}
          >
            <li>
              <Button
                text="Hubungi Kami"
                className={`${
                  pathname === "/"
                    ? `${
                        inRange
                          ? "!bg-primary !text-white "
                          : "bg-white text-primary hover:bg-netral-100"
                      } border-none`
                    : "bg-primary text-white "
                }`}
                onClick={() =>
                  window.open("https://wa.me/6281542952220", "_blank")
                }
              />
            </li>
          </ul>

          <button
            className="md:hidden p-2 absolute top-5 right-7"
            onClick={() => setIsOpen(false)}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.1665 12.008L20.762 4.43822C21.0793 4.11791 21.0793 3.599 20.762 3.27868C20.4503 2.95264 19.9355 2.94285 19.6118 3.2568L12.0163 10.8266L4.51839 3.2568C4.36467 3.09288 4.15078 3 3.92702 3C3.70327 3 3.48938 3.09288 3.33566 3.2568C3.0543 3.56628 3.0543 4.04123 3.33566 4.35071L10.8335 11.9096L3.238 19.4685C2.92067 19.7888 2.92067 20.3077 3.238 20.628C3.38907 20.784 3.59685 20.871 3.81309 20.8687C4.03351 20.8867 4.25202 20.8159 4.42074 20.6718L12.0163 13.102L19.6118 20.7593C19.7629 20.9153 19.9707 21.0022 20.1869 21C20.4029 21.001 20.6102 20.9142 20.762 20.7593C21.0793 20.439 21.0793 19.9201 20.762 19.5998L13.1665 12.008Z"
                fill={inRange ? "#196feb" : "#f8f9fa"}
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}

export default Header;
