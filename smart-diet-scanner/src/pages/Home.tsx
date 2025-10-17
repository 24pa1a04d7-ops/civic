import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Smart Diet Scanner</h1>
        <p className="text-gray-600">Scan labels. Spot risks. Choose better.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/scan" className="card hover:shadow-md">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">📷</span>
            <div>
              <div className="font-medium">Scan Product</div>
              <div className="text-sm text-gray-500">Use camera or upload photo</div>
            </div>
          </div>
        </Link>

        <Link to="/profile" className="card hover:shadow-md">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">👤</span>
            <div>
              <div className="font-medium">Your Profile</div>
              <div className="text-sm text-gray-500">Allergies, conditions, diet</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
