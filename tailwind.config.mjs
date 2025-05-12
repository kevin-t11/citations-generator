/** @type {import('tailwindcss').Config} */
import animate from 'tailwindcss-animate';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Custom citation color palette
        citation: {
          DEFAULT: 'rgb(165, 62, 90)',
          light: 'rgb(188, 112, 133)',
          dark: 'rgb(132, 50, 72)',
          50: 'rgb(245, 232, 235)',
          100: 'rgb(235, 209, 215)',
          200: 'rgb(224, 187, 195)',
          300: 'rgb(214, 164, 174)',
          400: 'rgb(193, 118, 134)',
          500: 'rgb(165, 62, 90)',
          600: 'rgb(148, 56, 81)',
          700: 'rgb(124, 47, 68)',
          800: 'rgb(99, 37, 54)',
          900: 'rgb(74, 28, 41)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      backgroundImage: {
        'citation-gradient': 'linear-gradient(to right, rgb(165, 62, 90), rgb(188, 112, 133))',
        'citation-gradient-alt':
          'linear-gradient(135deg, rgb(165, 62, 90) 0%, rgb(132, 50, 72) 100%)',
      },
    },
  },
  plugins: [animate],
};

export default config;
