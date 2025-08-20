const DMX = require('dmx')
const ParLightB262 = require('./devices/ParLightB262')

const dmx = new DMX()
const universe = dmx.addUniverse('ottes', 'enttec-open-usb-dmx', 'COM5')
const parLight = new ParLightB262(universe, 1)

parLight.turnOn(255, ParLightB262.COLORS.GREEN)

setTimeout(() => {
  parLight.setColor(ParLightB262.COLORS.RED)
  parLight.fadeToColor(ParLightB262.COLORS.BLUE, 2000, 'linear', () => {
    parLight.fadeDimmer(100, 2000, 'inOutCubic', () => {
      parLight.turnOff()
      process.exit(0)
    })
  })
}, 2000)

// setTimeout(() => {
//     parLight.startColorCycle([
//         ParLightB262.COLORS.RED,
//         ParLightB262.COLORS.GREEN,
//         ParLightB262.COLORS.BLUE
//     ], 2000, 'inOutSine');
// }, 6000);

// setTimeout(() => {
//     parLight.startPulse(ParLightB262.COLORS.PURPLE, 30, 255, 3000, 'inOutCubic');
// }, 12000);

// setTimeout(() => {
//     parLight.startRainbow(8000, 50);
// }, 21000);

// setTimeout(() => {
//     parLight.startStrobe(ParLightB262.COLORS.WHITE, 50, 150);
// }, 30000);
