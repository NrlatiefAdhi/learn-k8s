type EducationData = {
  school: string
  degree: string
  period: string
}

export default function Education({ data }: { data: EducationData }) {
  return (
    <section className="border-t border-neutral-900 py-20">
      <div className="space-y-6">
        <h2 className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          Education
        </h2>

        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <div className="space-y-1">
            <p className="font-medium text-neutral-100">{data.school}</p>
            <p className="text-sm text-neutral-400">{data.degree}</p>
          </div>
          <p className="font-mono text-xs text-neutral-500">{data.period}</p>
        </div>
      </div>
    </section>
  )
}
