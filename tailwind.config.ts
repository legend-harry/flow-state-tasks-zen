
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
				todo: {
					purple: '#8B5CF6',
					'deep-purple': '#7C3AED',
					'light-purple': '#EDE9FE',
					'high-priority': '#DC3545',
					'medium-priority': '#FFC107',
					'low-priority': '#28A745',
				},
				uiElement: '#F8F9FA',
				textPrimary: '#343A40',
				accent: {
					coral: '#FF7F50',
					skyBlue: '#00BFFF',
				},
				completedTask: '#ADB5BD',
				dynamic: {
					teal: '#A0D2DB',
					lavender: '#C3AED6',
					peach: '#F7C5A6',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				'slide-in': {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-out': {
					'0%': { transform: 'translateY(0)', opacity: '1' },
					'100%': { transform: 'translateY(10px)', opacity: '0' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'check-mark': {
					'0%': { transform: 'scale(0)' },
					'50%': { transform: 'scale(1.2)' },
					'100%': { transform: 'scale(1)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-15px)' }
				},
				'float-delay': {
					'0%, 100%': { transform: 'translateY(0) rotate(12deg)' },
					'50%': { transform: 'translateY(-10px) rotate(12deg)' }
				},
				'float-alt': {
					'0%, 100%': { transform: 'translateY(0) rotate(-6deg)' },
					'50%': { transform: 'translateY(-20px) rotate(-6deg)' }
				},
				'gradient-shift': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'button-hover': {
					'0%': { transform: 'scale(1)' },
					'100%': { transform: 'scale(1.05)' }
				},
				'button-click': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(0.95)' },
					'100%': { transform: 'scale(1)' }
				},
				'shape-drift-1': {
					'0%': { transform: 'translate(0, 0) rotate(0deg)' },
					'33%': { transform: 'translate(30px, -20px) rotate(10deg)' },
					'66%': { transform: 'translate(-20px, 20px) rotate(5deg)' },
					'100%': { transform: 'translate(0, 0) rotate(0deg)' }
				},
				'shape-drift-2': {
					'0%': { transform: 'translate(0, 0) rotate(0deg)' },
					'33%': { transform: 'translate(-40px, 10px) rotate(-15deg)' },
					'66%': { transform: 'translate(20px, 30px) rotate(-5deg)' },
					'100%': { transform: 'translate(0, 0) rotate(0deg)' }
				},
				'shape-drift-3': {
					'0%': { transform: 'translate(0, 0) rotate(0deg)' },
					'33%': { transform: 'translate(15px, 25px) rotate(5deg)' },
					'66%': { transform: 'translate(-15px, -25px) rotate(10deg)' },
					'100%': { transform: 'translate(0, 0) rotate(0deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				'slide-out': 'slide-out 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'check-mark': 'check-mark 0.3s ease-out',
				'float': 'float 9s ease-in-out infinite',
				'float-delay': 'float-delay 7s ease-in-out infinite',
				'float-alt': 'float-alt 11s ease-in-out infinite',
				'gradient-shift': 'gradient-shift 600s ease infinite',
				'button-hover': 'button-hover 0.2s ease-out',
				'button-click': 'button-click 0.2s ease-out',
				'shape-drift-1': 'shape-drift-1 60s ease-in-out infinite',
				'shape-drift-2': 'shape-drift-2 75s ease-in-out infinite',
				'shape-drift-3': 'shape-drift-3 90s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
