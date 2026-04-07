import { BadgeCheck, BriefcaseBusiness, GraduationCap, Users } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'

function AboutPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-900/10 bg-white/75 p-6 shadow-sm backdrop-blur sm:p-8 lg:p-10">
        <SectionHeading
          eyebrow="About"
          title="Why this project stands out"
          description="Finova AI is designed as a final-year project with industry-style product design, clean frontend engineering, and room for real-world expansion."
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-900/10 bg-[#132a24] p-8 text-white shadow-[0_30px_80px_rgba(19,42,36,0.22)]">
          <p className="text-sm uppercase tracking-[0.3em] text-[#bdd1c7]">Project Vision</p>
          <h2 className="mt-4 font-display text-4xl">A smart finance companion for modern users.</h2>
          <p className="mt-4 text-sm leading-8 text-[#d2e1da]">
            Instead of building a simple CRUD expense form, this project focuses on intelligence,
            design quality, and clarity of presentation. It demonstrates how a personal finance
            platform can support users with meaningful insights rather than just raw data.
          </p>
        </div>

        <div className="grid gap-4">
          <ValueCard icon={GraduationCap} title="Academic depth" copy="Covers UI engineering, business logic, data visualization, and future integration scope." />
          <ValueCard icon={BriefcaseBusiness} title="Industry style" copy="Professional navigation, polished layout, reusable components, and portfolio-ready design." />
          <ValueCard icon={Users} title="User-centric thinking" copy="Built around helpful alerts, better clarity, and easier financial decision making." />
          <ValueCard icon={BadgeCheck} title="Submission ready" copy="Appropriate for project demo, report explanation, and viva walkthrough." />
        </div>
      </section>
    </div>
  )
}

function ValueCard({ icon, title, copy }) {
  const IconComponent = icon

  return (
    <article className="rounded-[1.75rem] border border-slate-900/10 bg-white/75 p-6 shadow-sm backdrop-blur">
      <IconComponent className="h-6 w-6 text-slate-900" />
      <h2 className="mt-4 font-display text-2xl text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">{copy}</p>
    </article>
  )
}

export default AboutPage
