---
'@backstage/config-loader': minor
---

**BREAKING** Uses key visibility when the value isn't an array of objects in schema filters. So if the key of an array of string is visible, all elements of this array will also be visible.
