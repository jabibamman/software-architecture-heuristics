/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './index.html',
      './src/**/*.{vue,js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: '#1E40AF',   
          secondary: '#10B981', 
          accent: '#F59E0B',    
          danger: '#EF4444',    
          background: '#F3F4F6',
        },
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui'],
          mono: ['Source Code Pro', 'ui-monospace', 'monospace'],
        },
        borderRadius: {
          xl: '1rem',
        },
        boxShadow: {
          card: '0 4px 6px rgba(0,0,0,0.1)',
        },
      },
    },
    plugins: [],
  }
  