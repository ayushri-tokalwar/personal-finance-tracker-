import { ArrowRight, BrainCircuit, ShieldCheck, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import FinanceDashboard from '../components/FinanceDashboard'
import SectionHeading from '../components/SectionHeading'

function HomePage() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-slate-900/10 bg-[#132a24] px-6 py-10 text-[#f8f3ea] shadow-[0_30px_80px_rgba(19,42,36,0.22)] sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.34em] text-[#c9dbd1]">Home</p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              A professional finance website with an intelligent product demo.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#d7e5de]">
              Finova AI combines product branding, feature storytelling, and a live expense tracker
              into one polished website for final-year presentation, evaluation, and portfolio use.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/content" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-[#f7f2e8]">
                Explore Content
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Contact Team
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <FeatureHighlight icon={BrainCircuit} title="AI Suggestions" description="Surface spend patterns and savings actions from tracked transactions." />
            <FeatureHighlight icon={TrendingUp} title="Executive Reporting" description="Show monthly charts, budget status, and performance metrics in one place." />
            <FeatureHighlight icon={ShieldCheck} title="Future API Ready" description="Prepared for banking integrations and backend expansion in later phases." />
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-900/10 bg-white/70 p-6 shadow-sm backdrop-blur sm:p-8">
        <SectionHeading
          eyebrow="Live Experience"
          title="Working dashboard embedded inside the website"
          description="The homepage acts as both a landing page and a product preview so your faculty can immediately see the system in action."
        />
      </section>

      <FinanceDashboard />
    </div>
  )
}

function FeatureHighlight({ icon, title, description }) {
  const IconComponent = icon

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
      <IconComponent className="h-6 w-6 text-amber-300" />
      <h2 className="mt-4 font-display text-2xl text-white">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-[#d7e5de]">{description}</p>
    </div>
  )
}

export default HomePage
