const ACCOUNTS = {
    "mod": { pw: "modvortex12", role: "moderator" },
    "admin": { pw: "adminvortex25", role: "admin" },
    "owner": { pw: "ownervortexstudio", role: "owner" }
};

let user = { name: "", role: "" };
let requests = []; 

// --- 1. LOGIKA LOADING BAR (DIPERBAIKI) ---
document.addEventListener("DOMContentLoaded", () => {
    let bar = document.getElementById('bar');
    let statusText = document.getElementById('status-text');
    let progress = 0;

    let interval = setInterval(() => {
        // Menambah progress secara acak agar terlihat natural
        progress += Math.floor(Math.random() * 10) + 2;

        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Memberi jeda sebentar saat 100% sebelum pindah
            setTimeout(() => {
                document.getElementById('loading-screen').classList.add('hidden');
                document.getElementById('login-screen').classList.remove('hidden');
            }, 800);
        }

        bar.style.width = progress + "%";
        if (statusText) statusText.innerText = `INITIALIZING... ${progress}%`;
    }, 150);
});

// --- 2. AUTH LOGIN ---
function authLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    const msg = document.getElementById('auth-msg');

    if(ACCOUNTS[u] && ACCOUNTS[u].pw === p) {
        user.name = u;
        user.role = ACCOUNTS[u].role;
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('dashboard-screen').classList.remove('hidden');
        setupDash();
    } else {
        msg.innerHTML = "<p style='color:#ff4d4d; font-size:12px; margin-bottom:10px;'>AUTHENTICATION FAILED</p>";
    }
}

// --- 3. DASHBOARD SETUP ---
function setupDash() {
    document.getElementById('user-welcome').innerText = user.name.toUpperCase();
    document.getElementById('role-tag').innerText = "Role: " + user.role.toUpperCase();

    if(user.role === 'admin' || user.role === 'owner') {
        const navPending = document.getElementById('nav-pending');
        if(navPending) navPending.classList.remove('hidden');
    }
}

function switchTab(id) {
    document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById('tab-' + id).classList.add('active');
    
    // Aktifkan tombol yang diklik
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }
}

// --- 4. WHITELIST ACTION ---
function handleAddWL() {
    const type = document.getElementById('wl-type').value;
    const target = document.getElementById('target-id').value;
    const notif = document.getElementById('wl-notif');

    if(!target) {
        notif.innerText = "Please enter an ID!";
        notif.style.color = "red";
        return;
    }

    if(user.role === 'moderator') {
        requests.push({ id: Date.now(), type: type, target: target, from: user.name });
        notif.innerText = "Sent to Admin (Pending)";
        notif.style.color = "orange";
        renderRequests();
    } else {
        notif.innerText = type + " Added Successfully!";
        notif.style.color = "#00f3ff";
    }
}

// --- 5. APPROVAL RENDER ---
function renderRequests() {
    const container = document.getElementById('pending-container');
    if(!container) return;

    if(requests.length === 0) {
        container.innerHTML = "<p style='color:#444'>No pending requests found.</p>";
        return;
    }

    container.innerHTML = "";
    requests.forEach(req => {
        const div = document.createElement('div');
        div.className = "req-card";
        div.innerHTML = `
            <p><small style="color:#00f3ff">${req.type}</small></p>
            <p><strong>${req.target}</strong></p>
            <p style="font-size:11px; color:#666">Req by: ${req.from}</p>
            <div style="margin-top:10px">
                <button class="btn-acc" onclick="processReq(${req.id}, 'Approved')">Accept</button>
                <button class="btn-dec" onclick="processReq(${req.id}, 'Declined')">Decline</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function processReq(id, action) {
    alert("Request " + action);
    requests = requests.filter(r => r.id !== id);
    renderRequests();
}

// --- 6. MUSIC CONTROLLER ---
let isPlaying = false;
function toggleMusic() {
    const m = document.getElementById('bg-music');
    const icon = document.getElementById('m-icon');
    if(!isPlaying) { 
        m.play().catch(e => console.log("Autoplay blocked: user must click first")); 
        icon.innerText = "🔊"; 
    }
    else { 
        m.pause(); 
        icon.innerText = "🔇"; 
    }
    isPlaying = !isPlaying;
}