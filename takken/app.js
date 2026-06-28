// ==========================================
// ⚙️ 宅建法律ラボ：システム・エンジン（app.js）
// ==========================================

let currentStageData = null;
let currentStageIndex = 0;
let activePieces = [];
let isRandomMode = false;
let userData = { exp: 0, level: 1 };
const TITLES = ["宅建見習い", "宅建アシスタント", "重要事項説明士", "主任者候補", "宅建マスター", "不動産王"];

// ------------------------------------------
// 📱 ビュー切り替え ＆ メニュー機能
// ------------------------------------------
function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(v => {
        v.classList.remove('active');
        v.style.display = 'none';
    });
    const target = document.getElementById(viewId);
    if(target) {
        target.classList.add('active');
        target.style.display = 'flex';
    }
}

function openMenu() {
    const container = document.getElementById('category-container'); 
    container.innerHTML = '';
    const quizSource = (typeof loadedQuestions !== 'undefined') ? loadedQuestions : [];
    
    if (quizSource.length === 0) {
        container.innerHTML = `<div style="color:#ef8354; text-align:center; padding:20px;">⚠️ 問題データが読み込めていません。</div>`;
        showView('menu-view');
        return;
    }

    const groups = ["権利関係", "宅建業法", "法令上の制限", "税・その他"];
    let hasAnyGroup = false;

    groups.forEach(groupName => {
        const problemsInGroup = quizSource.map((q, idx) => ({...q, originalIndex: idx})).filter(q => q.group === groupName);
        if(problemsInGroup.length > 0) {
            hasAnyGroup = true;
            const groupDiv = document.createElement('div');
            groupDiv.innerHTML = `<div class="category-section-title">📘 ${groupName}</div>`;
            const listDiv = document.createElement('div'); listDiv.className = "problem-list";
            problemsInGroup.forEach(q => {
                const btn = document.createElement('div'); btn.className = 'problem-item-btn';
                btn.innerHTML = `<span>${q.category || groupName}</span><br><strong>${q.title}</strong>`;
                btn.onclick = () => { isRandomMode = false; currentStageIndex = q.originalIndex; loadStage(currentStageIndex); showView('play-view'); };
                listDiv.appendChild(btn);
            });
            groupDiv.appendChild(listDiv); container.appendChild(groupDiv);
        }
    });

    if(!hasAnyGroup) {
        const groupDiv = document.createElement('div');
        groupDiv.innerHTML = `<div class="category-section-title">📘 特訓メニュー</div>`;
        const listDiv = document.createElement('div'); listDiv.className = "problem-list";
        quizSource.forEach((q, idx) => {
            const btn = document.createElement('div'); btn.className = 'problem-item-btn';
            btn.innerHTML = `<span>Q.${idx+1}</span><br><strong>${q.title}</strong>`;
            btn.onclick = () => { isRandomMode = false; currentStageIndex = idx; loadStage(currentStageIndex); showView('play-view'); };
            listDiv.appendChild(btn);
        });
        groupDiv.appendChild(listDiv); container.appendChild(groupDiv);
    }
    showView('menu-view');
}

function startRandomPlay() {
    const quizSource = (typeof loadedQuestions !== 'undefined') ? loadedQuestions : [];
    if(quizSource.length === 0) return;
    isRandomMode = true;
    currentStageIndex = Math.floor(Math.random() * quizSource.length);
    loadStage(currentStageIndex);
    showView('play-view');
}

function openDictionary() {
    const list = document.getElementById('dict-list'); 
    list.innerHTML = '';
    const quizSource = (typeof loadedQuestions !== 'undefined') ? loadedQuestions : [];
    
    let addedTerms = new Set();
    quizSource.forEach(q => {
        if(q.term_help) {
            q.term_help.forEach(t => {
                if(!addedTerms.has(t.term)) {
                    addedTerms.add(t.term);
                    const d = (typeof glossary !== 'undefined' && glossary[t.term]) ? glossary[t.term] : { icon: "💡", catchphrase: "重要キーワード" };
                    const item = document.createElement('div'); item.className = 'dict-item';
                    item.innerHTML = `
                        <div class="dict-icon">${d.icon}</div>
                        <div class="dict-content">
                            <div class="dict-term">${t.term}</div>
                            <div class="dict-catch">${d.catchphrase}</div>
                            <div class="dict-desc">${t.definition}</div>
                        </div>`;
                    list.appendChild(item);
                }
            });
        }
    });
    showView('dict-view');
}

