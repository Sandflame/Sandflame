const carouselItems = [
	{ label: "Zoku Owarimonogatari", color: "#0d3020", image: "./images/zoku-owarimonogatari.jpg" },
	{ label: "Puella Magi Madoka Magica", color: "#1a0d18", image: "./images/madoka-magica.jpg" },
	{ label: "Hellsing Ultimate", color: "#1a0808", image: "./images/hellsing-ultimate.jpg" },
	{ label: "Thus Spoke Zarathustra", color: "#1a1008", image: "./images/thus-spoke-zarathustra.jpg" },
	{ label: "Show 5", color: "#1a0d18", image: "" },
	{ label: "Album", color: "#0d1a0d", image: "" },
	{ label: "Show 7", color: "#1a1a0d", image: "" },
];

let carouselCurrent = 0;
const stage = document.getElementById('c-stage');
const infoEl = document.getElementById('c-info');
const dotsEl = document.getElementById('c-dots');
const cards = [];

const positions = [
	{ x: -123, s: 0.5, o: 0.15 },
	{ x: -88, s: 0.65, o: 0.4 },
	{ x: -44, s: 0.8, o: 0.65 },
	{ x: 0, s: 1.0, o: 1.0 },
	{ x: 44, s: 0.8, o: 0.65 },
	{ x: 88, s: 0.65, o: 0.4 },
	{ x: 123, s: 0.5, o: 0.15 },
];

carouselItems.forEach((item, i) => {
	const card = document.createElement('div');
	card.className = 'c-card';
	card.innerHTML = `<div class="c-card-inner" style="background:linear-gradient(180deg,${item.color} 0%,#060c08 100%);${item.image ? `background-image:url(${item.image});background-size:cover;background-position:center;` : ''}">${item.image ? '' : item.label}</div>`;
	card.addEventListener('click', () => { carouselCurrent = i; carouselRender(); });
	stage.appendChild(card);
	cards.push(card);

	const dot = document.createElement('div');
	dot.className = 'c-dot';
	dot.addEventListener('click', () => { carouselCurrent = i; carouselRender(); });
	dotsEl.appendChild(dot);
});

/* where a card sits at slot f (0 = far left, 3 = centre, 6 = far right).
   f can be a fraction, so cards glide smoothly between slots while dragging. */
function carouselSlot(f) {
	const at = k => k < 0 ? { x: -150, s: 0.4, o: 0 } : k > 6 ? { x: 150, s: 0.4, o: 0 } : positions[k];
	const lo = Math.floor(f), t = f - lo, a = at(lo), b = at(lo + 1);
	return { x: a.x + (b.x - a.x) * t, s: a.s + (b.s - a.s) * t, o: a.o + (b.o - a.o) * t };
}

/* pos is which item is centred. Normally a whole number (carouselCurrent);
   while dragging it is a fraction, e.g. 1.4 = partway between items 1 and 2. */
function carouselRender(pos = carouselCurrent) {
	const dots = dotsEl.querySelectorAll('.c-dot');
	const n = carouselItems.length;
	cards.forEach((card, i) => {
		const offset = (((i - pos + n / 2) % n) + n) % n - n / 2;   // distance from centre, wrapped around
		const p = carouselSlot(offset + 3);
		const lift = 8 * Math.max(0, 1 - Math.abs(offset));
		card.style.transform = `translateX(${p.x}px) translateY(${-lift}px) scale(${p.s})`;
		card.style.opacity = p.o;
		card.style.zIndex = Math.round(p.s * 100);
		card.style.pointerEvents = p.o < 0.05 ? 'none' : 'auto';
		card.className = 'c-card' + (Math.abs(offset) < 0.5 ? ' cc' : '');
	});
	const nearest = ((Math.round(pos) % n) + n) % n;
	dots.forEach((d, i) => d.classList.toggle('on', i === nearest));
	infoEl.textContent = carouselItems[nearest].label;
}

carouselRender();



