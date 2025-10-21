let t = 0.0;
let vel = 0.02;
let num;
let paletteSelected;
let paletteSelected1;
let paletteSelected2;

// 新增：側邊選單設定
let sidebarW = 100;            
let sidebarAlpha = 220;
let menuItems = ["單元一作品", "單元一筆記", "作品三"];  // 修改選單文字
let itemH = 56;
let itemPadding = 16;
let hoveredIndex = -1;
let clickedIndex = -1;

// 新增：可收回動畫與觸發距離
let sidebarX = -sidebarW;        // 當前 X 偏移（-sidebarW 表示隱藏）
let sidebarTargetX = -sidebarW;  // 目標 X
let sidebarVel = 0;              // 速度（px/s）
let springStiffness = 48.0;      // 彈簧強度（越大收放越快）
let springDamping = 12.0;        // 阻尼（越大減震越快）
let openMargin = 100;            // 滑鼠靠左小於此值會打開
let closeMargin = 120;           // 滑出後要大於此值才會收回，避免抖動
let snapThreshold = 0.5;        // 距離小於此值就直接 snap 到目標

// （左上顯示但高度改為全螢幕）
let sidebarTopPadding = 12;
let sidebarTitleH = 28;

// 新增網站連結設定
const websites = {
    0: "https://benson960423-cloud.github.io/20251014_1/",
    1: "https://hackmd.io/@dJPZyAMQQSuax1vS-NvSxA/BJhZKO13ee"
};

// 在 setup 中加入關閉按鈕事件監聽
function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(2);
    angleMode(DEGREES);
    num = random(100000);
    paletteSelected = random(palettes);
    paletteSelected1 = random(palettes);
    paletteSelected2 = random(palettes);

    // 設定關閉按鈕事件
    const closeBtn = document.getElementById('frame-close');
    closeBtn.addEventListener('click', () => {
        document.getElementById('content-frame').style.display = 'none';
        closeBtn.style.display = 'none';
        clickedIndex = -1;
    });
}

function draw() {
    randomSeed(num);
    background(bgCol())
    stroke("#355070");
    circlePacking() 

    // 判斷是否在 sidebar 範圍（考慮目前 sidebarX）
    let localMouseX = mouseX - sidebarX;
    let isOverSidebar = localMouseX >= 0 && localMouseX <= sidebarW && mouseY >= 0 && mouseY <= height;

    // 使用 hysteresis：靠左小於 openMargin 開啟；離開超過 closeMargin 且不在選單內則收回
    if (mouseX < openMargin || isOverSidebar || clickedIndex !== -1) {
        sidebarTargetX = 0;
    } else if (mouseX > closeMargin) {
        sidebarTargetX = -sidebarW;
    }

    // 彈簧阻尼整流（考慮 deltaTime）
    let dt = min(deltaTime / 1000.0, 0.05); // 限制 dt 防止大幅跳動
    // 加速度 = k * (target - x) - c * v
    let force = springStiffness * (sidebarTargetX - sidebarX) - springDamping * sidebarVel;
    let acc = force; // 質量設為 1
    sidebarVel += acc * dt;
    sidebarX += sidebarVel * dt;

    // 若非常接近目標且速度小則直接對齊，避免長時間微微震盪
    if (abs(sidebarTargetX - sidebarX) < 0.3 && abs(sidebarVel) < 0.3) {
        sidebarX = sidebarTargetX;
        sidebarVel = 0;
    }

    // 在最上層畫側邊選單（使用 sidebarX 平移以實現收回）
    drawSidebar();
}

function circlePacking() {
    push();

    translate(width / 2, height / 2)
    let points = [];
    let count = 2000;
    for (let i = 0; i < count; i++) {
        let a = random(360);
        let d = random(width * 0.35);
        let s = random(200);
        let x = cos(a) * (d - s / 2);
        let y = sin(a) * (d - s / 2);
        let add = true;
        for (let j = 0; j < points.length; j++) {
            let p = points[j];
            if (dist(x, y, p.x, p.y) < (s + p.z) * 0.6) {
                add = false;
                break;
            }
        }
        if (add) points.push(createVector(x, y, s));
    }
    for (let i = 0; i < points.length; i++) {

        let p = points[i];
        let rot = random(360);
        push();
        translate(p.x, p.y);
        rotate(rot);
        blendMode(OVERLAY)
        let r = p.z - 5;
        gradient(r)
        shape(0, 0, r)
        pop();
    }
    pop();
 }

function shape(x, y, r) {
    push();
    noStroke();
    translate(x, y);
    let radius = r; //半徑
    let nums = 8
    for (let i = 0; i < 360; i += 360 / nums) {
        let ex = radius * sin(i);
        let ey = radius * cos(i);
        push();
        translate(ex,ey)
        rotate(atan2(ey, ex))
        distortedCircle(0,0,r);
    
        pop();
        stroke(randomCol())
        strokeWeight(0.5)
        line(0,0,ex,ey)
        ellipse(ex,ey,2)
    }
    pop();
}

