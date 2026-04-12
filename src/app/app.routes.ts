import { Routes } from '@angular/router';
import { FormExample } from './components/form-example/form-example';

export const routes: Routes = [
  { path: 'form-inicial', component: FormExample },
  { path: '', redirectTo: '/form-inicial', pathMatch: 'full' },
  { path: '**', redirectTo: '/form-inicial', pathMatch: 'full' },
];
