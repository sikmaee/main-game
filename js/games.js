// ============================================
// RuxxPuzzle - 10 Game Definitions
// ============================================

const GAMES = [
    {
        id: 'color-match',
        name: 'Color Match',
        description: 'Cocokkan warna yang sama untuk mendapatkan poin!',
        icon: '🎨',
        category: 'pattern',
        difficulty: 'Easy',
        targetScore: 100,
        maxMoves: 20,
        gridSize: 4,
        render: renderColorMatch,
        handleInput: handleColorMatch
    },
    {
        id: 'memory-flip',
        name: 'Memory Flip',
        description: 'Balik kartu dan temukan pasangannya!',
        icon: '🧠',
        category: 'memory',
        difficulty: 'Medium',
        targetScore: 150,
        maxMoves: 15,
        gridSize: 4,
        render: renderMemoryFlip,
        handleInput: handleMemoryFlip
    },
    {
        id: 'sliding-puzzle',
        name: 'Sliding Puzzle',
        description: 'Susun angka berurutan dengan menggeser!',
        icon: '🧩',
        category: 'logic',
        difficulty: 'Hard',
        targetScore: 200,
        maxMoves: 50,
        gridSize: 3,
        render: renderSlidingPuzzle,
        handleInput: handleSlidingPuzzle
    },
    {
        id: 'pattern-finder',
        name: 'Pattern Finder',
        description: 'Temukan pola tersembunyi dalam grid!',
        icon: '🔍',
        category: 'pattern',
        difficulty: 'Medium',
        targetScore: 120,
        maxMoves: 15,
        gridSize: 5,
        render: renderPatternFinder,
        handleInput: handlePatternFinder
    },
    {
        id: 'quick-math',
        name: 'Quick Math',
        description: 'Selesaikan soal matematika dengan cepat!',
        icon: '🔢',
        category: 'speed',
        difficulty: 'Easy',
        targetScore: 80,
        maxMoves: 10,
        gridSize: 0,
        render: renderQuickMath,
        handleInput: handleQuickMath
    },
    {
        id: 'block-sort',
        name: 'Block Sort',
        description: 'Susun balok berdasarkan warna!',
        icon: '📦',
        category: 'logic',
        difficulty: 'Medium',
        targetScore: 130,
        maxMoves: 25,
        gridSize: 5,
        render: renderBlockSort,
        handleInput: handleBlockSort
    },
    {
        id: 'sequence-memory',
        name: 'Sequence Memory',
        description: 'Ingat dan ulangi urutan yang ditampilkan!',
        icon: '🎵',
        category: 'memory',
        difficulty: 'Hard',
        targetScore: 180,
        maxMoves: 0,
        gridSize: 0,
        render: renderSequenceMemory,
        handleInput: handleSequenceMemory
    },
    {
        id: 'word-scramble',
        name: 'Word Scramble',
        description: 'Susun huruf menjadi kata yang benar!',
        icon: '📝',
        category: 'logic',
        difficulty: 'Medium',
        targetScore: 110,
        maxMoves: 12,
        gridSize: 0,
        render: renderWordScramble,
        handleInput: handleWordScramble
    },
    {
        id: 'reaction-tap',
        name: 'Reaction Tap',
        description: 'Tap secepat mungkin saat warna berubah!',
        icon: '⚡',
        category: 'speed',
        difficulty: 'Easy',
        targetScore: 90,
        maxMoves: 30,
        gridSize: 0,
        render: renderReactionTap,
        handleInput: handleReactionTap
    },
    {
        id: 'shape-sorter',
        name: 'Shape Sorter',
        description: 'Kelompokkan bentuk geometri yang sama!',
        icon: '🔷',
        category: 'pattern',
        difficulty: 'Hard',
        targetScore: 160,
        maxMoves: 20,
        gridSize: 6,
        render: renderShapeSorter,
        handleInput: handleShapeSorter
    }
];

