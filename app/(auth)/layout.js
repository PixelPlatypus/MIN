export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg-secondary dark:bg-bg-secondary-dark flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
