const TAX_TABLES = {
  under25: [
    { label: '0 € – 10.000 €', max: 10_000, rates: [0, 0, 0, 0, 0, 0, 0] },
    { label: '10.000,01 € – 20.000 €', max: 20_000, rates: [0, 0, 0, 0, 0, 0, 0] },
    { label: '20.000,01 € – 30.000 €', max: 30_000, rates: [0.26, 0.24, 0.22, 0.2, 0.18, 0.16, 0.14] },
    { label: '30.000,01 € – 40.000 €', max: 40_000, rates: Array(7).fill(0.34) },
    { label: '40.000,01 € – 60.000 €', max: 60_000, rates: Array(7).fill(0.39) },
    { label: '> 60.000 €', max: Infinity, rates: Array(7).fill(0.44) }
  ],
  age26to30: [
    { label: '0 € – 10.000 €', max: 10_000, rates: [0.09, 0.09, 0.09, 0.09, 0, 0, 0] },
    { label: '10.000,01 € – 20.000 €', max: 20_000, rates: [0.09, 0.09, 0.09, 0.09, 0, 0, 0] },
    { label: '20.000,01 € – 30.000 €', max: 30_000, rates: [0.26, 0.24, 0.22, 0.2, 0.18, 0.16, 0.14] },
    { label: '30.000,01 € – 40.000 €', max: 40_000, rates: Array(7).fill(0.34) },
    { label: '40.000,01 € – 60.000 €', max: 60_000, rates: Array(7).fill(0.39) },
    { label: '> 60.000 €', max: Infinity, rates: Array(7).fill(0.44) }
  ],
  over30: [
    { label: '0 € – 10.000 €', max: 10_000, rates: [0.09, 0.09, 0.09, 0.09, 0, 0, 0] },
    { label: '10.000,01 € – 20.000 €', max: 20_000, rates: [0.2, 0.18, 0.16, 0.09, 0, 0, 0] },
    { label: '20.000,01 € – 30.000 €', max: 30_000, rates: [0.26, 0.24, 0.22, 0.2, 0.18, 0.16, 0.14] },
    { label: '30.000,01 € – 40.000 €', max: 40_000, rates: Array(7).fill(0.34) },
    { label: '40.000,01 € – 60.000 €', max: 60_000, rates: Array(7).fill(0.39) },
    { label: '> 60.000 €', max: Infinity, rates: Array(7).fill(0.44) }
  ]
};

const form = document.getElementById('tax-form');
const resetBtn = document.getElementById('reset');
const resultsSection = document.getElementById('results');
const totalTaxEl = document.getElementById('total-tax');
const effectiveRateEl = document.getElementById('effective-rate');
const breakdownBody = document.getElementById('breakdown');

function clampChildren(children) {
  if (Number.isNaN(children) || children < 0) return 0;
  return Math.min(Math.floor(children), 6);
}

function determineAgeGroup(age) {
  if (age <= 25) return 'under25';
  if (age <= 30) return 'age26to30';
  return 'over30';
}

function calculateTax({ income, age, children }) {
  const ageGroup = determineAgeGroup(age);
  const brackets = TAX_TABLES[ageGroup];
  const childIndex = clampChildren(children);
  const breakdown = [];
  let remainingIncome = income;
  let lowerBound = 0;
  let totalTax = 0;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;

    const upperBound = bracket.max;
    const taxableAmount = Math.min(remainingIncome, upperBound === Infinity ? remainingIncome : upperBound - lowerBound);
    const rate = bracket.rates[childIndex];
    const taxForBracket = taxableAmount * rate;

    breakdown.push({
      label: bracket.label,
      rate,
      taxableAmount,
      taxForBracket
    });

    totalTax += taxForBracket;
    remainingIncome -= taxableAmount;
    lowerBound = upperBound;
  }

  return { ageGroup, childIndex, breakdown, totalTax };
}

function formatCurrency(value) {
  return value.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' });
}

function formatPercentage(value) {
  return (value * 100).toFixed(2).replace('.', ',') + ' %';
}

function renderBreakdown(breakdown) {
  breakdownBody.innerHTML = '';

  breakdown.forEach((row) => {
    const tr = document.createElement('tr');

    const rateCell = `${formatPercentage(row.rate)}`;
    const incomeCell = row.taxableAmount === 0 ? '—' : formatCurrency(row.taxableAmount);
    const taxCell = row.taxableAmount === 0 ? '—' : formatCurrency(row.taxForBracket);

    tr.innerHTML = `
      <td>${row.label}</td>
      <td>${rateCell}</td>
      <td>${incomeCell}</td>
      <td>${taxCell}</td>
    `;

    breakdownBody.appendChild(tr);
  });
}

function handleSubmit(event) {
  event.preventDefault();

  const income = Number(document.getElementById('income').value);
  const age = Number(document.getElementById('age').value);
  const children = Number(document.getElementById('children').value);

  if (income < 0 || Number.isNaN(income) || Number.isNaN(age) || age < 0) {
    alert('Παρακαλώ εισαγάγετε έγκυρες τιμές.');
    return;
  }

  const { breakdown, totalTax } = calculateTax({ income, age, children });
  const effectiveRate = income === 0 ? 0 : totalTax / income;

  totalTaxEl.textContent = formatCurrency(totalTax);
  effectiveRateEl.textContent = formatPercentage(effectiveRate);
  renderBreakdown(breakdown);

  resultsSection.classList.remove('hidden');
}

function handleReset() {
  form.reset();
  breakdownBody.innerHTML = '';
  totalTaxEl.textContent = '–';
  effectiveRateEl.textContent = '–';
  resultsSection.classList.add('hidden');
}

form.addEventListener('submit', handleSubmit);
resetBtn.addEventListener('click', handleReset);

// Υπολογισμός σε πραγματικό χρόνο για βελτιωμένη εμπειρία χρήσης
['income', 'age', 'children'].forEach((id) => {
  document.getElementById(id).addEventListener('input', () => {
    if (!form.reportValidity()) {
      return;
    }

    const income = Number(document.getElementById('income').value);
    const age = Number(document.getElementById('age').value);
    const children = Number(document.getElementById('children').value);

    if (income >= 0 && age >= 0) {
      const { breakdown, totalTax } = calculateTax({ income, age, children });
      const effectiveRate = income === 0 ? 0 : totalTax / income;

      totalTaxEl.textContent = formatCurrency(totalTax);
      effectiveRateEl.textContent = formatPercentage(effectiveRate);
      renderBreakdown(breakdown);
      resultsSection.classList.remove('hidden');
    }
  });
});
