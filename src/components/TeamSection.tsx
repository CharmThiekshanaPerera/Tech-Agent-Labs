import { Linkedin, Twitter, Github } from "lucide-react";

const teamMembers = [
  {
    name: "Alexandra Chen",
    role: "CEO & Co-Founder",
    bio: "Former AI researcher at Stanford with 15+ years in tech leadership.",
    avatar: "AC",
    socials: { linkedin: "#", twitter: "#" }
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO & Co-Founder",
    bio: "Ex-Google engineer specializing in machine learning and distributed systems.",
    avatar: "MR",
    socials: { linkedin: "#", twitter: "#", github: "#" }
  },
  {
    name: "Sarah Kim",
    role: "Head of Product",
    bio: "Product visionary with experience at Salesforce and Microsoft.",
    avatar: "SK",
    socials: { linkedin: "#", twitter: "#" }
  },
  {
    name: "David Okonkwo",
    role: "Head of AI Research",
    bio: "PhD in Neural Networks, published researcher with 50+ papers.",
    avatar: "DO",
    socials: { linkedin: "#", github: "#" }
  },
  {
    name: "Emma Thompson",
    role: "VP of Engineering",
    bio: "Scaled engineering teams at multiple successful startups.",
    avatar: "ET",
    socials: { linkedin: "#", twitter: "#", github: "#" }
  },
  {
    name: "James Park",
    role: "Head of Customer Success",
    bio: "Customer-obsessed leader with 10+ years in enterprise SaaS.",
    avatar: "JP",
    socials: { linkedin: "#", twitter: "#" }
  }
];

const TeamSection = () => {
  return (
    <section id="team" className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-10 w-48 h-48 md:w-72 md:h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-48 h-48 md:w-72 md:h-72 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Our Team
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Meet the <span className="text-primary">Minds</span> Behind the Magic
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            A passionate team of innovators, engineers, and visionaries dedicated to revolutionizing business automation
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group bg-card border border-border rounded-2xl p-6 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
            >
              {/* Avatar */}
              <div className="relative mx-auto mb-5">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl md:text-3xl font-bold text-primary mx-auto group-hover:scale-105 transition-transform duration-300">
                  {member.avatar}
                </div>
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Info */}
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
                {member.name}
              </h3>
              <p className="text-primary font-medium text-sm mb-3">
                {member.role}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                {member.bio}
              </p>

              {/* Social Links */}
              <div className="flex justify-center gap-3">
                {member.socials.linkedin && (
                  <a
                    href={member.socials.linkedin}
                    className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                    aria-label={`${member.name}'s LinkedIn`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {member.socials.twitter && (
                  <a
                    href={member.socials.twitter}
                    className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                    aria-label={`${member.name}'s Twitter`}
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {member.socials.github && (
                  <a
                    href={member.socials.github}
                    className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                    aria-label={`${member.name}'s GitHub`}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Join Team CTA */}
        <div className="text-center mt-12 md:mt-16">
          <div className="inline-block bg-card border border-border rounded-2xl p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              Want to join our team?
            </h3>
            <p className="text-muted-foreground mb-4">
              We're always looking for talented individuals to help shape the future of AI.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full font-medium transition-colors"
            >
              View Open Positions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
