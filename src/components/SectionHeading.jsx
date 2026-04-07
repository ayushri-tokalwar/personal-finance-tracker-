function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="text-sm uppercase tracking-[0.32em] text-slate-500">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl text-slate-900 sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-slate-600">{description}</p> : null}
    </div>
  )
}

export default SectionHeading
