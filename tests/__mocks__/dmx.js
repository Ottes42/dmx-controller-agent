// Mock DMX module for testing
const mockUniverse = {
  update: jest.fn(),
  get: jest.fn(() => 0),
  add: jest.fn(),
  set: jest.fn()
}

const mockAnimation = {
  add: jest.fn(() => mockAnimation),
  run: jest.fn(),
  stop: jest.fn()
}

const mockDMX = jest.fn(() => ({
  addUniverse: jest.fn(() => mockUniverse)
}))

const mockAnim = jest.fn(() => mockAnimation)

module.exports = {
  DMX: mockDMX,
  mockUniverse,
  mockAnimation,
  mockAnim
}

// Mock dmx module
jest.mock('dmx', () => mockDMX)

// Mock dmx/anim module
jest.mock('dmx/anim', () => mockAnim)