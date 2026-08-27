/**
 * komparasi.js
 * Radar Chart & Spec Comparison Engine for Car Battle Matrix
 */

const CAR_DATABASE = {
    avanza: {
        name: "Toyota Veloz Q CVT / Avanza G",
        scores: [92, 90, 94, 90, 96], // Safety, Power, BBM, Comfort, Resale
        specs: {
            engine: "106 PS / 137 Nm (Dual VVT-i)",
            fuel: "17.2 KM/L (CVT)",
            safety: "Toyota Safety Sense (TSS 6 Airbags)",
            warranty: "3 Thn / 100k KM + Free Service 3 Thn",
            resale: "Sangat Tinggi (Toyota Resale Value #1)"
        },
        hook: "Toyota Veloz Q CVT memiliki fitur Toyota Safety Sense (TSS) terlengkap, CVT 7-speed halus, & nilai jual kembali (resale value) tertinggi di kelas MPV."
    },
    zenix: {
        name: "Innova Zenix V Hybrid",
        scores: [96, 95, 98, 96, 98],
        specs: {
            engine: "186 PS (Hybrid System Gen-5)",
            fuel: "21.5 KM/L (EV-Mode)",
            safety: "TSS 3.0 + 6 Airbags + Blind Spot",
            warranty: "8 Thn Baterai Hybrid / 160k KM",
            resale: "Sangat Tinggi (Legenda Innova)"
        },
        hook: "Innova Zenix Hybrid menggunakan platform TNGA-C penggerak depan, sangat irit (21.5 km/liter), bebas ganjil genap di titik tertentu, & garansi baterai 8 tahun!"
    },
    yaris_cross: {
        name: "Yaris Cross S GR Hybrid",
        scores: [94, 92, 96, 92, 94],
        specs: {
            engine: "111 PS (Hybrid 2NR-VEX)",
            fuel: "30.3 KM/L (Uji Efisiensi)",
            safety: "TSS + Panoramic Glassroof + Power Backdoor",
            warranty: "8 Thn Baterai Hybrid",
            resale: "Tinggi (Trend Compact Hybrid)"
        },
        hook: "Yaris Cross Hybrid adalah Compact SUV teririt di Indonesia (30+ km/liter) dengan fitur Panoramic Glassroof dan Power Backdoor Kick Sensor di kelasnya!"
    },
    avanza_comp: {
        name: "Xpander Ultimate",
        scores: [78, 80, 80, 88, 86],
        specs: {
            engine: "105 PS / 141 Nm",
            fuel: "14.8 KM/L",
            safety: "ASC + HAS (2 Airbags)",
            warranty: "3 Thn / 100k KM",
            resale: "Tinggi"
        }
    },
    xpander_comp: {
        name: "Stargazer Prime",
        scores: [82, 85, 82, 85, 80],
        specs: {
            engine: "115 PS / 144 Nm",
            fuel: "15.5 KM/L",
            safety: "Smartsense (6 Airbags)",
            warranty: "3 Thn / 50k KM",
            resale: "Sedang"
        }
    },
    hrv_comp: {
        name: "HR-V SE 1.5 CVT",
        scores: [88, 85, 82, 86, 90],
        specs: {
            engine: "121 PS / 145 Nm",
            fuel: "14.5 KM/L",
            safety: "Honda Sensing (4 Airbags)",
            warranty: "3 Thn / 100k KM",
            resale: "Tinggi"
        }
    }
};

let battleChart = null;

document.addEventListener('DOMContentLoaded', () => {
    initRadarChart();
    updateBattleComparison();
});

function initRadarChart() {
    const ctx = document.getElementById('radarBattleChart')?.getContext('2d');
    if (!ctx) return;

    battleChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Keselamatan', 'Performa', 'Hemat BBM', 'Kenyamanan', 'Resale Value'],
            datasets: [
                {
                    label: 'Unit Kita',
                    data: [90, 88, 92, 85, 90],
                    backgroundColor: 'rgba(215, 18, 58, 0.25)',
                    borderColor: '#d7123a',
                    borderWidth: 2.5,
                    pointBackgroundColor: '#d7123a'
                },
                {
                    label: 'Kompetitor',
                    data: [72, 78, 85, 76, 92],
                    backgroundColor: 'rgba(100, 116, 139, 0.15)',
                    borderColor: '#64748b',
                    borderWidth: 2,
                    pointBackgroundColor: '#64748b'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: '#e2e8f0' },
                    grid: { color: '#f1f5f9' },
                    suggestedMin: 50,
                    suggestedMax: 100,
                    ticks: { display: false }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { family: 'Plus Jakarta Sans', weight: '700', size: 12 },
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

function updateBattleComparison() {
    const ourKey = document.getElementById('selectOurCar')?.value || 'avanza';
    const compKey = document.getElementById('selectCompCar')?.value || 'avanza_comp';

    const ourCar = CAR_DATABASE[ourKey];
    const compCar = CAR_DATABASE[compKey];

    if (!ourCar || !compCar) return;

    // Update Radar Chart Data
    if (battleChart) {
        battleChart.data.datasets[0].label = ourCar.name;
        battleChart.data.datasets[0].data = ourCar.scores;

        battleChart.data.datasets[1].label = compCar.name;
        battleChart.data.datasets[1].data = compCar.scores;

        battleChart.update();
    }

    // Update Specs
    document.getElementById('specOurEngine').innerText = ourCar.specs.engine;
    document.getElementById('specCompEngine').innerText = compCar.specs.engine;

    document.getElementById('specOurFuel').innerText = ourCar.specs.fuel;
    document.getElementById('specCompFuel').innerText = compCar.specs.fuel;

    document.getElementById('specOurSafety').innerText = ourCar.specs.safety;
    document.getElementById('specCompSafety').innerText = compCar.specs.safety;

    document.getElementById('specOurWarranty').innerText = ourCar.specs.warranty;
    document.getElementById('specCompWarranty').innerText = compCar.specs.warranty;

    document.getElementById('specOurResale').innerText = ourCar.specs.resale;
    document.getElementById('specCompResale').innerText = compCar.specs.resale;

    // Update Winning Percentage
    const ourTotal = ourCar.scores.reduce((a, b) => a + b, 0);
    const compTotal = compCar.scores.reduce((a, b) => a + b, 0);
    const diffPct = Math.round(((ourTotal - compTotal) / compTotal) * 100);

    const winnerBadge = document.getElementById('winnerBadge');
    if (winnerBadge) {
        if (diffPct >= 0) {
            winnerBadge.className = 'winner-badge';
            winnerBadge.innerHTML = `<i class="fa-solid fa-trophy"></i> Unit Kita Unggul +${diffPct}%`;
        } else {
            winnerBadge.className = 'winner-badge';
            winnerBadge.style.background = '#fef2f2';
            winnerBadge.style.color = '#b91c1c';
            winnerBadge.innerHTML = `<i class="fa-solid fa-scale-balanced"></i> Skor Seimbang (${diffPct}%)`;
        }
    }

    // Update Sales Hook
    const hookBox = document.getElementById('salesHookText');
    if (hookBox && ourCar.hook) {
        hookBox.innerText = ourCar.hook;
    }
}
