import Link from 'next/link'
import { FAQ } from '@/components/FAQ'

const pathways = [
  {
    title: 'Study Permit',
    description: 'Get authorized to study at a Canadian designated learning institution (DLI).',
    icon: '🎓',
  },
  {
    title: 'PGWP',
    description: 'Work in Canada for up to 3 years after graduation with a Post-Graduation Work Permit.',
    icon: '💼',
  },
  {
    title: 'Express Entry',
    description: 'Permanent residence through CEC, FSW, or FST programs based on CRS score.',
    icon: '🇨🇦',
  },
  {
    title: 'PNP',
    description: 'Provincial Nominee Programs like OINP, BC PNP, and AAIP for targeted pathways.',
    icon: '🗺️',
  },
]

export default function LandingPage() {
  return (
    <>
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">CanadaPath AI</h1>
          <Link
            href="/chat"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Start Chatting
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Your Canadian Immigration<br />
            <span className="text-blue-600">Path to PR</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            An AI-powered assistant that helps international students navigate the journey
            from study permit to permanent residence. Get accurate, source-backed information
            about Express Entry, PNP programs, and every step in between.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-lg font-medium shadow-lg shadow-blue-200"
          >
            Ask CanadaPath AI
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="text-sm text-gray-500 mt-4">Free • No sign-up required</p>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-10">Student → PR Pathway</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {pathways.map((p, i) => (
              <div key={i} className="relative">
                <div className="border border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 hover:shadow-md transition-all">
                  <span className="text-4xl mb-3 block">{p.icon}</span>
                  <h4 className="font-semibold text-gray-900 mb-2">{p.title}</h4>
                  <p className="text-sm text-gray-600">{p.description}</p>
                </div>
                {i < pathways.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <FAQ />

        <section className="bg-gray-50 py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to start your journey?</h3>
            <p className="text-gray-600 mb-8">
              Ask CanadaPath AI about your specific situation. Get personalized information
              about which pathway might work for you.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Start Chatting
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p className="mb-2">CanadaPath AI is an informational assistant only. Not a substitute for professional legal advice from a licensed RCIC or immigration lawyer.</p>
          <p>Always verify information with official IRCC sources.</p>
        </div>
      </footer>
    </>
  )
}
