  import scrollbarHide from 'tailwind-scrollbar-hide'
  
  export default {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
      extend: {
        boxShadow: {
          card: '0 24px 70px rgba(15, 23, 42, 0.08)',
        },
        backgroundImage: {
          'hero-gradient': 'linear-gradient(135deg, #4338ca 0%, #2563eb 100%)',
        },
        fontFamily: {
          sans: [
            "Poppins",
            "Inter",
            "ui-sans-serif",
            "system-ui",
            "sans-serif",
          ],
        },
        // colors: {
        //   brand: "#FF9800",
        //   ink: "#12343C",
        //   sand: "#FFF9ED",
        //   line: "#EEE6D9",
        //   muted: "#69777B",
        // },
      },
  
    },
    
    plugins: [
      scrollbarHide,
    ],
  }
