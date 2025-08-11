// Helper function to safely parse JSON
function safeParse(key, defaultValue) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch {
        return defaultValue;
    }
}

// Initial state
let session = safeParse("neosis_session", null);

// Render app based on login state
function renderApp() {
    const app = document.getElementById("app");
    if (!session) {
        renderLogin(app);
    } else {
        renderFeed(app);
    }
}

// Login page
function renderLogin(app) {
    app.innerHTML = `
        <div class="container">
            <h1>Neosis Login</h1>
            <input id="username" placeholder="Username">
            <input id="password" type="password" placeholder="Password">
            <button onclick="login()">Login</button>
            <button onclick="renderSignup(document.getElementById('app'))">Sign Up</button>
        </div>
    `;
}

// Signup page
function renderSignup(app) {
    app.innerHTML = `
        <div class="container">
            <h1>Create Account</h1>
            <input id="newUsername" placeholder="Username">
            <input id="newPassword" type="password" placeholder="Password">
            <button onclick="signup()">Sign Up</button>
            <button onclick="renderLogin(document.getElementById('app'))">Back to Login</button>
        </div>
    `;
}

// Feed page
function renderFeed(app) {
    app.innerHTML = `
        <div class="container">
            <h1>Welcome, ${session.username}</h1>
            <p>This is your feed.</p>
        </div>
        <div class="navbar">
            <button onclick="renderFeed(document.getElementById('app'))">Home</button>
            <button onclick="renderSettings(document.getElementById('app'))">Settings</button>
            <button onclick="logout()">Logout</button>
        </div>
    `;
}

// Settings page
function renderSettings(app) {
    app.innerHTML = `
        <div class="container">
            <h1>Settings</h1>
            <div class="settings-tabs">
                <button onclick="showTab('account')">Account</button>
                <button onclick="showTab('privacy')">Privacy</button>
                <button onclick="showTab('about')">About</button>
            </div>
            <div id="tab-account" class="settings-tab">
                <p>Username: ${session.username}</p>
                <p>Password: (hidden)</p>
            </div>
            <div id="tab-privacy" class="settings-tab hidden">
                <p>Privacy settings go here...</p>
            </div>
            <div id="tab-about" class="settings-tab hidden">
                <p>Neosis App v1.0</p>
            </div>
        </div>
        <div class="navbar">
            <button onclick="renderFeed(document.getElementById('app'))">Home</button>
            <button onclick="renderSettings(document.getElementById('app'))">Settings</button>
            <button onclick="logout()">Logout</button>
        </div>
    `;
}

// Show specific settings tab
function showTab(name) {
    document.querySelectorAll('.settings-tab').forEach(tab => tab.classList.add('hidden'));
    document.getElementById(`tab-${name}`).classList.remove('hidden');
}

// Login logic
function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const users = safeParse("neosis_users", []);

    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
        session = { username };
        localStorage.setItem("neosis_session", JSON.stringify(session));
        renderApp();
    } else {
        alert("Invalid credentials");
    }
}

// Signup logic
function signup() {
    const username = document.getElementById("newUsername").value.trim();
    const password = document.getElementById("newPassword").value.trim();
    let users = safeParse("neosis_users", []);

    if (users.find(u => u.username === username)) {
        alert("Username already taken");
        return;
    }

    users.push({ username, password });
    localStorage.setItem("neosis_users", JSON.stringify(users));
    alert("Account created! Please login.");
    renderLogin(document.getElementById("app"));
}

// Logout logic
function logout() {
    localStorage.removeItem("neosis_session");
    session = null;
    renderApp();
}

// Start the app
renderApp();
