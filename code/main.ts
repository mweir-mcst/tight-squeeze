import kaboom, {AreaComp, ColorComp, GameObj, OpacityComp, OriginComp, PosComp, ScaleComp, SpriteComp} from "kaboom";
import {Level, LevelInitInfo} from "./global";

import level1 from "../levels/level1.json";
import level2 from "../levels/level2.json";
import level3 from "../levels/level3.json";
import level4 from "../levels/level4.json";
import level5 from "../levels/level5.json";
import level6 from "../levels/level6.json";
import level7 from "../levels/level7.json";
import level8 from "../levels/level8.json";
import level9 from "../levels/level9.json";
import level10 from "../levels/level10.json";
import level11 from "../levels/level11.json";
import level12 from "../levels/level12.json";
import level13 from "../levels/level13.json";

const kbm = kaboom({
    width: 1000,
    height: 1000,
    background: [0, 0, 0],
    font: "sinko"
});

let level = 1;
let hasWon = false;
let music;
let mouse = vec2();

Level.init(mouse);

async function transition(overlay: GameObj<OpacityComp>, fadeIn: boolean, change = 0.1, count = 10, each: (i: number) => void = () => {}) {
    for (let i = 0; i < count; i++) {
        overlay.opacity += (fadeIn ? -1 : 1) * change;
        each(i);
        await wait(0);
    }
}

function createOverlay(defaultOpacity = 1) {
    return add([
        rect(1000, 1000),
        color(0, 0, 0),
        opacity(defaultOpacity),
        z(99)
    ]);
}

async function addLevel(options: LevelInitInfo) {
    const overlay = createOverlay();
    let paused = false;

    const currentLevel = new Level(options, async () => {
        await transition(overlay, false);
        go(`level${++level}`);
        if (getData("currentLevel", 1) < level) setData("currentLevel", level);
    }, async () => {
        if (paused) {
            paused = false;
            hasWon = false;
            paused1.opacity = 0;
            paused2.opacity = 0;
            paused3.opacity = 0;
            await transition(overlay, false, 0.05);
            music.stop();
            go(`levelSelect`);
        } else {
            if (hasWon) return;
            await transition(overlay, false);
            go(`level${level}`);
        }
    });

    let paused1 = add([
        text("Paused", {size: 100}),
        pos(0,0),
        opacity(0),
        z(100)
    ]);
    paused1.moveTo(500 - paused1.width / 2, 200);

    let paused2 = add([
        text("Press P to Continue", {size: 50}),
        pos(0,0),
        opacity(0),
        z(100)
    ]);
    paused2.moveTo(500 - paused2.width / 2, 500);

    let paused3 = add([
        text("Press R for Level Select", {size: 50}),
        pos(0,0),
        opacity(0),
        z(100)
    ]);
    paused3.moveTo(500 - paused3.width / 2, 525 + paused2.height);

    keyPress("p", async() => {
        if (paused) {
            await transition(overlay, true, 0.1, 5, i => {
                paused1.opacity -= 0.2;
                paused2.opacity -= 0.2;
                paused3.opacity -= 0.2;
                music.volume(0.5 + (i + 1) * 0.1);
            });
            currentLevel.hasWon = false;
            paused = false;
        } else {
            if (hasWon) return;
            paused = true;
            currentLevel.hasWon = true;
            await transition(overlay, false, 0.1, 5, i => {
                paused1.opacity += 0.2;
                paused2.opacity += 0.2;
                paused3.opacity += 0.2;
                music.volume(1 - (i + 1) * 0.1);
            });
        }
    });

    await transition(overlay, true);
}

scene("level1", async () => {
    add([
        text("WASD or arrows to move.\nPush the block at the center\nof its sides. \nPress R to reset, P to pause.", {size: 40}),
        pos(20, 15),
        z(98)
    ]);
    await addLevel(level1);
})

scene("level2", async () => {
    add([
        text("Press P to Pause", {size: 40}),
        pos(20, 15),
        z(98)
    ]);
    await addLevel(level2);
});

scene("level3", async () => {
    await addLevel(level3);
});

scene("level4", async () => {
    await addLevel(level4);
});

scene("level5", async () => {
    await addLevel(level5);
});

scene("level6", async () => {
    add([
        text("The circle is a switch.When\nthe block sits on top of it, \nall blue walls allow you to\nwalk through them.", {size: 40}),
        pos(20, 15),
        z(98)
    ]);
    await addLevel(level6);
});

scene("level7", async () => {
    await addLevel(level7);
});

scene("level8", async () => {
    await addLevel(level8);
});

scene("level9", async () => {
    await addLevel(level9);
});

scene("level10", async () => {
    await addLevel(level10);
});

scene("level11", async () => {
    await addLevel(level11);
});

scene("level12", async () => {
    await addLevel(level12);
});

scene("level13", async () => {
    await addLevel(level13);
});

function grid() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            add([
                sprite(`grid`, {width: 100, height: 100, quad: quad(i % 4 * 0.25, j % 4 * 0.25, 0.25, 0.25)}),
                pos(i * 100, j * 100),
                "grid"
            ]);
        }
    }
}

scene("level14", () => {
    grid();

    let topText = add([
        text("Thanks for Playing!", {size: 60}),
        pos(0, 0)
    ]);
    topText.moveTo(500 - topText.width / 2, 100);

    let credits = add([
        text("Creative Lead:\nXander Russell\n\nDevelopment Lead:\nMatthew Weir\n\nSound Design:\nAbigail Prowse\n\nArt Lead:\nFaith Yap", {size: 50}),
        pos(0,0)
    ]);
    credits.moveTo(500 - credits.width / 2, 500 - credits.height / 2);

    let bottomText = add([
        text("More levels coming soon!", {size: 50}),
        pos(0,0)
    ]);
    bottomText.moveTo(500 - bottomText.width / 2, 850);

});

