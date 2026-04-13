import { Routes } from '@angular/router';
import { FormExample } from './components/form-example/form-example';
import { LayoutExampleComponent } from './components/layout-example-component/layout-example-component';
import { ReactiveExampleComponent } from './components/reactive-example-component/reactive-example-component';
import { DateAndValidationComponent } from './components/date-and-validation-component/date-and-validation-component';
import { RepeatSectionComponent } from './components/repeat-section-component/repeat-section-component';

export const routes: Routes = [
  { path: 'form-example', component: FormExample },
  { path: 'layout-example', component: LayoutExampleComponent },
  { path: 'reactive-example', component: ReactiveExampleComponent },
  { path: 'date-and-validation', component: DateAndValidationComponent },
  { path: 'repeat-section', component: RepeatSectionComponent },

  { path: '', redirectTo: '/form-example', pathMatch: 'full' },
  { path: '**', redirectTo: '/form-example', pathMatch: 'full' },
];
