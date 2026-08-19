<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales App - AI Sales Copilot</title>
    <meta name="description" content="Asisten Pintar Sales & Handler Keberatan Konsumen Berbasis AI">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css?v=5.0" />
    <script src="../js/sidebar_desktop.js"></script>
    <link rel="manifest" href="../manifest.json">
    <meta name="theme-color" content="#0d1b3e">
    <style>
        .copilot-hero {
            background: linear-gradient(135deg, #0d1b3e 0%, #16305f 50%, #20458a 100%);
            border-radius: var(--radius-lg, 16px);
            padding: 20px;
            color: #fff;
            margin-bottom: 20px;
            box-shadow: 0 10px 25px rgba(13, 27, 62, 0.25);
            position: relative;
            overflow: hidden;
        }

        .copilot-hero::after {
            content: '';
            position: absolute;
            top: -50px;
            right: -50px;
            width: 150px;
            height: 150px;
            background: radial-gradient(circle, rgba(215, 18, 58, 0.35) 0%, transparent 70%);
            border-radius: 50%;
        }

        .badge-ai {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(8px);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            color: #ffd700;
            border: 1px solid rgba(255, 255, 255, 0.2);
            margin-bottom: 8px;
        }

        .tab-nav {
            display: flex;
            background: #eef2f7;
            padding: 4px;
            border-radius: var(--radius-md, 14px);
            margin-bottom: 20px;
            gap: 4px;
        }

        .tab-btn {
            flex: 1;
            padding: 10px 12px;
            border-radius: var(--radius-sm, 10px);
            border: none;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
            background: transparent;
            color: var(--text-secondary, #475569);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }

        .tab-btn.active {
            background: #ffffff;
            color: var(--primary-blue, #0d1b3e);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .objection-chip {
            padding: 12px 16px;
            background: #ffffff;
            border: 1.5px solid var(--border-color, #e2e8f0);
            border-radius: 12px;
            font-size: 13px;
            font-weight: 600;
            color: var(--text-dark, #1e293b);
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .objection-chip:hover,
        .objection-chip.active {
            border-color: var(--primary-red, #d7123a);
            background: rgba(215, 18, 58, 0.04);
            color: var(--primary-red, #d7123a);
        }

        .response-card {
            background: #ffffff;
            border-radius: var(--radius-lg, 16px);
            padding: 20px;
            border: 1px solid var(--border-color, #e2e8f0);
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
            margin-top: 16px;
        }

        .style-pill {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            border: 1px solid var(--border-color, #cbd5e1);
            background: #f8fafc;
            color: #64748b;
        }

        .style-pill.active {
            background: var(--primary-blue, #0d1b3e);
            color: #ffffff;
            border-color: var(--primary-blue);
        }

        .chat-bubble {
            padding: 12px 16px;
            border-radius: 16px;
            margin-bottom: 12px;
            max-width: 85%;
            font-size: 13.5px;
            line-height: 1.5;
        }

        .chat-user {
            background: var(--primary-blue, #0d1b3e);
            color: #ffffff;
            margin-left: auto;
            border-bottom-right-radius: 4px;
        }

        .chat-ai {
            background: #ffffff;
            color: #1e293b;
            border: 1px solid #e2e8f0;
            border-bottom-left-radius: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
    </style>
</head>

<body>
    <div class="mobile-app">
        <header class="header-page">
            <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
            <h2>AI Sales Copilot</h2>
        </header>

        <div class="container" style="margin-top: 0;">

            <!-- Hero AI Banner -->
            <div class="copilot-hero">
                <div class="badge-ai">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> AI POWERED ASSISTANT
                </div>
                <h3 style="margin:0 0 6px 0; font-size: 18px; font-weight:800;">Smart Sales Pitch & Objection AI</h3>
                <p style="margin:0; font-size: 12.5px; opacity:0.9; line-height: 1.4;">
                    Asisten AI instan untuk membantu Anda mengatasi keberatan konsumen, menyusun penawaran persuasi, dan
                    meningkatkan angka closing.
                </p>
            </div>

            <!-- Tab Navigasi -->
            <div class="tab-nav">
                <button type="button" id="tabObjection" class="tab-btn active" onclick="switchCopilotTab('objection')">
                    <i class="fa-solid fa-shield-halved"></i> Objection Handler
                </button>
                <button type="button" id="tabPitch" class="tab-btn" onclick="switchCopilotTab('pitch')">
                    <i class="fa-solid fa-bullhorn"></i> Smart Pitch
                </button>
                <button type="button" id="tabChat" class="tab-btn" onclick="switchCopilotTab('chat')">
                    <i class="fa-solid fa-comments"></i> Tanya AI
                </button>
            </div>

            <!-- ══════════════ TAB 1: OBJECTION HANDLER ══════════════ -->
            <div id="contentObjection">
                <div class="form-group" style="margin-bottom: 12px;">
                    <label style="font-weight: 700; font-size: 13px; color: var(--text-dark);">Pilih Keberatan Konsumen
                        Saat Ini:</label>
                </div>

                <div style="display: flex; flex-direction: column; gap: 8px;" id="objectionList">
                    <!-- Populated dynamically via JS -->
                </div>

                <!-- Response Box -->
                <div class="response-card" id="responseCard" style="display: none;">
                    <div
                        style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                        <span
                            style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: var(--primary-red); letter-spacing: 0.5px;">
                            <i class="fa-solid fa-bolt"></i> Rekomendasi Respon Sales
                        </span>
                        <button type="button" onclick="copyCopilotScript()" class="btn-sm"
                            style="background: var(--bg-color); border: 1px solid var(--border-color); padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer;">
                            <i class="fa-regular fa-copy"></i> Salin
                        </button>
                    </div>

                    <!-- Style Pills -->
                    <div style="display: flex; gap: 6px; margin-bottom: 14px;">
                        <button class="style-pill active" onclick="setResponseStyle('soft', this)">⚡ Soft
                            Selling</button>
                        <button class="style-pill" onclick="setResponseStyle('value', this)">🎯 ROI & Value</button>
                        <button class="style-pill" onclick="setResponseStyle('closing', this)">🔥 Closing Push</button>
                    </div>

                    <div id="aiScriptBox"
                        style="font-size: 13.5px; line-height: 1.6; color: var(--text-dark); background: #f8fafc; padding: 14px; border-radius: 12px; border-left: 4px solid var(--primary-red);">
                        Pilih salah satu keberatan konsumen di atas untuk melihat respon rekomendasi AI.
                    </div>

                    <div style="margin-top: 14px; display: flex; gap: 8px;">
                        <button type="button" class="btn-main" onclick="shareToWA()"
                            style="flex:1; background: #25D366; font-size: 12px; border:none; border-radius:10px; color:#fff; font-weight:700; padding:10px;">
                            <i class="fa-brands fa-whatsapp"></i> Kirim Jawaban ke WA
                        </button>
                    </div>
                </div>
            </div>

            <!-- ══════════════ TAB 2: SMART PITCH ══════════════ -->
            <div id="contentPitch" style="display: none;">
                <div class="card"
                    style="padding: 16px; margin-bottom: 16px; background:#fff; border-radius:16px; border:1px solid #e2e8f0;">
                    <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 800; color: var(--primary-blue);">
                        <i class="fa-solid fa-sliders"></i> Profil & Kebutuhan Konsumen
                    </h4>

                    <div class="form-group" style="margin-bottom:12px;">
                        <label style="font-size:12.5px; font-weight:700;">Profil Konsumen</label>
                        <select id="pitchProfil" class="form-control">
                            <option value="keluarga">Keluarga (Utamakan Kenyamanan & Keamanan)</option>
                            <option value="muda">Eksekutif Muda (Utamakan Desain & Fitur Canggih)</option>
                            <option value="bisnis">Pengusaha / Operasional (Utamakan Hemat BBM & Durabilitas)</option>
                            <option value="first">First-Time Car Buyer (Utamakan Angsuran Ringan & Kemudahan)</option>
                        </select>
                    </div>

                    <div class="form-group" style="margin-bottom:12px;">
                        <label style="font-size:12.5px; font-weight:700;">Tipe Kendaraan Yang Diminati</label>
                        <input type="text" id="pitchModel" class="form-control"
                            placeholder="Contoh: MPV 7-Seater / SUV Compact" value="MPV 7-Seater">
                    </div>

                    <div class="form-group" style="margin-bottom:14px;">
                        <label style="font-size:12.5px; font-weight:700;">Fokus Skema Pembayaran</label>
                        <select id="pitchSkema" class="form-control">
                            <option value="dp">Fokus DP Ringan</option>
                            <option value="angsuran">Fokus Angsuran Murah Tenor Panjang</option>
                            <option value="cash">Pembelian Cash (Negosiasi Bonus & Cashback)</option>
                        </select>
                    </div>

                    <button type="button" class="btn-main" onclick="generateSmartPitch()"
                        style="width: 100%; border:none; padding:12px; background:var(--primary-blue); color:#fff; font-weight:700; border-radius:12px;">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> Buat Skrip Penawaran AI
                    </button>
                </div>

                <div class="response-card" id="pitchResultCard" style="display: none;">
                    <div
                        style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                        <span style="font-size: 12px; font-weight: 800; color: var(--primary-blue);">
                            <i class="fa-solid fa-lightbulb"></i> Skrip Pitching Rekomendasi
                        </span>
                        <button type="button" onclick="copyPitchResult()" class="btn-sm"
                            style="padding: 4px 10px; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; font-size:11px;">
                            <i class="fa-regular fa-copy"></i> Salin
                        </button>
                    </div>
                    <div id="pitchResultText"
                        style="font-size: 13.5px; line-height: 1.6; color: var(--text-dark); background: #f8fafc; padding: 14px; border-radius: 12px; border-left: 4px solid var(--accent-blue);">
                    </div>
                </div>
            </div>

            <!-- ══════════════ TAB 3: CHAT AI ══════════════ -->
            <div id="contentChat" style="display: none;">
                <div class="card"
                    style="padding: 16px; min-height: 420px; display: flex; flex-direction: column; background:#fff; border-radius:16px; border:1px solid #e2e8f0;">
                    <div id="chatHistory"
                        style="flex: 1; min-height:260px; max-height:340px; overflow-y: auto; padding-right: 4px; display: flex; flex-direction: column; gap: 8px;">
                        <div class="chat-bubble chat-ai">
                            👋 Halo! Saya <strong>AI Sales Assistant</strong>. Tanyakan apa saja seputar cara merespon
                            pertanyaan konsumen, trik negosiasi, atau tips closing!
                        </div>
                    </div>

                    <!-- Quick Suggestions -->
                    <div style="display: flex; gap: 6px; overflow-x: auto; padding: 8px 0; margin-top: 6px;"
                        id="quickPrompts">
                        <button class="style-pill"
                            onclick="sendQuickChat('Bagaimana cara menjelaskan keunggulan garansi kita?')">🛡️
                            Garansi</button>
                        <button class="style-pill"
                            onclick="sendQuickChat('Apa argumen terbaik jika konsumen ingin tunda beli?')">⏳ Tunda
                            Beli</button>
                        <button class="style-pill" onclick="sendQuickChat('Berikan tips closing saat test drive')">🚘
                            Test Drive Closing</button>
                    </div>

                    <div style="display: flex; gap: 8px; margin-top: 8px;">
                        <input type="text" id="chatInput" class="form-control"
                            placeholder="Ketik pertanyaan untuk AI..."
                            onkeypress="if(event.key==='Enter') sendChatMessage()">
                        <button type="button" class="btn-main" onclick="sendChatMessage()"
                            style="width: auto; padding: 0 16px; border:none; background:var(--primary-blue); color:#fff; border-radius:10px;">
                            <i class="fa-solid fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>

        </div><!-- /container -->
    </div><!-- /mobile-app -->

    <script src="../js/script.js"></script>
    <script src="../js/ai_copilot.js?v=20260819_fix_ai_reply"></script>
</body>

</html>