scene("welcome", () => {
    grid();

    let box1 = add([
        sprite("block", {width: 300, height: 300}),
        pos(500, 500),
        area({width: 300, height: 300}),
        scale(),
        kbm.origin("center")
    ]);

    let text1 = add([
        text("Play", {size: 60}),
        pos(500, 500),
        scale(),
        kbm.origin("center")
    ]);

    let box2 = add([
        sprite("block", {width: 200, height: 200}),
        pos(175, 500),
        area({width: 200, height: 200}),
        scale(),
        kbm.origin("center")
    ]);

    let text2 = add([
        text("About", {size: 35}),
        pos(175, 500),
        scale(),
        kbm.origin("center")
    ]);

    let box3 = add([
        sprite("block", {width: 200, height: 200}),
        pos(825, 500),
        area({width: 200, height: 200}),
        scale(),
        kbm.origin("center")
    ]);

    let text3 = add([
        text("Level", {size: 35}),
        pos(825, 500),
        scale(),
        kbm.origin(vec2(0, 1))
    ]);
    let text4 = add([
        text("Editor", {size: 35}),
        pos(825, 500),
        scale(),
        kbm.origin(vec2(0, -1))
    ]);

    let text5 = add([
        text("Tight Squeeze", {size: 80}),
        pos(0, 0)
    ]);
    text5.moveTo(500 - (text5.width / 2), 100);

    let overlay = createOverlay(0);

    let clickAction = false;
    action(async () => {
        let hover = false;
        if (box1.hasPoint(mouse)) {
            box1.scaleTo(1.5);
            text1.scaleTo(1.5);
            hover = true;
            if (mouseIsDown() && !clickAction) {
                clickAction = true;
                await transition(overlay, false);
                go("levelSelect");
            }
        } else {
            box1.scaleTo(1);
            text1.scaleTo(1);
        }
        if (box2.hasPoint(mouse)) {
            box2.scaleTo(1.5);
            text2.scaleTo(1.5);
            hover = true;
            if (mouseIsDown() && !clickAction) {
                clickAction = true;
                await transition(overlay, false);
                go("about");
            }
        } else {
            box2.scaleTo(1);
            text2.scaleTo(1);
        }
        if (box3.hasPoint(mouse)) {
            box3.scaleTo(1.5);
            text3.scaleTo(1.5);
            text4.scaleTo(1.5);
            hover = true;
            if (mouseIsDown() && !clickAction) {
                clickAction = true;
                await transition(overlay, false);
                go("levelEditor");
            }
        } else {
            box3.scaleTo(1);
            text3.scaleTo(1);
            text4.scaleTo(1);
        }
        if (hover) {
            cursor("pointer");
        } else {
            cursor("default");
        }
    });
});

scene("levelSelect", async () => {
    let overlay = createOverlay();

    grid();

    let boxHoverFunctions: Map<GameObj<SpriteComp|PosComp|ScaleComp|AreaComp|ColorComp>, () => Promise<void>> = new Map();
    let boxUnHoverFunctions: Map<GameObj<SpriteComp|PosComp|ScaleComp|AreaComp|ColorComp>, () => Promise<void>> = new Map();

    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 2; j++) { // only doing 2 rows for now
            let boxArray: (SpriteComp|PosComp|ScaleComp|AreaComp|ColorComp|OriginComp|string)[] = [
                sprite("block", {width: 100, height: 100}),
                pos(200 * i, 250 * j + 50),
                scale(1),
                kbm.origin("center"),
                area({width: 100, height: 100})
            ];
            if (getData("currentLevel", 1) < i + (j - 1) * 4) {
                boxArray.push(color(50, 50, 50));
            } else {
                boxArray.push("selectBox");
            }
            let box = add(boxArray);
            if (getData("currentLevel", 1) < i + (j - 1) * 4) continue;
            let txt = add([
                text(String(i + (j - 1) * 4), {size: 40}),
                pos(200 * i, 250 * j + 50),
                scale(1),
                kbm.origin("center")
            ]);
            let clicked = false;
            boxHoverFunctions.set(box, async () => {
                box.scaleTo(1.5);
                txt.scaleTo(1.5);
                cursor("pointer");
                if (mouseIsDown() && !clicked) {
                    clicked = true;
                    await transition(overlay, false);
                    music = play("music", {
                        loop: true
                    });
                    cursor("default");
                    level = i + (j - 1) * 4;
                    go(`level${i + (j - 1) * 4}`);
                    clicked = false;
                }
            });
            boxUnHoverFunctions.set(box, async () => {
                box.scaleTo(1);
                txt.scaleTo(1);
            });
        }
    }

    let txt = add([
        text("Select a Level", {size: 75}),
        pos(0,0)
    ]);
    txt.moveTo(500 - txt.width / 2, 85);

    action(() => {
        let hover = false;
        every("selectBox", (box: GameObj<SpriteComp|PosComp|ScaleComp|AreaComp|ColorComp>) => {
            if (box.hasPoint(mouse)) {
                boxHoverFunctions.get(box)();
                hover = true;
            } else {
                boxUnHoverFunctions.get(box)();
            }
        });
        if (!hover) cursor("default");
    });

    await transition(overlay, true);
});

scene("levelEditor", () => {
    createOverlay();
    location.href = "editor.html";
});

go("welcome");
