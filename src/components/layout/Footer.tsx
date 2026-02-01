import { Link } from "react-router-dom";
import { Linkedin, Facebook, Instagram } from "lucide-react";
import logo from "@/assets/logo.png";

const footerLinks = {
  company: [
    { name: "About", href: "/company" },
    { name: "Upcoming Events", href: "https://events.bizmillennium.com/", external: true },
    { name: "Past Events", href: "/gallery" },
    { name: "Blogs", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact Us", href: "/contact" },
  ],
  services: [
    { name: "In-House", href: "/in-house" },
    { name: "Bespokes", href: "/conferences" },
    { name: "Become a Member", href: "/contact" },
  ],
  privacy: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Formerly Empiric Media", href: "#" },
  ],
};

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const socialLinks = [
  { Icon: Linkedin, href: "https://www.linkedin.com/company/bizmillennium/", label: "LinkedIn" },
  { Icon: Facebook, href: "https://www.facebook.com/p/Biz-Millennium-100063890416062/", label: "Facebook" },
  { Icon: Instagram, href: "https://www.instagram.com/biz.millennium/", label: "Instagram" },
  { Icon: XIcon, href: "https://x.com/BizMillennium", label: "X (Twitter)" },
];

export function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white">
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <img src={logo} alt="Biz Millennium" className="h-14 w-auto" />
            </Link>
            <p className="text-gray-400 text-sm mb-8 max-w-sm">
              Driving Business Success Through Networking and Collaboration
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-md bg-gray-700 flex items-center justify-center hover:bg-accent transition-colors"
                  aria-label={social.label}
                >
                  <social.Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Privacy Column */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Privacy Statement</h3>
            <ul className="space-y-3">
              {footerLinks.privacy.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <p className="text-sm text-gray-400 text-center">
            Copyright © {new Date().getFullYear()} <span className="text-white font-medium">Averance Group of Companies</span> | Averance Pvt. Ltd.
            <br />
            All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}