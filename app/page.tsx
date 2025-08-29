"use client"

// Core React and Next.js imports
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Lucide React icons for consistent iconography
import {
  Facebook,
  Twitter,
  Instagram,
  Home,
  Building,
  Users,
  FileText,
  Mail,
  Phone,
  MapPin,
  Clock,
  X,
  Plus,
  Download,
  ShoppingCart,
  Star,
  Shield,
  BookOpen,
  Search,
} from "lucide-react"

// Next.js Image component for optimized image loading
import Image from "next/image"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PaymentModal } from "@/components/payment/PaymentModal"

/**
 * Custom hook for animated counter effect
 * Creates smooth counting animation from 0 to target number
 * @param end - Target number to count to
 * @param duration - Animation duration in milliseconds
 * @param delay - Delay before starting animation
 */
const useCountUp = (end: number, duration = 2000, delay = 0) => {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!hasStarted) return

    const startTime = Date.now() + delay
    const endTime = startTime + duration

    const timer = setInterval(() => {
      const now = Date.now()

      if (now < startTime) return

      const progress = Math.min((now - startTime) / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 3) // Smoother easing function
      const currentCount = Math.floor(easeOutQuart * end)

      setCount(currentCount)

      if (progress === 1) {
        clearInterval(timer)
        setCount(end)
      }
    }, 16) // ~60fps animation

    return () => clearInterval(timer)
  }, [end, duration, delay, hasStarted])

  return { count, start: () => setHasStarted(true) }
}

/**
 * Main AKA Law Landing Page Component
 * Professional law firm website with modern animations and interactive features
 */