// ------------------------------------------
// 🧪 プレイ画面エンジン
// ------------------------------------------
function processText(text, currentData) {
    if(!text) return "";
    let res = text;
    if(currentData && currentData.term_help) {
        currentData.term_help.forEach(t => { 
            res = res.split(t.term).join(`<span class="term-highlight" onclick="showInlineGlossary('${t.term}')">${t.term}</span>`); 
        });
    }
    return res;
}

function showInlineGlossary(term) {
    if(!currentStageData || !currentStageData.term_help) return;
    const found = currentStageData.term_help.find(t => t.term === term);
    if(!found) return;
    const d = (typeof glossary !== 'undefined' && glossary[term]) ? glossary[term] : { icon: "💡", catchphrase: "重要キーワード" };
    document.getElementById('glossary-container').style.display = 'flex';
    document.getElementById('glossary-inline-icon').innerText = d.icon;
    document.getElementById('glossary-inline-title').innerText = term;
    document.getElementById('glossary-inline-catch').innerText = d.catchphrase;
    document.getElementById('glossary-inline-desc').innerText = found.definition;
}

function loadStage(index) {
    const quizSource = (typeof loadedQuestions !== 'undefined') ? loadedQuestions : [];
    document.querySelectorAll('.fixed-character, .keyword-slot, .puzzle-piece').forEach(el => el.remove());
    document.getElementById('answer-btn-wrapper').innerHTML = '';
    document.getElementById('tray-container').innerHTML = ''; 
    activePieces = [];
    
    const outerCanvas = document.getElementById('canvas-outer');
    if(outerCanvas) outerCanvas.scrollTop = 0;
    
    document.getElementById('glossary-container').style.display = 'none';
    document.getElementById('answer-selection-zone').style.display = 'none';
    
    // コントロールバーとトレイの基本表示状態リセット
    document.getElementById('control-bar').style.display = 'flex';
    const mainBtn = document.getElementById('finish-experiment-btn');
    mainBtn.style.display = 'block';
    mainBtn.innerText = '実験終了、答える！';
    mainBtn.onclick = () => finishSimulation();
    
    if (index >= quizSource.length) { alert('全問クリア！ホームに戻ります。'); showView('home-view'); return; }

    const data = quizSource[index]; currentStageData = data;
    document.getElementById('stage-title').innerText = data.title;
    document.getElementById('stage-category').innerText = data.category || "実践過去問シミュレーション";
    document.getElementById('question-box').innerHTML = processText(data.problem_statement, data);

    const scaleZone = document.getElementById('balance-scale'); 
    const sortZone = document.getElementById('sorting-zone'); 
    const flowZone = document.getElementById('flow-zone'); 
    const sliderZone = document.getElementById('slider-zone'); 
    const land = document.getElementById('movable-land');
    const canvasContainer = document.getElementById('canvas-container');
    
    if(scaleZone) scaleZone.style.display = 'none'; 
    if(sortZone) sortZone.style.display = 'none'; 
    if(flowZone) flowZone.style.display = 'none'; 
    if(sliderZone) sliderZone.style.display = 'none'; 
    if(land) land.style.display = 'none';

    if(land && data.moving_object) {
        land.innerHTML = `${data.moving_object.icon || "🏠"}<span id="land-sub">対象</span>`;
    }

    if (data.ui_mode === 'SCALE') {
        document.getElementById('tray-outer').style.display = 'flex';
        if(scaleZone) scaleZone.style.display = 'flex'; 
        if(land) land.style.display = 'flex';
        document.getElementById('scale-left').innerText = data.scale_left_text || "左皿"; 
        document.getElementById('scale-right').innerText = data.scale_right_text || "右皿";
        
        const leftLabel = (data.scale_left_text || "候補A").replace(/⚖️\s*/, '').split('（')[0];
        const rightLabel = (data.scale_right_text || "候補B").replace(/⚖️\s*/, '').split('（')[0];
        const dummyChars = [
            { id: "char-left", name: leftLabel, role: "当事者", x: 20, y: 60 },
            { id: "char-center", name: "売主側", role: "トラブル元", x: 50, y: 85 },
            { id: "char-right", name: rightLabel, role: "当事者", x: 80, y: 60 }
        ];
        dummyChars.forEach(c => {
            const el = document.createElement('div'); el.className = 'fixed-character'; el.id = c.id;
            el.style.left = c.x + '%'; el.style.top = c.y + '%'; el.innerHTML = `<span class="char-title">${c.role}</span>${c.name}`;
            canvasContainer.appendChild(el);
        });

        const sEl = document.createElement('div'); sEl.className = 'keyword-slot'; sEl.id = 'target-slot'; sEl.style.left = '50%'; sEl.style.top = '53%'; sEl.innerText = "条件をはめる"; canvasContainer.appendChild(sEl);
        document.getElementById('commentary-text').innerText = '下のトレイからパーツを運んで実験してみよう！';

    } else if (data.ui_mode === 'SORT_BOX') {
        document.getElementById('tray-outer').style.display = 'flex';
        if(sortZone) sortZone.style.display = 'flex';
        document.getElementById('sort-title-left').innerText = data.scale_left_text || "NG"; 
        document.getElementById('sort-title-right').innerText = data.scale_right_text || "OK";
        document.getElementById('sort-box-left').classList.remove('correct-flash'); 
        document.getElementById('sort-box-right').classList.remove('correct-flash');
        document.getElementById('commentary-text').innerText = '下のトレイからパーツを運んで仕分けてみよう！';

    } else if (data.ui_mode === 'FLOW') {
        document.getElementById('tray-outer').style.display = 'flex';
        if(flowZone) flowZone.style.display = 'block'; 
        if(land) land.style.display = 'flex';
        const labels = data.flow_labels || { checkpoint: "🔍 条件分岐の関所", left_goal: data.scale_left_text || "必要", right_goal: data.scale_right_text || "不要" };
        const ck = document.getElementById('flow-checkpoint'); if(ck) ck.innerHTML = labels.checkpoint; 
        const lg = document.getElementById('flow-goal-left'); if(lg) lg.innerHTML = labels.left_goal; 
        const rg = document.getElementById('flow-goal-right'); if(rg) rg.innerHTML = labels.right_goal;
        
        const sEl = document.createElement('div'); sEl.className = 'keyword-slot'; sEl.id = 'target-slot'; sEl.style.left = '50%'; sEl.style.top = '45%'; sEl.innerText = "条件をはめる"; canvasContainer.appendChild(sEl);
        document.getElementById('commentary-text').innerText = '下のトレイからパーツを運んで実験してみよう！';

    } else if (data.ui_mode === 'SLIDER_LIMIT') {
        if(sliderZone) sliderZone.style.display = 'flex';
        document.getElementById('tray-outer').style.display = 'none'; // スライダー問題はトレイ不要
        document.getElementById('commentary-text').innerText = 'スライダーを動かして、制限基準値の限界をシミュレーションしよう！';
        
        const sc = data.slider_config || { min: 0, max: 200, limit: 100, unit: "㎡", label: "値", start: 50 };
        const slider = document.getElementById('building-slider');
        slider.min = sc.min; slider.max = sc.max; slider.value = sc.start;
        
        const limitLine = document.getElementById('limit-line');
        const limitRatio = sc.limit / sc.max;
        limitLine.style.bottom = (limitRatio * 140) + 'px';
        document.getElementById('limit-label').innerText = '上限 ' + sc.limit + sc.unit;
        
        slider.oninput = (e) => {
            const val = parseInt(e.target.value);
            document.getElementById('slider-value-disp').innerText = `${sc.label}: ${val} ${sc.unit}`;
            const box = document.getElementById('building-box');
            const ratio = val / sc.max;
            box.style.height = (ratio * 140) + 'px';
            box.style.width = (40 + ratio * 40) + 'px';
            box.innerText = val;
            
            if(val > sc.limit) {
                box.classList.add('building-over');
                document.getElementById('commentary-text').innerText = "🚨 制限オーバー！このままでは超過（NG）してしまいます！";
            } else {
                box.classList.remove('building-over');
                document.getElementById('commentary-text').innerText = "✅ 基準内クリア！この範囲であれば適法（OK）です。";
            }
        };
        slider.dispatchEvent(new Event('input'));
    }

    const ansZone = document.getElementById('answer-btn-wrapper');
    if (data.choices) {
        data.choices.forEach(c => {
            const btn = document.createElement('button'); 
            btn.className = 'choice-btn';
            btn.innerText = c.text; 
            btn.onclick = () => submitAnswer(c.is_correct, c.commentary); 
            ansZone.appendChild(btn);
        });
    }

    if (data.pieces && data.pieces.length > 0) {
        const pWidth = 140; const gap = 12;
        const tCon = document.getElementById('tray-container');
        tCon.style.width = ((pWidth + gap) * data.pieces.length + 60) + 'px';
        data.pieces.forEach((p, i) => {
            const el = document.createElement('div'); el.className = 'puzzle-piece'; el.innerText = p.text;
            el.dataset.winner = p.target || ""; el.dataset.boxTarget = p.target || ""; el.dataset.feed = p.effect_commentary || "";
            el.style.position = 'relative'; tCon.appendChild(el); activePieces.push(el); setupDrag(el);
        });
        triggerEffect('center');
    }
}

