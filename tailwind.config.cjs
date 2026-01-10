/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				white: '#f8f9fa'
			},
			fontFamily: {
				sans: ['Pretendard', 'Manrope', ...defaultTheme.fontFamily.sans],
				body: ['Pretendard', 'Manrope', ...defaultTheme.fontFamily.sans]
			},
			gridTemplateColumns: {
				list: 'repeat(auto-fill, minmax(400px, max-content))'
			}
		}
	},
	plugins: [require('@tailwindcss/typography')]
}
