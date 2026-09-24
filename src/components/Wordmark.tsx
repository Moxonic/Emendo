// The Emendo wordmark: the brand mark (an "E" of three bars) stands in for the
// leading E in E·MENDO, with the rest of the name set in the surrounding type.
// Sizes to the current font-size (em units), so the same component works in the
// nav and on the sign-in screen.
export default function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span role="img" aria-label="Emendo" className={`inline-flex items-center ${className}`}>
      <img
        src="/logos/emendo-mark-black.svg"
        alt=""
        aria-hidden="true"
        className="mr-[0.08em] inline-block h-[0.9em] w-auto"
      />
      <span aria-hidden="true">mendo</span>
    </span>
  );
}