// 🕹️ スクロール対応型ドラッグ＆ドロップエンジン
function setupDrag(el) {
    let isDragging = false, startX, startY;
    const start = (e) => {
        if(document.getElementById('answer-selection-zone').style.display === 'flex') return;
        isDragging = true; const clientX = e.touches ? e.touches[0].clientX : e.clientX; const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const rect = el.getBoundingClientRect(); startX = clientX - rect.left; startY = clientY - rect.top;
        document.body.appendChild(el); el.style.position = 'fixed'; el.style.left = rect.left + 'px'; el.style.top = rect.top + 'px'; el.style.margin = '0'; el.style.zIndex = 1000;
        el.style.opacity = "1";
    };
    const move = (e) => {
        if (!isDragging) return; e.preventDefault(); const clientX = e.touches ? e.touches[0].clientX : e.clientX; const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        el.style.left = (clientX - startX) + 'px'; el.style.top = (clientY - startY) + 'px';
    };
    const end = () => {
        if (!isDragging) return; isDragging = false;
        const pieceRect = el.getBoundingClientRect(); const pCX = pieceRect.left + pieceRect.width / 2; const pCY = pieceRect.top + pieceRect.height / 2;

        if (currentStageData.ui_mode === 'SCALE' || currentStageData.ui_mode === 'FLOW') {
            const targetSlot = document.getElementById('target-slot');
            if (targetSlot) {
                const slotRect = targetSlot.getBoundingClientRect();
                if (Math.abs(pCX - (slotRect.left + slotRect.width/2)) < 60 && Math.abs(pCY - (slotRect.top + slotRect.height/2)) < 60) {
                    document.getElementById('canvas-container').appendChild(el); el.style.position = 'absolute'; const cRect = document.getElementById('canvas-container').getBoundingClientRect();
                    el.style.left = (slotRect.left - cRect.left + (slotRect.width - pieceRect.width)/2) + 'px'; el.style.top = (slotRect.top - cRect.top + (slotRect.height - pieceRect.height)/2) + 'px';
                    
                    activePieces.forEach(p => { if (p !== el) returnToTray(p); });
                    triggerEffect(el.dataset.winner); document.getElementById('commentary-text').innerText = el.dataset.feed; return;
                }
            }
        } else if (currentStageData.ui_mode === 'SORT_BOX') {
            const bL = document.getElementById('sort-box-left'), bR = document.getElementById('sort-box-right');
            const rL = bL.getBoundingClientRect(), rR = bR.getBoundingClientRect();
            if (pCX > rL.left && pCX < rL.right && pCY > rL.top && pCY < rL.bottom) { placeInBox(el, bL, "left"); return; } 
            else if (pCX > rR.left && pCX < rR.right && pCY > rR.top && pCY < rR.bottom) { placeInBox(el, bR, "right"); return; }
        }
        returnToTray(el); let anyPlaced = activePieces.some(p => p.parentElement === document.getElementById('canvas-container') || p.parentElement.classList.contains('sort-box'));
        if (!anyPlaced && currentStageData.ui_mode !== 'SORT_BOX') triggerEffect('center');
    };
    el.addEventListener('touchstart', start, {passive:false}); window.addEventListener('touchmove', move, {passive:false}); window.addEventListener('touchend', end);
    el.addEventListener('mousedown', start); window.addEventListener('mousemove', move); window.addEventListener('mouseup', end);
}

