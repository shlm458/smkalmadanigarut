db.js
// db.js - SIMULASI DATABASE BERBASIS LOCALSTORAGE

function initDatabase() {
    if (!localStorage.getItem('DB_USERS')) {
        const defaultUsers = [
            { id: 1, email: "murid@almadani.sch.id", pass: "123", name: "sarah", role: "murid", jurusan: "PPLG" },
            { id: 2, email: "guru@almadani.sch.id", pass: "123", name: "bu kekeu", role: "guru", jurusan: "PPLG" },
            { id: 3, email: "tu@almadani.sch.id", pass: "123", name: "bu mira", role: "tu", jurusan: "Umum" }
        ];
        localStorage.setItem('DB_USERS', JSON.stringify(defaultUsers));
    }

    if (!localStorage.getItem('DB_ABSENSI')) {
        localStorage.setItem('DB_ABSENSI', JSON.stringify([]));
    }

    if (!localStorage.getItem('DB_KUIS')) {
        const defaultKuis = [
            {
                id: 1,
                jurusan: "PPLG",
                soal: "Apa kepanjangan dari PPLG?",
                opsi: ["Pengembangan Perangkat Lunak & Gim", "Pusat Pelatihan Lokasi Gedung", "Program Pemrograman Lokal"],
                jawaban: 0
            }
        ];
        localStorage.setItem('DB_KUIS', JSON.stringify(defaultKuis));
    }
}

// Inisialisasi Database
initDatabase();

// FUNGSI 1: Login & Auto-Create Account
function loginOrRegister(email, password, name, role, jurusan) {
    let users = JSON.parse(localStorage.getItem('DB_USERS')) || [];

    // Cek apakah email sudah terdaftar
    let foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (foundUser) {
        if (foundUser.pass === password) {
            localStorage.setItem('LOGGED_IN_USER', JSON.stringify(foundUser));
            redirectByRole(foundUser.role);
        } else {
            alert("Password salah!");
        }
    } else {
        const newUser = {
            id: Date.now(),
            email: email,
            pass: password,
            name: name || email.split('@')[0],
            role: role,
            jurusan: jurusan || "PPLG"
        };

        users.push(newUser);
        localStorage.setItem('DB_USERS', JSON.stringify(users));
        localStorage.setItem('LOGGED_IN_USER', JSON.stringify(newUser));

        alert("Akun berhasil dibuat dan Anda otomatis masuk!");
        redirectByRole(role);
    }
}

// FUNGSI 2: Redirect Berdasarkan Role
function redirectByRole(role) {
    if (role === 'murid') window.location.href = 'dashboard-murid.html';
    else if (role === 'guru') window.location.href = 'dashboard-guru.html';
    else if (role === 'tu') window.location.href = 'dashboard-tu.html';
}

// FUNGSI 3: Cek Proteksi Halaman
function checkAccess(allowedRole) {
    const user = JSON.parse(localStorage.getItem('LOGGED_IN_USER'));
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    if (allowedRole && user.role !== allowedRole) {
        alert("Akses Ditolak! Role Anda adalah: " + user.role);
        redirectByRole(user.role);
        return null;
    }
    return user;
}

// FUNGSI 4: Logout
function logout() {
    localStorage.removeItem('LOGGED_IN_USER');
    window.location.href = 'index.html';
}