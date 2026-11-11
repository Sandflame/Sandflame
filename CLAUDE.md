# CLAUDE.md — sandflame.xyz

This is the working brief for sandflame.xyz, Justin's hand-built personal website. Read it at the start of every session and work the way it describes. This file lives in a public repo, so it holds no private details; keep it that way.

## How to work with Justin

- Justin is the designer and the writer; Claude does the building. He gives design direction ("make the cards bigger", "this feels too much like the homepage") and Claude edits the files, tests them, commits and pushes.
- He started this site to learn HTML and CSS by hand and still wants to understand his own code. After a change, say in a sentence or two what changed and where (file plus selector or function), without a lecture. Keep code commented so he can find and adjust values himself.
- Keep replies short and lead with the result. Ask one question at a time, and only when a wrong guess would be costly; otherwise make a sensible call and say what you chose.
- He often works by voice or from his phone. Keep replies easy to follow by ear, with no dense walls of bullets.
- He tunes values by eye (he found the gallery height of 283px by testing 282 and 284). When he gives a number, use it exactly. When you propose one, name the property so he can adjust it.
- He likes creative, unusual ideas that still fit the aesthetic. When he asks for ideas, give a few distinct ones, and offer a visual mock-up when the choice is visual.
- After a push, tell him it will be live in 1 to 2 minutes and to hard refresh (Ctrl+Shift+R on a computer, a private tab on a phone).

## Rules

1. Never write Justin's content for him: essays, reviews, verdicts, opinions, notes or captions about his life. Leave a `class="todo"` placeholder instead. Structure and headings are fine; the voice is his.
2. Never invent facts about him: what he likes, listened to, watched or owns, or when. If it isn't in this file, on the site or in his message, ask. A past session credited him with an artist he never mentioned; don't repeat that.
3. The repo and the site are public. Keep private details out of both: job, workplace, address, family, health, email. "Justin", the ign "Sandflame" and "California" are already public.
4. Never save screenshots or screen captures into the repo, only real image files he provides.
5. Don't change the hand-tuned values listed under Design system without asking.
6. Before pushing, test at desktop width (about 1100px) and phone width (about 390px): no sideways scrolling, no console errors, and interactions work with both mouse and touch.
7. Write commit messages that say what changed and why. Never delete or overwrite the `backup-before-template-build` branch.
8. Keep the stack plain: HTML, CSS and vanilla JavaScript. No frameworks, build steps or CDNs unless he asks.

## Repo, deploy and rollback

- GitHub repo `Sandflame/Sandflame`. Branch `master` is live at sandflame.xyz through GitHub Pages (the `CNAME` file sets the domain). Pushing to `master` deploys.
- Restore point: branch `backup-before-template-build` (commit `b4a8d67`) is the site before the inner pages were built. "Roll back" means returning the site to that state, after confirming with Justin.
- The copy on his PC can be older than GitHub, so always pull first.
- Unused leftovers, safe to ignore (delete only if he asks): `main.css`, `page2.html`, `page3.html`, `debug.log`, the `my-site/` folder, `sao.jpg`.
- Images live in `./images/`. Photos should be compressed before they're added (he uses squoosh.app).

## Design system

The feel is dark, cinematic and terminal-like: teal glow, scanlines, monospace type, boxed panels with thin teal borders. Every new piece must look like it belongs.

| Role | Value |
| --- | --- |
| Background | `#0e0f0e` |
| Panel | `#0b0c0b` |
| Border | `#2a5a40` |
| Border, dim | `#1e2a20` |
| Teal accent | `#4ecfaa` |
| Teal 2 | `#3abf90` |
| Teal 3 | `#2a8a55` |
| Teal 4 (dim text) | `#1a5a38` |
| Body text | `#a9c9bb` |
| Bright text | `#c8f0e0` |
| Amber (warnings) | `#cfa84e` |
| Red | `#cf5a4e` |

- Inner pages define these as CSS variables in `pages.css` (`:root`); `styles.css` uses the raw hex values. Glow colour is `rgba(78, 207, 170, 0.5)`.
- Type: monospace everywhere. Widget labels are 12px, uppercase and letter-spaced. Long prose is 13px with line-height 1.75 and a 62ch max width.
- Layout: 960px centred container. A 200px header with the flipped image `./images/header-image.jpg`, title "砂炎 SANDFLAME" and subtitle "the mirror - sandflame.xyz". Below it a top nav, a left sidebar and the content area.
- The name: 砂炎 is sand + flame, which make glass, which makes a mirror. "The mirror" is also a Koyomi Reverse (Monogatari) reference.
- Effects: glow pulse on the profile avatar (`profileGlow`), a moving scanline (`scanMove`), and hover that dims a card to brightness 0.3 with its title centred.
- Phones (700px and below): the sidebar moves above the content and its nav list hides (the top nav wraps instead), widget rows stack, and on touch screens hover effects become tap to show, tap again to hide.
- Site icon: a teal flame on a dark rounded square (`favicon.svg`, `.ico` and `.png` sizes, `site.webmanifest`).
- Hand-tuned values, ask before changing: gallery widget height 283px (matches Recently Completed); carousel slot positions ±44, ±88 and ±123px with scales 0.8, 0.65 and 0.5; carousel cards 85 × 124px; profile avatar 40px (he wants it bigger later); `CAROUSEL_DRAG_STEP` 55.

