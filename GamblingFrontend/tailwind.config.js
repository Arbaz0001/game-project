module.exports = {
  theme: {
    extend: {
      backgroundImage: {
        fire: "url('./fire.png')",
      },
      animation: {
        'bg-scroll': 'bgScroll 5s linear infinite',
      },
      keyframes: {
        bgScroll: {
          '0%': { backgroundPosition: 'center bottom' },
          '100%': { backgroundPosition: 'center top' },
        },
      },
    },
  },
}
