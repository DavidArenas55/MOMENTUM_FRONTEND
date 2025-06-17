import { HttpClient } from "@angular/common/http";
import { inject, Inject, Injectable } from "@angular/core";
import { APP_CONFIG, Config } from "../config/config";
import { forkJoin, Observable, pipe } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class BusinessService {

  constructor(private http: HttpClient, @Inject(APP_CONFIG) readonly config: Config) {}

  getBusinesses(page: number, limit: number): Observable<any> {
    return this.http.get(this.config.apiUrl + "/business/paginated", {
      params: {
        getDeleted: true,
        page: page,
        limit: limit,
      }
    });
  }

  deleteBusiness(id: string): Observable<Object> {
    return this.http.patch(this.config.apiUrl + `/business/${id}/soft`, {});
  }

  deleteBusinesses(ids: string[]): Observable<Object> {
    return forkJoin(ids.map(id =>
      this.http.patch(this.config.apiUrl + `/business/${id}/softdelete`, {})
    ));
  }

  restoreBusiness(id: string): Observable<Object> {
    return this.http.patch(this.config.apiUrl + `/business/${id}/restore`, {});
  }

  deleteLocation(id: string) {
    return this.http.patch(this.config.apiUrl + `/location/softdelete/${id}`, {});
  }

  restoreLocation(id: string) {
    return this.http.patch(this.config.apiUrl + `/location/restore/${id}`, {});
  }
}
