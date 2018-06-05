import { Injectable } from "@angular/core";

/**
 * A service with common use utilities
 */
@Injectable()
export class UtilsService {
  /**
   * Checks if all the elements of the array `contained` are contained in the array `container`. 
   * @param container The array where the elements are going to be checked if they all exists.
   * @param contained The array with the elements to check.
   * @returns Returns `true` if `contained` is contained in `container` or `false` if not.
   */
  isContained(container: any[], contained: any[]): boolean {
    return container.length >= contained.length &&
      contained.length > 0 &&
      contained.every((value: any) => {
        return container.includes(value);
      });
  }
}