// ============================================
// Game 1: Color Match
// ============================================
function renderColorMatch() {
    const area = document.getElementById('gameplayArea');
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F7DC6F', '#BB8FCE', '#82E0AA'];
    
    let gridHTML = '<div class="puzzle-grid" style="grid-template-columns: repeat(4, 80px);">';
    
    for (let i = 0; i < 16; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        gridHTML += `
            <div class="puzzle-cell" 
                 data-color="${color}" 
                 style="background: ${color};"
                 onclick="handleColorMatchClick(this)">
            </div>`;
    }
    
    gridHTML += '</div>';
    area.innerHTML = gridHTML;
}

function handleColorMatchClick(cell) {
    const selected = document.querySelector('.puzzle-cell.selected');
    
    if (selected) {
        const color1 = selected.dataset.color;
        const color2 = cell.dataset.color;
        
        if (color1 === color2 && selected !== cell) {
            selected.classList.add('matched');
            cell.classList.add('matched');
            engine.addScore(10);
            
            setTimeout(() => {
                const newColor = ['#FF6B6B', '#4ECDC4', '#45B7D1'][Math.floor(Math.random() * 3)];
                selected.style.background = newColor;
                selected.dataset.color = newColor;
                selected.classList.remove('matched', 'selected');
                cell.style.background = newColor;
                cell.dataset.color = newColor;
                cell.classList.remove('matched');
            }, 500);
        } else {
            selected.classList.remove('selected');
            cell.classList.add('selected');
        }
    } else {
        cell.classList.add('selected');
    }
}

function handleColorMatch(input) {
    // Handled by onclick
}

// ============================================
// Game 2: Memory Flip
// ============================================
let memoryCards = [];
let flippedCards = [];
let memoryLocked = false;

function renderMemoryFlip() {
    const area = document.getElementById('gameplayArea');
    const emojis = ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'];
    const pairs = [...emojis, ...emojis];
    
    // Shuffle
    pairs.sort(() => Math.random() - 0.5);
    memoryCards = pairs;
    flippedCards = [];
    memoryLocked = false;
    
    let gridHTML = '<div class="memory-grid">';
    
    pairs.forEach((emoji, index) => {
        gridHTML += `
            <div class="memory-card" data-index="${index}" onclick="handleMemoryClick(this)">
                <div class="memory-card-front">❓</div>
                <div class="memory-card-back">${emoji}</div>
            </div>`;
    });
    
    gridHTML += '</div>';
    area.innerHTML = gridHTML;
}

function handleMemoryClick(card) {
    if (memoryLocked || card.classList.contains('flipped')) return;
    
    card.classList.add('flipped');
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        memoryLocked = true;
        const [card1, card2] = flippedCards;
        const emoji1 = memoryCards[card1.dataset.index];
        const emoji2 = memoryCards[card2.dataset.index];
        
        if (emoji1 === emoji2) {
            engine.addScore(20);
            flippedCards = [];
            memoryLocked = false;
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                memoryLocked = false;
            }, 800);
        }
    }
}

function handleMemoryFlip(input) {
    // Handled by onclick
}

// ============================================
// Game 3: Sliding Puzzle
// ============================================
let slidingGrid = [];

function renderSlidingPuzzle() {
    const area = document.getElementById('gameplayArea');
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, null];
    
    // Shuffle
    do {
        numbers.sort(() => Math.random() - 0.5);
    } while (!isSolvable(numbers));
    
    slidingGrid = numbers;
    
    let gridHTML = '<div class="sliding-grid" style="grid-template-columns: repeat(3, 70px);">';
    
    numbers.forEach((num, index) => {
        if (num === null) {
            gridHTML += '<div class="sliding-cell empty"></div>';
        } else {
            gridHTML += `<div class="sliding-cell" onclick="handleSlidingClick(${index})">${num}</div>`;
        }
    });
    
    gridHTML += '</div>';
    area.innerHTML = gridHTML;
}

