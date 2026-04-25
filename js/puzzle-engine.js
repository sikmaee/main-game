// ============================================
// RuxxPuzzle - Puzzle Engine
// ============================================

class PuzzleEngine {
    constructor() {
        this.currentGame = null;
        this.score = 0;
        this.stars = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.isPlaying = false;
        this.moves = 0;
        this.maxMoves = 0;
        this.targetScore = 0;
    }

    // Inisialisasi game
    initGame(gameConfig) {
        this.currentGame = gameConfig;
        this.score = 0;
        this.stars = 0;
        this.timer = 0;
        this.moves = 0;
        this.maxMoves = gameConfig.maxMoves || 0;
        this.targetScore = gameConfig.targetScore || 100;
        this.isPlaying = true;
        
        this.startTimer();
        this.updateUI();
    }

    // Timer
    startTimer() {
        this.stopTimer();
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimerDisplay();
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer % 60;
        const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        const timerElement = document.getElementById('gameTimer');
        if (timerElement) timerElement.textContent = display;
    }

    // Score
    addScore(points) {
        this.score += points;
        this.moves++;
        this.updateUI();
        this.checkCompletion();
    }

    // Stars calculation
    calculateStars() {
        const percentage = (this.score / this.targetScore) * 100;
        if (percentage >= 100) return 3;
        if (percentage >= 70) return 2;
        if (percentage >= 40) return 1;
        return 0;
    }

    // Check if game is complete
    checkCompletion() {
        const stars = this.calculateStars();
        if (stars > this.stars) {
            this.stars = stars;
        }
        
        if (this.stars >= 3 || (this.maxMoves > 0 && this.moves >= this.maxMoves)) {
            this.completeGame();
        }
    }

    // Complete game
    completeGame() {
        this.stopTimer();
        this.isPlaying = false;
        this.stars = this.calculateStars();
        
        // Simpan progress
        this.saveProgress();
        
        // Update leaderboard
        this.updateLeaderboard();
        
        // Update achievements
        this.updateAchievements();
        
        // Tampilkan modal
        this.showCompletionModal();
    }

    // Save progress ke localStorage
    saveProgress() {
        const progress = JSON.parse(localStorage.getItem('ruxxpuzzle_progress') || '{}');
        progress[this.currentGame.id] = {
            stars: this.stars,
            highScore: Math.max(this.score, (progress[this.currentGame.id]?.highScore || 0)),
            bestTime: Math.min(this.timer, (progress[this.currentGame.id]?.bestTime || Infinity)),
            completed: true
        };
        localStorage.setItem('ruxxpuzzle_progress', JSON.stringify(progress));
    }

    // Update leaderboard
    updateLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('ruxxpuzzle_leaderboard') || '[]');
        leaderboard.push({
            game: this.currentGame.name,
            score: this.score,
            stars: this.stars,
            time: this.timer,
            date: new Date().toISOString()
        });
        
        // Sort dan ambil top 50
        leaderboard.sort((a, b) => b.score - a.score);
        const top50 = leaderboard.slice(0, 50);
        
        localStorage.setItem('ruxxpuzzle_leaderboard', JSON.stringify(top50));
    }

    // Update achievements
    updateAchievements() {
        const achievements = JSON.parse(localStorage.getItem('ruxxpuzzle_achievements') || '{}');
        const progress = JSON.parse(localStorage.getItem('ruxxpuzzle_progress') || '{}');
        
        const allAchievements = [
            { id: 'first_game', name: 'Pemula', desc: 'Selesaikan game pertama', condition: () => true },
            { id: 'three_stars', name: 'Bintang 3', desc: 'Dapatkan 3 bintang di semua game', condition: () => {
                return Object.values(progress).every(g => g.stars >= 3);
            }},
            { id: 'speed_demon', name: 'Kilat', desc: 'Selesaikan game dalam 30 detik', condition: () => this.timer <= 30 },
            { id: 'perfect_score', name: 'Sempurna', desc: 'Dapatkan skor sempurna', condition: () => this.score >= this.targetScore },
            { id: 'all_games', name: 'Kolektor', desc: 'Mainkan semua game', condition: () => {
                return Object.keys(progress).length >= 10;
            }}
        ];
        
        allAchievements.forEach(ach => {
            if (!achievements[ach.id] && ach.condition()) {
                achievements[ach.id] = {
                    unlocked: true,
                    date: new Date().toISOString()
                };
            }
        });
        
        localStorage.setItem('ruxxpuzzle_achievements', JSON.stringify(achievements));
    }

    // Show completion modal
    showCompletionModal() {
        const modal = document.getElementById('modalOverlay');
        const content = document.getElementById('modalContent');
        
        const starEmojis = ['⭐', '⭐⭐', '🌟🌟🌟'];
        const messages = ['Coba lagi!', 'Bagus!', 'Sempurna!'];
        
        content.innerHTML = `
            <div class="completion-modal">
                <div class="completion-stars">${starEmojis[this.stars - 1] || '⭐'}</div>
                <h2>${messages[this.stars - 1] || 'Selesai!'}</h2>
                <div class="completion-stats">
                    <div class="comp-stat">
                        <i class="fas fa-star"></i>
                        <span>${this.stars} Bintang</span>
                    </div>
                    <div class="comp-stat">
                        <i class="fas fa-trophy"></i>
                        <span>Skor: ${this.score}</span>
                    </div>
                    <div class="comp-stat">
                        <i class="fas fa-clock"></i>
                        <span>Waktu: ${this.formatTime(this.timer)}</span>
                    </div>
                </div>
                <div class="completion-buttons">
                    <button class="cta-button" onclick="backToGames()">
                        <i class="fas fa-th"></i> Pilih Game
                    </button>
                    <button class="cta-button" style="background: var(--gradient-success);" onclick="retryGame()">
                        <i class="fas fa-redo"></i> Coba Lagi
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    }

    // Format time
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // Update UI elements
    updateUI() {
        const starsEl = document.getElementById('gameStars');
        const scoreEl = document.getElementById('gameScore');
        
        if (starsEl) starsEl.textContent = this.stars;
        if (scoreEl) scoreEl.textContent = this.score;
        
        // Update total stats di header
        this.updateTotalStats();
    }

    // Update total stats
    updateTotalStats() {
        const progress = JSON.parse(localStorage.getItem('ruxxpuzzle_progress') || '{}');
        let totalStars = 0;
        
        Object.values(progress).forEach(game => {
            totalStars += game.stars || 0;
        });
        
        document.getElementById('totalStars').textContent = totalStars;
        document.getElementById('totalCoins').textContent = totalStars * 10; // 10 coins per star
    }

    // Cleanup
    destroy() {
        this.stopTimer();
        this.isPlaying = false;
    }
}

// Global engine instance
const engine = new PuzzleEngine();