const galleryItems = [
	{ caption: "justin — jun 2026", color: "#0d3020" },
	{ caption: "kiss-shot 1/7 scale", color: "#0d1a2a" },
	{ caption: "dark cinematic fit", color: "#1a0d18" },
	{ caption: "aesthetic", color: "#1a1008" },
	{ caption: "figure shelf", color: "#0a1a10" },
];

let galleryCurrent = 0;
const gSlides = document.getElementById('g-slides');
const gDotsEl = document.getElementById('g-dots');
const gCounter = document.getElementById('g-counter');
const gCaptionText = document.getElementById('g-caption-text');
const gPrev = document.getElementById('g-prev');
const gNext = document.getElementById('g-next');
const gSlideEls = [];

galleryItems.forEach((item, i) => {
	const slide = document.createElement('div');
	slide.className = 'g-slide' + (i === 0 ? ' active' : '');
	slide.style.background = `linear-gradient(135deg, ${item.color} 0%, #060c08 100%)`;
	slide.textContent = item.caption;
	gSlides.appendChild(slide);
	gSlideEls.push(slide);

	const dot = document.createElement('div');
	dot.className = 'g-dot' + (i === 0 ? ' on' : '');
	dot.addEventListener('click', () => galleryGoTo(i));
	gDotsEl.appendChild(dot);
});

gCaptionText.textContent = galleryItems[0].caption;
gCounter.textContent = `1 / ${galleryItems.length}`;

function galleryGoTo(i) {
	gSlideEls[galleryCurrent].classList.remove('active');
	gDotsEl.querySelectorAll('.g-dot')[galleryCurrent].classList.remove('on');
	galleryCurrent = (i + gSlideEls.length) % gSlideEls.length;
	gSlideEls[galleryCurrent].classList.add('active');
	gDotsEl.querySelectorAll('.g-dot')[galleryCurrent].classList.add('on');
	gCounter.textContent = `${galleryCurrent + 1} / ${gSlideEls.length}`;
	gCaptionText.textContent = galleryItems[galleryCurrent].caption;
}

gPrev.addEventListener('click', () => galleryGoTo(galleryCurrent - 1));
gNext.addEventListener('click', () => galleryGoTo(galleryCurrent + 1));

/* --- drag with the mouse or a finger, in real time ---------------------
   addDrag(element, { start, move, end })
     start()        runs once when a sideways drag begins (return false to refuse it)
     move(dx)       runs continuously; dx = how far the pointer has moved, in px
     end(dx, speed) runs on release; speed is px per millisecond (negative = leftwards) */
function addDrag(el, handlers) {
	let x0 = null, y0 = 0, active = false, moved = false, lastX = 0, lastT = 0, speed = 0;
	el.classList.add('swipeable');
	el.addEventListener('pointerdown', e => {
		if (e.pointerType === 'mouse' && e.button !== 0) return;
		if (e.target.closest('button, .g-arrow, .g-dot, .c-dot')) return;
		x0 = e.clientX; y0 = e.clientY; active = false; moved = false;
		lastX = x0; lastT = e.timeStamp; speed = 0;
	});
	window.addEventListener('pointermove', e => {
		if (x0 === null) return;
		const dx = e.clientX - x0, dy = e.clientY - y0;
		if (!active) {
			if (Math.abs(dx) < 6) return;
			if (Math.abs(dy) > Math.abs(dx)) { x0 = null; return; }   // it's a scroll, not a drag
			if (handlers.start && handlers.start() === false) { x0 = null; return; }
			active = true; moved = true;
			el.classList.add('grabbing');
		}
		const dt = e.timeStamp - lastT;
		if (dt > 0) speed = 0.7 * ((e.clientX - lastX) / dt) + 0.3 * speed;
		speed = Math.max(-3, Math.min(3, speed));
		lastX = e.clientX; lastT = e.timeStamp;
		handlers.move(dx);
	});
	function finish(e) {
		if (x0 === null) return;
		const dx = e.clientX - x0;
		x0 = null;
		if (!active) return;
		active = false;
		el.classList.remove('grabbing');
		if (e.timeStamp - lastT > 80) speed = 0;   // paused before letting go
		handlers.end(dx, speed);
		setTimeout(() => { moved = false; }, 50);
	}
	window.addEventListener('pointerup', finish);
	window.addEventListener('pointercancel', finish);
	// a drag should not also count as a click on whatever was under it
	el.addEventListener('click', e => {
		if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; }
	}, true);
	el.addEventListener('dragstart', e => e.preventDefault());
}

