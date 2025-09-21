import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary-variant">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="text-primary-foreground hover:bg-white/20 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Oneira
            </Button>
          </Link>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          <div className="prose prose-gray max-w-none space-y-6">
            
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Oneira ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
              <p>
                Oneira is a digital platform that allows users to write, analyze, and explore their dreams using artificial intelligence. The Service includes text-based dream journaling, AI-powered analysis, and conversation features about dream content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
              <p>
                Users must create an account using Google authentication to access the Service. You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. User Content</h2>
              <p>
                You retain ownership of all content you submit to Oneira, including dream entries, descriptions, and titles. By using our Service, you grant us a license to use, store, and analyze your content to provide the Service features, including AI analysis and insights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Privacy and Data Protection</h2>
              <p>
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service. By using Oneira, you agree to the collection and use of information in accordance with our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Prohibited Uses</h2>
              <p>
                You may not use our Service for any unlawful purpose, to violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances, to transmit, or procure the sending of, any advertising or promotional material, or to impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. AI-Generated Content</h2>
              <p>
                Oneira uses artificial intelligence to analyze and provide insights about your dreams. AI-generated content is provided for entertainment and self-reflection purposes only and should not be considered as professional medical, psychological, or therapeutic advice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Service Availability</h2>
              <p>
                We strive to maintain continuous service availability but do not guarantee uninterrupted access. We reserve the right to modify or discontinue the Service at any time with reasonable notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Children's Online Privacy Protection Act (COPPA) Compliance</h2>
              <p>
                Our Service is not intended for children under the age of 13. We do not knowingly collect, use, or disclose personal information from children under 13 without prior parental consent. If we become aware that we have collected personal information from a child under 13 without parental consent, we will take steps to delete such information promptly.
              </p>
              <p className="mt-2">
                Parents or guardians who believe their child under 13 has provided personal information to us should contact us immediately. We will investigate and take appropriate action, including deleting the account and associated data if necessary.
              </p>
              <p className="mt-2">
                By using our Service, you represent and warrant that you are at least 13 years of age. If you are between 13 and 18 years of age, you represent that you have obtained permission from your parent or guardian to use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Limitation of Liability</h2>
              <p>
                In no event shall Oneira, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the Service. Your continued use of the Service after such modifications constitutes your acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us through our support channels within the application.
              </p>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}