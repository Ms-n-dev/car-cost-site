# GA4 Event Tracking

## Implementation

GA4 uses the existing measurement ID `G-0ZDCRFPDN5` and remains behind the site's optional-analytics consent. The app initializes one Google tag, disables its automatic initial page view, and sends one explicit `page_view` per distinct Next.js pathname. Page URLs retain only bounded, standard UTM campaign parameters; arbitrary query values are excluded. `landing_page_viewed` fires once per consented tab session on the first route viewed, including SEO entry pages. Microsoft Clarity remains consent-gated and has a once-only initialization guard.

A non-identifying random `attempt_id` groups calculator events for one attempt. GA4's native user and session dimensions should be used for unique visitors and sessions. Do not register `attempt_id` as a GA4 custom dimension because its high cardinality can distort standard reports; use it in DebugView or BigQuery exports when attempt-level joins are needed.

## Events

| Event | Trigger | Useful parameters |
| --- | --- | --- |
| `page_view` | One consented view per distinct pathname, including SPA navigation | `page_location`, `page_title` |
| `landing_page_viewed` | First consented route view in a tab session | `page_path` |
| `calculator_started` | First meaningful calculator interaction per attempt | `attempt_id`, `calculator_type`, `calculator_step` |
| `calculator_step_reached` | User explicitly advances to a wizard step; once per step per attempt | `attempt_id`, `calculator_type`, `calculator_step` |
| `calculator_completed` | First results display after a started attempt | `attempt_id`, `calculator_type`, `calculator_step`, `purchase_method`, `ownership_years` |
| `calculator_recalculated` | User explicitly presses “Recalculate result” on v2 results | `attempt_id`, `calculator_type`, `calculator_step`, `purchase_method`, `ownership_years` |
| `results_cta_clicked` | One deliberate results action click | `attempt_id`, `calculator_type`, `cta_type` |
| `lead_submitted` | Only after a lead/email endpoint returns success | `attempt_id`, `calculator_type`, `lead_type` |
| `reg_lookup_success` | DVLA lookup succeeds, once per registration per mounted vehicle step | `fuel_type`, `make` |
| `opened_improve_accuracy` | User opens the accuracy editor | None |

`cta_type` values: `finance_inquiry`, `email_breakdown`, `insurance_enquiry`, `warranty_enquiry`, `compare_another_car`, `ownership_guides`, `similar_vehicles`.

`lead_type` values: `finance_inquiry`, `email_breakdown`, `insurance_enquiry`, `warranty_enquiry`. The v1 “similar cars” form is a local interest prototype, not a submitted lead, so it emits only its CTA click.

No traffic-source parameter is fabricated. GA4 acquisition dimensions and campaign attribution should be used for traffic-source reporting.

## Historical Events

Existing GA4 data is not renamed or deleted. The application no longer emits these old names for the same actions: `started_input`, `viewed_result`, `viewed_results`, `recalculated_result`, `clicked_finance_cta`, `clicked_email_cta`, `clicked_compare_cta`, `clicked_similar_cta`, `clicked_insurance_enquiry`, `clicked_warranty_enquiry`, `clicked_recalculate_result`, `submitted_finance_lead`, `submitted_email_breakdown`, and `submitted_similar_cta`. Use the canonical events above for reports from deployment onward; historical event rows retain their original names.

## Manual GA4 Setup

1. In the GA4 web data stream, turn off Enhanced Measurement's **Page changes based on browser history events**. The application now sends SPA page views itself; leaving this enabled can double-count navigation page views. Keep `page_view` collection available for the explicit events.
2. Confirm no separate Google Tag Manager container or second hard-coded Google tag is installed in the hosting platform, CMS, or injected site snippets. The repository contains one GA4 configuration and no GTM container.
3. In GA4 Admin, register `calculator_type`, `calculator_step`, `purchase_method`, `cta_type`, and `lead_type` as event-scoped custom dimensions if they are needed in standard reports. Do not register `attempt_id` as a standard custom dimension.
4. Mark `lead_submitted` as a key event. Keep `calculator_completed` and `results_cta_clicked` as funnel steps unless you have a separate business reason to mark them as key events.

## DebugView Verification

1. Open the site, accept optional analytics, and connect a test browser with Google Tag Assistant or the Google Analytics Debugger.
2. Load the site directly and confirm one `page_view` and one `landing_page_viewed` in the session. Navigate between routes and confirm one `page_view` for each new pathname.
3. Start a fresh calculator attempt and interact once. Confirm one `calculator_started` with an `attempt_id`; advancing wizard steps should produce one `calculator_step_reached` per step.
4. Reach results and confirm one `calculator_completed` for that same attempt. Rerenders, edits, ownership-period slider changes, and Strict Mode effect replays must not create another completion.
5. Press “Recalculate result” once and confirm exactly one `calculator_recalculated`; do not press the button to test ordinary field updates.
6. Click a results CTA once and confirm exactly one `results_cta_clicked` with the expected `cta_type`.
7. Cause a lead request to fail in a test environment and confirm no `lead_submitted`. After a successful test submission, confirm exactly one `lead_submitted` with the expected `lead_type`.
8. Reject optional analytics and verify no GA4 events are sent. Clarity and Vercel Analytics remain subject to the same consent choice.

Do not use real customer contact or vehicle registration details in test submissions. The central event dispatcher strips common identifying/financial parameter names, but event calls should continue to use only the documented safe parameters.
