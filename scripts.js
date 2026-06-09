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

function carouselRender() {
	const dots = dotsEl.querySelectorAll('.c-dot');
	cards.forEach((card, i) => {
		let offset = i - carouselCurrent;
		const n = carouselItems.length;
		if (offset > n / 2) offset -= n;
		if (offset < -n / 2) offset += n;
		const idx = offset + 3;
		if (idx < 0 || idx > 6) {
			card.style.opacity = 0;
			card.style.pointerEvents = 'none';
			return;
		}
		const p = positions[idx];
		card.style.transform = `translateX(${p.x}px) translateY(${idx === 3 ? -8 : 0}px) scale(${p.s})`;
		card.style.opacity = p.o;
		card.style.zIndex = Math.round(p.s * 10);
		card.style.pointerEvents = 'auto';
		card.className = 'c-card' + (idx === 3 ? ' cc' : '');
	});
	dots.forEach((d, i) => d.classList.toggle('on', i === carouselCurrent));
	infoEl.textContent = carouselItems[carouselCurrent].label;
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