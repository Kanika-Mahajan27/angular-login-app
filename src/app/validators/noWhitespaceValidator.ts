import { AbstractControl, ValidatorFn } from "@angular/forms";

export function noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value.trim() === '') {
        return { 'required': true };
      }
      return null;
    };
  }