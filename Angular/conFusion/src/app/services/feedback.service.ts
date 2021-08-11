import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feedback } from '../shared/feedback';

import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';

import { ProcessHTTPMsgService } from './process-httpmsg.service'; 

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  submitFeedback(feedback: Feedback): Observable<Feedback> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.put<Feedback>(baseURL + 'feedback/' + feedback.id, feedback, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));

  }
}