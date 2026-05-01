# Import Rule Examples

## Compliant

```ts
import React from "react";

import { useBatchTransferStore } from "src/state/useBatchTransferStore";
import { BatchTransferModal } from "src/ui/BatchTransferModal";

import type { SomeType } from "./types";
```

## Non-compliant: deep relative path

```ts
import { helper } from "../../../../utils/helper";
```

Reason: import traversal is deeper than `../../..`; replace with `src/...`.

## Non-compliant: wrong group order

```ts
import { useBatchTransferStore } from "src/state/useBatchTransferStore";
import React from "react";
```

Reason: library imports must appear before `src/...` imports.
