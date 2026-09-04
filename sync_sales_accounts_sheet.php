<?php
require 'api/koneksi.php';

$accounts = [
    [
        'id' => 58,
        'nama_lengkap' => 'Rizki Rismawan',
        'username' => 'Rizkitunastoyota47',
        'password' => 'Tunas@47',
        'no_hp' => '085322777600',
        'nama_spv' => 'Pak Alvin',
        'is_active' => 1
    ],
    [
        'id' => 26,
        'nama_lengkap' => 'MUHAMMAD FADIL FAHMI RUSTANDI',
        'username' => 'fadil.fahmi99',
        'password' => 'Bandung99',
        'no_hp' => '085811316926',
        'nama_spv' => 'Pak Alvin',
        'is_active' => 1
    ],
    [
        'id' => 42,
        'nama_lengkap' => 'Shovia Syafany',
        'username' => 'Shovia',
        'password' => '850406',
        'no_hp' => '085312000340',
        'nama_spv' => 'Pak Riva',
        'is_active' => 1
    ],
    [
        'id' => 45,
        'nama_lengkap' => 'Nuri Lestari Kristianty',
        'username' => 'Nurilestari',
        'password' => 'Lestari08',
        'no_hp' => '081953737337',
        'nama_spv' => 'Pak Riva',
        'is_active' => 1
    ],
    [
        'id' => 64,
        'nama_lengkap' => 'Reni Nurbayani',
        'username' => 'Reninurbayani',
        'password' => 'Reni.1988#',
        'no_hp' => '081122891988',
        'nama_spv' => 'Pak Riva',
        'is_active' => 1
    ],
    [
        'id' => 5,
        'nama_lengkap' => 'YANI ANDRIYANI',
        'username' => 'Yani Drey',
        'password' => 'Kiaracondong47',
        'no_hp' => '082129998819',
        'nama_spv' => 'Pak Ryan',
        'is_active' => 1
    ],
    [
        'id' => 37,
        'nama_lengkap' => 'Kharisma Galih Putra',
        'username' => 'Galih138',
        'password' => 'Galih_1308',
        'no_hp' => '087722000844',
        'nama_spv' => 'Pak Riva',
        'is_active' => 1
    ],
    [
        'id' => 50,
        'nama_lengkap' => 'Isna Nurhayati',
        'username' => 'Isna',
        'password' => 'Isna192020',
        'no_hp' => '082117514355',
        'nama_spv' => 'Pak Ryan',
        'is_active' => 1
    ],
    [
        'id' => 9,
        'nama_lengkap' => 'GALIH HARISTIANTO',
        'username' => 'Galih Haristianto',
        'password' => 'Farmasi11',
        'no_hp' => '082121487461',
        'nama_spv' => 'Pak Ryan',
        'is_active' => 1
    ],
    [
        'id' => 23,
        'nama_lengkap' => 'Andri Jaya Laksana',
        'username' => 'Ndri',
        'password' => '12345',
        'no_hp' => '089531689271',
        'nama_spv' => 'Pak Alvin',
        'is_active' => 1
    ],
    [
        'id' => 54,
        'nama_lengkap' => 'Frederick Neo',
        'username' => 'neo',
        'password' => '123',
        'no_hp' => '+62 851-9930-3743',
        'nama_spv' => 'Pak Ryan',
        'is_active' => 1
    ],
    [
        'id' => 25,
        'nama_lengkap' => 'ARDIAN PURNAMA',
        'username' => 'Ardianpur28',
        'password' => 'Runaskc47',
        'no_hp' => '081999611528',
        'nama_spv' => 'Pak Alvin',
        'is_active' => 1
    ],
    [
        'id' => 47,
        'nama_lengkap' => 'Rico Ade Saputra',
        'username' => 'Rico',
        'password' => 'Merdeka123',
        'no_hp' => '083139808238',
        'nama_spv' => 'Pak Alvin',
        'is_active' => 1
    ]
];

echo "=== UPDATING SALES ACCOUNTS IN DATABASE ===\n\n";

$conn->begin_transaction();
$successCount = 0;

foreach ($accounts as $acc) {
    $id = intval($acc['id']);
    $nama = $conn->real_escape_string($acc['nama_lengkap']);
    $usn = $conn->real_escape_string($acc['username']);
    $hashedPass = password_hash($acc['password'], PASSWORD_DEFAULT);
    $pass_esc = $conn->real_escape_string($hashedPass);
    $hp = $conn->real_escape_string($acc['no_hp']);
    $spv = $conn->real_escape_string($acc['nama_spv']);
    $active = intval($acc['is_active']);

    // Fetch before
    $qBefore = $conn->query("SELECT username, nama_lengkap, no_hp, nama_spv, is_active FROM sales_accounts WHERE id = $id");
    $before = $qBefore ? $qBefore->fetch_assoc() : null;

    $sql = "UPDATE sales_accounts 
            SET nama_lengkap = '$nama',
                username = '$usn',
                password = '$pass_esc',
                no_hp = '$hp',
                nama_spv = '$spv',
                is_active = $active
            WHERE id = $id";

    if ($conn->query($sql)) {
        echo "✅ SUCCESS ID $id:\n";
        echo "   Before: Usn='{$before['username']}' | Nama='{$before['nama_lengkap']}' | HP='{$before['no_hp']}'\n";
        echo "   After : Usn='{$acc['username']}' | Nama='{$acc['nama_lengkap']}' | HP='{$acc['no_hp']}' | Pass='{$acc['password']}'\n\n";
        $successCount++;
    } else {
        echo "❌ ERROR ID $id: " . $conn->error . "\n";
        $conn->rollback();
        exit(1);
    }
}

$conn->commit();
echo "🎉 ALL $successCount ACCOUNTS SUCCESSFULLY UPDATED IN DATABASE!\n";
