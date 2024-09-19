import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configUrl = 'env-config.json';
  public config: any;

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await firstValueFrom(
          this.http.get(this.configUrl).pipe(
            map((data) => {
              this.config = data;
            })
          )
        );
        console.log('Configuration loaded:', this.config);
        resolve();
      }
      catch (error) {
        console.error('Failed to load configuration', error);
        reject();
      }
    });
  }
}
