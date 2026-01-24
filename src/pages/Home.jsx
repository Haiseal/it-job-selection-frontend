import { useMemo } from "react";
import { Link } from "react-router-dom";

// --- decode JWT payload (no library) ---
function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function ExampleFlow() {
  // SVG minh hoạ flow: Skills -> Recommend -> Results -> Roadmap
  // (Bạn có thể thay bằng ảnh thật sau)
  return (
    <div className="mt-3 rounded-xl border bg-white p-4">
      <svg
        viewBox="0 0 720 260"
        className="w-full h-auto"
        role="img"
        aria-label="Example flow illustration"
      >
        {/* background */}
        <rect x="8" y="8" width="704" height="244" rx="18" fill="white" />
        <rect
          x="8"
          y="8"
          width="704"
          height="244"
          rx="18"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="2"
        />

        {/* top nodes */}
        <rect x="70" y="55" width="170" height="64" rx="14" fill="#0b0b0b" />
        <rect x="275" y="55" width="170" height="64" rx="14" fill="#0b0b0b" />
        <rect x="480" y="55" width="170" height="64" rx="14" fill="#0b0b0b" />

        {/* bottom node */}
        <rect x="180" y="140" width="360" height="78" rx="16" fill="#0b0b0b" />

        {/* arrows */}
        <line x1="240" y1="87" x2="275" y2="87" stroke="#9ca3af" strokeWidth="6" />
        <polygon points="275,87 261,79 261,95" fill="#9ca3af" />

        <line x1="445" y1="87" x2="480" y2="87" stroke="#9ca3af" strokeWidth="6" />
        <polygon points="480,87 466,79 466,95" fill="#9ca3af" />

        <line x1="155" y1="119" x2="300" y2="140" stroke="#9ca3af" strokeWidth="6" />
        <polygon points="300,140 286,131 287,148" fill="#9ca3af" />

        <line x1="360" y1="119" x2="360" y2="140" stroke="#9ca3af" strokeWidth="6" />
        <polygon points="360,140 352,126 368,126" fill="#9ca3af" />

        <line x1="565" y1="119" x2="420" y2="140" stroke="#9ca3af" strokeWidth="6" />
        <polygon points="420,140 433,148 434,131" fill="#9ca3af" />

        {/* labels */}
        <text x="155" y="94" textAnchor="middle" fontSize="16" fill="white" fontFamily="Arial">
          Skills
        </text>
        <text x="360" y="94" textAnchor="middle" fontSize="16" fill="white" fontFamily="Arial">
          Recommend
        </text>
        <text x="565" y="94" textAnchor="middle" fontSize="16" fill="white" fontFamily="Arial">
          Results
        </text>
        <text x="360" y="186" textAnchor="middle" fontSize="16" fill="white" fontFamily="Arial">
          Roadmap (next steps)
        </text>
      </svg>
    </div>
  );
}

export default function Home() {
  const token = localStorage.getItem("token") || "";
  const me = useMemo(() => parseJwt(token), [token]);
  const isLoggedIn = Boolean(me?.email);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Hero */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div>
          <div className="inline-flex items-center gap-2 border rounded-full px-3 py-1 text-sm text-gray-700">
            <span className="font-semibold">IT Job Selection</span>
            <span className="text-gray-400">•</span>
            <span>Skill-based guidance</span>
          </div>

          <h1 className="mt-5 text-4xl md:text-5xl font-bold leading-tight">
            Find your best-fit IT career
            <br />
            path <span className="text-gray-500">based on your skills</span>
          </h1>

          <p className="mt-4 text-gray-600 max-w-xl">
            Update your skill levels, generate recommendations, and follow a roadmap to close skill
            gaps step-by-step.
          </p>

          {/* Login-aware box */}
          <div className="mt-6 border rounded-xl p-4 bg-white">
            {isLoggedIn ? (
              <>
                <div className="text-sm text-gray-600">Welcome back</div>
                <div className="mt-1 font-semibold">
                  {me.email}{" "}
                  <span className="text-gray-500 font-normal">(role: {me.role || "student"})</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link className="border rounded px-4 py-2" to="/dashboard">
                    Go to Dashboard
                  </Link>
                  <Link className="border rounded px-4 py-2" to="/skills">
                    Update Skills
                  </Link>
                  <Link className="border rounded px-4 py-2" to="/recommend">
                    Generate Recommendation
                  </Link>
                  <Link className="border rounded px-4 py-2" to="/history">
                    View History
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="font-semibold">Start in 2 minutes</div>
                <div className="text-sm text-gray-600 mt-1">
                  Login to save your skills and track recommendation history.
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link className="border rounded px-4 py-2" to="/login">
                    Login
                  </Link>
                  <Link className="border rounded px-4 py-2" to="/register">
                    Create account
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Feature cards */}
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            <div className="border rounded-xl p-4 bg-white">
              <div className="font-semibold">Skill Gap Analysis</div>
              <div className="text-sm text-gray-600 mt-1">
                See what’s missing for each job path.
              </div>
            </div>
            <div className="border rounded-xl p-4 bg-white">
              <div className="font-semibold">Ranked Recommendations</div>
              <div className="text-sm text-gray-600 mt-1">
                Compare paths by score and difficulty.
              </div>
            </div>
            <div className="border rounded-xl p-4 bg-white">
              <div className="font-semibold">Roadmap Steps</div>
              <div className="text-sm text-gray-600 mt-1">
                Learn in a structured, trackable way.
              </div>
            </div>
          </div>
        </div>

        {/* Illustration */}
        <div className="border rounded-2xl p-5 bg-gray-50">
          <div className="text-sm text-gray-600">Example flow (illustration)</div>
          <ExampleFlow />
          <div className="mt-3 text-sm text-gray-600">
            You can replace this with a real image later, but SVG is perfect for a clean MVP.
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold">How it works</h2>
        <div className="mt-4 grid md:grid-cols-4 gap-3">
          <div className="border rounded-xl p-4 bg-white">
            <div className="text-sm text-gray-500">Step 1</div>
            <div className="font-semibold mt-1">Update skills</div>
            <div className="text-sm text-gray-600 mt-1">
              Add your current level (0–5) for each skill.
            </div>
          </div>
          <div className="border rounded-xl p-4 bg-white">
            <div className="text-sm text-gray-500">Step 2</div>
            <div className="font-semibold mt-1">Generate recommendation</div>
            <div className="text-sm text-gray-600 mt-1">
              The system ranks job paths based on your profile.
            </div>
          </div>
          <div className="border rounded-xl p-4 bg-white">
            <div className="text-sm text-gray-500">Step 3</div>
            <div className="font-semibold mt-1">Check gaps</div>
            <div className="text-sm text-gray-600 mt-1">
              Understand which skills you’re missing.
            </div>
          </div>
          <div className="border rounded-xl p-4 bg-white">
            <div className="text-sm text-gray-500">Step 4</div>
            <div className="font-semibold mt-1">Follow roadmap</div>
            <div className="text-sm text-gray-600 mt-1">
              Learn step-by-step and close the gaps.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
