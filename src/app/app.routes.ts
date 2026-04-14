import { Routes } from '@angular/router';
import { FormExampleComponent } from './components/form-example/form-example.component';
import { LayoutExampleComponent } from './components/layout-example/layout-example.component';
import { ReactiveExampleComponent } from './components/reactive-example/reactive-example.component';
import { DateAndValidationComponent } from './components/date-and-validation/date-and-validation.component';
import { RepeatSectionComponent } from './components/repeat-section/repeat-section.component';
import { JsonSchemaComponent } from './components/json-schema/json-schema.component';
import { CustomElementsComponent } from './components/custom-elements/custom-elements.component';
import { GlobalExtensionsComponent } from './components/global-extensions/global-extensions.component';

export const routes: Routes = [
  { path: 'form-example', component: FormExampleComponent },
  { path: 'layout-example', component: LayoutExampleComponent },
  { path: 'reactive-example', component: ReactiveExampleComponent },
  { path: 'date-and-validation', component: DateAndValidationComponent },
  { path: 'repeat-section', component: RepeatSectionComponent },
  { path: 'json-schema', component: JsonSchemaComponent },
  { path: 'custom-elements', component: CustomElementsComponent },
  { path: 'global-extension', component: GlobalExtensionsComponent },

  { path: '', redirectTo: '/form-example', pathMatch: 'full' },
  { path: '**', redirectTo: '/form-example', pathMatch: 'full' },
];

