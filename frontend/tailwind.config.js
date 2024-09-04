/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Scanner tous les fichiers source dans le dossier `src`
  ],
  theme: {
    extend: {
      colors: {
        // Ajouter des couleurs personnalisées si nécessaire
        primary: '#1DA1F2',
        secondary: '#14171A',
      },
      spacing: {
        // Ajouter des valeurs de spacing personnalisées si nécessaire
        '128': '32rem',
        '144': '36rem',
      },
      // Étendre d'autres propriétés comme les typographies, les bordures, etc.
    },
  },
  plugins: [
    // Ajouter des plugins Tailwind ici si nécessaire
    require('@tailwindcss/forms'),  // Exemple: un plugin pour les styles de formulaires
  ],
}


