// /** @type {import('tailwindcss').Config} */
// module.exports = {
//     content: [
//         "./app/**/*.{js,ts,jsx,tsx,mdx}", // src가 없으므로 ./app 으로 시작해야 함
//         "./components/**/*.{js,ts,jsx,tsx,mdx}", // 최상위에 있는 components 폴더
//         "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     ],
//     theme: {
//         extend: {
//             colors: {
//                 transparent: 'transparent',
//                 current: 'currentColor',
//                 Byellow: '#FFB018',
//                 Bgreen: '#334B35',
//                 Bgrey: '#E5DCCB',
//                 Bbrown: '#B76939',
//                 Borange: '#FB624B',
//                 Bblack: '#020003',
//                 Bbeige: '#F6EEE1',
//                 Bdark: '#24272C',
//                 Benamel: '#f4e2d0',
//                 Blightbeige: '#faf8f4',
//                 bred: '#B53920',
//                 bbegie: '#F4F4EC'
//             },
//         },
//     },
//     plugins: [],
// };

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 이미지 분위기를 반영한 새 컬러 팔레트
        navy: {
          deep: '#0A192F',   // 가장 어두운 딥 네이비 (상단 히어로용)
          main: '#1E3A8A',   // 핵심 포인트 네이비/블루
          light: '#3B82F6',  // 밝은 포인트 블루
        },
        offwhite: '#F8FAFC',  // 차분하고 깨끗한 연한 아이보리/슬레이트 배경
        subtle: '#94A3B8',    // 보조 텍스트용 그레이
      },
    },
  },
  plugins: [],
};