function isSolvable(grid) {
    let inversions = 0;
    const arr = grid.filter(x => x !== null);
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j]) inversions++;
        }
    }
    return inversions % 2 === 0;
}

function handleSlidingClick(index) {
    const emptyIndex = slidingGrid.indexOf(null);
    const validMoves = [
        emptyIndex - 1, // kiri
        emptyIndex + 1, // kanan
        emptyIndex - 3, // atas
        emptyIndex + 3  // bawah
    ];
    
    if (validMoves.includes(index) && isValidMove(emptyIndex, index)) {
        [slidingGrid[emptyIndex], slidingGrid[index]] = [slidingGrid[index], slidingGrid[emptyIndex]];
        engine.addScore(5);
        renderSlidingPuzzle();
        
        // Check win
        const winState = [1, 2, 3, 4, 5, 6, 7, 8, null];
        if (JSON.stringify(slidingGrid) === JSON.stringify(winState)) {
            engine.addScore(50);
            engine.completeGame();
        }
    }
}

function isValidMove(empty, target) {
    const emptyRow = Math.floor(empty / 3);
    const targetRow = Math.floor(target / 3);
    const emptyCol = empty % 3;
    const targetCol = target % 3;
    return (Math.abs(emptyRow - targetRow) + Math.abs(emptyCol - targetCol)) === 1;
}

function handleSlidingPuzzle(input) {
    // Handled by onclick
}

// ============================================
// Game 4: Pattern Finder
// ============================================
let patternGrid = [];
let patternTarget = null;

function renderPatternFinder() {
    const area = document.getElementById('gameplayArea');
    const gridSize = 5;
    patternGrid = [];
    
    // Generate pattern
    const pattern = [];
    const patternLength = 4;
    
    for (let i = 0; i < patternLength; i++) {
        pattern.push({
            row: Math.floor(Math.random() * gridSize),
            col: Math.floor(Math.random() * gridSize)
        });
    }
    
    patternTarget = [...pattern];
    
    // Create grid
    let gridHTML = `<div class="puzzle-grid" style="grid-template-columns: repeat(${gridSize}, 70px);">`;
    
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const isPattern = pattern.some(p => p.row === row && p.col === col);
            gridHTML += `
                <div class="puzzle-cell ${isPattern ? 'pattern-cell' : ''}" 
                     data-row="${row}" 
                     data-col="${col}"
                     style="background: ${isPattern ? 'var(--primary)' : 'rgba(255,255,255,0.1)'};"
                     onclick="handlePatternClick(${row}, ${col})">
                </div>`;
        }
    }
    
    gridHTML += '</div>';
    
    // Hide pattern after 2 seconds
    area.innerHTML = gridHTML;
    setTimeout(() => {
        document.querySelectorAll('.puzzle-cell').forEach(cell => {
            cell.style.background = 'rgba(255,255,255,0.1)';
            cell.classList.remove('pattern-cell');
        });
    }, 2000);
}

let patternGuesses = [];

function handlePatternClick(row, col) {
    if (patternGuesses.length >= patternTarget.length) return;
    
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    
    if (patternGuesses.some(p => p.row === row && p.col === col)) {
        cell.style.background = 'rgba(255,255,255,0.1)';
        patternGuesses = patternGuesses.filter(p => !(p.row === row && p.col === col));
    } else {
        cell.style.background = 'var(--secondary)';
        patternGuesses.push({ row, col });
    }
    
    if (patternGuesses.length === patternTarget.length) {
        checkPattern();
    }
}

function checkPattern() {
    let correct = 0;
    patternGuesses.forEach(guess => {
        if (patternTarget.some(p => p.row === guess.row && p.col === guess.col)) {
            correct++;
        }
    });
    
    engine.addScore(correct * 10);
    renderPatternFinder();
}

function handlePatternFinder(input) {
    // Handled by onclick
}