function returnToTray(el) { document.getElementById('tray-container').appendChild(el); el.style.position = 'relative'; el.style.left = '0'; el.style.top = '0'; el.style.margin = '0'; el.style.opacity = "1"; }
function placeInBox(el, box, side) {
    box.appendChild(el); el.style.position = 'static'; el.style.margin = '5px 0'; el.style.opacity = "1";
    if(el.dataset.boxTarget === side) box.classList.add('correct-flash'); else box.classList.remove('correct-flash');
    document.getElementById('commentary-text').innerText = el.dataset.feed;
}

function triggerEffect(winner) {
    const land = document.getElementById('movable-land'); if (!land) return;
    if (currentStageData.ui_mode === 'SCALE') {
        const sL = document.getElementById('scale-left'), sR = document.getElementById('scale-right');
        if (winner === 'left') { sL.style.transform='translateY(15px)'; sR.style.transform='translateY(-15px)'; land.style.left='20%'; land.style.top='35%'; }
        else if (winner === 'right') { sL.style.transform='translateY(-15px)'; sR.style.transform='translateY(15px)'; land.style.left='80%'; land.style.top='35%'; }
        else { sL.style.transform='translateY(0)'; sR.style.transform='translateY(0)'; land.style.left='50%'; land.style.top='30%'; }
    } else if (currentStageData.ui_mode === 'FLOW') {
        const gL = document.getElementById('flow-goal-left'), gR = document.getElementById('flow-goal-right');
        const cRect = document.getElementById('canvas-container').getBoundingClientRect();
        if (winner === 'left') { land.style.left=(gL.getBoundingClientRect().left - cRect.left + 32)+'px'; land.style.top=(gL.getBoundingClientRect().top - cRect.top + 60)+'px'; }
        else if (winner === 'right') { land.style.left=(gR.getBoundingClientRect().left - cRect.left + 32)+'px'; land.style.top=(gR.getBoundingClientRect().top - cRect.top + 60)+'px'; }
        else { land.style.left='50%'; land.style.top='28%'; }
    }
}

