# Error Handling

## Global Strategy
- **API Errors:** Use Axios interceptors to globally catch 401 (trigger logout/redirect to login) and 429 (exponential backoff or user-facing alert).
- **Validation Errors (422):** Map the response `errors` object directly to the corresponding UI form fields.
- **UI Notifications:** Use `react-hot-toast` for all user-facing success and error feedback.
- **Unexpected Failures:** Use React Error Boundaries to catch unhandled component crashes.
