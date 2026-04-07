import { Banknote, BellRing, BrainCircuit, LayoutDashboard, PieChart, Workflow } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'

const features = [
  {
    icon: LayoutDashboard,
    title: 'Finance dashboard',
    copy: 'A professional control center that brings together cash flow, savings, transaction activity, and financial health indicators.',
  },
  {
    icon: PieChart,
    title: 'Reports and visualization',
    copy: 'Monthly area and category charts make it easy to explain performance trends and spending behavior during review sessions.',
  },
  {
    icon: BellRing,
    title: 'Budget alert system',
    copy: 'Users can assign category budgets and receive visual warning states when spending approaches or exceeds limits.',
  },
  {
    icon: BrainCircuit,
    title: 'AI-style insights',
    copy: 'Rule-based intelligent suggestions explain overspending risk, saving opportunities, and unusual monthly jumps.',
  },
  {
    icon: Workflow,
    title: 'Automatic categorization',
    copy: 'Transactions are classified from merchant descriptions to reduce manual data entry and improve UX.',
  },
  {
    icon: Banknote,
    title: 'Bank integration roadmap',
    copy: 'The architecture is designed to support future connectors like Plaid, Razorpay, or custom open banking services.',
  },
]

function ContentPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-900/10 bg-white/75 p-6 shadow-sm backdrop-blur sm:p-8 lg:p-10">
        <SectionHeading
          eyebrow="Content"
          title="Everything the project delivers"
          description="This page presents the functional scope of the website in a clean, review-friendly way so the project reads like a genuine software product."
        />
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-slate-900/10 bg-[#132a24] p-8 text-white shadow-[0_30px_80px_rgba(19,42,36,0.22)]">
          <p className="text-sm uppercase tracking-[0.3em] text-[#bdd1c7]">Architecture</p>
          <h2 className="mt-4 font-display text-4xl">Built like a product, not a mockup.</h2>
          <p className="mt-4 text-sm leading-8 text-[#d2e1da]">
            The project uses React for composable UI, Tailwind CSS for consistent styling, GSAP for
            presentation-quality motion, Recharts for analytics, and LocalStorage for demo
            persistence. This makes it strong enough for viva presentation and portfolio showcase.
          </p>
        </div>

        <div className="grid gap-4">
          <Milestone title="Frontend" detail="Responsive routed website with page-level storytelling and a live dashboard." />
          <Milestone title="Analytics Layer" detail="Monthly summary generation, budget tracking, trend detection, and insight generation." />
          <Milestone title="Scalability" detail="Clear upgrade path to backend APIs, authentication, data export, and real bank synchronization." />
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, copy }) {
  const IconComponent = icon

  return (
    <article className="rounded-[1.75rem] border border-slate-900/10 bg-white/75 p-6 shadow-sm backdrop-blur">
      <div className="inline-flex rounded-2xl bg-[#132a24] p-3 text-white">
        <IconComponent className="h-5 w-5" />
      </div>
      <h2 className="mt-5 font-display text-2xl text-slate-900">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">{copy}</p>
    </article>
  )
}

function Milestone({ title, detail }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-900/10 bg-[#fcfaf5] p-6">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{title}</p>
      <p className="mt-3 text-base leading-7 text-slate-700">{detail}</p>
    </div>
  )
}

export default ContentPage
