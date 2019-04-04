import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api'

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  constructor() { }

  createDb() {
    const users = [
      { id: 1, email: 'test@test.test', password: 'Test42Test' },
      { id: 2, email: 'sben@sben.sben', password: 'Sben42Sben' },
    ];
    const todos = [
      { id: 1, name: 'Going to gym', status: 1 },
      { id: 2, name: 'Visit parents', status: 0 },
      { id: 3, name: 'Work harder', status: 0 },
    ];
    return { users, todos };
  }
}
