class Optics {
  constructor (source, patch) {
    this.source = source
    this.patch = patch
  }
  /**
   * returns a combined output for the given diff
   * @param  {Object} [diffOptions={}] - options passed to diff
   * @return {String}
   */
  combinedDiff (diffOptions = {}) {
    const { combined } = this.diff(diffOptions)

    return combined.split('\n').map((line) => {
      if (line.indexOf('] -') > -1) {
        return `\x1b[31m${line}\x1b[39m`
      }
      if (line.indexOf('] +') > -1) {
        return `\x1b[32m${line}\x1b[39m`
      }
      return line
    }).join('\n')
  }
  /**
   * returns a split view output for the given diff
   * @param  {Object} [diffOptions={}] - options passed to diff
   * @return {String}
   */
  splitDiff (diffOptions = {}) {
    const { removed, added, maxLineLength, totalLines } = this.diff(diffOptions)

    let output = ''

    const removedMap = removed.split('\n')
    const addedMap = added.split('\n')

    for (var i = 0; i < totalLines; i++) {
      let addedLine = addedMap[i] || ``
      let removedLine = removedMap[i] || ``

      if (!removedLine && !addedLine) continue

      if (removedLine && !addedLine) addedLine = `[${i}]`
      if (!removedLine && addedLine) removedLine = `[${i}]`
      let addedPadding = (maxLineLength - addedLine.length)
      let removedPadding = (maxLineLength - removedLine.length)

      if (removedLine.indexOf('] -') > -1) {
        removedLine = `\x1b[31m${removedLine}\x1b[39m`
      }
      if (addedLine.indexOf('] +') > -1) {
        addedLine = `\x1b[32m${addedLine}\x1b[39m`
      } else {
        addedPadding = addedPadding + 4
      }

      addedLine = addedLine + ' '.repeat(addedPadding > 0 ? addedPadding : 0)
      removedLine = removedLine + ' '.repeat(removedPadding > 0 ? removedPadding : 0)

      output += `${removedLine} | ${addedLine}\n`
    }

    return output
  }
  /**
   * diffs the given source and patchh
   * @param  {String} s - source line
   * @param  {String} t - patch line
   * @return {Integer} - the ammount of changes between the given strings
   */
  static diffLine (s, t) {
    let additions = 0
    let deletions = 0
    let changes = 0

    const totalCharacters = s.length > t.length ? s.length : t.length

    for (var i = 0; i < totalCharacters; i++) {
      if (!s[i] && t[i]) additions += 1
      if (s[i] && !t[i]) deletions += 1
      if (s[i] !== t[i]) changes += 1
    }

    return {
      additions,
      deletions,
      changes
    }
  }
  /**
   * [diff description]
   * @param  {Object} options
   * @param  {Boolean} options.isCondensed - to trim unnecessary lines from the output (defaults false)
   * @param  {Integer} options.padding - if isCondensed is true, this control the amount of text above and below the selection (defaults 4)
   * @return {Object} { changes: (an array of integer changes for each line), combined: (combined added and removed), added: (only added values), removed: (only removed values), totalLines: (the true size of the diff), maxLineLength: (the max line length for the returned diff)}
   */
  diff ({ isCondensed = false, padding = 4 } = {}) {
    let combined = ''
    let removed = ''
    let added = ''
    let lastSignificantLine = 0
    let maxLineLength = 0

    let tempAdded = ''
    let tempRemoved = ''

    const changes = []
    const sourceMap = this.source.split('\n')
    const patchMap = this.patch.split('\n')
    const totalLines = Math.max(sourceMap.length, patchMap.length)

    for (var i = 0; i < totalLines; i++) {
      if (patchMap[i] === undefined && sourceMap[i] === undefined) continue

      const newLine = !patchMap[i] ? '' : patchMap[i]
      const oldLine = !sourceMap[i] ? '' : sourceMap[i]
      const change = Optics.diffLine(oldLine, newLine)

      // make sure we track the changes
      changes.push(change)

      if (change.changes === 0) {
        if (isCondensed) {
          if (tempRemoved && tempAdded) {
            if (lastSignificantLine === 0 && padding > 0) {
              // we should make sure we put some padding around the beginning of the diff to give context
              const context = sourceMap.slice(i - (padding + 1), i - 1).map((l, li) => {
                // make sure we update the maxLineLength
                if (maxLineLength < `[${i}]    ${l}`.length) maxLineLength = `[${i}]    ${l}`.length

                return `[${(i - (padding + 1)) + li}]    ${l}\n`
              }).join('')
              combined = context + combined
              removed = context + removed
              added = context + added
            }
            lastSignificantLine = i
          }
          if (!tempRemoved && !tempAdded && (((i - lastSignificantLine) > padding) || lastSignificantLine === 0)) continue
        }
        combined += tempRemoved
        combined += tempAdded

        removed += tempRemoved
        removed += `[${i}]    ${oldLine}\n`

        added += tempAdded
        added += `[${i}]    ${oldLine}\n`

        combined += `[${i}]    ${oldLine}\n`

        tempRemoved = ''
        tempAdded = ''
      } else {
        tempRemoved += `[${i}] -  ${oldLine}\n`

        if (newLine) tempAdded += `[${i}] +  ${newLine}\n`
      }
      if (maxLineLength < `[${i}] +  ${newLine}`.length) maxLineLength = `[${i}] +  ${newLine}`.length
      if (maxLineLength < `[${i}]    ${oldLine}`.length) maxLineLength = `[${i}]    ${oldLine}`.length
    }

    combined += tempRemoved
    combined += tempAdded

    added += tempAdded
    removed += tempRemoved

    return {
      changes,
      combined,
      added,
      removed,
      totalLines,
      maxLineLength
    }
  }
}

module.exports = Optics