// ============================================
// Game 5: Quick Math
// ============================================
let mathQuestion = null;

function renderQuickMath() {
    const area = document.getElementById('gameplayArea');
    const operations = ['+', '-', '×'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    let a, b, answer;
    
    switch(op) {
        case '+':
            a = Math.floor(Math.random() * 50) + 1;
            b = Math.floor(Math.random() * 50) + 1;
            answer = a + b;
            break;
        case '-':
            a = Math.floor(Math.random() * 50) + 25;
            b = Math.floor(Math.random() * a);
            answer = a - b;
            break;
        case '×':
            a = Math.floor(Math.random() * 12) + 1;
            b = Math.floor(Math.random() * 12) + 1;
            answer = a * b;
            break;
    }
    
    mathQuestion = { a, b, op, answer };
    
    const wrongAnswers = [
        answer + Math.floor(Math.random() * 10) + 1,
        answer - Math.floor(Math.random() * 10) - 1,
        answer + Math.floor(Math.random() * 5) + 5
    ];
    
    const choices = [answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    
    area.innerHTML = `
        <div style="text-align: center;">
            <h2 style="font-size: 3rem; margin-bottom: 2rem;">${a} ${op} ${b} = ?</h2>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; max-width: 400px; margin: 0 auto;">
                ${choices.map(choice => `
                    <button class="math-choice" onclick="handleMathAnswer(${choice})" 
                            style="padding: 1.5rem; font-size: 1.5rem; background: var(--gradient-primary); 
                                   border: none; border-radius: var(--radius-md); color: white; cursor: pointer;">
                        ${choice}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function handleMathAnswer(choice) {
    if (choice === mathQuestion.answer) {
        engine.addScore(10);
        renderQuickMath();
    } else {
        engine.addScore(0);
        // Flash red
        event.target.style.background = 'var(--danger)';
        setTimeout(() => renderQuickMath(), 500);
    }
}

function handleQuickMath(input) {
    // Handled by onclick
}

// ============================================
// Game 6: Block Sort
// ============================================
let blockColumns = [[], [], [], [], []];

function renderBlockSort() {
    const area = document.getElementById('gameplayArea');
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F7DC6F', '#BB8FCE'];
    blockColumns = [[], [], [], [], []];
    
    // Generate random blocks
    for (let col = 0; col < 5; col++) {
        const numBlocks = Math.floor(Math.random() * 4) + 2;
        for (let i = 0; i < numBlocks; i++) {
            blockColumns[col].push(colors[Math.floor(Math.random() * colors.length)]);
        }
    }
    
    let html = '<div style="display: flex; gap: 1rem; justify-content: center; align-items: flex-end; min-height: 300px;">';
    
    blockColumns.forEach((column, colIndex) => {
        html += `<div style="display: flex; flex-direction: column-reverse; align-items: center; gap: 4px; cursor: pointer;" onclick="handleBlockClick(${colIndex})">`;
        column.forEach((color) => {
            html += `<div style="width: 60px; height: 60px; background: ${color}; border-radius: var(--radius-sm);"></div>`;
        });
        html += '</div>';
    });
    
    html += '</div>';
    area.innerHTML = html;
}

let selectedBlock = null;

function handleBlockClick(colIndex) {
    if (selectedBlock === null) {
        if (blockColumns[colIndex].length > 0) {
            selectedBlock = colIndex;
            highlightColumn(colIndex);
        }
    } else {
        if (selectedBlock !== colIndex && blockColumns[colIndex].length < 5) {
            const block = blockColumns[selectedBlock].pop();
            blockColumns[colIndex].push(block);
            engine.addScore(3);
        }
        selectedBlock = null;
        renderBlockSort();
    }
}

function highlightColumn(index) {
    // Visual feedback
    document.querySelectorAll('[onclick^="handleBlockClick"]').forEach((el, i) => {
        el.style.border = i === index ? '2px solid var(--primary)' : 'none';
    });
}

function handleBlockSort(input) {
    // Handled by onclick
}

// ============================================
// Game 7: Sequence Memory
// ============================================
let sequence = [];
let playerSequence = [];
let showingSequence = false;

function renderSequenceMemory() {
    const area = document.getElementById('gameplayArea');
    const buttons = ['🔴', '🟢', '🔵', '🟡'];
    sequence = [];
    playerSequence = [];
    showingSequence = false;
    
    // Generate sequence
    for (let i = 0; i < 5; i++) {
        sequence.push(Math.floor(Math.random() * 4));
    }
    
    area.innerHTML = `
        <div style="text-align: center;">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; max-width: 300px; margin: 0 auto 2rem;">
                ${buttons.map((btn, i) => `
                    <button class="seq-btn" data-index="${i}" 
                            style="width: 100px; height: 100px; font-size: 3rem; background: rgba(255,255,255,0.1); 
                                   border: 2px solid rgba(255,255,255,0.2); border-radius: var(--radius-lg); cursor: pointer;"
                            onclick="handleSequenceClick(${i})">
                        ${btn}
                    </button>
                `).join('')}
            </div>
            <button class="cta-button" onclick="showSequence()">Tampilkan Urutan</button>
        </div>
    `;
}

function showSequence() {
    showingSequence = true;
    const buttons = document.querySelectorAll('.seq-btn');
    let delay = 0;
    
    sequence.forEach((index, i) => {
        setTimeout(() => {
            buttons[index].style.background = 'var(--primary)';
            setTimeout(() => {
                buttons[index].style.background = 'rgba(255,255,255,0.1)';
                if (i === sequence.length - 1) showingSequence = false;
            }, 500);
        }, delay);
        delay += 800;
    });
}

function handleSequenceClick(index) {
    if (showingSequence) return;
    
    playerSequence.push(index);
    const buttons = document.querySelectorAll('.seq-btn');
    buttons[index].style.background = 'var(--secondary)';
    
    setTimeout(() => {
        buttons[index].style.background = 'rgba(255,255,255,0.1)';
    }, 200);
    
    if (playerSequence.length === sequence.length) {
        checkSequence();
    }
}

function checkSequence() {
    let correct = true;
    for (let i = 0; i < sequence.length; i++) {
        if (sequence[i] !== playerSequence[i]) {
            correct = false;
            break;
        }
    }
    
    if (correct) {
        engine.addScore(25);
    } else {
        engine.addScore(5);
    }
    
    renderSequenceMemory();
}

function handleSequenceMemory(input) {
    // Handled by onclick
}

// ============================================
// Game 8: Word Scramble
// ============================================
let scrambledWord = '';
let correctWord = '';

const words = ['PUZZLE', 'BLOCKLY', 'GAMING', 'LOGIC', 'BRAIN', 'SMART', 'THINK', 'SOLVE'];

function renderWordScramble() {
    const area = document.getElementById('gameplayArea');
    correctWord = words[Math.floor(Math.random() * words.length)];
    scrambledWord = correctWord.split('').sort(() => Math.random() - 0.5).join('');
    
    area.innerHTML = `
        <div style="text-align: center;">
            <h2 style="font-size: 3rem; letter-spacing: 0.5rem; margin-bottom: 2rem;">${scrambledWord}</h2>
            <input type="text" id="wordInput" 
                   style="padding: 1rem 2rem; font-size: 1.5rem; text-align: center; 
                          border-radius: var(--radius-md); border: 2px solid var(--primary); 
                          background: rgba(255,255,255,0.1); color: white; width: 80%; max-width: 400px;"
                   placeholder="Tebak katanya...">
            <br><br>
            <button class="cta-button" onclick="checkWord()">Cek Jawaban</button>
        </div>
    `;
}

function checkWord() {
    const input = document.getElementById('wordInput').value.toUpperCase();
    if (input === correctWord) {
        engine.addScore(15);
        renderWordScramble();
    } else {
        // Shake effect
        document.getElementById('wordInput').style.animation = 'shake 0.5s';
        setTimeout(() => {
            document.getElementById('wordInput').style.animation = '';
        }, 500);
    }
}

function handleWordScramble(input) {
    // Handled by onclick of button
}

// ============================================
// Game 9: Reaction Tap
// ============================================
let reactionTimeout = null;

function renderReactionTap() {
    const area = document.getElementById('gameplayArea');
    area.innerHTML = `
        <div style="text-align: center; min-height: 300px; display: flex; align-items: center; justify-content: center;">
            <button id="reactionBtn" 
                    style="width: 250px; height: 250px; border-radius: 50%; background: var(--danger); 
                           border: none; cursor: pointer; transition: var(--transition-fast);"
                    onclick="handleReactionClick()">
                <span style="font-size: 1.5rem; font-weight: 700; color: white;">TUNGGU HIJAU</span>
            </button>
        </div>
    `;
    
    startReactionGame();
}

function startReactionGame() {
    const btn = document.getElementById('reactionBtn');
    if (!btn) return;
    
    btn.style.background = 'var(--danger)';
    btn.querySelector('span').textContent = 'TUNGGU HIJAU';
    
    const delay = Math.random() * 3000 + 1000;
    reactionTimeout = setTimeout(() => {
        btn.style.background = 'var(--success)';
        btn.querySelector('span').textContent = 'TAP SEKARANG!';
        btn.dataset.ready = 'true';
    }, delay);
}

function handleReactionClick() {
    const btn = document.getElementById('reactionBtn');
    if (!btn) return;
    
    if (btn.dataset.ready === 'true') {
        engine.addScore(5);
        btn.dataset.ready = 'false';
        clearTimeout(reactionTimeout);
        startReactionGame();
    } else {
        // Too early
        btn.style.background = 'var(--warning)';
        btn.querySelector('span').textContent = 'TERLALU CEPAT!';
        clearTimeout(reactionTimeout);
        setTimeout(() => startReactionGame(), 1000);
    }
}

function handleReactionTap(input) {
    // Handled by onclick
}

// ============================================
// Game 10: Shape Sorter
// ============================================
const shapes = ['circle', 'square', 'triangle', 'diamond'];
let shapeGrid = [];

function renderShapeSorter() {
    const area = document.getElementById('gameplayArea');
    const gridSize = 6;
    shapeGrid = [];
    
    for (let i = 0; i < gridSize * gridSize; i++) {
        shapeGrid.push(shapes[Math.floor(Math.random() * shapes.length)]);
    }
    
    let gridHTML = `<div class="puzzle-grid" style="grid-template-columns: repeat(${gridSize}, 60px);">`;
    
    shapeGrid.forEach((shape, index) => {
        const symbol = { circle: '⬤', square: '⬛', triangle: '▲', diamond: '◆' }[shape];
        gridHTML += `
            <div class="puzzle-cell" data-shape="${shape}" data-index="${index}" 
                 style="font-size: 1.5rem;"
                 onclick="handleShapeClick(this)">
                ${symbol}
            </div>`;
    });
    
    gridHTML += '</div>';
    area.innerHTML = gridHTML;
}

let selectedShapes = [];

function handleShapeClick(cell) {
    if (selectedShapes.length === 0) {
        cell.classList.add('selected');
        selectedShapes.push(cell);
    } else {
        const firstShape = selectedShapes[0].dataset.shape;
        const secondShape = cell.dataset.shape;
        
        if (firstShape === secondShape && selectedShapes[0] !== cell) {
            selectedShapes[0].style.opacity = '0.2';
            cell.style.opacity = '0.2';
            engine.addScore(5);
        }
        
        selectedShapes[0].classList.remove('selected');
        selectedShapes = [];
    }
}

function handleShapeSorter(input) {
    // Handled by onclick
}

// Add shake animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);
