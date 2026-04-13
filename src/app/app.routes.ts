import { Routes } from '@angular/router';
import { FormExample } from './components/form-example/form-example';
import { LayoutExampleComponent } from './components/layout-example-component/layout-example-component';
import { ReactiveExampleComponent } from './components/reactive-example-component/reactive-example-component';
import { DateAndValidationComponent } from './components/date-and-validation-component/date-and-validation-component';

export const routes: Routes = [
  { path: 'form-example', component: FormExample },
  { path: 'layout-example', component: LayoutExampleComponent },
  { path: 'reactive-example', component: ReactiveExampleComponent },
  { path: 'date-and-validation', component: DateAndValidationComponent },

  { path: '', redirectTo: '/form-example', pathMatch: 'full' },
  { path: '**', redirectTo: '/form-example', pathMatch: 'full' },
];
