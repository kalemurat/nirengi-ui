const uiKitConfig = require('./projects/nirengi-ui-kit/tailwind.config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
        "./projects/nirengi-ui-kit/src/**/*.{html,ts,scss}", // UI Kit content
    ],
    theme: {
        extend: {
            // UI Kit'in custom theme değerlerini extend et
            ...uiKitConfig.theme.extend,

            // Ana proje özel renkleri veya override'lar buraya eklenebilir
            // UI Kit config'i override etmemek için dikkatli olun
        },
    },
    plugins: [],
}
