# CLAUDE.md — sandflame.xyz

Personal indie-web site for Justin (ign Sandflame, California). Plain hand-coded HTML/CSS/JS, no frameworks, hosted on GitHub Pages at sandflame.xyz (CNAME). Justin is learning web dev: explain changes briefly, keep code readable and commented, short answers, one question at a time.

## Repo

- Repo: Sandflame/Sandflame, branch `master` is live and the source of truth.
- Restore point: branch `backup-before-template-build` (commit b4a8d67, site before inner pages were built). "Roll back" means restore this.
- Unused leftovers (safe to ignore, maybe clean later): main.css, page2.html, page3.html, debug.log, my-site/ subfolder, sao.jpg.

## Design

- Dark cinematic aesthetic. Background #0e0f0e, teal accent #4ecfaa, borders #2a5a40, monospace font throughout, 960px centered container.
- Header 200px with flipped image ./images/header-image.jpg, title "砂炎 SANDFLAME", subtitle "the mirror - sandflame.xyz".
- Favicon: teal flame on dark rounded square (favicon.svg, .ico/png sizes, site.webmanifest).
- Mobile breakpoint 700px: sidebar above content, rows stack, header shrinks, tap-to-toggle instead of hover.

## Files

- index.html, styles.css, scripts.js: homepage. Layout header, nav, sidebar (profile panel + 7 nav items with slide-up SVG characters), content (Latest Writing cards, Spotlight + Currently carousel, Gallery widget + Recently Completed).
- pages.css, pages.js: shared shell and features for all inner pages.
- Inner pages: about.html (interactive terminal, text in hidden #term-data), writing.html (filterable archive, data-cat essay/anime/books/music), post-template.html (progress bar, read time), anime.html (verdict board, details.case, classes v-pass/v-mark/v-warn/v-fail), books.html (shelf spines with data-title/author/status/note/link), music.html (essay in 14 section.era blocks with sticky signal strip), gallery.html (figures/style grid + full-screen viewer), now.html (status monitor; time datetime drives freshness meter).
- Placeholders use class="todo" (dashed boxes) and show publicly until filled.
- Drag/swipe: shared addDrag(el,{start,move,end}) helper in scripts.js and pages.js. Carousel uses carouselSlot/carouselRender(pos), CAROUSEL_DRAG_STEP = 55.

## Pending

- Justin reviews and corrects pre-filled content (book list, music artists, anime verdicts, /now progress bar) and fills todo placeholders.
- Music essay (Justin writes it): theme is powerful voices, Freddie Mercury to Ado, music beyond language. Add tracks, YouTube embeds, album art.
- Homepage: writing card images, real gallery photos, 3 placeholder carousel cards, profile refinements (bigger avatar, custom scanline overlay).
- Maybe: favicon alternative (砂炎 kanji or mirror), music player widget, clean old repo files, test on a real phone.

## Rules

- Test desktop and 700px mobile, no horizontal overflow, no console errors.
- Commit with clear messages; don't delete the backup branch.
- Never save screenshots into the repo, only real image files.
