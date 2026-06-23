# Error Handling

## Global Strategy

<details markdown="1">
<summary>Click to see details</summary>

- **Unexpected Failures:** Use `react-error-boundary` at the application root (outside the router) to catch unhandled runtime JavaScript errors.
- **Error UI:** Create a `GlobalErrorFallback.tsx` component (designed with Tailwind and Lucide icons) to provide a user-friendly UI with a "Try Again/Refresh" mechanism.
- **API Errors:** Use Axios interceptors to globally catch 401 (trigger logout/redirect to login) and 429 (exponential backoff or user-facing alert).
- **Validation Errors (422):** Map the response `errors` object directly to the corresponding UI form fields.
- **UI Notifications:** Use `react-hot-toast` for all user-facing success and error feedback.

</details>

