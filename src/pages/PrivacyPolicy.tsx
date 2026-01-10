import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Shield, Cookie, Eye, UserCheck, Mail, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/seo/SEOHead";
import StructuredData, { generateBreadcrumbSchema } from "@/components/seo/StructuredData";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const breadcrumbData = generateBreadcrumbSchema([
    { name: "Home", url: "https://techagentlabs.com/" },
    { name: "Privacy Policy", url: "https://techagentlabs.com/privacy-policy" },
  ]);

  const lastUpdated = "January 10, 2026";

  return (
    <>
      <SEOHead
        title="Privacy Policy - Tech Agent Labs"
        description="Learn how Tech Agent Labs collects, uses, and protects your personal data. Our privacy policy covers cookies, analytics, GDPR rights, and data security."
        canonicalUrl="https://techagentlabs.com/privacy-policy"
        noIndex={false}
      />
      <StructuredData type="BreadcrumbList" data={breadcrumbData} />

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/" className="flex items-center gap-1.5 hover:text-primary">
                      <Home className="w-4 h-4" />
                      Home
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <header className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                    Privacy Policy
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Last updated: {lastUpdated}
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground">
                At Tech Agent Labs, we are committed to protecting your privacy and ensuring the security of your personal data. This policy explains how we collect, use, and safeguard your information.
              </p>
            </header>

            {/* Content */}
            <article className="prose prose-invert prose-primary max-w-none space-y-8">
              
              {/* Section 1 */}
              <section className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">1. Information We Collect</h2>
                </div>
                
                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Personal Information</h3>
                <p className="text-muted-foreground mb-4">
                  When you interact with our website, we may collect the following personal information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
                  <li><strong className="text-foreground">Contact Information:</strong> Name, email address, phone number, and company name when you submit forms</li>
                  <li><strong className="text-foreground">Communication Data:</strong> Messages you send through our contact forms or chat</li>
                  <li><strong className="text-foreground">Demo Booking Details:</strong> Preferred dates, times, and any additional information you provide</li>
                </ul>

                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Automatically Collected Data</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li><strong className="text-foreground">Device Information:</strong> Browser type, operating system, device type</li>
                  <li><strong className="text-foreground">Usage Data:</strong> Pages visited, time spent, click patterns, scroll depth</li>
                  <li><strong className="text-foreground">IP Address:</strong> Anonymized for analytics purposes</li>
                  <li><strong className="text-foreground">Referral Source:</strong> How you found our website</li>
                </ul>
              </section>

              {/* Section 2 */}
              <section className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Cookie className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">2. Cookies & Tracking Technologies</h2>
                </div>
                
                <p className="text-muted-foreground mb-4">
                  We use cookies and similar technologies to enhance your experience. You can manage your preferences through our cookie consent banner.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Essential Cookies</h3>
                <p className="text-muted-foreground mb-4">
                  Required for the website to function properly. These cannot be disabled and do not require consent.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Analytics Cookies</h3>
                <p className="text-muted-foreground mb-2">
                  We use the following analytics services (only with your consent):
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>
                    <strong className="text-foreground">Google Analytics (GA4):</strong> Helps us understand visitor behavior, traffic sources, and page performance. 
                    We use anonymized IP addresses for enhanced privacy.{" "}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Google's Privacy Policy
                    </a>
                  </li>
                  <li>
                    <strong className="text-foreground">Microsoft Clarity:</strong> Provides session recordings and heatmaps to help us improve user experience. 
                    Personal information is masked automatically.{" "}
                    <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Microsoft's Privacy Statement
                    </a>
                  </li>
                </ul>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-4">
                  <p className="text-sm text-muted-foreground m-0">
                    <strong className="text-primary">Your Choice:</strong> You can change your cookie preferences at any time by clicking the cookie icon (🍪) in the bottom-left corner of any page.
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
                
                <p className="text-muted-foreground mb-4">We use the collected information to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Process demo bookings and schedule meetings</li>
                  <li>Send relevant updates about our AI agents and services (with your consent)</li>
                  <li>Analyze website traffic and improve user experience</li>
                  <li>Detect and prevent security threats or fraudulent activity</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">4. Data Sharing & Third Parties</h2>
                
                <p className="text-muted-foreground mb-4">
                  We do not sell your personal data. We may share data with:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
                  <li><strong className="text-foreground">Service Providers:</strong> Cloud hosting (Supabase), analytics (Google, Microsoft), and email services</li>
                  <li><strong className="text-foreground">Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong className="text-foreground">Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                </ul>
                <p className="text-muted-foreground">
                  All third-party providers are contractually obligated to protect your data and use it only for specified purposes.
                </p>
              </section>

              {/* Section 5 - GDPR Rights */}
              <section className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <UserCheck className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">5. Your Rights Under GDPR</h2>
                </div>
                
                <p className="text-muted-foreground mb-4">
                  If you are in the European Economic Area (EEA), you have the following rights:
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-secondary/30 rounded-xl p-4">
                    <h4 className="font-medium text-foreground mb-1">Right to Access</h4>
                    <p className="text-sm text-muted-foreground m-0">Request a copy of your personal data we hold</p>
                  </div>
                  <div className="bg-secondary/30 rounded-xl p-4">
                    <h4 className="font-medium text-foreground mb-1">Right to Rectification</h4>
                    <p className="text-sm text-muted-foreground m-0">Request correction of inaccurate data</p>
                  </div>
                  <div className="bg-secondary/30 rounded-xl p-4">
                    <h4 className="font-medium text-foreground mb-1">Right to Erasure</h4>
                    <p className="text-sm text-muted-foreground m-0">Request deletion of your personal data</p>
                  </div>
                  <div className="bg-secondary/30 rounded-xl p-4">
                    <h4 className="font-medium text-foreground mb-1">Right to Restrict Processing</h4>
                    <p className="text-sm text-muted-foreground m-0">Limit how we use your data</p>
                  </div>
                  <div className="bg-secondary/30 rounded-xl p-4">
                    <h4 className="font-medium text-foreground mb-1">Right to Data Portability</h4>
                    <p className="text-sm text-muted-foreground m-0">Receive your data in a portable format</p>
                  </div>
                  <div className="bg-secondary/30 rounded-xl p-4">
                    <h4 className="font-medium text-foreground mb-1">Right to Object</h4>
                    <p className="text-sm text-muted-foreground m-0">Object to processing for certain purposes</p>
                  </div>
                </div>

                <p className="text-muted-foreground mt-4">
                  To exercise any of these rights, please contact us at{" "}
                  <a href="mailto:privacy@techagentlabs.com" className="text-primary hover:underline">
                    privacy@techagentlabs.com
                  </a>
                </p>
              </section>

              {/* Section 6 */}
              <section className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">6. Data Security</h2>
                
                <p className="text-muted-foreground mb-4">
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>SSL/TLS encryption for all data transfers</li>
                  <li>Secure cloud infrastructure with SOC 2 compliance</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Employee training on data protection practices</li>
                </ul>
              </section>

              {/* Section 7 */}
              <section className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">7. Data Retention</h2>
                
                <p className="text-muted-foreground">
                  We retain your personal data only as long as necessary to fulfill the purposes outlined in this policy, 
                  or as required by law. Contact form submissions and demo bookings are retained for up to 2 years. 
                  Analytics data is retained for 14 months in aggregated form.
                </p>
              </section>

              {/* Section 8 */}
              <section className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">8. Children's Privacy</h2>
                
                <p className="text-muted-foreground">
                  Our services are not directed to individuals under 16 years of age. We do not knowingly collect 
                  personal information from children. If you believe we have collected data from a child, 
                  please contact us immediately.
                </p>
              </section>

              {/* Section 9 */}
              <section className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">9. Changes to This Policy</h2>
                
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of significant changes 
                  by posting the new policy on this page and updating the "Last updated" date. 
                  We encourage you to review this policy periodically.
                </p>
              </section>

              {/* Contact Section */}
              <section className="bg-primary/5 border border-primary/20 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">10. Contact Us</h2>
                </div>
                
                <p className="text-muted-foreground mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li>
                    <strong className="text-foreground">Email:</strong>{" "}
                    <a href="mailto:privacy@techagentlabs.com" className="text-primary hover:underline">
                      privacy@techagentlabs.com
                    </a>
                  </li>
                  <li>
                    <strong className="text-foreground">General Inquiries:</strong>{" "}
                    <a href="mailto:info@techagentlabs.com" className="text-primary hover:underline">
                      info@techagentlabs.com
                    </a>
                  </li>
                </ul>
              </section>
            </article>

            {/* Back Link */}
            <div className="mt-12">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
