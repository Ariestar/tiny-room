const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},

				// Vercel风格功能色
				"accent-blue": "var(--accent-blue)",
				"accent-purple": "var(--accent-purple)",
				"accent-pink": "var(--accent-pink)",
				"accent-green": "var(--accent-green)",
				"accent-orange": "var(--accent-orange)",

				// Vercel风格灰度系统 - 精细渐进的灰度层次
				gray: {
					50: "#fafafa", // 页面背景 - 最浅
					100: "#f5f5f5", // 卡片背景
					150: "#f0f0f0", // 细微区分
					200: "#e5e5e5", // 边框颜色
					300: "#d4d4d4", // 分隔线
					400: "#a3a3a3", // 辅助文本
					500: "#737373", // 次要文本
					600: "#525252", // 主要文本
					700: "#404040", // 深色文本
					800: "#262626", // 深色背景
					900: "#171717", // 最深文本
					950: "#0a0a0a", // 极深背景
				},

				// 黑白色系作为主品牌色 - 现代简约风格
				brand: {
					50: "#ffffff", // 纯白
					100: "#fafafa", // 极浅灰
					200: "#f5f5f5", // 浅灰
					300: "#e5e5e5", // 边框灰
					400: "#a3a3a3", // 中灰
					500: "#525252", // 深灰 - 主要品牌色
					600: "#404040", // 更深灰
					700: "#262626", // 深色
					800: "#171717", // 极深
					900: "#0a0a0a", // 接近黑色
					950: "#000000", // 纯黑
				},

				// 可切换的点缀色系统 - 方便后期更换主题
				accent: {
					// 蓝色系 - 科技感
					blue: {
						50: "#eff6ff",
						100: "#dbeafe",
						200: "#bfdbfe",
						300: "#93c5fd",
						400: "#60a5fa",
						500: "#0070f3", // Vercel蓝
						600: "#0056b3",
						700: "#1d4ed8",
						800: "#1e40af",
						900: "#1e3a8a",
					},
					// 紫色系 - 创意感
					purple: {
						50: "#faf5ff",
						100: "#f3e8ff",
						200: "#e9d5ff",
						300: "#d8b4fe",
						400: "#c084fc",
						500: "#7c3aed",
						600: "#7c3aed",
						700: "#6d28d9",
						800: "#5b21b6",
						900: "#4c1d95",
					},
					// 粉色系 - 活力感
					pink: {
						50: "#fdf2f8",
						100: "#fce7f3",
						200: "#fbcfe8",
						300: "#f9a8d4",
						400: "#f472b6",
						500: "#ec4899",
						600: "#db2777",
						700: "#be185d",
						800: "#9d174d",
						900: "#831843",
					},
					// 绿色系 - 自然感
					green: {
						50: "#ecfdf5",
						100: "#d1fae5",
						200: "#a7f3d0",
						300: "#6ee7b7",
						400: "#34d399",
						500: "#10b981",
						600: "#059669",
						700: "#047857",
						800: "#065f46",
						900: "#064e3b",
					},
					// 橙色系 - 温暖感
					orange: {
						50: "#fffbeb",
						100: "#fef3c7",
						200: "#fde68a",
						300: "#fcd34d",
						400: "#fbbf24",
						500: "#f59e0b",
						600: "#d97706",
						700: "#b45309",
						800: "#92400e",
						900: "#78350f",
					},
					// 红色系 - 警示感
					red: {
						50: "#fef2f2",
						100: "#fee2e2",
						200: "#fecaca",
						300: "#fca5a5",
						400: "#f87171",
						500: "#ef4444",
						600: "#dc2626",
						700: "#b91c1c",
						800: "#991b1b",
						900: "#7f1d1d",
					},
				},

				// 语义化颜色 - 使用中性色作为默认
				success: "#10b981",
				warning: "#f59e0b",
				error: "#ef4444",
				info: "#525252", // 改为灰色

				// 可切换的渐变背景色
				"gradient-start": "var(--gradient-start)",
				"gradient-end": "var(--gradient-end)",
				"gradient-accent-start": "var(--gradient-accent-start)",
				"gradient-accent-end": "var(--gradient-accent-end)",
			},

			// 现代化字体系统
			fontFamily: {
				lxgw: ["var(--font-lxgw-wenkai)", ...fontFamily.sans],
				sans: ["system-ui", "sans-serif"],
				serif: ["Times New Roman", "serif"],
				mono: ["Fira Code", "JetBrains Mono", "monospace"],
			},

			// 现代化间距系统
			spacing: {
				18: "4.5rem", // 72px
				88: "22rem", // 352px
				128: "32rem", // 512px
				144: "36rem", // 576px
			},

			// 现代化阴影系统
			boxShadow: {
				soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
				medium: "0 4px 25px -2px rgba(0, 0, 0, 0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.25)",
				strong: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
				glow: "0 0 20px rgba(82, 82, 82, 0.15)", // 改为灰色光晕
				"glow-lg": "0 0 40px rgba(82, 82, 82, 0.15)", // 改为灰色光晕
			},

			// 统一动画时间系统
			transitionDuration: {
				veryfast: "10ms",
				fast: "150ms", // 微交互、按钮状态
				normal: "300ms", // 标准过渡、悬停效果
				slow: "500ms", // 页面转场、复杂动画
				"very-slow": "800ms", // 大型动画、强调效果
			},

			// 现代化动画系统
			animation: {
				// 基础动画 - 使用统一时间
				"fade-in": "fadeIn 500ms ease-out",
				"fade-out": "fadeOut 300ms ease-in",
				"slide-up": "slideUp 500ms cubic-bezier(0.16, 1, 0.3, 1)",
				"slide-down": "slideDown 500ms cubic-bezier(0.16, 1, 0.3, 1)",
				"slide-left": "slideLeft 500ms cubic-bezier(0.16, 1, 0.3, 1)",
				"slide-right": "slideRight 500ms cubic-bezier(0.16, 1, 0.3, 1)",

				// 高级动画
				"scale-in": "scaleIn 500ms cubic-bezier(0.16, 1, 0.3, 1)",
				"scale-out": "scaleOut 300ms cubic-bezier(0.16, 1, 0.3, 1)",
				"bounce-soft": "bounceSoft 800ms ease-in-out",
				float: "float 3s ease-in-out infinite",
				"gradient-shift": "gradientShift 8s ease-in-out infinite",

				// 微交互动画
				"button-press": "buttonPress 150ms ease-out",
				"card-hover": "cardHover 300ms ease-out",
				"glow-pulse": "glowPulse 2s ease-in-out infinite",
				"accordion-up": "accordion-up 0.2s ease-out",
			},

			keyframes: {
				// 基础动画关键帧
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				fadeOut: {
					"0%": { opacity: "1" },
					"100%": { opacity: "0" },
				},
				slideUp: {
					"0%": { transform: "translateY(30px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
				slideDown: {
					"0%": { transform: "translateY(-30px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
				slideLeft: {
					"0%": { transform: "translateX(30px)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" },
				},
				slideRight: {
					"0%": { transform: "translateX(-30px)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" },
				},

				// 高级动画关键帧
				scaleIn: {
					"0%": { transform: "scale(0.95)", opacity: "0" },
					"100%": { transform: "scale(1)", opacity: "1" },
				},
				scaleOut: {
					"0%": { transform: "scale(1)", opacity: "1" },
					"100%": { transform: "scale(0.95)", opacity: "0" },
				},
				bounceSoft: {
					"0%, 20%, 53%, 80%, 100%": { transform: "translate3d(0, 0, 0)" },
					"40%, 43%": { transform: "translate3d(0, -15px, 0)" },
					"70%": { transform: "translate3d(0, -7px, 0)" },
					"90%": { transform: "translate3d(0, -2px, 0)" },
				},
				float: {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-10px)" },
				},
				gradientShift: {
					"0%, 100%": { backgroundPosition: "0% 50%" },
					"50%": { backgroundPosition: "100% 50%" },
				},

				// 微交互动画关键帧
				buttonPress: {
					"0%": { transform: "scale(1)" },
					"100%": { transform: "scale(0.96)" },
				},
				cardHover: {
					"0%": { transform: "translateY(0)" },
					"100%": { transform: "translateY(-4px)" },
				},
				glowPulse: {
					"0%, 100%": { boxShadow: "0 0 20px rgba(82, 82, 82, 0.1)" },
					"50%": { boxShadow: "0 0 30px rgba(82, 82, 82, 0.2)" },
				},
			},

			// 现代化边框半径
			borderRadius: {
				"4xl": "2rem",
				"5xl": "2.5rem",
			},

			// 现代化背景图案
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
				"gradient-primary":
					"linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)",
				"gradient-accent":
					"linear-gradient(135deg, var(--gradient-accent-start) 0%, var(--gradient-accent-end) 100%)",
				"gradient-subtle": "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
			},

			// 增强的排版系统
			fontSize: {
				"2xs": ["0.6875rem", { lineHeight: "1rem" }], // 11px
				"7xl": ["4.5rem", { lineHeight: "1" }], // 72px
				"8xl": ["6rem", { lineHeight: "1" }], // 96px
				"9xl": ["8rem", { lineHeight: "1" }], // 128px
			},

			// 增强的行高系统
			lineHeight: {
				"extra-loose": "2.5",
				12: "3rem",
				14: "3.5rem",
				16: "4rem",
			},

			// 增强的字符间距
			letterSpacing: {
				"extra-wide": "0.2em",
			},

			// 增强的z-index系统
			zIndex: {
				60: "60",
				70: "70",
				80: "80",
				90: "90",
				100: "100",
			},
		},
	},
	plugins: [require("@tailwindcss/typography"), require("tailwind-scrollbar")],
};
