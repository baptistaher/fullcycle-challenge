import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../presentation/styles/global.scss';
import { Router } from './routes/router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>
);
