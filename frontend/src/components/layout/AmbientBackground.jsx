import botHero from '@/assets/images/bot-hero.webp'

// Shared ambient background: the CodeRecall bot, dimmed into the dark
// shell so real content stays legible on top of it. Used by both the
// authenticated app shell (AppLayout) and the public marketing shell
// (MarketingLayout) so every page shares the exact same look.
export default function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <img
        src={botHero}
        alt=""
        className="absolute -right-24 -top-16 w-[900px] max-w-none opacity-[0.14] blur-[1px] sm:opacity-[0.16]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/85 to-ink" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(245,148,31,0.08),transparent)]" />
    </div>
  )
}
