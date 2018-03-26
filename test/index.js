const test = require('tape')

const Optics = require('../index')

test('@opticals', (t) => {
  t.test('@diffLine', (t) => {
    t.test('should show nothing was changed', (t) => {
      t.deepEqual(Optics.diffLine('how are you?', 'how are you?'), { additions: 0, deletions: 0, changes: 0 })
      t.end()
    })

    t.test('should work with extremely long strings', (t) => {
      t.deepEqual(Optics.diffLine('hlrIlWctSAJtXJ8pfWCLhlrIlWctSAJtXJ8pfWCL', 'MBdIIT0hX2qNMacgAqGVMBdIIT0hX2qNMacgAqGV'), { additions: 0, deletions: 0, changes: 38 })
      t.deepEqual(Optics.diffLine('MBdIIT0hX2qNMacgAqGVMBdIIT0hX2qNMacgAqGV', 'hlrIlWctSAJtXJ8pfWCLhlrIlWctSAJtXJ8pfWCL'), { additions: 0, deletions: 0, changes: 38 })
      t.end()
    })

    t.test('should show something was changed', (t) => {
      t.deepEqual(Optics.diffLine('how are you?', 'you are who?'), { additions: 0, deletions: 0, changes: 5 })
      t.end()
    })

    t.test('should show the same things have chaged', (t) => {
      t.deepEqual(Optics.diffLine('you are who?', 'how are you?'), { additions: 0, deletions: 0, changes: 5 })
      t.end()
    })
  })

  t.test('@diff', (t) => {
    t.test('should be able to diff a simple change', (t) => {
      const source = `
        hello world

        how are you?

        what is up?
      `

      const patch = `
        hello world

        you are who?

        what is up?
      `

      const _diff = new Optics(source, patch).diff()

      t.deepEqual(_diff.changes, [ { additions: 0, deletions: 0, changes: 0 }, { additions: 0, deletions: 0, changes: 0 }, { additions: 0, deletions: 0, changes: 0 }, { additions: 0, deletions: 0, changes: 5 }, { additions: 0, deletions: 0, changes: 0 }, { additions: 0, deletions: 0, changes: 0 }, { additions: 0, deletions: 0, changes: 0 } ])
      t.equal(_diff.maxLineLength, 27)
      t.equal(_diff.combined, '[0]    \n[1]            hello world\n[2]    \n[3] -          how are you?\n[3] +          you are who?\n[4]    \n[5]            what is up?\n[6]          \n')
      t.equal(_diff.added, '[0]    \n[1]            hello world\n[2]    \n[3] +          you are who?\n[4]    \n[5]            what is up?\n[6]          \n')
      t.equal(_diff.removed, '[0]    \n[1]            hello world\n[2]    \n[3] -          how are you?\n[4]    \n[5]            what is up?\n[6]          \n')

      t.end()
    })

    t.test('should be able to compress diff to only the changed selection', (t) => {
      const source = `
        hello world

        how are you?

        what is up?
      `

      const patch = `
        hello world

        you are who?

        what is up?
      `

      const _diff = new Optics(source, patch).diff({ isCondensed: true, padding: 0 })

      t.equal(_diff.combined, '[3] -          how are you?\n[3] +          you are who?\n[4]    \n')
      t.equal(_diff.removed, '[3] -          how are you?\n[4]    \n')
      t.equal(_diff.added, '[3] +          you are who?\n[4]    \n')

      t.end()
    })

    t.test('should be able to diff a simple change (with only source)', (t) => {
      const source = `
        hello world

        how are you?

        what is up?
      `

      const patch = ``

      const _diff = new Optics(source, patch).diff()

      t.deepEqual(_diff.changes, [ { additions: 0, deletions: 0, changes: 0 }, { additions: 0, deletions: 19, changes: 19 }, { additions: 0, deletions: 0, changes: 0 }, { additions: 0, deletions: 20, changes: 20 }, { additions: 0, deletions: 0, changes: 0 }, { additions: 0, deletions: 19, changes: 19 }, { additions: 0, deletions: 6, changes: 6 } ])
      t.equal(_diff.maxLineLength, 27)
      t.equal(_diff.combined, '[0]    \n[1] -          hello world\n[2]    \n[3] -          how are you?\n[4]    \n[5] -          what is up?\n[6] -        \n')
      t.equal(_diff.added, '[0]    \n[2]    \n[4]    \n')
      t.equal(_diff.removed, '[0]    \n[1] -          hello world\n[2]    \n[3] -          how are you?\n[4]    \n[5] -          what is up?\n[6] -        \n')

      t.end()
    })

    t.test('should be able to diff a simple change (with only patch)', (t) => {
      const source = ``

      const patch = `
        hello world

        you are who?

        what is up?
      `

      const _diff = new Optics(source, patch).diff()

      t.deepEqual(_diff.changes, [ { additions: 0, deletions: 0, changes: 0 }, { additions: 19, deletions: 0, changes: 19 }, { additions: 0, deletions: 0, changes: 0 }, { additions: 20, deletions: 0, changes: 20 }, { additions: 0, deletions: 0, changes: 0 }, { additions: 19, deletions: 0, changes: 19 }, { additions: 6, deletions: 0, changes: 6 } ])
      t.equal(_diff.combined, '[0]    \n[1] -  \n[1] +          hello world\n[2]    \n[3] -  \n[3] +          you are who?\n[4]    \n[5] -  \n[6] -  \n[5] +          what is up?\n[6] +        \n')
      t.equal(_diff.added, '[0]    \n[1] +          hello world\n[2]    \n[3] +          you are who?\n[4]    \n[5] +          what is up?\n[6] +        \n')
      t.equal(_diff.removed, '[0]    \n[1] -  \n[2]    \n[3] -  \n[4]    \n[5] -  \n[6] -  \n')

      t.end()
    })
  })

  t.test('@splitDiff', (t) => {
    t.test('should be able to show a split view of the given diff', (t) => {
      const source = `
        hello world

        how are you?

        what is up?
      `

      const patch = `
        hello world

        you are who?

        what is up?
      `

      const _splitDiff = new Optics(source, patch).splitDiff()

      t.equal(_splitDiff, '[0]                         | [0]                            \n[1]            hello world  | [1]            hello world     \n[2]                         | [2]                            \n\x1b[31m[3] -          how are you?\x1b[39m | \x1b[32m[3] +          you are who?\x1b[39m\n[4]                         | [4]                            \n[5]            what is up?  | [5]            what is up?     \n[6]                         | [6]                            \n')

      t.end()
    })

    t.test('should still be able to show split view if only added is returned', (t) => {
      const source = ``

      const patch = `
        hello world

        you are who?

        what is up?
      `

      const _splitDiff = new Optics(source, patch).splitDiff()

      t.equal(_splitDiff, '[0]                         | [0]                            \n\x1b[31m[1] -  \x1b[39m                     | \x1b[32m[1] +          hello world\x1b[39m \n[2]                         | [2]                            \n\x1b[31m[3] -  \x1b[39m                     | \x1b[32m[3] +          you are who?\x1b[39m\n[4]                         | [4]                            \n\x1b[31m[5] -  \x1b[39m                     | \x1b[32m[5] +          what is up?\x1b[39m \n\x1b[31m[6] -  \x1b[39m                     | \x1b[32m[6] +        \x1b[39m              \n')

      t.end()
    })

    t.test('should still be able to show split view if only removed is returned', (t) => {
      const source = `
        hello world

        you are who?

        what is up?
      `

      const patch = ``

      const _splitDiff = new Optics(source, patch).splitDiff()

      t.equal(_splitDiff, '[0]                         | [0]                            \n\x1b[31m[1] -          hello world\x1b[39m  | [2]                            \n[2]                         | [4]                            \n\x1b[31m[3] -          you are who?\x1b[39m | [3]                            \n[4]                         | [4]                            \n\x1b[31m[5] -          what is up?\x1b[39m  | [5]                            \n\x1b[31m[6] -        \x1b[39m               | [6]                            \n')

      t.end()
    })
  })

  t.test('@combinedDiff', (t) => {
    t.test('should show the given diff in a combined view', (t) => {
      const source = `
        hello world

        how are you?

        what is up?
      `

      const patch = `
        hello world

        you are who?

        what is up?
      `

      const _combinedDiff = new Optics(source, patch).combinedDiff()

      t.equal(_combinedDiff, '[0]    \n[1]            hello world\n[2]    \n\x1b[31m[3] -          how are you?\x1b[39m\n\x1b[32m[3] +          you are who?\x1b[39m\n[4]    \n[5]            what is up?\n[6]          \n')

      t.end()
    })

    t.test('should show the given diff in a combined view (with changes)', (t) => {
      const source = `
        hello world

        how are you?

        what is up?
      `

      const patch = `
        hello world

        you are who?

        what is up?
      `

      const _combinedDiff = new Optics(source, patch).combinedDiff({ showChangeValues: true })

      t.equal(_combinedDiff, '[0]    \n[1]            hello world\n[2]    \n\x1b[31m[3] -          how are you?\x1b[39m\n\x1b[32m[3] +          you are who?\x1b[39m\n[4]    \n[5]            what is up?\n[6]          \n')

      t.end()
    })
  })
})
