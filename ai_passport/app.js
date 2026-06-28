let currentStageIndex = 0;

// 画面読み込み時に問題一覧を自動ビルド
window.onload = () => {
    const container = document.getElementById('stage-list');
    container.innerHTML = '';
    
    loadedQuestions.forEach((q, index) => {
        const item = document.createElement('div');
        item.className = 'stage-item';
        item.innerHTML = `<div><strong>第 ${index + 1} 問</strong>: ${q.title}</div>
                          <button style="padding:6px 12px; background:var(--accent-color); border:none; border-radius:6px; font-weight:bold; cursor:pointer;" onclick="startLab(${index})">開始</button>`;
        container.appendChild(item);
    });
};

function startLab(index) {
    currentStageIndex = index;
    document.getElementById('menu-view').classList.remove('active');
    document.getElementById('lab-view').classList.add('active');
    
    const data = loadedQuestions[index];
    document.getElementById('problem-statement').innerText = data.problem_statement;
    document.getElementById('commentary').innerText = "ピースをタップして効果を発動させ、シミュレーション実験を行おう！";
    document.getElementById('answer-zone').style.display = 'none';
    
    const board = document.getElementById('main-board');
    board.innerHTML = `<div style="text-align:center; font-weight:bold; color:#a1a1aa;">
                        ${data.moving_object.icon}<br><br>
                        【${data.ui_mode}モード】<br>
                        ${data.scale_left_text} ─── ─── ${data.scale_right_text}
                       </div>`;
                       
    const tray = document.getElementById('piece-tray');
    tray.innerHTML = '';
    data.pieces.forEach((p) => {
        const pieceEl = document.createElement('div');
        pieceEl.className = 'piece';
        pieceEl.innerText = p.text;
        pieceEl.onclick = () => {
            document.getElementById('commentary').innerText = `【実験結果】: ${p.effect_commentary}`;
        };
        tray.appendChild(pieceEl);
    });
}

function openQuiz() {
    const data = loadedQuestions[currentStageIndex];
    const zone = document.getElementById('answer-zone');
    const box = document.getElementById('choices-box');
    box.innerHTML = '';
    
    data.choices.forEach((c, i) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerText = `肢 ${i + 1}: ${c.text}`;
        btn.onclick = () => {
            alert(c.is_correct ? `🎉正解！\n\n${c.commentary}` : `❌残念！\n\n${c.commentary}`);
            if(c.is_correct) zone.style.display = 'none';
        };
        box.appendChild(btn);
    });
    zone.style.display = 'flex';
}