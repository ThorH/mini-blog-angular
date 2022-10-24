import { FormControl } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

/* istanbul ignore next */
export class ErrorStateMatcherPost implements ErrorStateMatcher {
    isErrorState(control: FormControl | null): boolean {
      return !!(control && control.invalid && (control.dirty || control.touched));
    }
}

/* istanbul ignore next */
export class ErrorStateMatcherComment implements ErrorStateMatcher {
    isErrorState(): boolean {
      return false;
    }
}