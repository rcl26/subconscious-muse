import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary-variant">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Oneira
            </Button>
          </Link>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          <div className="prose prose-gray max-w-none space-y-6">
            
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, record dreams, or interact with our AI analysis features. This includes:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Google account information (email, name, profile picture)</li>
                <li>Dream content (text descriptions, audio recordings)</li>
                <li>Usage data and interaction patterns with our Service</li>
                <li>Technical information about your device and browser</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Provide, maintain, and improve our Service</li>
                <li>Process and analyze your dream content using AI</li>
                <li>Authenticate your identity and manage your account</li>
                <li>Communicate with you about the Service</li>
                <li>Ensure the security and integrity of our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Data Storage and Security</h2>
              <p>
                Your data is stored securely using industry-standard encryption and security measures. We use Supabase as our database provider, which implements robust security protocols including:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>End-to-end encryption for data transmission</li>
                <li>Secure data centers with physical security measures</li>
                <li>Regular security audits and monitoring</li>
                <li>Row-level security policies to protect user data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. AI Processing</h2>
              <p>
                We use OpenAI's services to analyze your dream content and provide insights. This processing occurs in a secure environment, and we do not store your data with third-party AI providers beyond the processing session.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Data Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties except:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and the safety of our users</li>
                <li>With service providers who assist in operating our platform (under strict confidentiality agreements)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Your Rights and Choices</h2>
              <p>
                You have the right to:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Access, update, or delete your personal information</li>
                <li>Download a copy of your data</li>
                <li>Opt out of certain communications</li>
                <li>Delete your account and associated data</li>
                <li>Request clarification about our data practices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Data Retention</h2>
              <p>
                We retain your information for as long as your account is active or as needed to provide you with our Service. You may delete your account at any time, which will result in the deletion of your personal data within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Cookies and Tracking</h2>
              <p>
                We use essential cookies to maintain your session and provide core functionality. We do not use tracking cookies for advertising purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Children's Privacy</h2>
              <p>
                Our Service is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us through our support channels within the application.
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