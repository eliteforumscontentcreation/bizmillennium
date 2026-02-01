import { Linkedin, Facebook, Instagram } from "lucide-react";

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const socialLinks = [
  { Icon: Linkedin, href: "https://www.linkedin.com/company/bizmillennium/", label: "LinkedIn", bgColor: "bg-[#0077B5]" },
  { Icon: Facebook, href: "https://www.facebook.com/p/Biz-Millennium-100063890416062/", label: "Facebook", bgColor: "bg-[#1877F2]" },
  { Icon: Instagram, href: "https://www.instagram.com/biz.millennium/", label: "Instagram", bgColor: "bg-[#E4405F]" },
  { Icon: XIcon, href: "https://x.com/BizMillennium", label: "X (Twitter)", bgColor: "bg-[#00BFFF]" },
];

export function SocialSidebar() {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col">
      {socialLinks.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${social.bgColor} w-12 h-12 flex items-center justify-center text-white hover:opacity-90 transition-opacity`}
          aria-label={social.label}
        >
          <social.Icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}
