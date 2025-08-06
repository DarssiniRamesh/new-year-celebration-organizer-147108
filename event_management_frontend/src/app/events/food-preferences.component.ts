import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FoodPreferencesService } from './food-preferences.service';
import { AuthService } from '../auth.service';

/**
 * A festive red/white food preferences form, allow per-user preference for each event (veg, non-veg, allergies, special notes).
 * Used inside event details.
 */
// PUBLIC_INTERFACE
@Component({
  selector: 'app-food-preferences',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './food-preferences.component.html',
  styleUrls: ['./food-preferences.component.scss']
})
export class FoodPreferencesComponent implements OnInit {
  @Input() eventId: string | null = null;
  userId: string | null = null;

  loading = false;
  saving = false;
  deleting = false;
  error: string | null = null;
  savedMessage: string | null = null;

  preferenceType: string = 'veg';
  allergies: string = '';
  notes: string = '';

  private foodPrefsService = inject(FoodPreferencesService);
  private authService = inject(AuthService);

  async ngOnInit() {
    // Get the current user
    this.authService.user().subscribe(async user => {
      this.userId = user?.id ?? null;
      if (this.eventId && this.userId) {
        await this.loadPreferences();
      }
    });
  }

  async loadPreferences() {
    if (!this.eventId || !this.userId) return;
    this.loading = true;
    this.error = null;
    const { preferences, error } = await this.foodPrefsService.getPreferences(this.eventId, this.userId);
    if (error) this.error = error;
    else {
      this.preferenceType = preferences.type ?? 'veg';
      this.allergies = preferences.allergies ?? '';
      this.notes = preferences.notes ?? '';
    }
    this.loading = false;
  }

  async onSubmit() {
    if (!this.eventId || !this.userId) return;
    this.saving = true;
    this.error = null; this.savedMessage = null;
    const prefs = {
      type: this.preferenceType,
      allergies: this.allergies,
      notes: this.notes
    };
    const { error } = await this.foodPrefsService.savePreferences(this.eventId, this.userId, prefs);
    if (error) this.error = error;
    else this.savedMessage = "Saved!";
    this.saving = false;
  }

  async onDelete() {
    if (!this.eventId || !this.userId) return;
    this.deleting = true;
    this.error = null; this.savedMessage = null;
    const { error } = await this.foodPrefsService.deletePreferences(this.eventId, this.userId);
    if (error) this.error = error;
    else {
      this.preferenceType = 'veg';
      this.allergies = '';
      this.notes = '';
      this.savedMessage = "Removed preferences!";
    }
    this.deleting = false;
  }
}