## Homepage

The homepage is `index.html` with `styles.css` and `scripts.js`.

- Sidebar: a profile panel (`./images/juco-pfp.jpg` with scanlines and glow; "Justin / ign: Sandflame / loc: California") and 7 nav items, each with a small SVG character that slides up on hover. The sidebar HTML must stay identical on every page.
- Row 1, Latest Writing: three cards written directly in `index.html`.
- Row 2: Spotlight on the left (image, title and subtitle in `index.html`) and the Currently carousel on the right (the `carouselItems` list at the top of `scripts.js`, each with a label, colour and image).
- Row 3: the Gallery widget (the `galleryItems` list in `scripts.js`; gradient placeholders for now) and the Recently Completed grid (tiles in `index.html`; hover or tap shows the title).
- The carousel and gallery follow the mouse or finger in real time through the shared `addDrag(el, {start, move, end})` helper. The carousel snaps to the most-centred card on release; `carouselRender(pos)` accepts a fractional position.

## Inner pages

Every inner page uses the homepage shell and loads `styles.css`, `pages.css` and `pages.js` (not `scripts.js`). Content lives in the HTML, and each block has a comment explaining how to edit it. Placeholders are dashed `class="todo"` boxes that show publicly until filled. The current page is highlighted in both navs automatically.

| Page | Feature | How its content is edited |
| --- | --- | --- |
| `about.html` | Interactive terminal (click or type whoami, name, interests, site, contact, help, clear) plus "the longer version" prose | Command output sits in hidden `#term-data` blocks; a new command needs a block and a chip |
| `writing.html` | Archive listing with filter chips and a hover or tap preview line | One `a.ls-row` per piece, `data-cat` essay, anime, books or music; add an `href` and a "live" status when published |
| `post-template.html` | Article layout with a reading progress bar and automatic read time | Copy and rename it for each post; write inside `.prose` |
| `anime.html` | Verdict board: case files that open to a cover, verdict stamp, "why" and "reflected" | `details.case` with `data-cat` favorite, watching or year; stamp classes `v-pass`, `v-mark`, `v-warn`, `v-fail` |
| `books.html` | A shelf of spines; clicking one pulls it out and shows its card | `button.spine` with `--h`, `--c` and `data-title`, `data-author`, `data-status`, `data-note`, `data-link`; three shelves |
| `music.html` | The essay in 14 `section.era` blocks, with a sticky signal strip that lights the current era | Each era has a title, artist tags, prose, a tracklist and 4 album-art slots |
| `gallery.html` | Figures and style grids, plus a full-screen viewer (drag or swipe, arrow keys, Esc) | `button.gal-tile` holding an `img` and a `.gal-cap`; classes `tall` and `wide` |
| `now.html` | Status monitor whose signal meter fades as the page ages | Change the `time` element's `datetime` on every update; move old cards into "previous snapshots" |

## What's on the site now

- Spotlight: "On Evil and Good Intentions", subtitle "Most evil is done by people with good intentions", image `gosick-leviathan.png` (Leviathan, the alchemist from Gosick). The essay isn't written yet. Its theme is intent versus consequence: harm done in the name of righteous belief.
- Latest Writing cards (all drafts): Thus Spoke Zarathustra Review (5/31/26), Monogatari Series Analysis (6/01/26), The Mirror Reflects the Truth (6/02/26).
- Currently carousel: Zoku Owarimonogatari, Puella Magi Madoka Magica, Hellsing Ultimate, Thus Spoke Zarathustra, plus three placeholder slots (Show 5, Album, Show 7).
- Recently Completed: Owarimonogatari 2nd Season, Call of the Night Season 2, My Dress Up Darling Season 2, Dandadan Season 2, Psycho-Pass, Gosick.
- Gallery captions (placeholders): justin — jun 2026, kiss-shot 1/7 scale, dark cinematic fit, aesthetic, figure shelf.
- Pre-filled by Claude and not yet confirmed by Justin: the book shelves (Thus Spoke Zarathustra and Dao De Jing as reading; The Picture of Dorian Gray, Either/Or, Beyond Good and Evil, The Iliad, Vagabond Vol. 2, Rokka Vol. 2 and the Monogatari novels as want to read), the anime lists (every verdict "pending") and the /now "building" bar at 40%.