export default function Component() {
  // ==================== STATE MANAGEMENT ====================
  
  // Header scroll state for backdrop blur effect
  const [isScrolled, setIsScrolled] = useState(false)
  
  // Intersection Observer state for scroll-triggered animations
  const [visibleElements, setVisibleElements] = useState(new Set())
  
  // Contact form state management
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  
  // Consultation booking form state
  const [consultationData, setConsultationData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: undefined as Date | undefined,
  })
  
  // Modal and UI state management
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [expandedCards, setExpandedCards] = useState(new Set()) // Expertise cards expansion
  const [isSocialMinimized, setIsSocialMinimized] = useState(false) // Social sidebar state
  const [searchTerm, setSearchTerm] = useState("") // Document library search
  const [countersStarted, setCountersStarted] = useState(false) // Statistics animation trigger
  
  // Document library modal states
  const [selectedDocument, setSelectedDocument] = useState<any>(null) // For purchase modal
  const [showDisclaimer, setShowDisclaimer] = useState(false) // Legal disclaimer modal
  const [showPaymentModal, setShowPaymentModal] = useState(false) // Paystack payment modal
  const [selectedCategory, setSelectedCategory] = useState("all") // Document category filter
  const [showSampleModal, setShowSampleModal] = useState(false) // Document sample preview
  const [selectedSampleDocument, setSelectedSampleDocument] = useState<any>(null) // Selected sample document

  // ==================== COUNTER ANIMATIONS ====================
  
  // Statistics counter hooks with staggered delays for visual appeal
  const commitmentCounter = useCountUp(100, 3000, 0)
  const satisfiedClientsCounter = useCountUp(1074, 3000, 200)
  const coffeesCounter = useCountUp(279000, 3000, 400) // Count to 279000 to display as 279k

  // Start counters when hero section becomes visible
  useEffect(() => {
    if (visibleElements.has("hero-content") && !countersStarted) {
      const timer = setTimeout(() => {
        commitmentCounter.start()
        satisfiedClientsCounter.start()
        coffeesCounter.start()
        setCountersStarted(true)
      }, 1600) // Start right when counters appear (1500ms delay + 100ms)

      return () => clearTimeout(timer)
    }
  }, [visibleElements, countersStarted, commitmentCounter, satisfiedClientsCounter, coffeesCounter])

  // ==================== SCROLL EFFECTS ====================
  
  /**
   * Header scroll effect - adds backdrop blur when scrolled
   */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  /**
   * Intersection Observer for scroll-triggered animations
   * Animates elements as they come into viewport
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set(prev).add(entry.target.id))

            // Animation trigger for hero section (handled by counter useEffect now)
          }
        })
      },
      { threshold: 0.1 }, // Trigger when 10% of element is visible
    )

    // Immediately trigger hero section visibility on mount
    const timer = setTimeout(() => {
      setVisibleElements((prev) => new Set(prev).add("hero-content"))
    }, 100) // Small delay to ensure DOM is ready

    const elements = document.querySelectorAll("[data-animate]")
    elements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [countersStarted])

  // ==================== NAVIGATION FUNCTIONS ====================
  
  /**
   * Smooth scroll to specific section
   * @param sectionId - ID of the target section
   */
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // ==================== FORM HANDLERS ====================
  
  /**
   * Generic form input handler for contact form
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  /**
   * Consultation form input handler
   */
  const handleConsultationChange = (field: string, value: string | Date) => {
    setConsultationData((prev) => ({ ...prev, [field]: value }))
  }

  /**
   * Contact form submission - opens email client with pre-filled message
   */
  const handleSendMessage = () => {
    const { name, email, phone, subject, message } = formData

    const emailBody = `
Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}

Message:
${message}

---
This message was sent from the AKA LAW website contact form.
    `.trim()

    const mailtoLink = `mailto:info@akalaw.co.za?subject=${encodeURIComponent(
      `Website Contact: ${subject}`,
    )}&body=${encodeURIComponent(emailBody)}`

    window.location.href = mailtoLink
  }

  /**
   * Consultation booking handler - opens email client with consultation request
   */
  const handleScheduleConsultation = () => {
    const { name, email, phone, service, date } = consultationData

    const formattedDate = date ? format(date, "EEEE, MMMM do, yyyy") : "Not selected"

    const emailBody = `
CONSULTATION REQUEST

Client Information:
Name: ${name}
Email: ${email}
Phone: ${phone}

Service Required: ${service}
Preferred Date: ${formattedDate}

---
This consultation request was submitted through the AKA LAW website.
Please contact the client to confirm the appointment details.
    `.trim()

    const mailtoLink = `mailto:info@akalaw.co.za?subject=${encodeURIComponent(
      `Consultation Request - ${service}`,
    )}&body=${encodeURIComponent(emailBody)}`

    window.location.href = mailtoLink
    setIsModalOpen(false)

    // Reset consultation form
    setConsultationData({
      name: "",
      email: "",
      phone: "",
      service: "",
      date: undefined,
    })
  }

  // ==================== DOCUMENT LIBRARY HANDLERS ====================
  
  /**
   * Document purchase handler - shows legal disclaimer modal
   */
  const handleDocumentPurchase = (document: any) => {
    setSelectedDocument(document)
    setShowDisclaimer(true)
  }

  /**
   * Process document purchase after disclaimer acceptance
   */
  const proceedToPayment = () => {
    if (!selectedDocument) return

    // Close disclaimer modal and open payment modal
    setShowDisclaimer(false)
    setShowPaymentModal(true)
    // Keep selectedDocument for payment modal to use
  }

  /**
   * Handle payment modal close - reset state
   */
  const handlePaymentModalClose = () => {
    setShowPaymentModal(false)
    setSelectedDocument(null)
  }

  // ==================== UI INTERACTION HANDLERS ====================
  
  /**
   * Toggle expertise card expansion for "Learn More" functionality
   */
  const toggleCardExpansion = (index: number) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  /**
   * Toggle social media sidebar between expanded and minimized states
   */
  const toggleSocialSidebar = () => {
    setIsSocialMinimized(!isSocialMinimized)
  }

  // ==================== DATA CONFIGURATION ====================
  
  /**
   * Expertise areas configuration
   * Defines the four main practice areas with descriptions and images
   */
  const expertiseAreas = [
    {
      icon: Home,
      title: "Real Estate and Property",
      image: "/images/real-estate-expertise.jpeg",
      description:
        "Our Property Law Services are designed to provide you with expert guidance and support at every stage, ensuring that your property-related matters are handled with precision and care.",
      fullDescription:
        "Whether you're buying, selling, leasing, or developing property, our team is equipped with the legal knowledge and practical experience to navigate the intricacies of South African property law. We offer comprehensive services in conveyancing, property disputes, lease agreements, and more, always prioritising your best interests. In addition, we provide tailored services for international purchasers, assisting foreign clients in purchasing and acquiring immovable property in South Africa. With our deep understanding of local laws and regulations, we ensure a seamless and legally compliant process for overseas buyers. With a commitment to transparency, efficiency, and your peace of mind, we aim to make your property journey as smooth as possible, allowing you to proceed with confidence and clarity. Click here for a residential Offer to Purchase.",
    },
    {
      icon: Building,
      title: "Corporate Law",
      image: "/images/corporate-law.jpeg",
      description:
        "At AKA Law, we offer comprehensive Company Law Services to help businesses navigate the complexities of South African corporate law.",
      fullDescription:
        "Whether you're a startup, an established company, or a multinational corporation, our team provides expert legal guidance to support your growth, protect your interests, and ensure compliance with all regulatory requirements. Our services cover a wide range of corporate matters, including company formation, corporate governance, contract law, mergers and acquisitions, dispute resolution, and compliance with South African company laws and regulations. We also specialize in Shareholders Agreements, ensuring that your business relationships are clear, legally sound, and aligned with your strategic goals. In addition, our Company Secretarial Services ensure that your company complies with all statutory and regulatory requirements, from maintaining accurate records to filing necessary documents with authorities. With our in-depth understanding of both local and international business laws, we assist clients in navigating the legal intricacies of the corporate world, offering practical solutions and strategic advice to drive success and safeguard your company's future.",
    },
    {
      icon: Users,
      title: "Deceased Estate",
      image: "/images/deceased-estate.jpeg",
      description:
        "At AKA Law, we understand that dealing with the loss of a loved one is never easy, and the process of managing their estate can feel overwhelming.",
      fullDescription:
        "Our Deceased Estate Services are designed to offer you the compassionate support and expert guidance you need during this difficult time. Whether you are administering a loved one's estate according to a Will, a Trust, or Intestate Succession, we're here to help every step of the way. From handling reporting of an estate to managing asset distribution, we ensure that the deceased's wishes are honoured and that the estate is administered with care and precision. Our team also offers guidance on wills and testaments, assisting with estate taxes, and resolving any disputes that may arise among heirs or beneficiaries. We take the time to listen, provide clear advice, and offer solutions that make the process as smooth and stress-free as possible. At AKA Law, we're here to help you navigate this journey with the sensitivity and expertise you deserve, so you can focus on healing and honouring your loved one's memory.",
    },
    {
      icon: FileText,
      title: "Trust Registration (Asset Management)",
      image: "/images/trust-asset-administration.jpeg",
      description:
        "At AKA Law, we provide expert Trust Registration and Asset Management legal services designed to protect your wealth, secure your legacy, and ensure that your assets are managed according to your wishes.",
      fullDescription:
        "Whether you're looking to establish a trust for estate planning, tax efficiency, or wealth preservation, our team offers clear, strategic advice every step of the way. We assist with the full process of trust registration, from setting up the trust to ensuring compliance with South African trust law. Our services also include advising on the management and distribution of assets, ensuring that the trust operates smoothly and in accordance with your goals. With in-depth knowledge of local laws and a client-focused approach, we help individuals, families, and businesses manage their assets effectively, providing peace of mind that your wealth will be safeguarded for future generations. Click here to set up your will—we're here to make the process as straightforward as possible for you.",
    },
  ]

  /**
   * Legal documents available in the document library
   * Each document includes pricing, features, and metadata
   */
  const legalDocuments = [
    {
      id: 1,
      title: "Offer To Purchase - Residential Property",
      category: "property",
      description:
        "Comprehensive offer to purchase agreement for residential property in South Africa, including all necessary clauses and conditions for property transactions.",
      price: "R 450",
      format: "ZIP (PDF & Word)",
      pages: "14 pages",
      rating: 4.9,
      downloads: 1850,
      features: ["Legally compliant", "Editable format", "Expert reviewed", "Instant download"],
      preview:
        "Includes buyer/seller details, property description, purchase price, conditions of sale, transfer procedures, and legal protections for both parties.",
    },
    {
      id: 2,
      title: "Last Will & Testament",
      category: "estate",
      description:
        "Legally valid will template for South African residents, including executor appointments, asset distribution, and beneficiary designations.",
      price: "R 550",
      format: "ZIP (PDF & Word)",
      pages: "12 pages",
      rating: 4.9,
      downloads: 2400,
      features: ["Legally binding", "Executor guidance", "Asset protection", "Family provisions"],
      preview:
        "Includes beneficiary designations, executor powers, guardian appointments, special bequests, and comprehensive estate planning provisions.",
    },
    {
      id: 3,
      title: "Living Will",
      category: "estate",
      description:
        "Advanced healthcare directive document allowing you to specify your medical treatment preferences and end-of-life care decisions in South Africa.",
      price: "R 550",
      format: "ZIP (PDF & Word)",
      pages: "8 pages",
      rating: 4.8,
      downloads: 1200,
      features: ["Healthcare directive", "Medical decisions", "Legal protection", "Family guidance"],
      preview:
        "Covers medical treatment preferences, life-sustaining treatment decisions, healthcare proxy appointments, and detailed instructions for medical care.",
    },
  ]

  /**
   * Document category filter configuration
   * Used for filtering documents in the library section
   */
  const documentCategories = [
    { id: "all", name: "All Documents", icon: BookOpen },
    { id: "property", name: "Property Law", icon: Home },
    { id: "estate", name: "Estate Planning", icon: Users },
  ]

  /**
   * Filter documents based on selected category and search term
   */
  const filteredDocuments = legalDocuments.filter((doc) => {
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  /**
   * Document sample preview handler
   */
  const handleViewSample = (document: any) => {
    setSelectedSampleDocument(document)
    setShowSampleModal(true)
  }

  // ==================== COMPONENT RENDER ====================
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ==================== FIXED HEADER ==================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-white shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            

            {/* Main Navigation Menu */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection("hero")}
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("vision")}
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Vision
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("expertise")}
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Expertise
              </button>
              <button
                onClick={() => scrollToSection("library")}
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Library
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Contact
              </button>
            </nav>

            {/* Call-to-Action Button */}
            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-primary hover:bg-primary-600 text-white px-6 py-2"
            >
              Schedule Consult
            </Button>
          </div>
        </div>
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="relative pt-16">
        
        {/* ==================== HERO SECTION ==================== */}
        <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-16">
            
            {/* Hero Content - Left Side */}
            <div
              className="space-y-8"
              data-animate
              id="hero-content"
            >

                            {/* Company Logo */}
             <div className="flex items-center">
               <Image
                 src="/images/aka-law-logo.png"
                 alt="AKA LAW - Anchané Kriek Attorneys"
                 width={320}
                 height={180}
                 className="h-16 w-auto"
               />
             </div>
              {/* Brand accent line */}
              <div className={`w-16 h-1 bg-primary transform origin-left transition-all duration-800 delay-500 ${
                visibleElements.has("hero-content") ? "scale-x-100" : "scale-x-0"
              }`}></div>

              {/* Establishment tagline */}
              <div className={`text-primary text-sm font-semibold tracking-wider uppercase transition-all duration-800 delay-700 ${
                visibleElements.has("hero-content") ? "opacity-100" : "opacity-0"
              }`}>
                PRACTICING SINCE 2013
              </div>

              {/* Main headline with brand message */}
              <h1 className={`text-4xl lg:text-5xl font-bold text-gray-900 leading-tight transition-all duration-1000 delay-900 ${
                visibleElements.has("hero-content") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}>
                Recognised for delivering exceptional legal services with{" "}
                <span className="text-primary">precision, integrity, and strategic insight.</span>
              </h1>

              {/* Value proposition description */}
              <p className={`text-gray-600 text-lg leading-relaxed max-w-lg transition-all duration-1000 delay-1100 ${
                visibleElements.has("hero-content") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}>
                We aim to simplify complex legal matters and empower our clients to make informed decisions with
                confidence.
              </p>

              {/* Call-to-action buttons */}
              <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-1300 ${
                visibleElements.has("hero-content") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}>
                <Button
                  onClick={() => scrollToSection("contact")}
                  className="bg-primary hover:bg-primary-600 text-white px-8 py-3 transform hover:scale-105 transition-transform"
                >
                  Schedule Consult
                </Button>
                <Button
                  onClick={() => scrollToSection("expertise")}
                  variant="outline"
                  className="border-gray-400 text-gray-700 hover:bg-gray-50 px-8 py-3 transform hover:scale-105 transition-transform"
                >
                  Explore More
                </Button>
              </div>

              {/* Animated statistics counters */}
              <div className={`grid grid-cols-3 gap-8 pt-8 transition-all duration-1000 delay-1500 ${
                visibleElements.has("hero-content") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}>
                {[
                  {
                    number: `${commitmentCounter.count}%`,
                    label: "COMMITMENT",
                    key: "commitment",
                  },
                  {
                    number: `${satisfiedClientsCounter.count}+`,
                    label: "CLIENTS",
                    key: "satisfied-clients",
                  },
                  { 
                    number: `${Math.floor(coffeesCounter.count / 1000)}k`, 
                    label: "COFFEES", 
                    key: "coffees" 
                  },
                ].map((stat, index) => (
                  <div
                    key={stat.key}
                    className="text-center"
                  >
                    <div className="text-4xl font-bold text-gray-900 tabular-nums">{stat.number}</div>
                    <div className="text-primary text-sm font-semibold tracking-wider uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image - Right Side */}
            <div className={`relative transition-all duration-1000 delay-400 ${
              visibleElements.has("hero-content") ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}>
              <div className="relative h-96 lg:h-full">
                <Image
                  src="/images/modern-office-interior.jpeg"
                  alt="Modern professional office interior with contemporary furniture, natural lighting, and sophisticated design perfect for legal consultations"
                  fill
                  className="object-cover object-center rounded-lg transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ==================== VISION SECTION ==================== */}
        <section id="vision" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div
                className={`transition-all duration-1000 ${
                  visibleElements.has("vision-content") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                data-animate
                id="vision-content"
              >
                {/* Section accent line */}
                <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
                
                {/* Section heading */}
                <h2 id="vision-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Our Vision</h2>
                
                {/* Vision statement content */}
                <div className="max-w-4xl mx-auto space-y-6">
                  <p className="text-xl text-gray-600 leading-relaxed mb-6 text-justify">
                    At AKA Law, our vision is to be a trusted leader in the legal profession, recognised for delivering
                    exceptional legal services with precision, integrity, and strategic insight. We are committed to
                    fostering enduring client relationships by consistently providing high-quality legal counsel
                    tailored to each client's unique objectives.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6 text-justify">
                    We aim to simplify complex legal matters and empower our clients to make informed decisions with
                    confidence. Our team's depth of knowledge, combined with a client-centric approach, ensures that
                    every matter is handled with diligence, professionalism, and discretion.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed text-justify">
                    We aspire to be more than legal advisors—we aim to be long-term partners in our clients' success,
                    providing clarity in uncertainty and stability through change. Through our commitment to excellence
                    and innovation, we continuously strive to raise the standard of legal practice and deliver
                    meaningful outcomes that stand the test of time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== ABOUT US SECTION ==================== */}
        <section id="about" className="bg-primary text-white py-24 overflow-hidden relative">
          {/* Decorative background circle */}
          <div className="absolute left-0 top-0 w-[80%] h-[140%] md:w-[60%] md:h-[120%]">
            <div className="w-full h-full rounded-full bg-primary-400 opacity-20 transform -translate-x-1/3 -translate-y-1/4"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Founder profile image - Left Side */}
              <div
                className={`relative transition-all duration-1000 ${
                  visibleElements.has("about-circle") ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
                }`}
                data-animate
                id="about-circle"
              >
                <div className="w-full h-full max-w-md mx-auto">
                  <div className="aspect-square rounded-full overflow-hidden bg-primary-300 transform hover:scale-110 transition-transform duration-500 shadow-2xl">
                    <Image
                      src="/images/anchane-kriek-profile.jpeg"
                      alt="Anchané Kriek, Founding Attorney of AKA Law - Professional portrait of a confident legal professional"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* About content - Right Side */}
              <div
                className={`space-y-6 transition-all duration-1000 delay-300 ${
                  visibleElements.has("about-content") ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                }`}
                data-animate
                id="about-content"
              >
                <h2 className="text-5xl md:text-6xl font-bold mb-6">About us.</h2>

                {/* Company overview paragraphs */}
                <p className="text-lg leading-relaxed text-justify">
                  Based in Pretoria, Anchané Kriek Attorney Incorporated (AKA Law) is a dynamic South African law firm dedicated
                  to delivering premium legal services to both individuals and businesses. We offer expertise across a
                  range of areas, including company and commercial law, property law (conveyancing), deceased estates,
                  and asset administration (trust).
                </p>

                <p className="text-lg leading-relaxed text-justify">
                  Our team is committed to achieving the best outcomes for our clients while upholding the highest
                  standards of professional conduct. We combine in-depth legal knowledge with a forward-thinking
                  approach to deliver solutions that are not only effective but also aligned with your long-term goals.
                </p>

                <p className="text-lg leading-relaxed text-justify">
                  What sets us apart is our focus on innovation, precision, and efficiency. We work closely with our
                  clients to develop strategies that are both legally sound and practically effective—empowering you,
                  the client, to make confident, informed decisions at every stage.
                </p>

                <p className="text-lg leading-relaxed text-justify">
                  We want to empower you, the client, to make confident, informed decisions at every stage.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== EXPERTISE SECTION ==================== */}
        <section id="expertise" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div
              className={`text-center mb-16 transition-all duration-1000 ${
                visibleElements.has("expertise-header") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              data-animate
              id="expertise-header"
            >
              <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Expertise</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We provide comprehensive legal services across multiple practice areas, delivering expert guidance
                tailored to your specific needs.
              </p>
            </div>

            {/* Expertise Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {expertiseAreas.map((area, index) => {
                const Icon = area.icon
                const isExpanded = expandedCards.has(index)
                return (
                  <Card
                    key={area.title}
                    className={`group hover:shadow-xl transition-all duration-500 border-0 shadow-lg ${
                      visibleElements.has(`expertise-${index}`)
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                    data-animate
                    id={`expertise-${index}`}
                  >
                    <CardContent className="p-8">
                      <div className="flex items-start space-x-6">
                        
                        {/* Icon and image column */}
                        <div className="flex-shrink-0 flex flex-col items-center space-y-4">
                          {/* Practice area icon */}
                          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            <Icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
                          </div>
                          
                          {/* Practice area image */}
                          <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
                            <Image
                              src={area.image || "/placeholder.svg"}
                              alt={`${area.title} - Professional legal services illustration`}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        
                        {/* Content column */}
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                            {area.title}
                          </h3>
                          <p className="text-gray-600 mb-4 leading-relaxed text-left sm:text-justify">{area.description}</p>

                          {/* Expandable detailed description */}
                          <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                              isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                            }`}
                          >
                            <p className="text-gray-600 leading-relaxed text-sm mb-4 text-left sm:text-justify">
                              {area.fullDescription}
                            </p>
                          </div>

                          {/* Learn More toggle button */}
                          <div className="mt-6">
                            <Button
                              onClick={() => toggleCardExpansion(index)}
                              variant="outline"
                              className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 group-hover:scale-105"
                            >
                              {isExpanded ? "Show Less" : "Learn More"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* ==================== LEGAL DOCUMENT LIBRARY SECTION ==================== */}
        <section id="library" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div
              className={`text-center mb-16 transition-all duration-1000 ${
                visibleElements.has("library-header") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              data-animate
              id="library-header"
            >
              <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Legal Document Library</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Access professionally drafted legal documents created by our expert attorneys. Download instantly and
                customize for your specific needs.
              </p>
            </div>

            {/* Search and Filter Controls */}
            <div
              className={`mb-12 transition-all duration-1000 delay-200 ${
                visibleElements.has("library-filters") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              data-animate
              id="library-filters"
            >
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search legal documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-primary focus:ring-primary"
                  />
                </div>

                {/* Category Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  {documentCategories.map((category) => {
                    const Icon = category.icon
                    return (
                      <Button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        className={`${
                          selectedCategory === category.id
                            ? "bg-primary hover:bg-primary-600 text-white"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        } transition-all duration-300`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {category.name}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Document Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDocuments.map((document, index) => (
                <Card
                  key={document.id}
                  className={`group hover:shadow-xl transition-all duration-500 border-0 shadow-lg flex flex-col h-full ${
                    visibleElements.has(`library-doc-${index}`)
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  data-animate
                  id={`library-doc-${index}`}
                >
                  <CardContent className="p-6 flex flex-col h-full">
                    
                    {/* Document Header with Title and Price */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                          {document.title}
                        </h3>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {documentCategories.find((cat) => cat.id === document.category)?.name}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{document.price}</div>
                        <div className="text-sm text-gray-500">{document.format}</div>
                      </div>
                    </div>

                    {/* Document Description */}
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">{document.description}</p>

                    {/* Document Statistics */}
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{document.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>{document.downloads}</span>
                        </div>
                      </div>
                      <span>{document.pages}</span>
                    </div>

                    {/* Document Features Tags */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {document.features.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {feature}
                          </span>
                        ))}
                        {document.features.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{document.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Document Preview */}
                    <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 leading-relaxed">{document.preview}</p>
                    </div>

                    {/* Action Buttons - Fixed at bottom */}
                    <div className="space-y-3 mt-auto">
                      <Button
                        onClick={() => handleDocumentPurchase(document)}
                        className="w-full bg-primary hover:bg-primary-600 text-white transform hover:scale-105 transition-all duration-300"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Purchase & Download
                      </Button>
                      <Button
                        onClick={() => handleViewSample(document)}
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Sample
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Library Features Section */}
            <div
              className={`mt-16 transition-all duration-1000 delay-500 ${
                visibleElements.has("library-features") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              data-animate
              id="library-features"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Legal Compliance Feature */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Legally Compliant</h3>
                  <p className="text-gray-600 text-sm">
                    All documents are drafted by qualified attorneys and comply with South African law.
                  </p>
                </div>
                
                {/* Instant Download Feature */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Download</h3>
                  <p className="text-gray-600 text-sm">
                    Download immediately after purchase as a ZIP file containing both PDF and editable Word formats.
                  </p>
                </div>
                
                {/* Expert Support Feature */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Expert Support</h3>
                  <p className="text-gray-600 text-sm">
                    Get professional guidance and support from our legal team when needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== CONTACT SECTION ==================== */}
        <section id="contact" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div
              className={`text-center mb-16 transition-all duration-1000 ${
                visibleElements.has("contact-header") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              data-animate
              id="contact-header"
            >
              <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ready to discuss your legal needs? Get in touch with our team for expert guidance and personalized
                solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Contact Form - Left Side */}
              <div
                className={`transition-all duration-1000 ${
                  visibleElements.has("contact-form") ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
                }`}
                data-animate
                id="contact-form"
              >
                <Card className="shadow-lg border-0">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                    <div className="space-y-6">
                      
                      {/* Name and Email Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="border-gray-300 focus:border-primary focus:ring-primary"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="border-gray-300 focus:border-primary focus:ring-primary"
                            required
                          />
                        </div>
                      </div>

                      {/* Phone and Subject Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+27 82 562 3826"
                            value={formData.phone}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Allow only numbers, spaces, +, -, and parentheses
                              const cleaned = value.replace(/[^\d\s+\-()]/g, '');
                              handleInputChange("phone", cleaned);
                            }}
                            onBlur={(e) => {
                              const value = e.target.value;
                              if (value && !/^[\+]?[0-9\s\-\(\)]{10,15}$/.test(value)) {
                                e.target.classList.add('border-red-500');
                              } else {
                                e.target.classList.remove('border-red-500');
                              }
                            }}
                            className="border-gray-300 focus:border-primary focus:ring-primary"
                          />
                          {formData.phone && !/^[\+]?[0-9\s\-\(\)]{10,15}$/.test(formData.phone) && (
                            <p className="text-red-500 text-xs mt-1">
                              Please enter a valid phone number (e.g., +27 82 562 3826)
                            </p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                            Subject *
                          </label>
                          <Select onValueChange={(value) => handleInputChange("subject", value)}>
                            <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="real-estate">Real Estate & Property</SelectItem>
                              <SelectItem value="corporate">Corporate Law</SelectItem>
                              <SelectItem value="deceased-estate">Deceased Estate</SelectItem>
                              <SelectItem value="trust-registration">Trust Registration</SelectItem>
                              <SelectItem value="consultation">General Consultation</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Message Field */}
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                          Message *
                        </label>
                        <Textarea
                          id="message"
                          placeholder="Please describe your legal needs or questions..."
                          rows={6}
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          className="border-gray-300 focus:border-primary focus:ring-primary resize-none"
                          required
                        />
                      </div>

                      {/* Submit Button */}
                      <Button
                        onClick={handleSendMessage}
                        className="w-full bg-primary hover:bg-primary-600 text-white py-3 transform hover:scale-105 transition-all duration-300"
                        disabled={!formData.name || !formData.email || !formData.subject || !formData.message}
                      >
                        <Mail className="w-5 h-5 mr-2" />
                        Send Message
                      </Button>

                      <p className="text-sm text-gray-500 text-center">
                        * Required fields. This will open your email client to send the message.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information - Right Side */}
              <div
                className={`space-y-8 transition-all duration-1000 delay-300 ${
                  visibleElements.has("contact-info") ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                }`}
                data-animate
                id="contact-info"
              >
                
                {/* Office Location Card */}
                <Card className="shadow-lg border-0">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Our Office</h3>
                        <p className="text-gray-600 leading-relaxed">
                          2 Lenchen Park
                          <br />
                          Lenchen Avenue South
                          <br />
                          Centurion, 0046
                          <br />
                          South Africa
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Details Card */}
                <Card className="shadow-lg border-0">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Contact Details</h3>
                        <div className="space-y-2 text-gray-600">
                          <p>
                            <strong>Phone:</strong>{" "}
                            <a href="tel:+27825623826" className="hover:text-primary transition-colors">
                              +27 82 562 3826
                            </a>
                          </p>
                          <p>
                            <strong>Email:</strong>{" "}
                            <a href="mailto:anchane@akalaw.co.za" className="hover:text-primary transition-colors">
                              anchane@akalaw.co.za
                            </a>
                          </p>
                          <p>
                            <strong>Fax:</strong> 086 202 7191
                          </p>
                          <p>
                            <strong>Website:</strong>{" "}
                            <a
                              href="https://www.akalaw.co.za"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary transition-colors"
                            >
                              www.akalaw.co.za
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Office Hours Card */}
                <Card className="shadow-lg border-0">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Office Hours</h3>
                        <div className="space-y-1 text-gray-600">
                          <p>
                            <strong>Monday - Friday:</strong> 8:00 AM - 5:00 PM
                          </p>
                          <p>
                            <strong>Saturday:</strong> 9:00 AM - 1:00 PM
                          </p>
                          <p>
                            <strong>Sunday:</strong> Closed
                          </p>
                          <p className="text-sm text-primary mt-2">For legal emergency assistance after hours please communicate via WhatsApp on <strong>+27 082 562 3826</strong></p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SOCIAL MEDIA SIDEBAR ==================== */}
        <div
          className={`fixed right-0 top-1/2 transform -translate-y-1/2 bg-primary text-white rounded-l-lg hidden lg:block z-40 transition-all duration-500 ease-in-out opacity-0 translate-x-4 animate-[fadeInLeft_1s_ease-out_2s_forwards] ${
            isSocialMinimized ? "w-12" : "w-48"
          }`}
        >
          <div className="relative">
            
            {/* Toggle Button */}
            <button
              onClick={toggleSocialSidebar}
              className="absolute -left-3 top-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors shadow-lg"
              aria-label={isSocialMinimized ? "Expand social media" : "Minimize social media"}
            >
              {isSocialMinimized ? <Plus className="w-3 h-3 text-white" /> : <X className="w-3 h-3 text-white" />}
            </button>

            {/* Sidebar Content */}
            <div className="p-4">
              {isSocialMinimized ? (
                // Minimized state - icons only
                <div className="flex flex-col space-y-4">
                  <a
                    href="#"
                    className="text-white hover:text-primary-200 hover:scale-110 transition-all"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="text-white hover:text-primary-200 hover:scale-110 transition-all"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="text-white hover:text-primary-200 hover:scale-110 transition-all"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              ) : (
                // Expanded state - full content
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-sm font-semibold mb-4 tracking-wider">FOLLOW US</h3>
                    <p className="text-xs opacity-90 leading-relaxed">
                      Stay connected with AKA Law for legal insights and updates
                    </p>
                  </div>

                  <div className="space-y-4">
                    <a
                      href="https://www.facebook.com/share/1BZYAPtrrD/?mibextid=wwXIfr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-white hover:text-primary-200 transition-colors group"
                    >
                      <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">Facebook</span>
                    </a>
                    <a
                      href="https://x.com/AKALAW101"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-white hover:text-primary-200 transition-colors group"
                    >
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <span className="text-sm font-medium">X</span>
                    </a>
                    <a
                      href="https://www.instagram.com/akalaw101"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-white hover:text-primary-200 transition-colors group"
                    >
                      <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">Instagram</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ==================== MODAL COMPONENTS ==================== */}
      
      {/* Paystack Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handlePaymentModalClose}
        document={selectedDocument}
      />
      
      {/* Document Purchase Disclaimer Modal */}
      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
              Legal Document Purchase Agreement
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            
            {/* Document Information Header */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-primary mb-2">Document Purchase: {selectedDocument?.title}</h3>
              <p className="text-sm text-gray-600">
                Price: {selectedDocument?.price} | Format: {selectedDocument?.format}
              </p>
            </div>

            {/* Legal Disclaimer Content */}
            <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                  Legal disclaimer for legal documents purchased:
                </h4>

                <div className="space-y-4">
                  {/* Document-specific disclaimer for Will and Living Will */}
                  {(selectedDocument?.id === 2 || selectedDocument?.id === 3) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="font-semibold text-blue-800 mb-2">1. Originally signed and printed (Will and Living will):</h5>
                      <p className="text-blue-700">
                        The Will and Living Will documents must be printed and signed originally. Only original signed hard-copy documents are accepted as valid wills in South Africa.
                      </p>
                    </div>
                  )}

                  {/* Disclaimer Section 1 */}
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">
                      {selectedDocument?.id === 2 || selectedDocument?.id === 3 ? "2." : "1."} No Attorney-Client Relationship:
                    </h5>
                    <p>
                      Any document purchased and used on AKA Law's website does not establish an attorney-client
                      relationship, and the user hereby understands they are not receiving legal advice.
                    </p>
                  </div>

                  {/* Disclaimer Section 2 */}
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">
                      {selectedDocument?.id === 2 || selectedDocument?.id === 3 ? "3." : "2."} Informational Purposes Only:
                    </h5>
                    <p>
                      The document's content is drafted for its general purpose and does not include specific individual
                      clauses or information that might be applicable in the user's circumstances and the user
                      acknowledge that by buying and using this document that it does not substitute for professional
                      legal advice.
                    </p>
                  </div>

                  {/* Disclaimer Section 3 */}
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">
                      {selectedDocument?.id === 2 || selectedDocument?.id === 3 ? "4." : "3."} Limitation of Liability:
                    </h5>
                    <p>
                      The information provided in this document is not intended to be a substitute for professional
                      legal advice. We are not responsible for any errors or omissions in the information provided. AKA
                      Law and its employees will under no circumstances accept liability for the consequences resulting
                      from the use this template. We believe that it's important to always discuss legal matters with an
                      attorney before making a decision or signing any document.
                    </p>
                  </div>

                  {/* Free Consultation Benefit */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h5 className="font-semibold text-green-800 mb-2">
                      {selectedDocument?.id === 2 || selectedDocument?.id === 3 ? "5." : "4."} 20-Minute free consultation with every document purchased:
                    </h5>
                    <p className="text-green-700">
                      Each user who purchases a document is entitled to a 20-minute free consultation relating to the
                      document purchased. This consultation does not include amendments or changes to the document which
                      will be billed separately should it be required.
                    </p>
                  </div>

                  {/* Fair Use Disclaimer */}
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">
                      {selectedDocument?.id === 2 || selectedDocument?.id === 3 ? "6." : "5."} "Fair Use" Disclaimer:
                    </h5>
                    <p>
                      The material contained on these pages and in any printed form hereof ("the material") is subject
                      to copyright and is the ownership of Anchané Kriek Attorney Inc. No part of the material may be
                      reproduced or transmitted in any form or by any means, electronic or mechanical, including
                      photocopying, or by any information storage and retrieval system, without prior written permission
                      from Anchané Kriek Attorney Inc. AKA Law grants the user the right to use the material by
                      downloading, storing and making copies for private use only. None of the above grants any person
                      the right to copy or substantially include any of the material in a published work, whether
                      consisting in physical, electronic or whatever form, without prior written consent from Anchané
                      Kriek Attorney Inc.
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Reminder */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Important Reminder:</h4>
                <p className="text-blue-700">
                  Remember, your purchase includes a complimentary 20-minute consultation with one of our qualified
                  attorneys to discuss the document and answer any questions you may have about its use.
                </p>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                onClick={() => setShowDisclaimer(false)}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel Purchase
              </Button>
              <Button onClick={proceedToPayment} className="flex-1 bg-primary hover:bg-primary-600 text-white">
                I Agree - Proceed to Purchase
              </Button>
            </div>

            {/* Terms Acknowledgment */}
            <p className="text-xs text-gray-500 text-center border-t pt-4">
              By proceeding with this purchase, you acknowledge that you have read, understood, and agree to all terms
              and conditions outlined above.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Sample Preview Modal */}
      <Dialog open={showSampleModal} onOpenChange={setShowSampleModal}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
              Document Sample: {(selectedSampleDocument as any)?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedSampleDocument ? (
              <div className="space-y-4">
                
                {/* Sample Preview Header */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h3 className="font-semibold text-primary mb-2">Sample Preview</h3>
                  <p className="text-sm text-gray-600">
                    This is a preview of the {selectedSampleDocument.title} document. The full document contains
                    additional sections and clauses.
                  </p>
                </div>
                
                {/* Document Sample Images */}
                <div className="border rounded-lg overflow-hidden bg-white">
                  {/* Offer to Purchase Sample */}
                  {selectedSampleDocument.id === 1 && (
                    <Image
                      src="/images/offer-to-purchase-sample.png"
                      alt="Sample of Offer To Purchase - Residential Property document showing immovable property condition report"
                      width={800}
                      height={600}
                      className="w-full h-auto"
                    />
                  )}
                  
                  {/* Last Will & Testament Sample */}
                  {selectedSampleDocument.id === 2 && (
                    <Image
                      src="/images/last-will-testament-sample.png"
                      alt="Sample of Last Will & Testament document showing legal template with executor appointments and beneficiary sections"
                      width={800}
                      height={600}
                      className="w-full h-auto"
                    />
                  )}
                  
                  {/* Living Will Sample */}
                  {selectedSampleDocument.id === 3 && (
                    <Image
                      src="/images/living-will-sample.png"
                      alt="Sample of Living Will document showing healthcare directive template with medical proxy nominations"
                      width={800}
                      height={600}
                      className="w-full h-auto"
                    />
                  )}
                </div>
                
                {/* Document Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">About This Document:</h4>
                  <p className="text-blue-700 text-sm">
                    {selectedSampleDocument.id === 1 &&
                      "This comprehensive document includes all necessary clauses for residential property transactions in South Africa, including buyer/seller details, property descriptions, purchase price, conditions of sale, and transfer procedures."}
                    {selectedSampleDocument.id === 2 &&
                      "This legally binding will template includes executor appointments, asset distribution, beneficiary designations, and comprehensive estate planning provisions compliant with South African law."}
                    {selectedSampleDocument.id === 3 &&
                      "This advanced healthcare directive allows you to specify medical treatment preferences, nominate a medical proxy, and provide detailed instructions for end-of-life care decisions in South Africa."}
                  </p>
                </div>
              </div>
            ) : (
              /* Fallback for no sample available */
              <div className="text-center py-8">
                <p className="text-gray-600">Sample preview not available for this document.</p>
              </div>
            )}

            {/* Sample Modal Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
              <Button
                onClick={() => setShowSampleModal(false)}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Close Preview
              </Button>
              <Button
                onClick={() => {
                  setShowSampleModal(false)
                  handleDocumentPurchase(selectedSampleDocument)
                }}
                className="bg-primary hover:bg-primary-600 text-white"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Purchase This Document
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ==================== CUSTOM CSS ANIMATIONS ==================== */}
      <style jsx>{`
        /* Fade in up animation for hero elements */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(2rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Fade in right animation for hero image */
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(2rem);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Fade in left animation for social sidebar */
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(1rem);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Simple fade in animation */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Scale X animation for accent lines */
        @keyframes scaleX {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-8 text-center">
        <p className="text-gray-600 text-sm">
          Developed by{" "}
          <a
            href="https://xspark.co.za/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-600 font-medium transition-colors"
          >
            X Spark
          </a>{" "}
          Pty Ltd
        </p>
      </footer>
    </div>
  )
}