/* carousel: the cards follow the pointer; on release the nearest card snaps to the centre */
const CAROUSEL_DRAG_STEP = 55;   // px of dragging that moves the carousel by one card
let carouselDragFrom = 0;
addDrag(document.querySelector('.carousel-widget'), {
	start() { carouselDragFrom = carouselCurrent; stage.classList.add('dragging'); },
	move(dx) { carouselRender(carouselDragFrom - dx / CAROUSEL_DRAG_STEP); },
	end(dx) {
		const n = carouselItems.length;
		const landing = carouselDragFrom - dx / CAROUSEL_DRAG_STEP;   // whichever card is nearest the centre wins
		carouselCurrent = ((Math.round(landing) % n) + n) % n;
		stage.classList.remove('dragging');
		carouselRender();
	},
});

/* gallery: the photo slides with the pointer and the next one follows it in */
let galleryDragBusy = false;
let galleryNeighbour = null;
addDrag(document.querySelector('.gallery-widget'), {
	start() {
		if (galleryDragBusy || gSlideEls.length < 2) return false;
		gSlides.classList.add('dragging');
	},
	move(dx) {
		const n = gSlideEls.length, w = gSlides.clientWidth, dir = dx < 0 ? 1 : -1;
		const ni = (galleryCurrent + dir + n) % n;
		if (galleryNeighbour !== null && galleryNeighbour !== ni) {
			gSlideEls[galleryNeighbour].style.opacity = '';
			gSlideEls[galleryNeighbour].style.transform = '';
		}
		galleryNeighbour = ni;
		gSlideEls[galleryCurrent].style.transform = `translateX(${dx}px)`;
		gSlideEls[ni].style.opacity = 1;
		gSlideEls[ni].style.transform = `translateX(${dx + dir * w}px)`;
	},
	end(dx, speed) {
		const w = gSlides.clientWidth, dir = dx < 0 ? 1 : -1;
		const flicked = Math.abs(speed) > 0.5 && Math.sign(speed) === Math.sign(dx);
		const go = Math.abs(dx) > w * 0.25 || flicked;
		const cur = gSlideEls[galleryCurrent], nb = gSlideEls[galleryNeighbour];
		galleryDragBusy = true;
		gSlides.classList.remove('dragging');
		gSlides.classList.add('settling');
		cur.style.transform = go ? `translateX(${-dir * w}px)` : 'translateX(0)';
		nb.style.transform = go ? 'translateX(0)' : `translateX(${dir * w}px)`;
		setTimeout(() => {
			gSlides.classList.add('dragging');   // no animation while we tidy up
			gSlides.classList.remove('settling');
			if (go) galleryGoTo(galleryCurrent + dir);
			[cur, nb].forEach(el => { el.style.transform = ''; el.style.opacity = ''; });
			void gSlides.offsetWidth;
			gSlides.classList.remove('dragging');
			galleryNeighbour = null;
			galleryDragBusy = false;
		}, 260);
	},
});

/* --- phones: tap to show what hovering shows on a computer, tap again to hide --- */
if (window.matchMedia('(hover: none)').matches) {
	const completedCards = document.querySelectorAll('.completed-card');
	completedCards.forEach(card => {
		card.addEventListener('click', () => {
			const wasOn = card.classList.contains('on');
			completedCards.forEach(c => c.classList.remove('on'));
			if (!wasOn) card.classList.add('on');
		});
	});

	const galleryWidget = document.querySelector('.gallery-widget');
	galleryWidget.addEventListener('click', e => {
		if (e.target.closest('.g-arrow, .g-dot')) return;
		galleryWidget.classList.toggle('on');
	});
}
