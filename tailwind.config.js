/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 👈 이 경로가 정확해야 DronePage.jsx의 클래스를 읽어옵니다.
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}