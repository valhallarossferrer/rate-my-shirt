import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection, collectionChanges } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  items$: Observable<any>;
  constructor(private firestore: Firestore) { }

  ngOnInit() {
    const collectionItems = collection(this.firestore, 'items');
    this.items$ = collectionData(collectionItems);
    this.items$.subscribe(data => console.log('data', data));
  }
}
