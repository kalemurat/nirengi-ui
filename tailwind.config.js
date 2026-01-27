/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
        "./projects/nirengi-ui-kit/src/**/*.{html,ts,scss}", // UI Kit content
    ],
    theme: {
        extend: {
            // Ana proje renkleri buraya eklenebilir
            // UI Kit renkleri zaten UI Kit'in kendi tailwind.config.js'inde tanımlı
        },
    },
    plugins: [],
}
