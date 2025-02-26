#!/usr/bin/env node
const path = require('path')
const confirm = require('@inquirer/confirm')

const applyChanges = require('./applyChanges')
const getChanges = require('./getChanges')
const getData = require('./getData')
const getNewThresholds = require('./getNewThresholds')
const outputChanges = require('./outputChanges')
const outputResult = require('./outputResult')

module.exports = async ({
  config = 'jest.config.js',
  dryRun = false,
  interactive = false,
  margin = 0,
  silent = false,
  round = 0.001,
  tolerance = 0,
} = {}) => {
  const configPath = path.resolve(process.cwd(), config)

  const { thresholds, coverages } = await getData(configPath)
  const newThresholds = getNewThresholds(
    thresholds,
    coverages,
    margin,
    round,
    tolerance,
  )
  const { changes, data } = getChanges(configPath, newThresholds)

  if (!silent) {
    outputChanges(changes, dryRun)
  }

  const hasChanges = changes.length > 0

  if (!hasChanges) {
    return
  }

  const confirmed =
    !interactive || (await confirm({ message: 'Update thresholds?' }))

  if (!confirmed) {
    return
  }

  if (!dryRun) {
    applyChanges(configPath, data)
  }

  outputResult(configPath, dryRun)
}
