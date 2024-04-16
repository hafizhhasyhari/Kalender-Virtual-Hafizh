module.exports = {
  singleQuote: true,
  plugins: [require('prettier-plugin-tailwindcss')],
  importOrder: ['^@/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
