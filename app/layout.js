export const metadata = {
  title: 'Nomi',
  description: 'Find your next meal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
