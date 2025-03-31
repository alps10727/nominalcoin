
import type { Config } from "tailwindcss";

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
				// Custom colors with adjusted palette for navy and dark purple
				navy: {
					100: '#d0d5e9',
					200: '#a1acd4',
					300: '#7282be',
					400: '#4359a9',
					500: '#142f93',
					600: '#102676',
					700: '#0c1c58',
					800: '#08133b',
					900: '#04091d'
				},
				darkPurple: {
					100: '#dcd0e9',
					200: '#b9a1d4',
					300: '#9772be',
					400: '#7443a9',
					500: '#511493',
					600: '#411076',
					700: '#310c58',
					800: '#21083b',
					900: '#10041d'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				'sheen': 'sheen 8s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
