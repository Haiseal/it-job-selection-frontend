

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-white">
  <div className="max-w-6xl mx-auto px-6 py-10">
    {/* 3 columns */}
    <div className="grid gap-8 md:grid-cols-3">
      {/* Brand */}
      <div>
        <div className="font-semibold text-lg">IT Job Selection</div>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          Skill-based system to recommend suitable IT career paths and learning roadmaps.
        </p>
      </div>

      {/* Navigation */}
      <div>
        <div className="font-semibold text-sm text-gray-900">Navigation</div>
        <ul className="mt-3 space-y-2 text-sm text-gray-600">
          <li><a className="hover:text-gray-900" href="/">Home</a></li>
          <li><a className="hover:text-gray-900" href="/dashboard">Dashboard</a></li>
          <li><a className="hover:text-gray-900" href="/skills">Skills</a></li>
          <li><a className="hover:text-gray-900" href="/recommend">Recommend</a></li>
          <li><a className="hover:text-gray-900" href="/history">History</a></li>
        </ul>
      </div>

      {/* Tech stack */}
      <div>
        <div className="font-semibold text-sm text-gray-900">Built with</div>
        <ul className="mt-3 space-y-2 text-sm text-gray-600">
          <li>React</li>
          <li>React Router</li>
          <li>Axios</li>
          <li>Tailwind CSS</li>
        </ul>
      </div>
    </div>

    {/* bottom bar */}
    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-gray-500">
        © {new Date().getFullYear()} IT Job Selection. All rights reserved.
      </p>

      <div className="flex gap-4 text-xs text-gray-500">
        <a className="hover:text-gray-900" href="#">Privacy</a>
        <a className="hover:text-gray-900" href="#">Terms</a>
        <a className="hover:text-gray-900" href="#">Contact</a>
      </div>
    </div>
  </div>
</footer>
  );
}