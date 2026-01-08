// app/layout.tsx — DROP-IN REPLACEMENT
import "./globals.css";

export const metadata = {
  title: "Isaac Seiler",
  description: "Isaac's site: more coming soon",
};

const BG_SCRIPT = `
(function () {
  var COLORS = ["#4053d4", "#c495d1", "#95d1b1", "#67b6cf"];
  var KEY_LAST = "isaac_bg_last_v3";
  var KEY_NEXT = "isaac_bg_next_v3";

  function randColor(except) {
    if (COLORS.length === 1) return COLORS[0];
    for (var i = 0; i < 12; i++) {
      var c = COLORS[Math.floor(Math.random() * COLORS.length)];
      if (c !== except) return c;
    }
    return COLORS[0];
  }

  var last = null;
  var next = null;

  try { last = localStorage.getItem(KEY_LAST); } catch (e) {}
  try { next = localStorage.getItem(KEY_NEXT); } catch (e) {}

  // if we previously computed a "next", start on it immediately (prevents flash),
  // then compute a new next for the *next* reload.
  var start = (next && COLORS.indexOf(next) !== -1)
    ? next
    : (last && COLORS.indexOf(last) !== -1)
      ? last
      : COLORS[Math.floor(Math.random() * COLORS.length)];

  var newNext = randColor(start);

  // set initial background immediately (no transition yet)
  var root = document.documentElement;
  root.style.setProperty("--bg", start);

  // persist for next reload
  try { localStorage.setItem(KEY_LAST, start); } catch (e) {}
  try { localStorage.setItem(KEY_NEXT, newNext); } catch (e) {}

  // on this load, after first paint, crossfade to a slightly-adjusted target
  // only if we had an existing stored state (avoids first-ever weirdness)
  var hadState = !!last || !!next;
  if (hadState) {
    requestAnimationFrame(function () {
      root.style.setProperty("--bg", start); // ensure computed
    });
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: BG_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
