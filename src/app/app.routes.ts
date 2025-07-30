import { Routes } from '@angular/router';

export const routes: Routes = [
  // Default route redirects to Portfolio
  {
    path: '',
    redirectTo: 'Portfolio',
    pathMatch: 'full',
  },
  {
    path: 'Portfolio',
    loadComponent: () =>
      import('./pages/portfolio/portfolio').then((m) => m.Portfolio), // Lazy-loaded standalone component
  },
  // Optional: Wildcard route for unknown paths
  {
    path: '**',
    redirectTo: 'Portfolio',
  },
];
