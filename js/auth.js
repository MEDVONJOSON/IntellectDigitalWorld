(function() {
    "use strict";

    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem('users') || '[]');
        } catch (e) {
            return [];
        }
    }

    function setUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    function getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('currentUser') || 'null');
        } catch (e) {
            return null;
        }
    }

    function setCurrentUser(user) {
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('currentUser');
        }
    }

    function normalizeEmail(email) {
        return (email || '').trim().toLowerCase();
    }

    function registerUser({ name, email, password, phone, dateOfBirth, country, bio }) {
        const users = getUsers();
        const normalizedEmail = normalizeEmail(email);
        if (!name || !normalizedEmail || !password) {
            return { success: false, message: 'Name, email, and password are required.' };
        }
        if (users.some(u => normalizeEmail(u.email) === normalizedEmail)) {
            return { success: false, message: 'Email already registered.' };
        }
        const newUser = {
            id: Date.now(),
            name: name.trim(),
            email: normalizedEmail,
            password, // Demo-only: do NOT store plaintext passwords in production
            phone: phone || '',
            dateOfBirth: dateOfBirth || '',
            country: country || '',
            bio: bio || '',
            createdAt: new Date().toISOString(),
            avatar: ''
        };
        users.push(newUser);
        setUsers(users);
        setCurrentUser({ 
            id: newUser.id, 
            name: newUser.name, 
            email: newUser.email, 
            avatar: newUser.avatar, 
            bio: newUser.bio,
            phone: newUser.phone,
            dateOfBirth: newUser.dateOfBirth,
            country: newUser.country
        });
        return { success: true };
    }

    function loginUser({ email, password }) {
        const users = getUsers();
        const normalizedEmail = normalizeEmail(email);
        const found = users.find(u => normalizeEmail(u.email) === normalizedEmail && u.password === password);
        if (!found) return { success: false, message: 'Invalid credentials.' };
        setCurrentUser({ 
            id: found.id, 
            name: found.name, 
            email: found.email, 
            avatar: found.avatar, 
            bio: found.bio,
            phone: found.phone || '',
            dateOfBirth: found.dateOfBirth || '',
            country: found.country || ''
        });
        return { success: true };
    }

    function logoutUser() {
        setCurrentUser(null);
    }

    function updateProfile({ name, bio, avatar, phone, dateOfBirth, country }) {
        const current = getCurrentUser();
        if (!current) return { success: false, message: 'Not authenticated.' };
        const users = getUsers();
        const idx = users.findIndex(u => u.id === current.id);
        if (idx === -1) return { success: false, message: 'User not found.' };
        users[idx].name = name !== undefined ? name : users[idx].name;
        users[idx].bio = bio !== undefined ? bio : users[idx].bio;
        users[idx].avatar = avatar !== undefined ? avatar : users[idx].avatar;
        users[idx].phone = phone !== undefined ? phone : users[idx].phone;
        users[idx].dateOfBirth = dateOfBirth !== undefined ? dateOfBirth : users[idx].dateOfBirth;
        users[idx].country = country !== undefined ? country : users[idx].country;
        setUsers(users);
        setCurrentUser({ 
            id: users[idx].id, 
            name: users[idx].name, 
            email: users[idx].email, 
            avatar: users[idx].avatar, 
            bio: users[idx].bio,
            phone: users[idx].phone,
            dateOfBirth: users[idx].dateOfBirth,
            country: users[idx].country
        });
        return { success: true };
    }

    function requireAuthOrRedirect() {
        const current = getCurrentUser();
        if (!current) {
            window.location.href = 'user-login.html?next=' + encodeURIComponent(location.pathname.split('/').pop() || 'user-dashboard.html');
        }
    }

    // Admin auth (demo only). In production, replace with server-side auth.
    function isAdminAuthenticated() {
        try {
            const token = localStorage.getItem('adminAuthToken');
            return token === 'idh-admin-2025';
        } catch (_) { return false; }
    }

    function updateAccountNavLinks() {
        const current = getCurrentUser();
        const isAdmin = isAdminAuthenticated();
        const guestItems = document.querySelectorAll('[data-auth="guest"]');
        const userItems = document.querySelectorAll('[data-auth="user"]');
        const adminItems = document.querySelectorAll('[data-auth="admin"]');

        if (isAdmin) {
            guestItems.forEach(el => el.classList.add('d-none'));
            userItems.forEach(el => el.classList.add('d-none'));
            adminItems.forEach(el => el.classList.remove('d-none'));
        } else if (current) {
            guestItems.forEach(el => el.classList.add('d-none'));
            userItems.forEach(el => el.classList.remove('d-none'));
            adminItems.forEach(el => el.classList.add('d-none'));
            const nameEls = document.querySelectorAll('[data-current-user-name]');
            nameEls.forEach(el => el.textContent = current.name || current.email);
        } else {
            guestItems.forEach(el => el.classList.remove('d-none'));
            userItems.forEach(el => el.classList.add('d-none'));
            adminItems.forEach(el => el.classList.add('d-none'));
        }
    }

    function wireLogoutButtons() {
        document.addEventListener('click', function(e) {
            const target = e.target.closest('[data-action="logout"]');
            if (target) {
                e.preventDefault();
                logoutUser();
                updateAccountNavLinks();
                const href = target.getAttribute('href') || 'index.html';
                window.location.href = href;
            }
            const adminTarget = e.target.closest('[data-action="admin-logout"]');
            if (adminTarget) {
                e.preventDefault();
                try { localStorage.removeItem('adminAuthToken'); } catch (_) {}
                updateAccountNavLinks();
                const href = adminTarget.getAttribute('href') || 'index.html';
                window.location.href = href;
            }
        });
    }

    // Expose minimal API
    window.Auth = {
        getCurrentUser,
        registerUser,
        loginUser,
        logoutUser,
        updateProfile,
        requireAuthOrRedirect,
        updateAccountNavLinks
    };

    // Initialize common behaviors
    document.addEventListener('DOMContentLoaded', function() {
        updateAccountNavLinks();
        wireLogoutButtons();
    });
})();


