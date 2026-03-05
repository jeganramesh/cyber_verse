import { motion } from 'framer-motion'

function About() {
  const aboutCards = [
    {
      title: 'Technical Events',
      description: 'Challenge your coding skills with Capture The Flag, Paper Presentations, and Debugging competitions.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      title: 'Non-Technical Events',
      description: 'Fun gaming tournaments and surprise events that test your strategic thinking and creativity.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      )
    },
    {
      title: 'Cybersecurity Focus',
      description: 'Dive deep into ethical hacking, network security, and the latest in cyber defense technologies.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ]

  return (
    <section className="relative py-24 px-4 md:px-10 lg:px-20 z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            <span className="text-kali-blue">ABOUT</span> 
            <span className="text-white"> THE EVENT</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            CyberVerse 2K26 is a premier cybersecurity symposium bringing together 
            students, experts, and enthusiasts to explore the frontier of digital security.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {aboutCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="cyber-border p-8 rounded-lg group"
            >
              <div className="text-kali-blue mb-4 group-hover:animate-pulse">
                {card.icon}
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-3">
                {card.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
