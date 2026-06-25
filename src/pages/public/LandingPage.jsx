import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Building2, Users, Calendar, BookOpen, BarChart3, Award,
  ArrowRight, Star, Sparkles, Search, CheckCircle,
  GraduationCap, Shield, Clock,
} from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import Button from '../../components/ui/Button'

/* ────── animated counter ────── */
function AnimatedCounter({ value, suffix = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  return (
    <span ref={ref} className="text-4xl sm:text-5xl font-bold font-heading text-white">
      {isInView ? value : '0'}{suffix}
    </span>
  )
}

/* ────── feature card ────── */
const features = [
  { icon: Building2, title: 'Multi-College Management', desc: 'Create and manage multiple colleges under one platform with unique codes and principal assignment.', color: 'bg-blue-500' },
  { icon: Users, title: 'Role-Based Access', desc: 'Five distinct roles — Admin, Principal, HOD, Professor, Student — each with tailored dashboards.', color: 'bg-purple-500' },
  { icon: Clock, title: 'Smart Timetables', desc: 'Department-wise weekly schedules managed by HODs with real-time updates.', color: 'bg-emerald-500' },
  { icon: Calendar, title: 'Event Management', desc: 'Campus to club-level events with ticketing, Stripe payments, and participant tracking.', color: 'bg-orange-500' },
  { icon: BookOpen, title: 'Notes & Resources', desc: 'Year and subject-wise study materials uploaded by professors, accessible to students.', color: 'bg-pink-500' },
  { icon: BarChart3, title: 'Progress Tracking', desc: 'Real-time academic progress with subject-wise insights and professor notes.', color: 'bg-teal-500' },
]

const stats = [
  { value: '500', suffix: '+', label: 'Colleges' },
  { value: '10k', suffix: '+', label: 'Students' },
  { value: '1k', suffix: '+', label: 'Teachers' },
  { value: '50k', suffix: '+', label: 'Events' },
]

const steps = [
  { num: '01', icon: Shield, title: 'Admin Creates College', desc: 'Campus admin registers colleges, assigns principals, manages the platform.' },
  { num: '02', icon: Users, title: 'Teachers Manage', desc: 'Principals, HODs, and Professors handle depts, timetables, events & clubs.' },
  { num: '03', icon: GraduationCap, title: 'Students Learn', desc: 'Students access events, notes, submit work, track progress — all in one place.' },
]

const roleCards = [
  { role: 'Campus Admin', color: 'from-blue-800 to-blue-900', icon: Shield, features: ['Create & manage colleges', 'Campus-wide broadcasts', 'Platform analytics'] },
  { role: 'Principal', color: 'from-purple-700 to-purple-900', icon: Building2, features: ['Manage departments', 'Approve clubs', 'College events'] },
  { role: 'HOD', color: 'from-teal-600 to-teal-800', icon: Users, features: ['Dept timetables', 'Club approvals', 'Dept broadcasts'] },
  { role: 'Professor', color: 'from-orange-500 to-orange-700', icon: BookOpen, features: ['Manage batches', 'Upload notes', 'Track progress'] },
  { role: 'Student', color: 'from-emerald-500 to-emerald-700', icon: GraduationCap, features: ['Register events', 'Submit work', 'View progress'] },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const featuresRef = useRef(null)
  const statsRef = useRef(null)
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: '-100px' })
  const isStatsInView = useInView(statsRef, { once: true, margin: '-100px' })

  return (
    <div className="overflow-x-hidden">
      <Navbar />

      {/* ═══════════ HERO ═══════════ */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center gradient-bg overflow-hidden"
      >
        {/* Mesh overlay */}
        <div className="absolute inset-0 mesh-gradient opacity-50" />

        {/* Floating decorative elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-32 left-[10%] text-accent-400 text-4xl opacity-60"
        >
          ★
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-48 right-[15%] text-accent-400 text-2xl opacity-40"
        >
          ✦
        </motion.div>
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-32 left-[20%] text-accent-400 text-3xl opacity-50"
        >
          ◆
        </motion.div>
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-60 right-[30%] text-white/10 text-6xl"
        >
          ✦
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-6"
              >
                <GraduationCap className="w-4 h-4 text-accent-400" />
                <span className="text-sm text-white/90 font-medium">
                  Manage Your Campus Smarter
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-7xl font-bold font-heading text-white leading-tight mb-6"
              >
                Manage Campus,{' '}
                <span className="text-accent-400">Empower</span>{' '}
                Everyone
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-white/70 max-w-lg mb-8 leading-relaxed"
              >
                One platform for admins, teachers, and students to collaborate, learn, and
                grow together. Streamline your entire campus operations.
              </motion.p>

              {/* Search bar */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center bg-white/10 backdrop-blur rounded-full border border-white/20 px-4 py-2 max-w-md mb-8"
              >
                <Search className="w-5 h-5 text-white/50 mr-3" />
                <input
                  type="text"
                  placeholder="Search features..."
                  className="bg-transparent text-white placeholder-white/40 outline-none flex-1 text-sm"
                />
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <button
                  onClick={() => navigate('/register')}
                  className="btn-accent flex items-center gap-2 text-base"
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/external-events')}
                  className="btn-secondary text-base"
                >
                  View Open Events →
                </button>
                <button
                  onClick={() => {
                    const el = document.querySelector('#features')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="btn-secondary text-base"
                >
                  Learn More
                </button>
              </motion.div>
            </div>

            {/* Right — Floating Cards */}
            <div className="hidden lg:block relative h-[500px]">
              {/* Rating Card */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="absolute bottom-16 left-0 z-20"
              >
                <div className="bg-white rounded-2xl p-4 shadow-2xl">
                  <div className="text-lg font-bold text-dark-900 mb-1">4.8 ⭐⭐⭐⭐</div>
                  <p className="text-sm text-dark-500">Trusted by students worldwide</p>
                </div>
              </motion.div>

              {/* Center illustration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-72 h-72 rounded-3xl bg-white/5 backdrop-blur border border-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <GraduationCap className="w-20 h-20 text-white/30 mx-auto mb-4" />
                    <p className="text-white/40 text-sm">Campus Management</p>
                  </div>
                </div>
              </motion.div>

              {/* Users Card */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="absolute bottom-8 right-0 z-20"
              >
                <div className="bg-white rounded-2xl p-4 shadow-2xl">
                  <div className="flex -space-x-2 mb-2">
                    {['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500'].map(
                      (color, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full ${color} border-2 border-white`}
                        />
                      )
                    )}
                  </div>
                  <p className="text-lg font-bold text-dark-900">2k+ Active Users</p>
                  <p className="text-sm text-dark-500">Students growing with expert guidance</p>
                </div>
              </motion.div>

              {/* Decorative floating blobs */}
              <div className="absolute top-10 right-20 w-20 h-20 rounded-full bg-accent-400/20 blur-2xl animate-float" />
              <div className="absolute bottom-20 left-16 w-32 h-32 rounded-full bg-primary-400/20 blur-3xl animate-float-slow" />
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path
              d="M0,80 C360,20 720,60 1080,20 C1260,0 1380,30 1440,40 L1440,80 Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section id="features" ref={featuresRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-sm font-medium mb-4">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-dark-900 mb-4">
              Everything Your{' '}
              <span className="gradient-text">Campus Needs</span>
            </h2>
            <p className="text-dark-500 max-w-2xl mx-auto">
              A comprehensive suite of tools to manage every aspect of campus life.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group bg-white rounded-2xl p-6 border border-dark-100 hover:border-primary-200 hover:shadow-card-hover transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold font-heading text-dark-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-dark-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <section ref={statsRef} className="py-20 gradient-bg relative">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, idx) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center"
              >
                <AnimatedCounter value={s.value} suffix={s.suffix} />
                <p className="text-white/60 mt-2 text-sm font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-accent-50 text-accent-600 rounded-full text-sm font-medium mb-4">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-dark-900 mb-4">
              Three Simple <span className="gradient-text">Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 border-t-2 border-dashed border-primary-200" />

            {steps.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary-600 text-white flex items-center justify-center mx-auto mb-6 text-2xl font-bold font-heading relative z-10">
                  {step.num}
                </div>
                <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold font-heading text-dark-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-dark-500">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ MODULES / ROLES ═══════════ */}
      <section id="modules" className="py-24 gradient-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-sm font-medium mb-4">
              Role Modules
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-dark-900 mb-4">
              Tailored for <span className="gradient-text">Every Role</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {roleCards.map((card, idx) => (
              <motion.div
                key={card.role}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white group hover:-translate-y-2 transition-all duration-300 cursor-pointer`}
                onClick={() => navigate('/login')}
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold font-heading mb-3">{card.role}</h3>
                <ul className="space-y-2 mb-4">
                  {card.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/80">
                      <CheckCircle className="w-3.5 h-3.5 text-accent-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <span className="text-sm font-medium text-accent-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Login as {card.role} <ArrowRight className="w-4 h-4" />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-24 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute top-10 left-[10%] text-accent-400 text-5xl opacity-20"
        >
          ★
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-10 right-[15%] text-accent-400 text-3xl opacity-30"
        >
          ✦
        </motion.div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-bold font-heading text-white mb-6"
          >
            Ready to Transform Your Campus?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-lg mb-10 max-w-xl mx-auto"
          >
            Join hundreds of institutions already using CampusNexus to streamline their operations.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={() => navigate('/register')}
              className="btn-accent text-base px-8 py-4"
            >
              Get Started Free
            </button>
            <button className="btn-secondary text-base px-8 py-4">
              View Demo
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
