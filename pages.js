/* =====================================================================
   pages.js — behaviour for every page EXCEPT the homepage
   (the homepage uses scripts.js).

   You should rarely need to edit this file. All the CONTENT lives in
   the .html files — this only makes it move. Each block below checks
   whether its page is open and does nothing otherwise.
   ===================================================================== */

/* --- drag with the mouse or swipe with a finger -----------------------
   addSwipe(element, whatToDoOnSwipeLeft, whatToDoOnSwipeRight)          */
function addSwipe(el, onLeft, onRight) {
	let startX = null, startY = 0, swiped = false;
	el.classList.add('swipeable');
	el.addEventListener('pointerdown', e => {
		if (e.pointerType === 'mouse' && e.button !== 0) return;
		startX = e.clientX; startY = e.clientY; swiped = false;
	});
	window.addEventListener('pointerup', e => {
		if (startX === null) return;
		const dx = e.clientX - startX, dy = e.clientY - startY;
		startX = null;
		if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
		swiped = true;
		setTimeout(() => { swiped = false; }, 50);
		if (dx < 0) onLeft(); else onRight();
	});
	window.addEventListener('pointercancel', () => { startX = null; });
	// a drag should not also count as a click on whatever was under it
	el.addEventListener('click', e => {
		if (swiped) { e.stopPropagation(); e.preventDefault(); swiped = false; }
	}, true);
	el.addEventListener('dragstart', e => e.preventDefault());
}

/* --- highlight the current page in both navs ----------------------- */
(function () {
	const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
	const page = document.body.dataset.nav || here;
	document.querySelectorAll('nav a, .nav-item a').forEach(a => {
		const target = (a.getAttribute('href') || '').split('/').pop().toLowerCase();
		if (target === page) {
			a.classList.add('here');
			if (a.parentElement.classList.contains('nav-item')) a.parentElement.classList.add('here');
		}
	});
})();

/* --- ABOUT: the terminal ------------------------------------------- */
(function () {
	const screen = document.getElementById('term-screen');
	if (!screen) return;
	const input = document.getElementById('term-input');
	const answers = {};
	document.querySelectorAll('#term-data [data-cmd]').forEach(el => {
		answers[el.dataset.cmd] = el.innerHTML.trim().split('\n').map(l => l.trim());
	});
	let queue = Promise.resolve();

	function print(html, cls) {
		const line = document.createElement('div');
		line.className = 'term-line' + (cls ? ' ' + cls : '');
		line.innerHTML = html || '&nbsp;';
		screen.appendChild(line);
		screen.scrollTop = screen.scrollHeight;
	}

	function run(raw) {
		const cmd = raw.trim().toLowerCase();
		if (!cmd) return;
		queue = queue.then(() => new Promise(done => {
			const safe = cmd.replace(/[<>&]/g, '');
			print(safe, 'cmd');
			if (cmd === 'clear') { screen.innerHTML = ''; return done(); }
			const lines = answers[cmd] ||
				['command not found: ' + safe, 'try: <b>' + Object.keys(answers).join('</b>, <b>') + '</b>'];
			let i = 0;
			(function next() {
				if (i >= lines.length) return done();
				print(lines[i++], answers[cmd] ? '' : 'dim');
				setTimeout(next, 55);
			})();
		}));
	}

	document.querySelectorAll('[data-run]').forEach(b => b.addEventListener('click', () => run(b.dataset.run)));
	input.addEventListener('keydown', e => {
		if (e.key === 'Enter') { run(input.value); input.value = ''; }
	});
	run(screen.dataset.start || 'whoami');
})();

/* --- WRITING + ANIME + GALLERY: filter chips ----------------------- */
(function () {
	document.querySelectorAll('[data-filter-group]').forEach(group => {
		const items = document.querySelectorAll(group.dataset.filterGroup);
		const counter = document.getElementById(group.dataset.count || '');
		function apply(filter) {
			let shown = 0;
			items.forEach(item => {
				const tags = (item.dataset.cat || '').split(' ');
				const match = filter === 'all' || tags.includes(filter);
				item.classList.toggle('hide', !match);
				if (match) shown++;
			});
			if (counter) counter.textContent = shown + (shown === 1 ? ' entry' : ' entries');
		}
		group.querySelectorAll('.chip').forEach(chip => chip.addEventListener('click', () => {
			group.querySelectorAll('.chip').forEach(c => c.classList.remove('on'));
			chip.classList.add('on');
			apply(chip.dataset.filter);
		}));
		apply('all');
	});
})();

