/**
 * Centralized event data source for the entire application.
 * All event-related components (Events page, homepage banner,
 * floating widget, promotional sections) consume from this file.
 */

const upcomingEvents = [
  {
    id: 'stem-fair',
    date: { month: 'SEP', day: '15', year: '2026' },
    dateString: '2026-09-15T09:00:00',
    title: 'Annual STEM & Innovation Fair',
    time: '9:00 AM - 4:00 PM',
    location: 'Main Exhibition Hall',
    description:
      'Showcasing cutting-edge student projects in robotics, software engineering, and scientific research.',
    category: 'Featured',
    shortDescription:
      'A celebration of student innovation in robotics, coding, and scientific discovery.',
  },
  {
    id: 'art-exhibition',
    date: { month: 'SEP', day: '28', year: '2026' },
    dateString: '2026-09-28T13:00:00',
    title: 'Digital Media & Art Showcase',
    time: '1:00 PM - 7:00 PM',
    location: 'Creative Arts Center',
    description:
      'An immersive gallery experience featuring digital illustrations, interactive 3D models, and animations.',
    category: 'Exhibition',
    shortDescription:
      'Explore student-created digital art, 3D animations, and creative media projects.',
  },
  {
    id: 'leadership-seminar',
    date: { month: 'OCT', day: '10', year: '2026' },
    dateString: '2026-10-10T10:30:00',
    title: 'Global Leadership & Ethics Seminar',
    time: '10:30 AM - 12:30 PM',
    location: 'Auditorium A',
    description:
      'Guest speaker panel featuring industry pioneers and entrepreneurs sharing global business insights.',
    category: 'Seminar',
    shortDescription:
      'Industry leaders share insights on ethics, leadership, and global entrepreneurship.',
  },
]

export default upcomingEvents
