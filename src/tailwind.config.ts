
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
				// Enhanced color palette
				navy: {
					100: '#d6dff0',
					200: '#aec0e1',
					300: '#85a0d2',
					400: '#5d81c3',
					500: '#3461b4',
					600: '#2a4e90',
					700: '#1f3a6c',
					800: '#152748',
					900: '#0a1324'
				},
				darkPurple: {
					100: '#e5d9f2',
					200: '#ccb3e5',
					300: '#b28ed8',
					400: '#9968cb',
					500: '#7f43be',
					600: '#663598',
					700: '#4c2872',
					800: '#331c4c',
					900: '#190e26'
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
				flow: {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				pulse: {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.1)' }
				},
				spin: {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				sheen: {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				float: {
					'0%': { transform: 'translateY(0)', opacity: '0' },
					'50%': { opacity: '1' },
					'100%': { transform: 'translateY(-20px)', opacity: '0' }
				},
				// New keyframes
				cosmicPulse: {
					'0%, 100%': { transform: 'scale(0.95)', opacity: '0.6' },
					'50%': { transform: 'scale(1.05)', opacity: '1' }
				},
				nebulaShift: {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				starTwinkle: {
					'0%, 100%': { opacity: '0.2' },
					'50%': { opacity: '1' }
				},
				orbitPath: {
					'0%': { transform: 'rotate(0deg) translateX(10px) rotate(0deg)' },
					'100%': { transform: 'rotate(360deg) translateX(10px) rotate(-360deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fadeIn 0.5s ease-out forwards',
				'flow': 'flow 2s linear infinite',
				'pulse-slow': 'pulse 3s ease-in-out infinite',
				'spin-slow': 'spin 8s linear infinite',
				'sheen': 'sheen 0.8s ease-in-out',
				'float': 'float 3s ease-in-out infinite',
				// New animations
				'cosmic-pulse': 'cosmicPulse 4s ease-in-out infinite',
				'nebula-shift': 'nebulaShift 15s ease infinite',
				'star-twinkle': 'starTwinkle 2s ease-in-out infinite',
				'orbit-path': 'orbitPath 8s linear infinite'
			},
			boxShadow: {
				'glow': '0 0 15px 2px rgba(127, 67, 190, 0.3)',
				'glow-lg': '0 0 25px 5px rgba(127, 67, 190, 0.4)'
			},
			backdropBlur: {
				'xs': '2px'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
