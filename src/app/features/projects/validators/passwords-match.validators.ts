import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validateur de groupe : vérifie que `password` et `confirmPassword` sont identiques.
 * Retourne null si les deux champs sont vides (les required s'en chargent).
 */
export const passwordsMatchValidator: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;

  if (!password || !confirm) return null;
  return password === confirm ? null : { passwordsMismatch: true };
};
