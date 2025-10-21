/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                'videoflix': {
                    'dark': '#1a1a1a',
                    'darker': '#0a0a0a',
                    'gray': '#2a2a2a',
                    'gray-light': '#3a3a3a',
                    'red': '#e50914',
                    'red-dark': '#b20710',
                    'red-light': '#ff1a24',
                }
            },
        },
    },
    plugins: [],
}