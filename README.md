# 🌐 Cyberverse

> An immersive symposium/event website featuring stunning animations and modern web design

## 📋 Overview
Cyberverse is a fully responsive event website designed to showcase modern front-end development capabilities. Built with cutting-edge web technologies, it delivers an engaging user experience through dynamic animations and interactive elements. This project is perfect for developers looking to learn advanced front-end techniques or for anyone wanting to create a visually stunning event website.

## 🛠️ Technologies Used
- **React** (v18.2.0) - A JavaScript library for building user interfaces
- **React DOM** (v18.2.0) - React renderer for the DOM
- **Vite** (v5.0.0) - A next-generation frontend build tool
- **Tailwind CSS** (v3.4.0) - A utility-first CSS framework for rapid UI development
- **Three.js** (v0.160.0) - A JavaScript 3D library
- **@react-three/fiber** (v8.15.0) - A React renderer for Three.js
- **@react-three/drei** (v9.92.0) - Useful helpers for react-three-fiber
- **@react-three/postprocessing** (v2.16.0) - Post-processing effects for react-three-fiber
- **Framer Motion** (v11.0.0) - A library for animations
- **GSAP** (v3.14.2) - A JavaScript animation library
- **PostCSS** (v8.4.32) - A tool for transforming CSS with JavaScript
- **Autoprefixer** (v10.4.16) - A PostCSS plugin to parse CSS and add vendor prefixes

## 🔧 Installation
To get a local copy up and running, follow these simple steps.

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/jeganramesh/cyberverse.git
   ```
2. **Navigate to the project directory**
   ```bash
   cd cyberverse
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn
   ```
4. **Start the development server**
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```
5. Open your browser and visit `http://localhost:5173` (or the URL shown in the terminal).

## 📁 Project Structure
The project is organized as follows:

```
cyberverse/
├── public/                 # Static files
│   └── favicon.ico        # Website favicon
├── src/                   # Source code
│   ├── assets/           # Static assets (images, fonts, etc.)
│   │   └── kalilinux-logo.svg
│   ├── components/       # React components
│   │   ├── layout/       # Layout components (Sidebar, MobileNav)
│   │   └── ...           # Other components (Hero, GalaxyScene, etc.)
│   ├── hooks/            # Custom React hooks
│   │   └── useVirtualScroll.js
│   ├── pages/            # Page components
│   │   └── HomePage.jsx
│   ├── router/           # Routing configuration
│   │   └── index.js
│   ├── App.jsx           # Main App component
│   ├── index.css         # Global styles
│   └── main.jsx          # Entry point
├── index.html            # HTML template
├── package.json          # Project dependencies
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── postcss.config.js     # PostCSS configuration
```

## ✨ Key Features
- **Stunning Animations**: Experience smooth CSS animations and transitions that bring the website to life.
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices.
- **Interactive UI**: Engaging user interface with interactive elements like hover effects, modals, and more.
- **3D Elements**: Includes 3D graphics using Three.js or similar libraries for an immersive experience.
- **Modern Design**: Sleek and modern interface with a dark theme and neon accents.
- **Performance Optimized**: Built with performance in mind, using lazy loading and optimized assets.

## 🏗️ Building for Production
To build the project for production, run:

```bash
npm run build
```
or
```bash
yarn build
```

This will create a `dist` folder with the production build. You can then deploy this folder to any static hosting service.

## 💡 What I Learned
- Advanced CSS animations and keyframes
- Responsive design principles and media queries
- Interactive JavaScript and DOM manipulation
- Performance optimization techniques
- 3D graphics and WebGL basics
- Building with React and Vite

## 🤝 Contributing
Feel free to fork this project and submit pull requests! If you find any issues or have suggestions, please open an issue.

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📫 Contact
- LinkedIn: [JEGAN .R](https://www.linkedin.com/in/jegan-r-82b3b0329?utm_source=share_via&utm_content=profile&utm_medium=member_android)
- Email: [jeganjj094@gmail.com](mailto:jeganjj094@gmail.com)

---