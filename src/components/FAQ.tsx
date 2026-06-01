'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'What is the typical pathway from student to PR in Canada?',
    a: 'The most common pathway is: Study Permit → Graduate (PGWP) → Get 1 year Canadian work experience → Apply under Canadian Experience Class (CEC) via Express Entry → Receive ITA → Apply for PR. Provincial Nominee Programs (PNPs) are alternative routes.',
  },
  {
    q: 'How long can I work in Canada after graduation?',
    a: 'PGWP (Post-Graduation Work Permit) is valid based on your program length: programs under 2 years get a PGWP matching the program length, programs 2+ years get a 3-year PGWP.',
  },
  {
    q: 'What is CRS score and what score do I need?',
    a: 'CRS (Comprehensive Ranking System) scores candidates in Express Entry based on age, education, work experience, language ability, and other factors. Cutoff scores vary each draw, typically ranging from 470-540+ for CEC draws.',
  },
  {
    q: 'Do I need a job offer for Express Entry?',
    a: 'No, a job offer is not required for the Canadian Experience Class (CEC). However, a valid job offer (LMIA-based) can add up to 200 CRS points. For FSW, you need at least 1 year of continuous skilled work experience.',
  },
  {
    q: 'What is the difference between FSW and CEC?',
    a: 'CEC (Canadian Experience Class) is for candidates with at least 1 year of skilled work experience IN Canada. FSW (Federal Skilled Worker) is for candidates with foreign work experience. Both use the same Express Entry pool and CRS score system.',
  },
  {
    q: 'Can I include my family in my PR application?',
    a: 'Yes. You can include your spouse or common-law partner and dependent children (usually under 22) in your Express Entry or PNP application. They will also receive permanent residence status.',
  },
  {
    q: 'What is a PNP and how does it work?',
    a: 'Provincial Nominee Programs (PNPs) allow provinces like Ontario (OINP), Alberta (AAIP), and British Columbia (BC PNP) to nominate immigrants who want to settle in that province. Many PNPs have streams for international graduates.',
  },
  {
    q: 'How much does it cost to apply for PR?',
    a: 'As of 2025, Express Entry application fees are approximately $1,365 CAD per adult + $230 CAD per dependent child. Biometrics ($85) and medical exams are extra. PNP fees vary by province (typically $1,500-$2,000 CAD).',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
              <svg
                className={`w-5 h-5 text-gray-600 transition-transform ${
                  openIndex === i ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === i && (
              <div className="px-6 pb-4">
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
