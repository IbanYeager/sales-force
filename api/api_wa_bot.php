<?php
// api/api_wa_bot.php
// Webhook & Auto-Reply Gateway untuk T-STOCK AI (WhatsApp Integration)
// Mendukung format webhook universal (Fonnte, Wablas, Starsender, Official WA Cloud API, Custom POST)

if (!headers_sent()) {
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
}

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/koneksi.php';
define('AI_ENGINE_ONLY', true);
require_once __DIR__ . '/api_ai_gemini.php';

// Capture incoming webhook payload
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true) ?? $_POST;

// Parse incoming message and sender phone
$sender = $input['sender'] ?? ($input['phone'] ?? ($input['from'] ?? ($input['wa_number'] ?? '')));
$message = trim($input['message'] ?? ($input['text'] ?? ($input['body'] ?? ($_GET['msg'] ?? ''))));

// If testing via GET parameter (e.g. api_wa_bot.php?msg=stok+alphard&sender=08123456789)
if (empty($message) && isset($_GET['msg'])) {
    $message = trim($_GET['msg']);
}
if (empty($sender) && isset($_GET['sender'])) {
    $sender = trim($_GET['sender']);
}

if (empty($message)) {
    echo json_encode([
        'status' => 'standby',
        'info' => 'T-STOCK WhatsApp Webhook siap menerima pesan masuk.',
        'usage' => [
            'method' => 'POST',
            'payload_example' => [
                'sender' => '08123456789',
                'message' => 'stok alphard putih ready apa aja?'
            ]
        ]
    ]);
    exit;
}

// 1. Generate Intelligent AI Response from T-STOCK SQL Engine
$aiReplyRaw = generateDirectSqlResponse($conn, $message);

// 2. Format reply for WhatsApp (clean markdown without HTML tags)
$waFormattedReply = cleanForWhatsApp($aiReplyRaw);

// 3. Log into database table 'tabel_wa_logs'
$conn->query("CREATE TABLE IF NOT EXISTS tabel_wa_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(30),
    message TEXT,
    reply TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

$stmt = $conn->prepare("INSERT INTO tabel_wa_logs (phone, message, reply) VALUES (?, ?, ?)");
if ($stmt) {
    $stmt->bind_param("sss", $sender, $message, $waFormattedReply);
    $stmt->execute();
    $stmt->close();
}

// 4. Return standard response compatible with WhatsApp Gateways (Fonnte / Wablas)
echo json_encode([
    'status' => 'success',
    'sender' => $sender,
    'incoming_message' => $message,
    'reply' => $waFormattedReply,
    'reply_message' => $waFormattedReply, // for Fonnte auto-reply
    'response' => $waFormattedReply,      // for Wablas auto-reply
    'wa_share_url' => 'https://wa.me/' . preg_replace('/[^0-9]/', '', $sender) . '?text=' . urlencode($waFormattedReply)
]);

// Helper to convert internal format to clean WhatsApp format (*bold*, _italic_, bullet points)
function cleanForWhatsApp($text) {
    // Strip card delimiters
    $t = preg_replace('/###VAR_START:[^#]+###/i', '', $text);
    $t = preg_replace('/###VAR_END###/i', '', $t);
    
    // Replace markdown bold **text** to WA *text*
    $t = preg_replace('/\*\*([^*]+)\*\*/', '*$1*', $t);
    
    // Ensure clean line breaks
    $t = trim($t);
    
    // Add signature footer
    $t .= "\n\n━━━━━━━━━━━━━━━━━━━━\n_🤖 Dibalas otomatis oleh T-STOCK AI (Tunas Toyota Kiara Condong)_";
    
    return $t;
}