## Music essay

Justin writes this one himself; the page is the essay. It tells how his taste developed, and carries the idea that music reaches past language. A voice chat also raised a "powerful voices, from Freddie Mercury to Ado" thread; ask him how it fits the outline below before building on it.

| # | Working title | Artists tagged on the page |
| --- | --- | --- |
| 01 | background noise | Queen, The Beatles, The Beach Boys, Tom Petty, Bruce Springsteen, Led Zeppelin |
| 02 | the kid who didn't care | none yet |
| 03 | nightcore | Krewella, Sia, Lana Del Rey, Panic! At The Disco; songs Senbonzakura and Courtesy Call (Thousand Foot Krutch) |
| 04 | naruto shippuden | none yet |
| 05 | openings and endings | LiSA (Crossing Field) |
| 06 | reol | Reol (Yoiyoi Kokon) |
| 07 | the deep dive | Aimer, Butaotome, Reol, LiSA, EGOIST, DECO*27, girl in red, beabadoobee |
| 08 | late nights | Pink Floyd, 202, YeYe |
| 09 | lexie liu | Lexie Liu |
| 10 | ryujin | ITZY, (G)I-DLE |
| 11 | k-rnb | BIBI, Heize, youra |
| 12 | without words | Bach |
| 13 | four concerts | (G)I-DLE, Ado, Enno Cheng, Kumo99 |
| 14 | the thread | none yet |

Details he has shared that the essay may use (ask before adding anything else):

- Classic rock came from the car radio and a Beach Boys CD, not cassettes. He has listened to classic rock throughout his life.
- Rush became a favourite later, from high school on. Pink Floyd came in high school. He discovered Greta Van Fleet on a car ride.
- Concerts: Ado in LA (2024), Enno Cheng, and Kumo99 at the Santa Ana Observatory, the most recent.
- Chinese artists he listens to include Lexie Liu, Angela Chang, Wang OK and Lucy. Bach is his music for focused work.
- The order of his K-RnB discoveries is still unsorted. He has exported Spotify playlists with dates that can help place eras.

## What the site is for

The site comes from the web-dev module of Justin's 12-week self-improvement curriculum: a hand-coded indie-web site that is "a presence, not a resume", built around his writing, taste, figures, music, anime and aesthetic. Its principles: own your content, let it be unfinished, make it personal.

- Pages in the plan: Home, About, Writing (blog), Reviews (not built yet), Bookshelf (this is `books.html`), Music, Gallery, Anime and /now.
- Gallery: a figures section (character and series captions) and a style section with outfit photos; minimal captions.
- Anime: all-time favourites with one line on why each matters (Monogatari first, linking to its analysis on the writing page), watched this year with loved, liked or dropped, and currently watching.
- /now: updated monthly with watching, reading, building, wearing and listening, plus a visible last-updated date.
- Content pipeline: writing drafted in Obsidian becomes posts; book reviews go to Books (and Reviews); outfit and figure photos go to Gallery.
- Still open from the plan: meta descriptions, optional custom fonts, image compression, alt text on every image, and a test on a real phone.

## Decisions and taste

- Inner pages should not feel like copies of the homepage; each page gets its own idea.
- Never use the word "shrine" anywhere on the site.
- The verdict board on the anime page is a placeholder Claude chose. Justin hasn't decided between it and his other concepts, The Mirror and Opening Sequence, so ask before investing more in it.
- A homepage music player (record player and reel-to-reel ideas) was considered and set aside; the gallery took that spot. He may come back to it.
- Spotlight is for anything he wants to highlight: a piece of writing, media, a video or anything else.
- Writing may later split into categories (blog, specific topics), each with its own widget.

## Pending

- Justin: review the pre-filled content, fill the `todo` placeholders, and write the music essay and other pieces.
- Homepage: images or gifs for the writing cards, real gallery photos, real items for the three placeholder carousel slots, and a bigger avatar with better vertical alignment and a scanline and glow tuned to the photo.
- Music page: tracks, links or YouTube embeds, album art.
- Anime page: settle the format.
- Maybe later: an alternative site icon (the 砂炎 kanji or a mirror), a music player widget, removing the leftover files, and a Reviews page.

## Known quirks

- Browsers cache the site hard (Opera especially). After a deploy, hard refresh.
- The homepage profile block sits slightly off-centre vertically.
- "loc: California" wraps in the narrow sidebar.
