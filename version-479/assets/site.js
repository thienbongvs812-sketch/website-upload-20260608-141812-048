import { H as Hls } from './hls.js';

const ready = (callback) => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
        callback();
    }
};

const normalize = (value) => (value || '').toString().trim().toLowerCase();

function initNavigation() {
    const toggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    if (!toggle || !mobileNav) return;
    toggle.addEventListener('click', () => {
        const open = !mobileNav.classList.contains('is-open');
        mobileNav.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
}

function initHero() {
    const root = document.querySelector('[data-hero]');
    if (!root) return;
    const slides = [...root.querySelectorAll('.hero-slide')];
    const dots = [...root.querySelectorAll('[data-hero-dot]')];
    const prev = root.querySelector('[data-hero-prev]');
    const next = root.querySelector('[data-hero-next]');
    if (slides.length <= 1) return;
    let index = 0;
    let timer;
    const activate = (nextIndex) => {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
        dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    };
    const start = () => {
        clearInterval(timer);
        timer = setInterval(() => activate(index + 1), 5200);
    };
    dots.forEach((dot, i) => dot.addEventListener('click', () => {
        activate(i);
        start();
    }));
    prev?.addEventListener('click', () => {
        activate(index - 1);
        start();
    });
    next?.addEventListener('click', () => {
        activate(index + 1);
        start();
    });
    start();
}

function yearMatches(option, yearValue) {
    if (!option || option === '全部年份') return true;
    const year = parseInt(yearValue, 10);
    if (!Number.isFinite(year)) return false;
    if (option === '2010-2019') return year >= 2010 && year <= 2019;
    if (option === '2000-2009') return year >= 2000 && year <= 2009;
    if (option === '更早') return year < 2000;
    return year === parseInt(option, 10);
}

function initFilters() {
    const grid = document.querySelector('[data-card-grid]');
    const cards = [...document.querySelectorAll('.movie-card')];
    const input = document.querySelector('.filter-input');
    const yearSelect = document.querySelector('[data-filter-year]');
    const typeSelect = document.querySelector('[data-filter-type]');
    const regionSelect = document.querySelector('[data-filter-region]');
    const empty = document.querySelector('[data-empty-state]');
    if (!grid || !cards.length) return;
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q');
    if (input && initialQuery) input.value = initialQuery;
    const apply = () => {
        const query = normalize(input?.value);
        const type = typeSelect?.value || '全部类型';
        const region = regionSelect?.value || '全部地区';
        const year = yearSelect?.value || '全部年份';
        let visible = 0;
        cards.forEach((card) => {
            const text = normalize(card.dataset.search);
            const cardType = card.dataset.type || '';
            const cardRegion = card.dataset.region || '';
            const cardYear = card.dataset.year || '';
            const okQuery = !query || text.includes(query);
            const okType = type === '全部类型' || cardType.includes(type);
            const okRegion = region === '全部地区' || cardRegion.includes(region);
            const okYear = yearMatches(year, cardYear);
            const show = okQuery && okType && okRegion && okYear;
            card.hidden = !show;
            if (show) visible += 1;
        });
        if (empty) empty.hidden = visible !== 0;
    };
    input?.addEventListener('input', apply);
    yearSelect?.addEventListener('change', apply);
    typeSelect?.addEventListener('change', apply);
    regionSelect?.addEventListener('change', apply);
    apply();
}

function initSearchForms() {
    document.querySelectorAll('[data-search-form]').forEach((form) => {
        form.addEventListener('submit', (event) => {
            const input = form.querySelector('input[name="q"]');
            if (!input) return;
            event.preventDefault();
            const query = input.value.trim();
            const url = new URL(form.getAttribute('action') || './search.html', window.location.href);
            if (query) url.searchParams.set('q', query);
            window.location.href = url.pathname.split('/').pop() + url.search;
        });
    });
}

export function setupMoviePlayer(streamUrl) {
    const video = document.getElementById('movie-player');
    const overlay = document.getElementById('player-overlay');
    if (!video || !streamUrl) return;
    let started = false;
    let hls;
    const start = async () => {
        if (!started) {
            started = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else if (Hls && Hls.isSupported()) {
                hls = new Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }
        overlay?.classList.add('is-hidden');
        video.controls = true;
        try {
            await video.play();
        } catch (error) {
            overlay?.classList.remove('is-hidden');
        }
    };
    overlay?.addEventListener('click', start);
    video.addEventListener('click', () => {
        if (!started || video.paused) start();
    });
    window.addEventListener('pagehide', () => {
        if (hls) hls.destroy();
    }, { once: true });
}

ready(() => {
    initNavigation();
    initHero();
    initFilters();
    initSearchForms();
});
