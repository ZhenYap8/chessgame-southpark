# South Park Chess

Clean Architecture vanilla JS chess game with a South Park themed skin (placeholder assets only).

## Status
Scaffold only. Logic & UI to be implemented in subsequent steps.

## Run Dev Server
npm install
npm run dev

Then open http://localhost:8080

## Structure (overview)
```
layers/
  domain/        # Pure chess logic (no side-effects)
  application/   # Use-cases orchestrating domain
  interface/     # Adapters (storage, audio, sprites, controller)
  ui/            # Delivery layer (views, styling, index.html)
  tests/         # Simple zero-dependency tests
assets/placeholder/  # Temporary piece sprites
```

See detailed README sections after full generation.

## Legal / IP Disclaimer

This project ships ONLY original, generic avatar SVGs generated at runtime. No third‑party or proprietary South Park artwork, likenesses, screenshots, or trademarked character assets are included.

To reduce IP risk:
- Piece labels use neutral archetype names (Strategist, Leader, Guardian, Advisor, Scout, Trainee, Challenger, Commander, Sentinel, Scholar, Rider, Cadet) instead of show character names.
- Avatars are simple geometric/cartoon forms produced procedurally (see `layers/ui/AvatarFactory.js`).
- No copyrighted dialogue, logos, or distinctive trade dress is embedded.

If you add your own artwork:
1. Place files at: `assets/theme/cartoon/<color>_<type>.svg` (e.g. `assets/theme/cartoon/white_king.svg`).
2. Ensure you own or have the rights to any art you commit.
3. Avoid using trademarked names in filenames or marketing text.

Attribution & Licensing:
- Source code: (add your chosen license if not already) – recommend MIT or Apache-2.0.
- Generated SVG avatars: treated as part of the code; you may modify them freely under the project license.
- You are solely responsible for any third‑party assets you add.

Not Affiliated:
This project is an independent, fan-made software implementation and is not endorsed by or affiliated with the owners of South Park. “South Park” and any related marks belong to their respective owners.

## Custom Theme Notes
- To replace a single piece graphic, add a file with the matching naming convention; the runtime can be extended to detect and use it before the generated avatar.
- Fallback: if a custom file is missing, the procedural avatar remains.
