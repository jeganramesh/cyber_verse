import { motion } from 'framer-motion'

function Events() {
  const events = [
    {
      title: 'Paper Presentation',
      description: 'Present your research on cutting-edge cybersecurity topics.',
      color: '#367BF0',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Capture The Flag',
      description: 'Test your hacking skills in our intense CTF competition.',
      color: '#FF3366',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Coding Challenge',
      description: 'Solve complex algorithmic problems under time pressure.',
      color: '#00FF88',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Debugging',
      description: 'Find and fix bugs in provided code snippets quickly.',
      color: '#FFD700',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Gaming',
      description: 'Compete in esports tournaments and prove your gaming prowess.',
      color: '#FF6B35',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      )
    },
    {
      title: 'Surprise Event',
      description: 'Something unexpected awaits. Be ready for the twist!',
      color: '#00D4FF',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
            <span className="text-white">EVENT</span>
            <span className="text-kali-blue">S</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose your challenge from our diverse range of technical and non-technical events.
          </p>
        </motion.div>

        {/* Events grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              {/* Cyber border effect */}
              <div 
                className="absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(45deg, ${event.color}, transparent, ${event.color})`,
                  filter: 'blur(8px)',
                }}
              />
              
              <div className="relative bg-kali-darker/80 backdrop-blur-sm border border-gray-800 group-hover:border-gray-600 rounded-lg p-6 h-full transition-colors duration-300">
                {/* Icon */}
                <div 
                  className="mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ color: event.color }}
                >
                  {event.icon}
                </div>
                
                {/* Content */}
                <h3 className="font-display text-xl font-semibold text-white mb-2 group-hover:text-kali-blue transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {event.description}
                </p>
                
                {/* Hover glow line */}
                <div 
                  className="absolute bottom-0 left-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: event.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Events
