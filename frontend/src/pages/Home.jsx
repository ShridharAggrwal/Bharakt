import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Heart,
  Users,
  Building2,
  Activity,
  Bell,
  ShieldCheck,
  MapPin,
  Clock,
  UserPlus,
  Droplets,
  HeartHandshake,
  ArrowRight,
  Menu,
  X,
  Phone,
  Mail,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "../components/ui/Button";

function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Home", "About", "Blood Types", "How It Works", "Contact"];

  const getDashboardRoute = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/admin';
      case 'ngo': return '/ngo';
      case 'blood_bank': return '/blood-bank';
      default: return '/dashboard';
    }
  };

  const handleDonateClick = () => {
    if (user) navigate('/dashboard/donate');
    else navigate('/login');
  };

  const handleRequestClick = () => {
    if (user) navigate('/dashboard/request');
    else navigate('/login');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? "bg-white/95 backdrop-blur-xl shadow-sm py-3"
        : "bg-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2.5 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/')}
          >
            <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <span className={`text-lg font-semibold transition-colors duration-300 ${isScrolled ? "text-slate-900" : "text-white"}`}>
              Bharakt
            </span>
          </motion.div>

          <nav className="hidden lg:flex items-center">
            <div className={`flex items-center backdrop-blur-sm rounded-full px-1.5 py-1.5 border transition-all duration-300 ${isScrolled
              ? "bg-slate-50/80 border-slate-200/50"
              : "bg-white/10 border-white/20"
              }`}>
              {navLinks.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveLink(item);
                    const element = document.getElementById(item.toLowerCase().replace(/\s+/g, '-'));
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                    else if (item === 'Home') window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeLink === item
                    ? (isScrolled ? "bg-slate-900 text-white" : "bg-white text-slate-900")
                    : (isScrolled ? "text-slate-600 hover:text-slate-900" : "text-white/80 hover:text-white")
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </nav>

          <div className="hidden lg:flex items-center gap-3">

            {!user ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className={`rounded-full transition-all duration-300 px-5 h-10 text-sm font-medium ${isScrolled
                    ? "text-slate-700 hover:bg-slate-100"
                    : "text-white hover:bg-white/10"
                    }`}
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className={`rounded-full transition-all duration-300 px-6 h-10 text-sm font-medium ${isScrolled
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-white text-slate-900 hover:bg-slate-100"
                    }`}
                >
                  Register
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate(getDashboardRoute())}
                className={`rounded-full transition-all duration-300 px-6 h-10 text-sm font-medium ${isScrolled
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-white text-slate-900 hover:bg-slate-100"
                  }`}
              >
                Dashboard
              </Button>
            )}
          </div>

          <button
            className={`lg:hidden p-2 rounded-full transition-colors ${isScrolled ? "hover:bg-slate-100 text-slate-900" : "hover:bg-white/10 text-white"}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100"
        >
          <div className="px-6 py-6 space-y-2">
            {navLinks.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveLink(item);
                  setIsMobileMenuOpen(false);
                  const element = document.getElementById(item.toLowerCase().replace(/\s+/g, '-'));
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeLink === item
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
                  }`}
              >
                {item}
              </button>
            ))}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <Button
                onClick={handleRequestClick}
                className="w-full bg-red-50 text-red-600 hover:bg-red-100 rounded-full h-11"
              >
                Request Blood
              </Button>
              {!user ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/login')}
                    className="w-full rounded-full h-11 border-slate-200 text-slate-700"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => navigate('/register')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full h-11"
                  >
                    Register
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => navigate(getDashboardRoute())}
                  className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full h-11"
                >
                  Dashboard
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

