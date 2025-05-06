import React, { useState } from 'react';

const TermsAndConditions = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  const handleContentClick = (e) => {
    // Prevent clicks inside the content from closing the modal
    e.stopPropagation();
  };

  return (
    <>
      <span 
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:underline cursor-pointer"
      >
        terms and conditions
      </span>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-2xl max-h-[80vh] w-[90%] relative overflow-hidden"
            onClick={handleContentClick}
          >
            {/* Close button */}
            <button 
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-xl font-bold mb-4">Terms and Conditions</h2>

            {/* Scrollable content */}
            <div className="overflow-y-auto pr-4 max-h-[calc(80vh-8rem)] space-y-4">
              <p className="text-sm">Last Updated: January 22, 2025</p>
              
              <h3 className="font-semibold text-lg">1. Acceptance of Terms</h3>
              <p>By accessing and using this complaint management system, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.</p>
              
              <h3 className="font-semibold text-lg">2. Use of Service</h3>
              <p>The complaint management system is provided for legitimate business purposes only. You agree to use this service in good faith and provide accurate, truthful information in all submissions.</p>
              
              <h3 className="font-semibold text-lg">3. User Responsibilities</h3>
              <p>Users must maintain the confidentiality of their account information and are fully responsible for all activities that occur under their account. Any suspected unauthorized use should be reported immediately.</p>
              
              <h3 className="font-semibold text-lg">4. Privacy and Data Protection</h3>
              <p>We collect and process personal data in accordance with our Privacy Policy. By using this service, you consent to such processing and warrant that all data provided by you is accurate and complete.</p>
              
              <h3 className="font-semibold text-lg">5. Submission of Complaints</h3>
              <p>All complaints must be submitted with supporting evidence where applicable. False or malicious complaints may result in suspension of service access and possible legal action.</p>
              
              <h3 className="font-semibold text-lg">6. Processing of Complaints</h3>
              <p>While we strive to process all complaints promptly, we do not guarantee specific resolution timeframes. Complex cases may require additional time and documentation.</p>
              
              <h3 className="font-semibold text-lg">7. Communication</h3>
              <p>Users agree to receive electronic communications regarding their complaints, account status, and service updates. These communications are considered part of our service.</p>
              
              <h3 className="font-semibold text-lg">8. Intellectual Property</h3>
              <p>All content and materials available through this service are protected by applicable intellectual property laws. Unauthorized use is prohibited.</p>
              
              <h3 className="font-semibold text-lg">9. Limitation of Liability</h3>
              <p>The service is provided "as is" without warranties of any kind. We shall not be liable for any damages arising from the use or inability to use our service.</p>
              
              <h3 className="font-semibold text-lg">10. Modifications</h3>
              <p>We reserve the right to modify these terms at any time. Continued use of the service following changes constitutes acceptance of modified terms.</p>
              
              <h3 className="font-semibold text-lg">11. Governing Law</h3>
              <p>These terms shall be governed by and construed in accordance with applicable laws, without regard to conflicts of law principles.</p>
              
              <h3 className="font-semibold text-lg">12. Termination</h3>
              <p>We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever.</p>
              
              <h3 className="font-semibold text-lg">13. Severability</h3>
              <p>If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TermsAndConditions;