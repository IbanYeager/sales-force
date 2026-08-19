/**
 * Toyota Voice Assistant & Smart Audio Guide
 * Tunas Toyota Kiara Condong - Customer POV
 */

(function () {
    'use strict';

    // Prevent multiple initializations
    if (window.__toyotaVoiceAssistantLoaded) return;
    window.__toyotaVoiceAssistantLoaded = true;

    class ToyotaVoiceAssistant {
        constructor() {
            this.isListening = false;
            this.recognition = null;
            this.synth = window.speechSynthesis || null;
            this.initRecognition();
            this.injectUI();
        }

        initRecognition() {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                console.log('Web Speech API not supported on this browser.');
                return;
            }

            try {
                this.recognition = new SpeechRecognition();
                this.recognition.lang = 'id-ID';
                this.recognition.continuous = false;
                this.recognition.interimResults = false;

                this.recognition.onstart = () => {
                    this.isListening = true;
                    this.updateUIState(true);
                };

                this.recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript.toLowerCase();
                    this.handleVoiceCommand(transcript);
                };

                this.recognition.onerror = (event) => {
                    console.warn('Voice recognition error:', event.error);
                    this.isListening = false;
                    this.updateUIState(false);
                };

                this.recognition.onend = () => {
                    this.isListening = false;
                    this.updateUIState(false);
                };
            } catch (e) {
                console.warn('Speech recognition init failed:', e);
            }
        }

        injectUI() {
            if (document.getElementById('toyota-voice-assistant-fab')) return;

            // Only inject on interactive pages
            const fab = document.createElement('div');
            fab.id = 'toyota-voice-assistant-fab';
            fab.style.cssText = `
                position: fixed;
                bottom: 85px;
                right: 18px;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: linear-gradient(135deg, #CC0000, #990000);
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 14px rgba(204, 0, 0, 0.35);
                z-index: 999;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            `;
            fab.title = 'Asisten Suara Toyota';
            fab.innerHTML = `<i class="fa-solid fa-microphone" style="font-size: 1.1rem;"></i>`;

            fab.addEventListener('click', () => this.toggleListening());
            document.body.appendChild(fab);
        }

        toggleListening() {
            if (!this.recognition) {
                this.speak('Maaf, browser Anda belum mendukung pengenalan suara.');
                return;
            }

            if (this.isListening) {
                this.recognition.stop();
            } else {
                try {
                    this.recognition.start();
                } catch (err) {
                    console.warn(err);
                }
            }
        }

        updateUIState(listening) {
            const fab = document.getElementById('toyota-voice-assistant-fab');
            if (!fab) return;

            if (listening) {
                fab.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                fab.style.transform = 'scale(1.1)';
                fab.innerHTML = `<i class="fa-solid fa-waveform-lines fa-fade" style="font-size: 1.2rem;"></i>`;
            } else {
                fab.style.background = 'linear-gradient(135deg, #CC0000, #990000)';
                fab.style.transform = 'scale(1)';
                fab.innerHTML = `<i class="fa-solid fa-microphone" style="font-size: 1.1rem;"></i>`;
            }
        }

        speak(text) {
            if (!this.synth) return;
            this.synth.cancel();
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = 'id-ID';
            utter.rate = 1.0;
            this.synth.speak(utter);
        }

        handleVoiceCommand(cmd) {
            console.log('Perintah suara:', cmd);

            if (cmd.includes('katalog') || cmd.includes('mobil') || cmd.includes('daftar harga') || cmd.includes('pricelist')) {
                this.speak('Membuka katalog mobil Toyota.');
                window.location.href = 'mobil.html';
            } else if (cmd.includes('kredit') || cmd.includes('kalkulator') || cmd.includes('cicilan') || cmd.includes('simulasi')) {
                this.speak('Membuka kalkulator kredit.');
                window.location.href = 'kalkulator.html';
            } else if (cmd.includes('servis') || cmd.includes('booking') || cmd.includes('bengkel')) {
                this.speak('Membuka jadwal booking servis.');
                window.location.href = 'service.html';
            } else if (cmd.includes('tracking') || cmd.includes('lacak') || cmd.includes('pesanan') || cmd.includes('spk')) {
                this.speak('Membuka live tracking pengiriman mobil.');
                window.location.href = 'tracking.html';
            } else if (cmd.includes('lounge') || cmd.includes('minum') || cmd.includes('kopi') || cmd.includes('menu')) {
                this.speak('Membuka menu pesanan Customer Lounge.');
                window.location.href = 'minuman.html';
            } else if (cmd.includes('tukar tambah') || cmd.includes('trade in') || cmd.includes('jual mobil')) {
                this.speak('Membuka taksasi Trade-in.');
                window.location.href = 'tradein.html';
            } else if (cmd.includes('promo') || cmd.includes('diskon')) {
                this.speak('Membuka halaman promo.');
                window.location.href = 'promo.html';
            } else if (cmd.includes('beranda') || cmd.includes('home') || cmd.includes('menu utama')) {
                this.speak('Kembali ke beranda.');
                window.location.href = 'index.html';
            } else {
                this.speak(`Mencari informasi tentang ${cmd}`);
                if (window.location.pathname.includes('mobil.html') && typeof window.filterMobil === 'function') {
                    const searchInput = document.getElementById('searchMobil');
                    if (searchInput) {
                        searchInput.value = cmd;
                        searchInput.dispatchEvent(new Event('input'));
                    }
                }
            }
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        window.toyotaVoiceAssistant = new ToyotaVoiceAssistant();
    });
})();
