import type { ScrapeSource } from '@/types'

export const SCRAPE_SOURCES: ScrapeSource[] = [
  // === STUDY PERMIT ===
  {
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html',
    category: 'study-permit',
    label: 'Get a Study Permit',
  },
  {
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/eligibility.html',
    category: 'study-permit',
    label: 'Study Permit Eligibility',
  },
  {
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/extend-study-permit.html',
    category: 'study-permit',
    label: 'Extend Study Permit',
  },
  {
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/while-you-study/study-permit-conditions.html',
    category: 'study-permit',
    label: 'Study Permit Conditions',
  },

  // === PGWP (core pages) ===
  {
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/about.html',
    category: 'pgwp',
    label: 'About PGWP',
  },
  {
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility.html',
    category: 'pgwp',
    label: 'PGWP Eligibility',
  },
  {
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/apply.html',
    category: 'pgwp',
    label: 'How to Apply for PGWP',
  },

  // === EXPRESS ENTRY (core pages) ===
  {
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html',
    category: 'express-entry',
    label: 'Express Entry Overview',
  },
  {
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/who-can-apply.html',
    category: 'express-entry',
    label: 'Express Entry Who Can Apply',
  },
  {
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/who-can-apply/canadian-experience-class.html',
    category: 'express-entry',
    label: 'Canadian Experience Class',
  },
  {
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/who-can-apply/federal-skilled-workers.html',
    category: 'express-entry',
    label: 'Federal Skilled Worker Program',
  },
  {
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/create-profile.html',
    category: 'express-entry',
    label: 'Create Express Entry Profile',
  },
  {
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/apply-permanent-residence.html',
    category: 'express-entry',
    label: 'Apply for PR via Express Entry',
  },

  // === PNP ===
  {
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html',
    category: 'pnp',
    label: 'PNP Overview',
  },
]
