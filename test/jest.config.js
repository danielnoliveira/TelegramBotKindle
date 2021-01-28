// jest.config.js
module.exports = {
  // setupTestFrameworkScriptFile has been deprecated in
  // favor of setupFilesAfterEnv in jest 24
  setupFilesAfterEnv: ['./jest.setup.js']
}

// jest.setup.js
jest.setTimeout(30000)