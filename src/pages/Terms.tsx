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
          <h1 className="text-3xl font-bold mb-8">Terms of Use</h1>
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
              <h2 className="text-xl font-semibold mb-3">5. Intellectual Property Rights</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Your Content Ownership</h3>
                  <p>
                    You retain full ownership and all intellectual property rights in your dream entries, personal stories, and any other content you create and submit through Oneira. We do not claim ownership of your dreams, thoughts, or personal experiences.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Limited License to Oneira</h3>
                  <p>
                    By using our Service, you grant Oneira a limited, non-exclusive, non-transferable license to:
                  </p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Store and display your content within the Service</li>
                    <li>Process your content through AI systems to provide analysis and insights</li>
                    <li>Enable Service features such as search, conversation, and data synchronization</li>
                    <li>Make technical reproductions necessary for Service operation and backup</li>
                  </ul>
                  <p className="mt-2">
                    This license is solely for providing you with the Service and terminates when you delete your content or close your account.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Oneira's Intellectual Property</h3>
                  <p>
                    The Oneira platform, including its name, logo, design, user interface, software code, algorithms, AI models, and all other proprietary technology, are owned by Oneira and protected by intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our Service or its software.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Data Use Restrictions</h3>
                  <p>
                    We will not sell, license, or otherwise distribute your personal dream content to third parties for commercial purposes. Your content may be processed by third-party AI services (such as OpenAI) solely for providing analysis features, but these services are contractually prohibited from retaining or using your data for their own purposes.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">License Termination</h3>
                  <p>
                    When you delete content from your account or terminate your account, our license to use that content ends, and we will delete it from our systems within 30 days, except where retention is required by law or for security purposes.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Privacy and Data Protection</h2>
              <p>
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service. By using Oneira, you agree to the collection and use of information in accordance with our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Prohibited Uses</h2>
              <p>
                You may not use our Service for any unlawful purpose, to violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances, to transmit, or procure the sending of, any advertising or promotional material, or to impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. AI-Generated Content</h2>
              <p>
                Oneira uses artificial intelligence to analyze and provide insights about your dreams. AI-generated content is provided for entertainment and self-reflection purposes only and should not be considered as professional medical, psychological, or therapeutic advice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Service Availability</h2>
              <p>
                We strive to maintain continuous service availability but do not guarantee uninterrupted access. We reserve the right to modify or discontinue the Service at any time with reasonable notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Children's Online Privacy Protection Act (COPPA) Compliance</h2>
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
              <h2 className="text-xl font-semibold mb-3">11. Limitation of Liability</h2>
              <p>
                In no event shall Oneira, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the Service. Your continued use of the Service after such modifications constitutes your acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">13. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will cease immediately. You may delete your account at any time through the application settings.
              </p>
              <p className="mt-2">
                Upon termination, we will delete your personal data within 30 days, except where retention is required by law or for legitimate business purposes such as fraud prevention.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">14. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless Oneira, its officers, directors, employees, agents, licensors, and suppliers from and against any claims, liabilities, damages, losses, and expenses, including reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of the Service, your violation of these Terms, or your violation of any third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">15. Disclaimer of Warranties</h2>
              <p>
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Oneira and its suppliers and licensors hereby disclaim all warranties of any kind, express or implied, including, without limitation, the warranties of merchantability, fitness for a particular purpose, and non-infringement. Neither Oneira nor its suppliers and licensors makes any warranty that the Service will be error-free or that access thereto will be continuous or uninterrupted.
              </p>
              <p className="mt-2">
                We specifically disclaim any warranty that the AI-generated content will be accurate, complete, or suitable for any particular purpose. The Service is intended for entertainment and self-reflection purposes only.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">16. Dispute Resolution and Arbitration</h2>
              <p>
                Any dispute, claim, or controversy arising out of or relating to these Terms or the Service shall be settled by binding arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules. The arbitration will be conducted in English and will take place in Texas, United States.
              </p>
              <p className="mt-2">
                <strong>Opt-Out Right:</strong> You may opt out of arbitration by sending written notice to us within 30 days of first accepting these Terms. The notice must include your name, address, and a clear statement that you wish to opt out of arbitration.
              </p>
              <p className="mt-2">
                <strong>Class Action Waiver:</strong> You agree that any arbitration or legal proceeding shall be limited to the dispute between you and Oneira individually. You will not join or consolidate claims in arbitration or otherwise participate in any claim as a class representative, class member, or in a private attorney general capacity.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">17. Governing Law</h2>
              <p>
                These Terms shall be interpreted and governed in accordance with the laws of the State of Texas, United States, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms will be brought exclusively in the federal or state courts located in Texas, and you hereby consent to personal jurisdiction and venue therein.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">18. Severability</h2>
              <p>
                If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions will remain in full force and effect. The invalid or unenforceable provision will be replaced with a valid provision that most closely matches the intent of the original provision.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">19. Medical Disclaimer</h2>
              <p>
                The AI-generated dream analysis and insights provided by Oneira are for entertainment and self-reflection purposes only and do not constitute medical, psychological, or therapeutic advice. The Service is not intended to diagnose, treat, cure, or prevent any medical or psychological condition. Always seek the advice of qualified healthcare professionals regarding any health-related questions or concerns.
              </p>
              <p className="mt-2">
                If you are experiencing sleep disorders, mental health issues, or other medical concerns, please consult with appropriate healthcare professionals.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">20. Contact Information</h2>
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