function finishSimulation() {
    if (currentStageData.ui_mode !== 'SLIDER_LIMIT') {
        let hasPiece = activePieces.some(p => p.parentElement !== document.getElementById('tray-container'));
        if(!hasPiece) { alert("パーツを運んでシミュレーションしてみよう！"); return; }
    }
    
    activePieces.forEach(p => {
        p.style.zIndex = "1";
        p.style.opacity = "0.3"; 
    });

    // 🌟 修正：実験終了時に固定のコントロールバーとトレイを完全に非表示にして4択画面を表示
    document.getElementById('control-bar').style.display = 'none';
    document.getElementById('tray-outer').style.display = 'none';
    
    document.getElementById('answer-selection-zone').style.display = 'flex';
    document.getElementById('commentary-text').innerText = "💡 実験終了！本試験の4択から、正しいと思う選択肢を選ぼう！";
}

function submitAnswer(isCorrect, explanationText) {
    const modal = document.getElementById('result-modal');
    const modalContent = modal.querySelector('.modal-content');
    
    if (isCorrect) {
        shootConfetti(); addExp(20);
        modalContent.className = "modal-content";
        document.getElementById('result-title').innerText = "🎉 見事大正解！";
        document.getElementById('result-title').style.color = "#4ecdc4";
        document.getElementById('result-body').innerText = explanationText || "完璧なジャッジです！";
        
        document.getElementById('answer-selection-zone').style.display = 'none';
        
        const controlBar = document.getElementById('control-bar');
        controlBar.innerHTML = `<button id="finish-experiment-btn" class="action-btn" onclick="nextStage()">${isRandomMode ? "次のランダム問題へ ➔" : "次の問題へ ➔"}</button>`;
        controlBar.style.display = 'flex';
    } else {
        modalContent.className = "modal-content fail";
        document.getElementById('result-title').innerText = "❌ 不正解！罠にハマりました";
        document.getElementById('result-title').style.color = "#ef8354";
        document.getElementById('result-body').innerText = explanationText || "もう一度、問題文とシミュレーションを確認してみよう！";
    }
    modal.style.display = "flex";
}

