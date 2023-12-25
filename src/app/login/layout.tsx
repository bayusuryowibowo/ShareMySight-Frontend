export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={
        'w-full min-h-screen flex justify-center items-center bg-gradient-to-r from-yellow-400 to-orange-400'
      }
      style={{ height: "100vh" }}
    >
      {children}
    </div>
  )
}