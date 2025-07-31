// Tailwind Configuration
tailwind.config = {
    theme: {
        extend: {
            colors: {
                'starfruit': '#F6E96D',
                'charcoal': '#2E2E2E',
                'off-white': '#FAFAFA',
                'rich-black': '#1B1B1B',
                'mint': '#A8D5BA'
            },
            fontFamily: {
                'heading': ['Poppins', 'sans-serif'],
                'body': ['Inter', 'sans-serif']
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.charcoal'),
                        a: {
                            color: theme('colors.blue.700'),
                            '&:hover': {
                                color: theme('colors.blue.800'),
                            },
                        },
                        h1: {
                            color: theme('colors.charcoal'),
                            fontFamily: theme('fontFamily.heading'),
                        },
                        h2: {
                            color: theme('colors.charcoal'),
                            fontFamily: theme('fontFamily.heading'),
                        },
                        h3: {
                            color: theme('colors.charcoal'),
                            fontFamily: theme('fontFamily.heading'),
                        },
                    },
                },
            }),
        }
    },
    plugins: [
        // require('@tailwindcss/typography'), // This will cause an error in browser-only setup
    ],
};