function closeModal() { 
    document.getElementById('result-modal').style.display = "none"; 
}

function nextStage() { 
    const controlBar = document.getElementById('control-bar');
    // 次の問題に進む、または初期化する時は「実験終了、答える！」ボタンの構造にリセットする
    controlBar.innerHTML = `<button id="finish-experiment-btn" class="action-btn" onclick="finishSimulation()">実験終了、答える！</button>`;
    
    if(isRandomMode) startRandomPlay(); 
    else { currentStageIndex++; loadStage(currentStageIndex); showView('play-view'); }
}

// ------------------------------------------
// 🏆 ユーザー成長 ＆ 紙吹雪エフェクト
// ------------------------------------------
function loadUserData() {
    const saved = localStorage.getItem('takken_lab_savedata');
    if(saved) userData = JSON.parse(saved);
    updateStatusCard();
}
function saveUserData() { localStorage.setItem('takken_lab_savedata', JSON.stringify(userData)); }
function updateStatusCard() {
    const levelDisp = document.getElementById('user-level-disp');
    if(levelDisp) {
        levelDisp.innerText = `Lv. ${userData.level}`;
        const titleIdx = Math.min(userData.level - 1, TITLES.length - 1);
        document.getElementById('user-title-disp').innerText = TITLES[titleIdx];
        const nextExp = userData.level * 100;
        const ratio = Math.min((userData.exp / nextExp) * 100, 100);
        document.getElementById('exp-bar-fill').style.width = ratio + '%';
        document.getElementById('exp-text-disp').innerText = `EXP: ${userData.exp} / ${nextExp}`;
    }
}
function addExp(amount) {
    userData.exp += amount;
    let nextExp = userData.level * 100;
    let leveledUp = false;
    while(userData.exp >= nextExp) { userData.exp -= nextExp; userData.level++; nextExp = userData.level * 100; leveledUp = true; }
    saveUserData(); updateStatusCard();
    if(leveledUp) setTimeout(() => {
        const titleIdx = Math.min(userData.level - 1, TITLES.length - 1);
        document.getElementById('levelup-modal').style.display = 'flex';
        document.getElementById('levelup-level').innerText = userData.level;
        document.getElementById('levelup-title').innerText = TITLES[titleIdx];
        shootConfetti();
    }, 1500);
}
function closeLevelUp() { document.getElementById('levelup-modal').style.display = 'none'; }

let particles = [], confettiCtx = null, confettiCanvas = null;
function initConfetti() { confettiCanvas = document.getElementById('confetti-canvas'); if(confettiCanvas) { confettiCtx = confettiCanvas.getContext('2d'); confettiCanvas.width = window.innerWidth; confettiCanvas.height = window.innerHeight; } }
function shootConfetti() {
    if(!confettiCtx) initConfetti();
    for(let i=0; i<80; i++) particles.push({ x: window.innerWidth / 2, y: window.innerHeight / 2, r: Math.random() * 6 + 3, dx: Math.random() * 12 - 6, dy: Math.random() * -15 - 5, color: ['#ffbc42', '#4ecdc4', '#ef8354', '#ffffff', '#2b5876'][Math.floor(Math.random()*5)] });
    requestAnimationFrame(updateConfetti);
}
function updateConfetti() {
    if(particles.length === 0) { if(confettiCtx) confettiCtx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height); return; }
    confettiCtx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
    for(let i=0; i<particles.length; i++) {
        let p = particles[i]; p.dy += 0.4; p.x += p.dx; p.y += p.dy;
        confettiCtx.beginPath(); confettiCtx.arc(p.x, p.y, p.r, 0, Math.PI*2); confettiCtx.fillStyle = p.color; confettiCtx.fill();
    }
    particles = particles.filter(p => p.y < confettiCanvas.height);
    requestAnimationFrame(updateConfetti);
}

// 起動処理
window.onload = () => { loadUserData(); showView('home-view'); };
window.onresize = () => {
    if(currentStageData && currentStageData.ui_mode !== 'SLIDER_LIMIT' && currentStageData.ui_mode !== 'SORT_BOX') {
        const p = activePieces.find(el => el.parentElement === document.getElementById('canvas-container'));
        triggerEffect(p ? p.dataset.winner : 'center');
    }
};