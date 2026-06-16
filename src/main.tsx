import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App';
import GlobalErrorFallback from './components/atoms/GlobalErrorFallback';
import './index.css';
import 'leaflet/dist/leaflet.css';
import './lib/i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary FallbackComponent={GlobalErrorFallback} onReset={() => window.location.reload()}>
            <App />
        </ErrorBoundary>
    </React.StrictMode>
);
