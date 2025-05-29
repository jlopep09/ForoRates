import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router';
import { Profile } from './views/Profile.jsx';
import { Auth0Provider } from '@auth0/auth0-react';
import ProtectedRoute from './views/ProtectedRoute.jsx';
import { Ranking } from './views/ranking/Ranking.jsx';

createRoot(document.getElementById('root')).render(
      <BrowserRouter>
      <Auth0Provider
            domain="dev-wdgb4k4b1rj6fh7j.us.auth0.com"
            clientId="IKJXfU6Ff4iFycpcRh0XQC0RpbRNVYu5"
          authorizationParams={{
            redirect_uri: window.location.origin
          }}
        >
      <Routes >
            <Route path="/" element={<App />}/>
            <Route path="profile" element={ <ProtectedRoute><Profile UserID={4}/></ProtectedRoute>} />
            <Route path="/ranking" element={<Ranking />}/>
      </Routes>
      </Auth0Provider>
    </BrowserRouter>
)
