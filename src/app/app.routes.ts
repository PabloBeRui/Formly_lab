import { Routes } from '@angular/router';
import { FormExample } from './components/form-example/form-example';
import { LayoutExampleComponent } from './components/layout-example-component/layout-example-component';

export const routes: Routes = [
  { path: 'form-inicial', component: FormExample },
  { path: 'layout-example', component: LayoutExampleComponent },

  { path: '', redirectTo: '/form-inicial', pathMatch: 'full' },
  { path: '**', redirectTo: '/form-inicial', pathMatch: 'full' },
];
