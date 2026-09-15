/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}", // src가 없으므로 ./app 으로 시작해야 함
        "./components/**/*.{js,ts,jsx,tsx,mdx}", // 최상위에 있는 components 폴더
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                transparent: 'transparent',
                current: 'currentColor',
                Byellow: '#FFB018',
                Bgreen: '#334B35',
                Bgrey: '#E5DCCB',
                Bbrown: '#B76939',
                Borange: '#FB624B',
                Bblack: '#020003',
                Bbeige: '#F6EEE1',
                Bdark: '#24272C',
                Benamel: '#f4e2d0',
                Blightbeige: '#faf8f4',
                bred: '#B53920',
                bbegie: '#F4F4EC'
            },
        },
    },
    plugins: [],
};
