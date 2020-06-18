let inSession = false,
    workoutLevel = 1

function playBaDing(n: number) {
    for (let i = 0; i < n; i++) {
        music.beginMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once)
        basic.pause(500)
    }
}

function levelUp() {
    if (workoutLevel >= 2) {
        workoutLevel = 1
        music.beginMelody(music.builtInMelody(Melodies.PowerDown), MelodyOptions.OnceInBackground)

    }
    else {
        workoutLevel += 1
        music.beginMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.OnceInBackground)
    }
    led.plotBarGraph(workoutLevel, 5)
    //basic.pause(2000)
}

function achieved() {
    music.beginMelody(music.builtInMelody(Melodies.JumpDown), MelodyOptions.OnceInBackground)
    basic.showString("CLEAR!")
}

function doInterval() {
    let stopTime = input.runningTime() + 30 * 1000
    music.beginMelody(music.builtInMelody(Melodies.PowerDown), MelodyOptions.OnceInBackground)
    while (input.runningTime() <= stopTime) {
        basic.showIcon(IconNames.Heart)
        basic.pause(500)
        basic.showIcon(IconNames.SmallHeart)
        basic.pause(500)
    }
}

function doZombie(n: number) {
    let startTime = input.runningTime();
    plotAll()

    for (let i = 0; i < n; i++) {
        music.beginMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once)
        basic.pause(500)
    }

    let elaps = input.runningTime() - startTime
    while (elaps < 60000) {
        let v = Math.floor(elaps / 2400)
        let seg = getSegment(v)
        let point = getPoint(v, seg)
        led.unplot(point[0], point[1])
        basic.pause(200)
        elaps = input.runningTime() - startTime
    }
}

function zombieSession() {
    for (let i = 0; i < 3; i++) {
        doZombie(i + 1)
        basic.pause(100)
        doInterval()
    }

    achieved()
}

function plotAll() {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            led.plot(i, j)
        }
    }
}

function getSegment(v: number) {
    let seg: number
    if (v <= 17) {
        seg = Math.floor(v / 4)
    } else {
        if (v <= 21) {
            seg = Math.floor(v / 4) + 1
        }
        else {
            seg = Math.floor(v / 4) + 2
        }
    }
    return seg
}

function getPoint(v: number, seg: number) {
    let x: number, y: number

    switch (seg) {
        case 0:
            x = v
            y = 0
            break
        case 1:
            x = 4
            y = v - 4
            break
        case 2:
            x = 12 - v
            y = 4
            break
        case 3:
            x = 0
            y = 16 - v
            break
        case 4:
            x = v - 15
            y = 1
            break
        case 5:
            x = 3
            y = v - 17
            break
        case 6:
            x = 23 - v
            y = 3
            break
        case 7:
            x = 1
            y = 25 - v
            break
        case 8:
            x = 2
            y = 2
            break
    }

    return [x, y]
}

function showUpState() {
    basic.showLeds(`
        # # # # #
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        `)
}

function playTone(state: string, length: number) {
    let hz = state === "up" ? 880 : 440
    let fraction = length === 0.5 ? BeatFraction.Half : BeatFraction.Quarter
    music.playTone(hz, music.beat(fraction))
}

function tick() {
    pins.analogPitch(880, 20)
    basic.pause(980)
}

function doSquat(n: number) {
    for (let index = 0; index < n; index++) {
        music.beginMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once)
        basic.pause(500)
    }

    led.plotBarGraph(workoutLevel, 5)
    playTone("down", 0.5)
    basic.pause(1000)

    // 10回繰り返し
    for (let index = 0; index < 10; index++) {
        // Start
        basic.showArrow(ArrowNames.North)
        for (let n = 0; n < workoutLevel * 2; n++) {
            tick()
        }

        playTone("up", 0.25)
        showUpState()
        basic.pause(1000)
        basic.showArrow(ArrowNames.South)
        for (let n = 0; n < workoutLevel * 3; n++) {
            tick()
        }

        playTone("down", 0.25)

        if (index == 9) {
            basic.showIcon(IconNames.Happy)
            basic.pause(500)
        }
        else {
            basic.showNumber(index + 1)
            basic.pause(800)
        }

    }
}

function squatSession() {
    for (let k = 0; k < 3; k++) {
        doSquat(k + 1)
        basic.pause(100)
        if (k < 2) {
            doInterval()
        }
    }

    achieved()
}

// Start here
music.beginMelody(music.builtInMelody(Melodies.JumpUp), MelodyOptions.OnceInBackground)
basic.clearScreen()

basic.forever(function () {
    input.onButtonPressed(Button.A, function () {
        inSession = true
        basic.pause(1000)
        zombieSession()
        inSession = false
    })

    input.onButtonPressed(Button.B, function () {
        inSession = true
        basic.pause(1000)
        squatSession()
        inSession = false
    })

    input.onButtonPressed(Button.AB, function () {
        inSession = false
        control.reset()
    })

    input.onGesture(Gesture.Shake, function () {
        if (inSession) {
            levelUp()
        }    
    })

    if (!inSession) {
        basic.showArrow(ArrowNames.West)
        basic.showString("A")
        basic.pause(200)
        basic.showArrow(ArrowNames.East)
        basic.showString("B")
        basic.pause(200)
    }
})
