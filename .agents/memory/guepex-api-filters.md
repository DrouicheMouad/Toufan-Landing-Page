---
name: Guepex API filter behavior
description: How Guepex treats the `is_deliverable` query parameter and how we filter results instead.
---

The Guepex `/wilayas` and `/communes` endpoints reject `is_deliverable=1` as a query parameter and return a 400 `invalid filter` error. They do return an `is_deliverable` field in each item. We fetch the full list and filter deliverable items server-side before sending them to the frontend.

**Why:** The Guepex docs are not explicit about which fields can be used as query filters, and the field name in the response is not accepted as a filter parameter.

**How to apply:** If you add more Guepex proxy endpoints, always test the query parameter first with a curl; if the API rejects it, remove the filter and apply it in the proxy route.
