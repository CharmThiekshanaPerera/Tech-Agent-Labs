import { Twitter, Linkedin, Youtube, Facebook, Instagram } from "lucide-react";
import TikTokIcon from "@/components/icons/TikTokIcon";

const socialLinks = [
  { 
    name: "Facebook", 
    icon: Facebook, 
    href: "https://facebook.com/techagentlabs",
    color: "hover:bg-[#1877F2]",
    bgColor: "bg-[#1877F2]"
  },
  { 
    name: "Instagram", 
    icon: Instagram, 
    href: "https://instagram.com/techagentlabs",
    color: "hover:bg-[#E4405F]",
    bgColor: "bg-[#E4405F]"
  },
  { 
    name: "Twitter", 
    icon: Twitter, 
    href: "https://twitter.com/techagentlabs",
    color: "hover:bg-[#1DA1F2]",
    bgColor: "bg-[#1DA1F2]"
  },
  { 
    name: "LinkedIn", 
    icon: Linkedin, 
    href: "https://linkedin.com/company/techagentlabs",
    color: "hover:bg-[#0A66C2]",
    bgColor: "bg-[#0A66C2]"
  },
  { 
    name: "YouTube", 
    icon: Youtube, 
    href: "https://youtube.com/@techagentlabs",
    color: "hover:bg-[#FF0000]",
    bgColor: "bg-[#FF0000]"
  },
  { 
    name: "TikTok", 
    icon: TikTokIcon, 
    href: "https://tiktok.com/@techagentlabs",
    color: "hover:bg-[#000000]",
    bgColor: "bg-[#000000]"
  },
];

const SocialMediaWidget = () => {
  return (
    <>
      {/* Desktop Floating Widget - Right side */}
      <div className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 flex-col gap-2">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow us on ${social.name}`}
            className={`w-10 h-10 flex items-center justify-center bg-secondary/80 backdrop-blur-sm border border-border/50 rounded-l-lg ${social.color} hover:text-white transition-all duration-300 hover:w-12 group`}
          >
            <social.icon className="w-4 h-4 text-foreground group-hover:text-white transition-colors" />
          </a>
        ))}
      </div>

    </>
  );
};

export default SocialMediaWidget;
