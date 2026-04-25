// ============================================
// RuxxPuzzle - Main Application
// ============================================

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavigation();
    renderGames();
    renderAchievements();
    renderLeaderboard();
    engine.updateTotalStats();
    
    // Close modal on overlay click
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
        if (e.target === e.target.parentElement.querySelector('.modal-overlay')) {
            closeModal();
        }
    });
});

// Particles Background
function initParticles() {
    const container = document.getElementById('particles');
    const colors = ['#6C5CE7', '#00CEC9', '#FD79A8', '#FDCB6E', '#00B894'];
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${Math.random() * 100}%;
            animation-duration: ${Math.random() * 20 + 10}s;
            animation-delay: ${Math.random() * 10}s;
        `;
        
        container.appendChild(particle);
    }
}

// Navigation
function initNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            switchView(view);
        });
    });
}

function switchView(viewName) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewName);
    });
    
    // Update views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) {
        targetView.classList.add('active');
    }
    
    // Refresh data if needed
    if (viewName === 'leaderboard') renderLeaderboard();
    if (viewName === 'achievements') renderAchievements();
    if (viewName === 'games') renderGames();
    
    // Close modal
    closeModal();
}

// Render Games
function renderGames(filter = 'all') {
    const grid = document.getElementById('gamesGrid');
    const filteredGames = filter === 'all' ? GAMES : GAMES.filter(g => g.category === filter);
    
    grid.innerHTML = filteredGames.map((game, index) => {
        const progress = JSON.parse(localStorage.getItem('ruxxpuzzle_progress') || '{}');
        const gameProgress = progress[game.id];
        const stars = gameProgress?.stars || 0;
        const starDisplay = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
        
        return `
            <div class="game-card" onclick="startGame('${game.id}')" data-category="${game.category}">
                <div class="game-card-icon" style="background: var(--game-${index + 1});">
                    ${game.icon}
                </div>
                <div class="game-card-title">${game.name}</div>
                <div class="game-card-desc">${game.description}</div>
                <div class="game-card-stats">
                    <span class="game-card-stars">${starDisplay}</span>
                    
                </div>
            </div>
        `;
    }).join('');
    
    // Filter buttons    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGames(btn.dataset.filter);
        });
    });
}

// Start Game
function startGame(gameId) {
    const game = GAMES.find(g => g.id === gameId);
    if (!game) return;
    
    engine.destroy();
    engine.initGame(game);
    
    document.getElementById('currentGameTitle').textContent = game.name;
    document.getElementById('gameStars').textContent = '0';
    document.getElementById('gameScore').textContent = '0';
    document.getElementById('gameTimer').textContent = '00:00';
    
    switchView('gameplay');
    
    // Render the game
    if (typeof game.render === 'function') {
        game.render();
    }
}

// Back to games
function backToGames() {
    engine.destroy();
    switchView('games');
}

// Retry current game
function retryGame() {
    closeModal();
    if (engine.currentGame) {
        startGame(engine.currentGame.id);
    }
}

// Close modal
function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

// Render Achievements
function renderAchievements() {
    const grid = document.getElementById('achievementsGrid');
    const achievements = JSON.parse(localStorage.getItem('ruxxpuzzle_achievements') || '{}');
    const allAchievements = [
        { id: 'first_game', name: 'Pemula', desc: 'Selesaikan game pertama', icon: '🎮' },
        { id: 'three_stars', name: 'Bintang 3', desc: 'Dapatkan 3 bintang di semua game', icon: '🌟' },
        { id: 'speed_demon', name: 'Kilat', desc: 'Selesaikan game dalam 30 detik', icon: '⚡' },
        { id: 'perfect_score', name: 'Sempurna', desc: 'Dapatkan skor sempurna', icon: '💎' },
        { id: 'all_games', name: 'Kolektor', desc: 'Mainkan semua 10 game', icon: '🏆' },
        { id: 'streak_5', name: 'Streak 5', desc: 'Mainkan 5 game berturut-turut', icon: '🔥' },
        { id: 'fast_learner', name: 'Cepat Belajar', desc: 'Selesaikan 3 game berbeda', icon: '📚' },
        { id: 'puzzle_master', name: 'Master Puzzle', desc: 'Total 30 bintang', icon: '👑' }
    ];
    
    grid.innerHTML = allAchievements.map(ach => {
        const unlocked = achievements[ach.id]?.unlocked;
        return `
            <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${ach.icon}</div>
                <h3>${ach.name}</h3>
                <p>${ach.desc}</p>
                ${unlocked ? '<span style="color: var(--warning);">✅ Terbuka</span>' : '<span style="color: rgba(255,255,255,0.3);">🔒 Terkunci</span>'}
            </div>
        `;
    }).join('');
}

// Render Leaderboard
function renderLeaderboard() {
    const container = document.getElementById('leaderboardTable');
    const leaderboard = JSON.parse(localStorage.getItem('ruxxpuzzle_leaderboard') || '[]');
    
    let html = `
        <div class="leaderboard-row header">
            <div class="leaderboard-rank">#</div>
            <div style="flex: 1;">Game</div>
            <div style="width: 80px;">Skor</div>
            <div style="width: 80px;">Bintang</div>
            <div style="width: 80px;">Waktu</div>
        </div>
    `;
    
    leaderboard.slice(0, 20).forEach((entry, index) => {
        let rankClass = '';
        if (index === 0) rankClass = 'gold';
        else if (index === 1) rankClass = 'silver';
        else if (index === 2) rankClass = 'bronze';
        
        const time = new Date(entry.time * 1000).toISOString().substr(11, 8);
        const starDisplay = '⭐'.repeat(entry.stars);
        
        html += `
            <div class="leaderboard-row">
                <div class="leaderboard-rank ${rankClass}">${index + 1}</div>
                <div style="flex: 1;">${entry.game}</div>
                <div style="width: 80px;">${entry.score}</div>
                <div style="width: 80px;">${starDisplay}</div>
                <div style="width: 80px;">${time}</div>
            </div>
        `;
    });
    
    if (leaderboard.length === 0) {
        html += '<div style="text-align: center; padding: 2rem; color: rgba(255,255,255,0.5);">Belum ada data. Mainkan game untuk masuk leaderboard!</div>';
    }
    
    container.innerHTML = html;
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        if (document.getElementById('gameplay-view').classList.contains('active')) {
            backToGames();
        }
    }
});
