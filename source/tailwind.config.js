module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Manrope"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      keyframes: {
        pop: { '0%': { transform: 'scale(.85)', opacity: '.3' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        fadein: { '0%': { opacity: '0', transform: 'translateY(4px)' }, '100%': { opacity: '1', transform: 'none' } },
        slidein: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'none' } },
        rise: { '0%': { opacity: '0', transform: 'translateY(16px) scale(.98)' }, '100%': { opacity: '1', transform: 'none' } },
        viewin: { '0%': { opacity: '0', transform: 'translateY(6px)' }, '100%': { opacity: '1', transform: 'none' } },
        highlight: { '0%': { backgroundColor: 'rgb(209 250 229)' }, '100%': { backgroundColor: 'transparent' } },
      },
      animation: {
        pop: 'pop .35s ease-out',
        fadein: 'fadein .3s ease-out',
        slidein: 'slidein .25s ease-out',
        rise: 'rise .25s ease-out',
        highlight: 'highlight 2.4s ease-out',
        viewin: 'viewin .45s cubic-bezier(.2,.8,.2,1)',
      },
    },
  },
};
