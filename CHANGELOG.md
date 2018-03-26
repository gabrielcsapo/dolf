# 0.1.0 (03/25/2018)

- makes sure that if patchMap is empty it will still add to the changes array
  - adds tests to make sure that this is true for sourceMap and patchMap (both source and patch being empty)
- fixes the maxLineLength not being the correct value (it was always the size of the old string and never of the new string)
- diffLine now returns (additions, deletions, changes)

# 0.0.1 (03/23/2018)

- basic functionality with documentation

# 0.0.0 (03/22/2018)

- saving npm name