/* --- WRITING on phones: first tap opens a row's preview, second tap follows the link
       (or closes the preview if the piece isn't published yet) --------- */
(function () {
	if (!window.matchMedia('(hover: none)').matches) return;
	const rows = document.querySelectorAll('.ls-row');
	rows.forEach(row => row.addEventListener('click', e => {
		const wasOn = row.classList.contains('on');
		rows.forEach(r => r.classList.remove('on'));
		if (!wasOn) { row.classList.add('on'); e.preventDefault(); }
	}));
})();

/* --- WRITING: post template (reading bar + read time) -------------- */
(function () {
	const post = document.querySelector('.post');
	if (!post) return;
	const out = document.getElementById('read-time');
	if (out) {
		const words = post.innerText.trim().split(/\s+/).length;
		out.textContent = Math.max(1, Math.round(words / 220)) + ' min read';
	}
	const bar = document.getElementById('read-bar');
	if (!bar) return;
	function update() {
		const r = post.getBoundingClientRect();
		const total = r.height - window.innerHeight;
		const done = total <= 0 ? 1 : Math.min(1, Math.max(0, -r.top / total));
		bar.style.width = (done * 100) + '%';
	}
	window.addEventListener('scroll', update, { passive: true });
	window.addEventListener('resize', update);
	update();
})();

/* --- ANIME: board counters + case numbers -------------------------- */
(function () {
	const cases = document.querySelectorAll('.case');
	if (!cases.length) return;
	cases.forEach((c, i) => {
		const no = c.querySelector('.case-no');
		if (no) no.textContent = '#' + String(i + 1).padStart(3, '0');
	});
	document.querySelectorAll('[data-count-cat]').forEach(el => {
		const cat = el.dataset.countCat;
		el.textContent = cat === 'all' ? cases.length :
			[...cases].filter(c => (c.dataset.cat || '').split(' ').includes(cat)).length;
	});
})();

/* --- BOOKS: pull a book off the shelf ------------------------------ */
(function () {
	const card = document.getElementById('book-card');
	if (!card) return;
	const spines = document.querySelectorAll('.spine:not(.empty)');
	function pull(spine) {
		spines.forEach(s => s.classList.remove('pulled'));
		spine.classList.add('pulled');
		const d = spine.dataset;
		const link = d.link ? `<a class="book-card-link" href="${d.link}">${d.linkText || 'read my review'} →</a>` : '';
		card.innerHTML =
			`<span class="tag">${d.status || ''}</span>` +
			`<div class="book-card-title">${d.title || spine.textContent}</div>` +
			`<div class="book-card-author">${d.author || ''}</div>` +
			`<div class="book-card-note">${d.note || ''}</div>` + link;
	}
	spines.forEach(s => s.addEventListener('click', () => pull(s)));
	if (spines.length) pull(spines[0]);
})();

/* --- MUSIC: the signal strip --------------------------------------- */
(function () {
	const bars = document.getElementById('sig-bars');
	if (!bars) return;
	const eras = [...document.querySelectorAll('.era')];
	const nowNo = document.getElementById('sig-no');
	const nowName = document.getElementById('sig-name');
	const segs = eras.map((era, i) => {
		const seg = document.createElement('button');
		seg.className = 'sig-seg';
		const title = era.querySelector('.era-title').textContent;
		seg.title = title;
		seg.setAttribute('aria-label', 'jump to ' + title);
		for (let b = 0; b < 5; b++) {
			const bar = document.createElement('i');
			// a fixed pseudo-random height so the waveform looks the same every visit
			const h = 25 + Math.abs(Math.sin((i + 1) * 12.9898 + b * 78.233) * 43758.5453 % 1) * 75;
			bar.style.height = h + '%';
			seg.appendChild(bar);
		}
		seg.addEventListener('click', () => era.scrollIntoView({ behavior: 'smooth', block: 'start' }));
		bars.appendChild(seg);
		return seg;
	});
	function update() {
		let current = 0;
		eras.forEach((era, i) => { if (era.getBoundingClientRect().top < 140) current = i; });
		segs.forEach((s, i) => s.classList.toggle('on', i === current));
		nowNo.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(eras.length).padStart(2, '0');
		nowName.textContent = eras[current].querySelector('.era-title').textContent;
	}
	window.addEventListener('scroll', update, { passive: true });
	update();
})();

