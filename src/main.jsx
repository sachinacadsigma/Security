import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import AppContextProvider from './context/app/AppContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SettingsPage from './components/SettingsPage';
import Dashboard from './components/Dashboard';
import Workingui from './components/workingui';
import AuthContextProvider from './context/auth/AuthContext.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import Help from './components/Help.jsx';
import { reactPlugin } from './appInsights.js';
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/ErrorCallback.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppInsightsContext.Provider value={reactPlugin}>
      <AppContextProvider>
        <AuthContextProvider>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Router>
              <Routes>
                <Route path='/' element={<App />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/help' element={<Help />} />
                <Route path='/' element={<PrivateRoute />}>
                  <Route path='workingui' element={<Workingui />} />
                  <Route path='settings' element={<SettingsPage />} />
                </Route>
              </Routes>
            </Router>
          </ErrorBoundary>
        </AuthContextProvider>
      </AppContextProvider>
    </AppInsightsContext.Provider>
  </StrictMode>
);
