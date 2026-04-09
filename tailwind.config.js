/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
        colors: {
            brand: {
                primary: '#15803d',
                secondary: '#166534',
                accent: '#f59e0b',
                surface: '#F5F5F5',
                card: '#FFFFFF',
                muted: '#9CA3AF',
                success: '#22c55e',
                error: '#ef4444',
                info: '#3b82f6',
            }
        },
        borderRadius: {
            'panel': '48px',
            'button': '24px',
            'card': '40px',
            'inner': '24px',
        },
        boxShadow: {
            'premium': '0 20px 50px rgba(0, 0, 0, 0.05)',
            'float': '0 10px 30px rgba(21, 128, 61, 0.15)',
            'glow': '0 0 20px rgba(21, 128, 61, 0.2)',
        }
    }
  },
  plugins: [],
}
