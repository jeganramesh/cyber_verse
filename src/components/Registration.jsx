import { motion } from 'framer-motion'

function Registration() {
  return (
    <section className="relative py-24 px-4 md:px-10 lg:px-20 z-10">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Glow background */}
          <div className="absolute inset-0 bg-kali-blue/10 rounded-2xl blur-3xl" />
          
          <div className="relative bg-kali-darker/80 border border-kali-blue/30 rounded-2xl py-16 px-8">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">READY TO</span>
              <span className="text-kali-blue"> HACK?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Join us at CyberVerse 2K26 and prove your skills in the ultimate 
              cybersecurity showdown. Limited spots available!
            </p>
            
            {/* Glowing button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              {/* Button glow layers */}
              <div className="absolute inset-0 bg-kali-blue opacity-50 blur-lg group-hover:blur-xl transition-all duration-300 rounded-full" />
              <div className="absolute inset-0 bg-gradient-to-r from-kali-blue via-kali-neon to-kali-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full animate-pulse" />
              
              <span className="relative block bg-kali-blue hover:bg-kali-neon text-white font-display font-bold text-xl py-4 px-12 rounded-full transition-all duration-300 shadow-neon">
                REGISTER NOW
              </span>
            </motion.button>
            
            {/* Terminal prompt */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 font-mono text-sm text-kali-blue/70"
            >
              {'>'} register --event cyberverse_2k26 --year 2026
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Registration
