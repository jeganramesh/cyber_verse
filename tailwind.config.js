/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kali: {
          blue: '#367BF0',
          dark: '#0D0D0D',
          darker: '#050505',
          neon: '#00D4FF',
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
        display: ['Orbitron', 'Rajdhani', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'flicker': 'flicker 0.15s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            filter: 'drop-shadow(0 0 20px #367BF0) drop-shadow(0 0 40px #367BF0) drop-shadow(0 0 60px #367BF0)',
            opacity: '1'
          },
          '50%': { 
            filter: 'drop-shadow(0 0 30px #367BF0) drop-shadow(0 0 50px #367BF0) drop-shadow(0 0 80px #367BF0)',
            opacity: '0.9'
          },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      boxShadow: {
        'neon': '0 0 10px #367BF0, 0 0 20px #367BF0, 0 0 30px #367BF0',
        'neon-lg': '0 0 20px #367BF0, 0 0 40px #367BF0, 0 0 60px #367BF0',
      }
    },
  },
  plugins: [],
}
