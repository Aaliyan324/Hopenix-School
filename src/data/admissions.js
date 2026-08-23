/**
 * Centralized admission data source for the entire application.
 * All admission-related components (Admissions page, homepage banner,
 * floating widget) consume from this file.
 */

const defaultAdmissions = {
  enabled: true,
  published: true,

  hero: {
    title: 'Admissions',
    subtitle: 'Begin Your Journey With Us',
    description:
      'Give your child a place to learn, grow, discover, and thrive.',
    image: '',
  },

  status: {
    label: 'Admissions Open',
    session: '2026–27',
    description: 'Applications are now open for selected classes.',
  },

  application: {
    enabled: true,
    label: 'Apply Now',
    url: '',
  },

  classes: [
    {
      id: 'cls_playgroup',
      name: 'Playgroup',
      description: 'A nurturing introduction to structured learning for the youngest learners.',
      status: 'open',
      ageRequirement: '2–3 years',
      seatsAvailable: '20',
      applicationUrl: '',
      published: true,
      order: 0,
    },
    {
      id: 'cls_nursery',
      name: 'Nursery',
      description: 'Building foundational social and cognitive skills through play-based learning.',
      status: 'open',
      ageRequirement: '3–4 years',
      seatsAvailable: '20',
      applicationUrl: '',
      published: true,
      order: 1,
    },
    {
      id: 'cls_kindergarten',
      name: 'Kindergarten',
      description: 'Preparing young minds for primary education with literacy and numeracy.',
      status: 'open',
      ageRequirement: '4–5 years',
      seatsAvailable: '15',
      applicationUrl: '',
      published: true,
      order: 2,
    },
    {
      id: 'cls_grade1',
      name: 'Grade 1',
      description: 'Structured academic curriculum with emphasis on core subjects.',
      status: 'open',
      ageRequirement: '5–6 years',
      seatsAvailable: '15',
      applicationUrl: '',
      published: true,
      order: 3,
    },
    {
      id: 'cls_grade2',
      name: 'Grade 2',
      description: 'Continuing academic growth with expanded subject areas.',
      status: 'closed',
      ageRequirement: '6–7 years',
      seatsAvailable: '',
      applicationUrl: '',
      published: true,
      order: 4,
    },
  ],

  process: [
    {
      id: 'proc_1',
      title: 'Submit Application',
      description: 'Complete the online application form with student details and required information.',
      enabled: true,
      order: 0,
    },
    {
      id: 'proc_2',
      title: 'Application Review',
      description: 'Our admissions team reviews the submitted application and supporting documents.',
      enabled: true,
      order: 1,
    },
    {
      id: 'proc_3',
      title: 'Assessment / Interview',
      description: 'Student participates in an age-appropriate assessment and family interview.',
      enabled: true,
      order: 2,
    },
    {
      id: 'proc_4',
      title: 'Admission Confirmation',
      description: 'Receive official admission decision and confirmation letter.',
      enabled: true,
      order: 3,
    },
    {
      id: 'proc_5',
      title: 'Enrollment',
      description: 'Complete fee formalities, submit documents, and welcome to the school family.',
      enabled: true,
      order: 4,
    },
  ],

  documents: [
    { id: 'doc_1', name: 'Birth Certificate / B-Form', enabled: true, order: 0 },
    { id: 'doc_2', name: 'Parent/Guardian CNIC', enabled: true, order: 1 },
    { id: 'doc_3', name: 'Previous School Record', enabled: true, order: 2 },
    { id: 'doc_4', name: 'Passport Size Photographs', enabled: true, order: 3 },
    { id: 'doc_5', name: 'Transfer Certificate (if applicable)', enabled: true, order: 4 },
  ],

  requirements: [
    { id: 'req_1', text: 'Minimum age requirement as per grade level', enabled: true, order: 0 },
    { id: 'req_2', text: 'Previous academic records for transfer students', enabled: true, order: 1 },
    { id: 'req_3', text: 'All required documents must be submitted before assessment', enabled: true, order: 2 },
    { id: 'req_4', text: 'Student must pass the age-appropriate assessment', enabled: true, order: 3 },
    { id: 'req_5', text: 'Parent/guardian interview is mandatory', enabled: true, order: 4 },
  ],

  timeline: [
    { id: 'tl_1', title: 'Applications Open', date: '2026-08-01', description: 'Online applications become available', order: 0 },
    { id: 'tl_2', title: 'Application Deadline', date: '2026-09-30', description: 'Last date to submit applications', order: 1 },
    { id: 'tl_3', title: 'Assessment', date: '2026-10-05', description: 'Student assessment and interview period', order: 2 },
    { id: 'tl_4', title: 'Final Selection', date: '2026-10-15', description: 'Admission decisions communicated', order: 3 },
    { id: 'tl_5', title: 'Classes Begin', date: '2027-04-01', description: 'New academic session starts', order: 4 },
  ],

  fees: {
    enabled: false,
    items: [
      { id: 'fee_1', name: 'Admission Fee', amount: '15,000', description: 'One-time admission fee', order: 0 },
      { id: 'fee_2', name: 'Registration Fee', amount: '5,000', description: 'Annual registration', order: 1 },
      { id: 'fee_3', name: 'Monthly Tuition', amount: '12,000', description: 'Monthly tuition fee', order: 2 },
    ],
  },

  contact: {
    phone: '',
    email: '',
    address: '',
    whatsapp: '',
  },

  updatedAt: new Date().toISOString(),
}

export default defaultAdmissions
