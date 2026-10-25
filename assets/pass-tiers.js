// Pass tiers: single source of truth for ticket prices and dates, shared by
// index.html and passes.html. Change a price or date here only — never in the HTML.
// Tiers switch automatically at midnight Philippines time (UTC+8) on each start
// date, so the price cards, countdown and "Active" badge always show the live tier.
const PASS_TIERS = [
    { name: 'Paradise Pioneer Pass',      start: '2026-07-01', end: '2026-09-30', full: 150, performer: 130, party: 120 },
    { name: 'Island Insider Pass',        start: '2026-10-01', end: '2026-11-30', full: 170, performer: 150, party: 140 },
    { name: 'Fiesta Fever Pass',          start: '2026-12-01', end: '2027-01-31', full: 190, performer: 170, party: 160 },
    { name: 'Paradise Countdown Pass',    start: '2027-02-01', end: '2027-04-30', full: 210, performer: 190, party: 180 },
    { name: 'Last Call to Paradise Pass', start: '2027-05-01', end: '2027-05-04', full: 220, performer: 200, party: 190 },
];

(function () {
    const DAY_MS = 24 * 60 * 60 * 1000;
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Midnight Philippines time at the start of a 'YYYY-MM-DD' date
    const manilaMidnight = isoDate => Date.parse(isoDate + 'T00:00:00+08:00');
    const tierStart = tier => manilaMidnight(tier.start);
    const tierEnd = tier => manilaMidnight(tier.end) + DAY_MS; // end date is inclusive

    function formatDate(isoDate, withYear = true) {
        const [year, month, day] = isoDate.split('-').map(Number);
        return MONTHS[month - 1] + ' ' + day + (withYear ? ', ' + year : '');
    }

    function formatRange(tier) {
        const sameYear = tier.start.slice(0, 4) === tier.end.slice(0, 4);
        return formatDate(tier.start, !sameYear) + ' - ' + formatDate(tier.end);
    }

    // Index of the tier on sale at `now`, or -1 once the last tier has ended
    function currentTierIndex(now) {
        if (now < tierStart(PASS_TIERS[0])) return 0;
        return PASS_TIERS.findIndex(tier => now >= tierStart(tier) && now < tierEnd(tier));
    }

    function renderCards(tier) {
        document.querySelectorAll('[data-tier-price]').forEach(el => {
            el.textContent = '$' + tier[el.dataset.tierPrice];
        });
        document.querySelectorAll('[data-tier-name]').forEach(el => { el.textContent = tier.name; });
        document.querySelectorAll('[data-tier-dates]').forEach(el => { el.textContent = formatRange(tier); });
    }

    function renderCountdownLabel(index) {
        const label = document.getElementById('countdown-label');
        if (!label) return;
        if (index === -1) {
            label.classList.add('hidden');
            document.getElementById('countdown-timer').innerHTML = "<div class='text-brand-gold font-bold bg-brand-card/80 px-6 py-3 rounded-lg border border-brand-gold/30'>Online pre-sale has ended. See you in Boracay!</div>";
        } else if (index === PASS_TIERS.length - 1) {
            label.textContent = 'Online pre-sale ends in:';
        } else {
            label.querySelectorAll('[data-tier-next-name]').forEach(el => { el.textContent = PASS_TIERS[index + 1].name; });
        }
    }

    // Passes page only: the full tier schedule with the live tier marked Active
    function renderTable(index) {
        const tbody = document.getElementById('pass-tiers-body');
        if (!tbody) return;
        tbody.innerHTML = PASS_TIERS.map((tier, i) => {
            const isActive = i === index;
            const isPast = index === -1 || i < index;
            const rowClass = (i < PASS_TIERS.length - 1 ? 'border-b border-white/5 ' : '') + 'hover:bg-white/[0.02] transition-colors' + (isPast ? ' opacity-40' : '');
            const nameCell = isActive
                ? '<td class="px-6 py-4 font-medium text-brand-light flex items-center gap-2">' + tier.name + '<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-brand-gold/20 text-brand-gold ml-2 border border-brand-gold/30">Active</span></td>'
                : '<td class="px-6 py-4 font-medium">' + tier.name + '</td>';
            const priceClass = 'px-6 py-4 text-center font-serif' + (isActive ? ' text-white' : '');
            return '<tr class="' + rowClass + '">' + nameCell +
                '<td class="px-6 py-4">' + formatDate(tier.start) + '</td>' +
                '<td class="px-6 py-4">' + formatDate(tier.end) + '</td>' +
                '<td class="' + priceClass + '">$' + tier.full + '</td>' +
                '<td class="' + priceClass + '">$' + tier.performer + '</td>' +
                '<td class="' + priceClass + '">$' + tier.party + '</td></tr>';
        }).join('');
    }

    function renderTier(index) {
        // After the last tier ends, keep its prices on the cards but mark nothing Active
        renderCards(PASS_TIERS[index === -1 ? PASS_TIERS.length - 1 : index]);
        renderCountdownLabel(index);
        renderTable(index);
    }

    function setUnit(id, value) {
        document.getElementById(id).innerText = Math.floor(value).toString().padStart(2, '0');
    }

    // Re-check the tier every second so an open page rolls over the moment a tier ends
    let shownIndex = null;
    function tick() {
        const now = Date.now();
        const index = currentTierIndex(now);
        if (index !== shownIndex) {
            shownIndex = index;
            renderTier(index);
        }
        if (index === -1) {
            clearInterval(timer);
            return;
        }

        const distance = tierEnd(PASS_TIERS[index]) - now;
        setUnit('days', distance / DAY_MS);
        setUnit('hours', (distance % DAY_MS) / (1000 * 60 * 60));
        setUnit('minutes', (distance % (1000 * 60 * 60)) / (1000 * 60));
        setUnit('seconds', (distance % (1000 * 60)) / 1000);
    }

    const timer = setInterval(tick, 1000);
    tick();
})();
