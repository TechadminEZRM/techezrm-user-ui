/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React from "react"
import { Mail, Phone, MapPin } from "lucide-react"

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12c0 3.259.014 3.668.072 4.948.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24c3.259 0 3.668-.014 4.948-.072 1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
  </svg>
)
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
  </svg>
)
import { useCompanyDetails } from "@/hooks/use-company-details"
import { toast } from "react-toastify"

interface ContactFormProps {
  source: string
  onSuccess: () => void
  onError: (error: string) => void
}

const ContactForm: React.FC<ContactFormProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSuccess()
      setFormData({ name: "", email: "", phone: "", message: "" })
    } catch (error) {
      onError("Failed to send message. Please try again.")
    }
  }

  const inputClass =
    "w-full bg-transparent border-0 border-b border-white/50 text-white text-[0.95rem] py-2 placeholder:text-white/70 focus:outline-none focus:border-white transition-colors"

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[400px]">
      <div className="flex flex-col gap-6">
        <input
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className={inputClass}
        />
        <input
          name="email"
          type="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className={inputClass}
        />
        <input
          name="phone"
          placeholder="Your Phone"
          value={formData.phone}
          onChange={handleChange}
          className={inputClass}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={3}
          className={`${inputClass} resize-none`}
        />
        <button
          type="submit"
          className="bg-white text-[#F9A922] font-semibold py-3 px-6 rounded-lg text-[0.95rem] hover:bg-white/90 transition-colors"
        >
          Send Message
        </button>
      </div>
    </form>
  )
}

const FooterSection: React.FC = () => {
  const { companyDetails, loading } = useCompanyDetails()

  const handleSuccess = () => {
    toast.success("Thank you! Your message has been sent successfully.")
  }

  const handleError = (error: string) => {
    toast.error(error)
  }

  return (
    <div
      style={{ background: "linear-gradient(135deg, #F9A922 0%, #E8981F 100%)" }}
      className="rounded-b-[20px] py-8 md:py-12 px-4 md:px-8 w-full"
    >
      <div className="px-0">
        {/* Main Content Grid */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Left Side - Contact Information */}
          <div className="flex-1">
            <p className="text-white/80 text-xs font-medium tracking-[0.1em] uppercase mb-4">
              GET IN TOUCH
            </p>
            <h3 className="text-white font-semibold text-[1.8rem] md:text-[2.2rem] mb-6 leading-tight">
              Request More Information
            </h3>
            <p className="text-white/90 text-[0.95rem] leading-relaxed mb-8 max-w-[400px]">
              We supply certified, traceable ingredients for nutrition, wellness, cosmetics, and pharma. Talk to our
              team for quotes, documentation, or custom sourcing.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-white flex-shrink-0" />
                <span className="text-white text-[0.95rem]">
                  {loading ? "Loading..." : companyDetails?.email || "Email@gmail.com"}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-white flex-shrink-0" />
                <span className="text-white text-[0.95rem]">
                  {loading ? "Loading..." : companyDetails?.phone || "1 124 152 424"}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-white flex-shrink-0" />
                <span className="text-white text-[0.95rem]">
                  {loading ? "Loading..." : companyDetails?.address || "J4, Main street, Bristol"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="flex-1 flex md:justify-end">
            <ContactForm source="website" onSuccess={handleSuccess} onError={handleError} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex justify-between items-center pt-8 border-t border-white/20 flex-col md:flex-row gap-6 md:gap-0">
          {/* Left - Navigation Links */}
          <div className="flex gap-8">
            {[
              { label: "Team", href: "/about" },
              { label: "Products", href: "/product" },
              { label: "Connect", href: "/#" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-white text-[0.95rem] hover:opacity-80 transition-opacity"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Center - Logo */}
          <span className="text-white text-2xl font-semibold tracking-[0.05em]">
            {loading ? "Loading..." : companyDetails?.name?.toLowerCase() || "ezrm"}
          </span>

          {/* Right - Social Icons */}
          <div className="flex gap-1">
            {companyDetails?.linkedin && (
              <a
                href={companyDetails.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              >
                <LinkedinIcon />
              </a>
            )}
            {companyDetails?.facebook && (
              <a
                href={companyDetails.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              >
                <FacebookIcon />
              </a>
            )}
            {companyDetails?.instagram && (
              <a
                href={companyDetails.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              >
                <InstagramIcon />
              </a>
            )}
            {companyDetails?.youtube && (
              <a
                href={companyDetails.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              >
                <YoutubeIcon />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FooterSection
