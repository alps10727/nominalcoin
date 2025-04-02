
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
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
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				gray: {
					850: '#1a1d23',
					950: '#0f1015'
				},
				// Darker colors for the darkPurple and navy palette
				darkPurple: {
					50: '#f3f1ff',
					100: '#ebe5ff',
					200: '#d9ceff',
					300: '#bea4ff',
					400: '#a176fd',
					500: '#844ff9',
					600: '#742df0',
					700: '#6322d1',
					800: '#521da9',
					900: '#3a1580',
					950: '#1e0855',
				},
				navy: {
					50: '#eef2ff',
					100: '#e0e7ff',
					200: '#c9d5ff',
					300: '#a8b7fe',
					400: '#8492fb',
					500: '#6166f5',
					600: '#4c42ea',
					700: '#3f34ce',
					800: '#342da8',
					900: '#252168',
					950: '#14123d',
				},
				indigo: {
					50: '#eef2ff',
					100: '#e0e7ff', 
					200: '#c7d2fe',
					300: '#a5b4fc',
					400: '#818cf8',
					500: '#6366f1',
					600: '#4f46e5',
					700: '#4338ca',
					800: '#3730a3',
					900: '#312e81',
					950: '#1e1b4b',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				glow: "0 0 15px rgba(74, 58, 240, 0.4), 0 0 30px rgba(59, 46, 139, 0.1)",
				'deep-glow': "0 0 20px rgba(54, 38, 180, 0.5), 0 0 40px rgba(39, 26, 109, 0.2)",
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				pulse: {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' }
				},
				'cosmic-pulse': {
					'0%': { transform: 'scale(0.95)', opacity: '0.6' },
					'50%': { transform: 'scale(1.05)', opacity: '1' },
					'100%': { transform: 'scale(0.95)', opacity: '0.6' }
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'reverse-spin': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(-360deg)' }
				},
				'float-1': {
					'0%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
					'10%': { opacity: '1' },
					'90%': { opacity: '0.5' },
					'100%': { transform: 'translateY(-100px) translateX(20px)', opacity: '0' }
				},
				'float-2': {
					'0%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
					'10%': { opacity: '1' },
					'90%': { opacity: '0.5' },
					'100%': { transform: 'translateY(-80px) translateX(-15px)', opacity: '0' }
				},
				'float-3': {
					'0%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
					'10%': { opacity: '1' },
					'90%': { opacity: '0.5' },
					'100%': { transform: 'translateY(-120px) translateX(10px)', opacity: '0' }
				},
				'sheen': {
					'100%': { transform: 'translateX(200%)' }
				},
				'gradient-x': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'twinkle': {
					'0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
					'50%': { opacity: '1', transform: 'scale(1.2)' }
				},
				'circular-rotate': {
					from: { transform: 'rotate(0deg) translateX(60px) rotate(0deg)' },
					to: { transform: 'rotate(360deg) translateX(60px) rotate(-360deg)' }
				},
				'reverse-circular-rotate': {
					from: { transform: 'rotate(0deg) translateX(40px) rotate(0deg)' },
					to: { transform: 'rotate(-360deg) translateX(40px) rotate(360deg)' }
				},
				'data-stream': {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'20%': { opacity: '0.8' },
					'80%': { opacity: '0.8' },
					'100%': { transform: 'translateX(200%)', opacity: '0' }
				},
				'particle-trace': {
					'0%': { opacity: '0', transform: 'scale(0.5)' },
					'50%': { opacity: '1', transform: 'scale(1)' },
					'100%': { opacity: '0', transform: 'scale(0.5) translate(var(--tx, 10px), -20px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fadeIn 0.5s ease-out forwards',
				'pulse-slow': 'pulse 3s ease-in-out infinite',
				'cosmic-pulse': 'cosmic-pulse 4s ease-in-out infinite',
				'spin-slow': 'spin-slow 15s linear infinite',
				'reverse-spin': 'reverse-spin 12s linear infinite',
				'float-1': 'float-1 4s ease-out infinite',
				'float-2': 'float-2 5s ease-out infinite',
				'float-3': 'float-3 6s ease-out infinite',
				'sheen': 'sheen 8s ease-in-out infinite',
				'gradient-x': 'gradient-x 3s ease infinite',
				'twinkle': 'twinkle 4s ease-in-out infinite',
				'circular-rotate': 'circular-rotate 10s linear infinite',
				'reverse-circular-rotate': 'reverse-circular-rotate 8s linear infinite',
				'data-stream': 'data-stream 4s linear infinite',
				'particle-trace': 'particle-trace 2s linear forwards'
			},
			fontFamily: {
				sans: ["var(--font-sans)", ...fontFamily.sans],
			},
			perspective: {
				'800': '800px',
				'1000': '1000px',
				'1200': '1200px',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
