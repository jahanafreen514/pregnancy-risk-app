import {
  Heart,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";

function Footer() {
  return (
    <footer className="mt-8 bg-white border-t shadow-sm px-8 py-6">

      <div className="flex flex-col md:flex-row justify-between items-center">

        {/* Left */}
        <div>
          <h2 className="text-lg font-bold text-pink-600 flex items-center gap-2">
            <Heart className="text-pink-500" size={20} />
            Pregnancy Risk Prediction System
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Monitoring maternal health for safer pregnancies.
          </p>
        </div>

        {/* Center */}
        <div className="flex gap-8 mt-5 md:mt-0">

          <div className="flex items-center gap-2 text-gray-600">
            <Mail size={18} />
            admin@pregnancycare.com
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={18} />
            +91 98765 43210
          </div>

        </div>

        {/* Right */}
        <div className="flex items-center gap-2 mt-5 md:mt-0 text-green-600">

          <ShieldCheck size={20} />

          Secure Healthcare System

        </div>

      </div>

      <hr className="my-5" />

      <div className="text-center text-gray-500 text-sm">
        © 2026 Pregnancy Risk Prediction System | Developed using React, Tailwind CSS & AI
      </div>

    </footer>
  );
}

export default Footer;