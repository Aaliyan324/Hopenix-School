/**
 * Centralized news data source for the entire application.
 * All news-related components consume from this file.
 */

const newsData = [
  {
    id: 'new-campus-building',
    title: 'New Campus Building Construction Begins',
    date: '2026-08-15',
    category: 'Announcement',
    featured: true,
    image: '',
    excerpt: 'We are excited to announce the construction of our new state-of-the-art science and technology building.',
    content: `We are thrilled to announce that construction has begun on our new state-of-the-art science and technology building. This 50,000 square foot facility will feature advanced laboratories, research spaces, and collaborative learning areas designed to inspire the next generation of scientists and engineers.

The building will include:
- 12 advanced science laboratories
- 6 technology and robotics workshops
- 4 research collaboration spaces
- A 200-seat auditorium for presentations
- Green spaces and outdoor learning areas

Construction is expected to be completed by December 2027. We look forward to providing our students with world-class facilities that support their academic journey.`,
    author: 'Administration',
    published: true,
  },
  {
    id: 'academic-excellence-awards',
    title: 'Students Win Regional Academic Excellence Awards',
    date: '2026-08-10',
    category: 'Achievement',
    featured: false,
    image: '',
    excerpt: 'Congratulations to our students who received regional academic excellence awards for outstanding performance.',
    content: `We are proud to celebrate the achievements of our students who received regional academic excellence awards for their outstanding performance in mathematics, science, and literature.

Award recipients include:
- Sarah Ahmed - Gold Medal in Mathematics
- Omar Khan - Silver Medal in Physics
- Fatima Ali - Bronze Medal in English Literature
- Hassan Raza - Excellence Award in Computer Science

These achievements reflect our commitment to academic excellence and the dedication of our students and teachers. We congratulate all award winners and encourage them to continue pursuing excellence in their studies.`,
    author: 'Academic Department',
    published: true,
  },
  {
    id: 'parent-teacher-conference',
    title: 'Parent-Teacher Conference Scheduled for September',
    date: '2026-08-05',
    category: 'Event',
    featured: false,
    image: '',
    excerpt: 'Join us for our annual parent-teacher conference to discuss student progress and academic goals.',
    content: `We invite all parents to attend our annual parent-teacher conference scheduled for September 20-22, 2026. This is an excellent opportunity to meet with teachers, discuss your child's progress, and set academic goals for the year.

Conference Schedule:
- September 20: Grades 1-5 (9:00 AM - 4:00 PM)
- September 21: Grades 6-8 (9:00 AM - 4:00 PM)
- September 22: Grades 9-12 (9:00 AM - 4:00 PM)

Parents can book 20-minute time slots through our online booking system. We look forward to partnering with you to support your child's educational journey.`,
    author: 'Administration',
    published: true,
  },
  {
    id: 'sports-day-celebration',
    title: 'Annual Sports Day Celebration a Great Success',
    date: '2026-07-28',
    category: 'Event',
    featured: false,
    image: '',
    excerpt: 'Our annual sports day brought together students, parents, and teachers for a day of athletic competition and fun.',
    content: `Our annual sports day was a tremendous success, bringing together students, parents, and teachers for a day of athletic competition, teamwork, and school spirit.

Highlights included:
- Track and field events
- Team sports competitions
- Individual skill challenges
- Awards ceremony for top athletes
- Family relay races

We congratulate all participants and thank our physical education department for organizing this wonderful event. Special thanks to the parents who volunteered and supported the event.`,
    author: 'Sports Department',
    published: true,
  },
  {
    id: 'summer-reading-program',
    title: 'Summer Reading Program Results Announced',
    date: '2026-07-20',
    category: 'Academic',
    featured: false,
    image: '',
    excerpt: 'Over 200 students participated in our summer reading program, reading more than 1,500 books collectively.',
    content: `We are delighted to announce the results of our summer reading program, which saw over 200 students participate and read more than 1,500 books collectively.

Top readers include:
- Grade 1-3: Ayesha Malik (45 books)
- Grade 4-6: Usman Ahmed (38 books)
- Grade 7-9: Zainab Khan (42 books)
- Grade 10-12: Ali Hassan (35 books)

The program encouraged students to explore different genres, develop critical thinking skills, and maintain their reading habits during the summer break. We congratulate all participants and look forward to next year's program.`,
    author: 'Library Department',
    published: true,
  },
]

export default newsData