/* --- GALLERY: the viewer ------------------------------------------- */
(function () {
	const lb = document.getElementById('lb');
	if (!lb) return;
	const tiles = [...document.querySelectorAll('.gal-tile')];
	const frame = document.getElementById('lb-frame');
	const caption = document.getElementById('lb-caption');
	const count = document.getElementById('lb-count');
	const strip = document.getElementById('lb-strip');
	let current = 0;
	let lastFocus = null;

	const thumbs = tiles.map((tile, i) => {
		const t = document.createElement('button');
		t.className = 'lb-thumb';
		const img = tile.querySelector('img');
		if (img) t.innerHTML = `<img src="${img.getAttribute('src')}" alt="">`;
		t.addEventListener('click', () => show(i));
		strip.appendChild(t);
		tile.addEventListener('click', () => open(i));
		return t;
	});

	function show(i) {
		current = (i + tiles.length) % tiles.length;
		const tile = tiles[current];
		const img = tile.querySelector('img');
		const cap = tile.querySelector('.gal-cap');
		frame.innerHTML = img
			? `<img src="${img.getAttribute('src')}" alt="${img.getAttribute('alt') || ''}">`
			: '<div class="lb-empty">no photo yet</div>';
		caption.textContent = cap ? cap.textContent : '';
		count.textContent = (current + 1) + ' / ' + tiles.length;
		thumbs.forEach((t, n) => t.classList.toggle('on', n === current));
		thumbs[current].scrollIntoView({ block: 'nearest', inline: 'center' });
	}
	function open(i) {
		lastFocus = document.activeElement;
		lb.classList.add('open');
		document.body.style.overflow = 'hidden';
		show(i);
		document.getElementById('lb-close').focus();
	}
	function close() {
		lb.classList.remove('open');
		document.body.style.overflow = '';
		if (lastFocus) lastFocus.focus();
	}
	document.getElementById('lb-close').addEventListener('click', close);
	document.getElementById('lb-prev').addEventListener('click', () => show(current - 1));
	document.getElementById('lb-next').addEventListener('click', () => show(current + 1));
	addSwipe(document.querySelector('.lb-stage'), () => show(current + 1), () => show(current - 1));
	lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-stage')) close(); });
	document.addEventListener('keydown', e => {
		if (!lb.classList.contains('open')) return;
		if (e.key === 'Escape') close();
		if (e.key === 'ArrowLeft') show(current - 1);
		if (e.key === 'ArrowRight') show(current + 1);
	});
})();

/* --- NOW: signal meter + progress bars ----------------------------- */
(function () {
	const stamp = document.getElementById('now-date');
	if (!stamp) return;
	const days = Math.max(0, Math.floor((Date.now() - new Date(stamp.getAttribute('datetime') + 'T00:00:00')) / 86400000));
	document.getElementById('now-age').textContent =
		days === 0 ? 'today' : days === 1 ? 'yesterday' : days + ' days ago';

	// signal strength drops as the page gets older
	const levels = [
		{ max: 14, lit: 5, cls: '', word: 'signal strong' },
		{ max: 30, lit: 4, cls: '', word: 'signal steady' },
		{ max: 60, lit: 3, cls: 'fading', word: 'signal fading' },
		{ max: 120, lit: 2, cls: 'fading', word: 'signal weak' },
		{ max: Infinity, lit: 1, cls: 'lost', word: 'signal nearly lost' },
	];
	const level = levels.find(l => days <= l.max);
	const meter = document.getElementById('now-meter');
	if (level.cls) meter.classList.add(level.cls);
	meter.querySelectorAll('i').forEach((bar, i) => bar.classList.toggle('lit', i < level.lit));
	document.getElementById('now-signal').textContent = level.word;

	requestAnimationFrame(() => document.querySelectorAll('.bar').forEach(bar => {
		bar.style.setProperty('--p', Math.min(100, Math.max(0, Number(bar.dataset.progress) || 0)) + '%');
	}));
})();
