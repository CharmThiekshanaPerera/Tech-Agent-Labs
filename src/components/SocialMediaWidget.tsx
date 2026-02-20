import { Twitter, Linkedin, Youtube, Facebook, Instagram, MessageCircle } from "lucide-react";
import { useState } from "react";

const socialLinks = [
  { 
    name: "Facebook", 
    icon: Facebook, 
    href: "https://facebook.com/techagentlabs",
    color: "hover:bg-[#1877F2]",
    bgColor: "bg-[#1877F2]/10"
  },
  { 
    name: "Instagram", 
    icon: Instagram, 
    href: "https://instagram.com/techagentlabs",
    color: "hover:bg-[#E4405F]",
    bgColor: "bg-[#E4405F]/10"
  },
  { 
    name: "Twitter", 
    icon: Twitter, 
    href: "https://twitter.com/techagentlabs",
    color: "hover:bg-[#1DA1F2]",
    bgColor: "bg-[#1DA1F2]/10"
  },
  { 
    name: "LinkedIn", 
    icon: Linkedin, 
    href: "https://linkedin.com/company/techagentlabs",
    color: "hover:bg-[#0A66C2]",
    bgColor: "bg-[#0A66C2]/10"
  },
  { 
    name: "YouTube", 
    icon: Youtube, 
    href: "https://youtube.com/@techagentlabs",
    color: "hover:bg-[#FF0000]",
    bgColor: "bg-[#FF0000]/10"
  },
];

const SocialMediaWidget = () => {
  const [isExpanded, setIsExpanded] = useState(false);

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

      {/* Mobile Floating Button */}
      <div className="md:hidden fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Social media links"
          className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-secondary text-foreground border border-border rounded-full shadow-lg transition-all duration-300 ${isExpanded ? "rotate-45" : ""}`}
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Mobile Expanded Menu */}
        <div 
          className={`absolute bottom-14 left-0 flex flex-col gap-2 transition-all duration-300 ${
            isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          {socialLinks.map((social, index) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow us on ${social.name}`}
              className={`w-10 h-10 flex items-center justify-center ${social.bgColor} border border-border/50 rounded-full ${social.color} hover:text-white transition-all duration-300 shadow-md`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <social.icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default SocialMediaWidget;
