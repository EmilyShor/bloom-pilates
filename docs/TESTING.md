# Testing Bloom

## Automated checks

```bash
pnpm test
pnpm format:check
pnpm build
```

GitHub Actions runs these checks for pushes to `main` and pull requests.

The tests cover behavior rather than snapshots of the implementation:

- Local date handling across month and year boundaries.
- A Monday–Sunday week containing a Sunday date.
- End times and the midnight limit.
- Required names, valid dates and times, integer counts, and capacity limits.
- Partial, contained, and identical-time overlaps.
- Back-to-back classes and editing an existing session.
- Safe sorting without mutating the original array.
- Validation of stored records.
- Adding, editing, persisting, and deleting a class through the UI.
- Empty search results and clearing filters.
- Overlap and overbooking messages in the form.
- Week navigation and returning to today.
- Preserving an intentionally empty schedule.
- Unreadable storage and storage write failures.

jsdom does not implement native dialog opening and closing. The test setup provides small shims for those methods; browser checks cover actual modal behavior and responsive layout.

## Manual demo and verification

1. Open the app in a fresh browser profile or on a fresh origin. An example week appears around the current local date.
2. Select different days, then use **Previous week**, **Next week**, and **Today**. The selected day and weekly totals should follow the visible week.
3. Choose **Mat** in the filter. Only Mat classes on the selected day should appear. Search for a nonexistent name, then clear filters.
4. Add a class at a free time. Verify that it appears in time order and that weekly totals change.
5. Edit it. Set booked spots equal to capacity; the card should read **Fully booked**.
6. Try booked spots above capacity. The form should show a validation message and remain open.
7. Try overlapping another session. Bloom should prevent saving. A class starting exactly when another ends should save.
8. Refresh. Your changes should remain.
9. Open the editor, click **Delete class**, then confirm removal. Refresh to confirm it stays deleted.
10. Use Tab to move through controls. Escape should close the editor; its Cancel and close buttons should work too.
11. At a phone width around 390px, check the calendar, filters, class cards, and form. There should be no horizontal page overflow.

## Verification limits

Unit and component tests cannot prove that all browsers render identically. Native form widgets and date pickers vary by browser and operating system. Google Fonts may fall back to local fonts without network access. Browser storage can be cleared by the browser or user and is not a backup service.
