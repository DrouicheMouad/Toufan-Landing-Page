---
name: TanStack Query 5 + Orval queryKey requirement
description: Generated Orval hooks require an explicit `queryKey` inside the `query` option when using `enabled` with TanStack Query 5.
---

When passing the `query` option to Orval-generated hooks like `useGetCommunes` to set `enabled`, TanStack Query 5's `UseQueryOptions` type requires `queryKey` to be present. The generated `getGetCommunesQueryKey(params)` and `getGetCentersQueryKey(params)` helpers produce the exact key the hook would use by default, so pass them in the `query` option to satisfy the type while keeping the correct cache key.

**Why:** TanStack Query 5 made `queryKey` a required property of `UseQueryOptions`, and Orval's generated hook signature uses the raw `UseQueryOptions` type even though the runtime helper supplies a default key.

**How to apply:** For any generated list hook that takes `enabled`, pass `{ query: { queryKey: getXQueryKey(params), enabled: ... } }`.
