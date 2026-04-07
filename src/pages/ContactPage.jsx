import { Mail, MapPin, PhoneCall, Send } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'

function ContactPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-900/10 bg-white/75 p-6 shadow-sm backdrop-blur sm:p-8 lg:p-10">
        <SectionHeading
          eyebrow="Contact"
          title="Get in touch with the project team"
          description="A professional contact page helps the website feel complete and gives you a polished presentation flow during project showcase."
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <ContactCard icon={Mail} title="Email" value="finova.project@example.com" />
          <ContactCard icon={PhoneCall} title="Phone" value="+91 98765 43210" />
          <ContactCard icon={MapPin} title="Location" value="India - Final Year Project Lab" />
        </div>

        <form className="rounded-[2rem] border border-slate-900/10 bg-[#132a24] p-8 text-white shadow-[0_30px_80px_rgba(19,42,36,0.22)]">
          <p className="text-sm uppercase tracking-[0.3em] text-[#bdd1c7]">Contact Form</p>
          <h2 className="mt-3 font-display text-3xl">Request a demo or collaboration.</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InputField label="Name" placeholder="Your name" />
            <InputField label="Email" placeholder="yourmail@example.com" type="email" />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <InputField label="Subject" placeholder="Project review" />
            <InputField label="Institution" placeholder="College or company" />
          </div>
          <label className="mt-4 block">
            <span className="text-xs uppercase tracking-[0.2em] text-[#bdd1c7]">Message</span>
            <textarea
              rows="6"
              placeholder="Tell us about your interest in the project..."
              className="mt-2 w-full rounded-[1.5rem] border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-[#d2e1da] focus:border-white/25"
            />
          </label>
          <button
            type="submit"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-[#f7f2e8]"
          >
            <Send className="h-4 w-4" />
            Send Message
          </button>
        </form>
      </section>
    </div>
  )
}

function ContactCard({ icon, title, value }) {
  const IconComponent = icon

  return (
    <article className="rounded-[1.75rem] border border-slate-900/10 bg-white/75 p-6 shadow-sm backdrop-blur">
      <IconComponent className="h-6 w-6 text-slate-900" />
      <p className="mt-4 text-sm uppercase tracking-[0.24em] text-slate-500">{title}</p>
      <h2 className="mt-2 font-display text-2xl text-slate-900">{value}</h2>
    </article>
  )
}

function InputField({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[#bdd1c7]">{label}</span>
      <input
        {...props}
        className="mt-2 w-full rounded-[1.5rem] border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-[#d2e1da] focus:border-white/25"
      />
    </label>
  )
}

export default ContactPage