function HeroSection() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDonateClick = () => {
    if (user) navigate('/dashboard/donate');
    else navigate('/login');
  };

  return (
    <section className="relative min-h-[95vh] lg:min-h-screen overflow-hidden bg-slate-50">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://www.livemint.com/lm-img/img/2025/02/20/optimize/INDIA-POLITICS-DELHI-14_1740045325725_1740045348415.jpg"
          alt="Healthcare professional"
          className="w-full h-full object-cover object-[center_15%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20 lg:pt-24 h-full flex items-center min-h-[85vh] lg:min-h-[90vh]">
        <div className="grid lg:grid-cols-12 gap-12 items-center w-full py-12">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 mb-6"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-white/90 text-sm font-medium tracking-wide uppercase">Saving Lives Together</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white leading-[1.2] mb-6"
            >
              Together We Support<br />
              <span className="text-red-400 italic">Educate and Heal</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/80 text-base sm:text-lg max-w-xl mb-8 leading-relaxed"
            >
              Every donation helps a family grow stronger, healthier, and more secure. Together, we build a future full of possibilities.
            </motion.p>

            <div className="flex flex-wrap gap-4 mb-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-white">100% Transparent</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-white">Verified Donors</span>
              </motion.div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 lg:p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-medium text-white">Bharakt</span>
                </div>
                <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-medium text-white/60 uppercase tracking-widest">
                  Live Impact
                </div>
              </div>

              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <HeartHandshake className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-semibold text-white mb-3 leading-tight">Make an Immediate Impact</h3>
              <p className="text-white/70 text-sm mb-6 leading-relaxed">
                Your contribution provides essential aid to families in need with care and dignity.
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleDonateClick}
                  className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full h-12 text-base font-medium shadow-lg shadow-red-600/20"
                >
                  Donate Now
                </Button>
                <Button
                  onClick={() => user ? window.location.href = '/dashboard/request' : window.location.href = '/login'}
                  className="w-full bg-transparent text-white hover:bg-white/10 rounded-full h-12 text-base font-medium transition-all"
                >
                  Request Blood
                </Button>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center lg:text-left"
              >
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-3 mx-auto lg:mx-0">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-0.5">500+</div>
                <div className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Active Volunteers</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center lg:text-left"
              >
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-3 mx-auto lg:mx-0">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-0.5">50,000+</div>
                <div className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Lives Saved</div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1 h-2 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-[1.5rem] overflow-hidden card-shadow h-full border border-slate-100">
              <div className="aspect-[4/3] relative">
                <img
                  src="/images/blood-donation.jpg"
                  alt="Blood donation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <HeartHandshake className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Compassion-Driven Support</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  We provide essential aid to families in need with care, respect, and dignity.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-[1.5rem] p-6 card-shadow h-full flex flex-col border border-slate-100">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Transparent & Trusted</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Every donation is used responsibly, with clear reporting and real impact updates.
              </p>
              <div className="mt-auto">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src="/images/medical-care.jpg"
                    alt="Medical care"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 flex flex-col gap-6"
          >
            <div className="bg-white rounded-[1.5rem] p-6 card-shadow border border-slate-100">
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Community-Focused Programs</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our initiatives empower local communities through education, health support, and sustainable relief.
              </p>
            </div>

            <div className="bg-slate-100 rounded-[1.5rem] overflow-hidden flex-1 relative">
              <img
                src="/images/community.jpg"
                alt="Community support"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Droplets className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-medium text-slate-500">Bharakt</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ImpactSection() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDonateClick = () => {
    if (user) navigate('/dashboard/donate');
    else navigate('/login');
  };

  return (
    <section id="about" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-3xl lg:text-4xl font-serif text-slate-900 mb-4">
                How Your Support Helps<br />
                <span className="text-red-600">Change Lives</span>
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-md">
                Explore the programs that directly impact families and communities. Every contribution you make goes toward creating real, measurable change.
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  icon: Heart,
                  title: "Support Life-Saving Healthcare",
                  description: "Provide medical checkups, essential medicines, and emergency treatments for families who cannot afford healthcare.",
                  image: "/images/healthcare-1.jpg"
                },
                {
                  icon: HeartHandshake,
                  title: "Compassion-Driven Support",
                  description: "Provide essential monthly food packs to families struggling with hunger. Your support ensures they receive nutritious meals and daily comfort.",
                  image: "/images/compassion.jpg"
                },
                {
                  icon: Users,
                  title: "Give Children a Chance to Learn",
                  description: "Help underprivileged children access quality education through books, uniforms, and school supplies. Your contribution shapes their future.",
                  image: "/images/education.jpg"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="flex-1 bg-white rounded-2xl p-5 card-shadow border border-slate-100">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                      <item.icon className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.description}</p>
                    <Button size="sm" onClick={handleDonateClick} className="bg-red-600 hover:bg-red-700 text-white rounded-full text-xs px-4 h-8">
                      Donate Now
                    </Button>
                  </div>
                  <div className="hidden sm:block w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl overflow-hidden card-shadow">
                <div className="aspect-square">
                  <img
                    src="/images/healthcare-support.jpg"
                    alt="Healthcare support"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 card-shadow border border-slate-100">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-bold text-slate-900">8,500+</span>
                    <span className="text-xs text-slate-500">Medical Aid Given</span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-4 card-shadow border border-slate-100">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-bold text-slate-900">12,000+</span>
                    <span className="text-xs text-slate-500">Children Supported</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5 text-red-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Vision Statement</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We strive to create a future where every child has the opportunity to learn, every family has access to basic needs, and every community can grow with hope, security.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                  <Building2 className="w-5 h-5 text-red-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Mission Statement</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We are dedicated to supporting vulnerable communities by providing food, education, healthcare, and essential resources with compassion and dignity.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function BloodTypesSection() {
  const bloodTypes = [
    { type: "A+", canDonateTo: "A+, AB+", canReceiveFrom: "A+, A-, O+, O-", percentage: "35.7%" },
    { type: "A-", canDonateTo: "A+, A-, AB+, AB-", canReceiveFrom: "A-, O-", percentage: "6.3%" },
    { type: "B+", canDonateTo: "B+, AB+", canReceiveFrom: "B+, B-, O+, O-", percentage: "8.5%" },
    { type: "B-", canDonateTo: "B+, B-, AB+, AB-", canReceiveFrom: "B-, O-", percentage: "1.5%" },
    { type: "AB+", canDonateTo: "AB+", canReceiveFrom: "All Types", percentage: "3.4%" },
    { type: "AB-", canDonateTo: "AB+, AB-", canReceiveFrom: "A-, B-, AB-, O-", percentage: "0.6%" },
    { type: "O+", canDonateTo: "O+, A+, B+, AB+", canReceiveFrom: "O+, O-", percentage: "37.4%" },
    { type: "O-", canDonateTo: "All Types", canReceiveFrom: "O-", percentage: "6.6%" },
  ];

  return (
    <section id="blood-types" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block text-red-600 font-medium text-sm tracking-wide uppercase mb-3">
            Blood Types
          </span>
          <h2 className="text-3xl lg:text-4xl font-serif text-slate-900 mb-4">
            Understanding Blood Compatibility
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Learn about different blood types and their compatibility for safe transfusions
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bloodTypes.map((blood, index) => (
            <motion.div
              key={blood.type}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-5 h-full border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:border-red-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-md">
                    <span className="text-xl font-bold text-white">{blood.type}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-500">{blood.percentage}</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide">Donates to</span>
                    <p className="text-xs font-medium text-slate-700">{blood.canDonateTo}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide">Receives from</span>
                    <p className="text-xs font-medium text-slate-700">{blood.canReceiveFrom}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Register",
      description: "Create your account in minutes. Provide basic health information and verify your identity.",
    },
    {
      number: "02",
      icon: Droplets,
      title: "Request or Donate",
      description: "Find nearby donors when you need blood, or respond to requests from those in need.",
    },
    {
      number: "03",
      icon: HeartHandshake,
      title: "Save Lives",
      description: "Complete the donation and become a hero. Track your impact and inspire others.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://www.livemint.com/lm-img/img/2025/02/20/optimize/INDIA-POLITICS-DELHI-14_1740045325725_1740045348415.jpg"
          alt="Background"
          className="w-full h-full object-cover object-[center_15%]"
        />
        <div className="absolute inset-0 bg-white/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block text-red-600 font-medium text-sm tracking-wide uppercase mb-3">
            How It Works
          </span>
          <h2 className="text-3xl lg:text-4xl font-serif text-slate-900 mb-4">
            Simple Steps to Save Lives
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Our streamlined process makes blood donation easier than ever
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <div className="bg-white rounded-[1.5rem] p-8 card-shadow h-full relative group hover:shadow-lg transition-all duration-300 border border-slate-100">
                <div className="absolute top-6 right-6 text-5xl font-bold text-slate-100 group-hover:text-red-50 transition-colors">
                  {step.number}
                </div>
                <div className="relative">
                  <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-100 transition-colors">
                    <step.icon className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-6 transform -translate-y-1/2 z-20 w-8 h-8 bg-white rounded-full items-center justify-center shadow-md border border-slate-100">
                    <ChevronRight className="w-4 h-4 text-red-500" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { icon: Users, label: "Active Donors", value: 15000, suffix: "+", color: "bg-blue-50", iconColor: "text-blue-600" },
    { icon: Building2, label: "Blood Banks", value: 250, suffix: "+", color: "bg-emerald-50", iconColor: "text-emerald-600" },
    { icon: Activity, label: "Partner NGOs", value: 120, suffix: "+", color: "bg-amber-50", iconColor: "text-amber-600" },
    { icon: Heart, label: "Lives Saved", value: 50000, suffix: "+", color: "bg-red-50", iconColor: "text-red-600" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 border border-slate-100 hover:border-slate-200"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative rounded-[2rem] overflow-hidden">
          <img
            src="/images/community.jpg"
            alt="Community support"
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-lg ml-12 lg:ml-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 mb-4"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-white/80 text-sm font-medium tracking-wide uppercase">Stay Connected</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl lg:text-4xl font-serif text-white mb-6"
              >
                Get Updates That<br />Make a Difference
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex gap-3"
              >
                <input
                  type="email"
                  placeholder="Enter Your Email Address"
                  className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-3 text-white placeholder:text-white/50 text-sm focus:outline-none focus:border-white/40"
                />
                <Button className="bg-white text-slate-900 hover:bg-white/90 rounded-full px-6 h-12 text-sm font-medium">
                  Subscribe
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CommunitySection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-slate-900 rounded-[2rem] p-10 lg:p-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }} />
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl" />

          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-red-400 font-medium text-sm tracking-wide uppercase mb-4">
                Join Our Community
              </span>
              <h2 className="text-3xl lg:text-4xl font-serif text-white mb-5 leading-tight">
                Be Part of Something<br />
                <span className="text-red-400">Bigger</span>
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Connect with a community of compassionate individuals dedicated to saving lives.
                Every member makes a difference.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 h-11 text-sm font-medium">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 h-11 text-sm font-medium">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "24/7", label: "Emergency Support" },
                { value: "100%", label: "Verified Donors" },
                { value: "35km", label: "Coverage Radius" },
                { value: "Free", label: "Forever" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
                  <div className="text-xs text-slate-400">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const quickLinks = [
    { label: "About Us", href: "#about" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Blood Types", href: "#blood-types" },
    { label: "Become a Donor", href: "#" },
    { label: "Request Blood", href: "#" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ];

  return (
    <footer id="contact" className="bg-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center">
                <Droplets className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">Bharakt</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
              Bharakt is dedicated to connecting blood donors with those in need,
              making life-saving blood accessible to everyone, everywhere.
            </p>
            <div className="flex gap-3">
              {["twitter", "facebook", "instagram", "linkedin"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-4 h-4 bg-slate-400" style={{
                    maskImage: `url(https://cdn.simpleicons.org/${social})`,
                    WebkitMaskImage: `url(https://cdn.simpleicons.org/${social})`,
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                  }} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-medium text-sm mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium text-sm mb-5">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-red-500" />
                <span>+1 (800) BLOOD-LINK</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-red-500" />
                <span>support@bharakt.org</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>123 Healthcare Ave,<br />Medical District, MD 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Bharakt. All rights reserved.
          </p>
          <div className="flex gap-6">
            {legalLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-slate-500 hover:text-slate-400 text-xs transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ImpactSection />
      <BloodTypesSection />
      <HowItWorksSection />
      <StatsSection />
      <CTASection />
      <CommunitySection />
      <Footer />
    </div>
  );
}
