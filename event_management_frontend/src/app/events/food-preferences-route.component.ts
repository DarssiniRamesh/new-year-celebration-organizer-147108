import { Component } from '@angular/core';
import { FoodPreferencesComponent } from './food-preferences.component';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-food-preferences-route',
  standalone: true,
  imports: [FoodPreferencesComponent],
  template: `
    <app-food-preferences></app-food-preferences>
  `
})
export class FoodPreferencesRouteComponent {}
