export default function ExampleFlow() {
  return (
    <div className="border rounded-2xl p-5 bg-white">
      <div className="text-sm text-gray-600 mb-3">Example flow (illustration)</div>

      <div className="border rounded-2xl p-4 bg-gray-50 overflow-x-auto">
        <svg
          width="760"
          height="240"
          viewBox="0 0 760 240"
          role="img"
          aria-label="Example flow: Skills → Recommend → Result → Roadmap"
        >
          {/* arrows defs */}
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#111827" />
            </marker>
          </defs>

          {/* top boxes */}
          <rect x="40" y="40" rx="14" ry="14" width="180" height="64" fill="#111827" />
          <rect x="290" y="40" rx="14" ry="14" width="180" height="64" fill="#111827" />
          <rect x="540" y="40" rx="14" ry="14" width="180" height="64" fill="#111827" />

          {/* labels */}
          <text x="130" y="78" textAnchor="middle" fill="white" fontSize="14" fontFamily="Arial">
            Update Skills
          </text>
          <text x="380" y="78" textAnchor="middle" fill="white" fontSize="14" fontFamily="Arial">
            Generate
          </text>
          <text x="630" y="78" textAnchor="middle" fill="white" fontSize="14" fontFamily="Arial">
            View Result
          </text>

          {/* arrows between top boxes */}
          <line x1="220" y1="72" x2="290" y2="72" stroke="#111827" strokeWidth="3" markerEnd="url(#arrow)" />
          <line x1="470" y1="72" x2="540" y2="72" stroke="#111827" strokeWidth="3" markerEnd="url(#arrow)" />

          {/* bottom big box */}
          <rect x="170" y="140" rx="16" ry="16" width="420" height="72" fill="#111827" />
          <text x="380" y="176" textAnchor="middle" fill="white" fontSize="14" fontFamily="Arial">
            Follow Roadmap Steps
          </text>

          {/* arrows down to bottom */}
          <line x1="130" y1="104" x2="260" y2="140" stroke="#111827" strokeWidth="3" markerEnd="url(#arrow)" />
          <line x1="380" y1="104" x2="380" y2="140" stroke="#111827" strokeWidth="3" markerEnd="url(#arrow)" />
          <line x1="630" y1="104" x2="500" y2="140" stroke="#111827" strokeWidth="3" markerEnd="url(#arrow)" />
        </svg>
      </div>

      
    </div>
  );
}