function distortedCircle(x, y, r) {
    push();
    translate(x, y)
    //points
    let p1 = createVector(0, -r / 2);
    let p2 = createVector(r / 2, 0);
    let p3 = createVector(0, r / 2);
    let p4 = createVector(-r / 2, 0)
    //anker
    let val = 0.3;
    let random_a8_1 = random(-r * val, r * val)
    let random_a2_3 = random(-r * val, r * val)
    let random_a4_5 = random(-r * val, r * val)
    let random_a6_7 = random(-r * val, r * val)
    let ran_anker_lenA = r * random(0.2, 0.5)
    let ran_anker_lenB = r * random(0.2, 0.5)
    let a1 = createVector(ran_anker_lenA, -r / 2 + random_a8_1);
    let a2 = createVector(r / 2 + random_a2_3, -ran_anker_lenB);
    let a3 = createVector(r / 2 - random_a2_3, ran_anker_lenA);
    let a4 = createVector(ran_anker_lenB, r / 2 + random_a4_5);
    let a5 = createVector(-ran_anker_lenA, r / 2 - random_a4_5);
    let a6 = createVector(-r / 2 + random_a6_7, ran_anker_lenB);
    let a7 = createVector(-r / 2 - random_a6_7, -ran_anker_lenA);
    let a8 = createVector(-ran_anker_lenB, -r / 2 - random_a8_1);
    beginShape();
    vertex(p1.x, p1.y);
    bezierVertex(a1.x, a1.y, a2.x, a2.y, p2.x, p2.y)
    bezierVertex(a3.x, a3.y, a4.x, a4.y, p3.x, p3.y)
    bezierVertex(a5.x, a5.y, a6.x, a6.y, p4.x, p4.y)
    bezierVertex(a7.x, a7.y, a8.x, a8.y, p1.x, p1.y)
    endShape();
    pop();
}

// 新增：繪製側邊選單（全螢幕高度，寬度固定）
function drawSidebar() {
    push();
    translate(sidebarX, 0); // 整個選單隨 sidebarX 平移（負值代表收回在左側）

    // 背景半透明白色（全螢幕高度）
    noStroke();
    fill(255, sidebarAlpha);
    rect(0, 0, sidebarW, height);

    // 標題
    fill(40, 40, 40);
    textSize(18);
    textAlign(LEFT, TOP);
    text("選單", 12, 12);

    // 使用 local mouse 座標判斷懸停（考慮 sidebarX 平移）
    let localMouseX = mouseX - sidebarX;
    hoveredIndex = -1;
    for (let i = 0; i < menuItems.length; i++) {
        let y = 60 + i * itemH;
        let h = itemH - 10;
        if (localMouseX >= 0 && localMouseX <= sidebarW && mouseY >= y && mouseY <= y + h) {
            hoveredIndex = i;
        }
    }

    // 畫項目
    for (let i = 0; i < menuItems.length; i++) {
        let y = 60 + i * itemH;
        let h = itemH - 10;

        // 背景高亮（點擊或懸停）
        if (i === clickedIndex) {
            fill(30, 144, 255, 180);
            rect(8, y - 6, sidebarW - 16, h + 8, 8);
        } else if (i === hoveredIndex) {
            fill(200, 200, 200, 160);
            rect(8, y - 6, sidebarW - 16, h + 8, 8);
        }

        // 文字
        fill(30);
        if (i === clickedIndex) fill(255);
        textSize(14);
        textAlign(LEFT, CENTER);
        text(menuItems[i], 18, y + h / 2);
    }

    pop();
}

// 新：滑鼠點擊處理（在左側 reveal 區或選單內點選）
// 將原本 mousePressed 的 revealMargin 改為 openMargin（一致）
function mousePressed() {
    // 若使用者在靠近左邊的 reveal 區域點擊，先打開選單
    if (mouseX < openMargin && sidebarTargetX !== 0) {
        sidebarTargetX = 0;
        return;
    }

    // 計算 local mouse X（考慮目前 sidebarX）
    let localX = mouseX - sidebarX;
    if (localX >= 0 && localX <= sidebarW) {
        // 判斷點選的項目
        for (let i = 0; i < menuItems.length; i++) {
            let y = 60 + i * itemH;
            let h = itemH - 10;
            if (mouseY >= y && mouseY <= y + h) {
                clickedIndex = i;
                
                // 處理網站連結
                if (websites[i]) {
                    const iframe = document.getElementById('content-frame');
                    const closeBtn = document.getElementById('frame-close');
                    iframe.src = websites[i];
                    iframe.style.display = 'block';
                    closeBtn.style.display = 'block';
                }
                break;
            }
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}