import {Injectable, EventEmitter } from '@angular/core';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FetchService {
  public productSelected = new EventEmitter<number>();

  async getAffiche(image: string): Promise<string> {
    const apiURL = environment.apiURL + "/images/" + image + ".png";
    const response = await fetch(apiURL);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}