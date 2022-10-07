import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection, collectionChanges } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  item$: Observable<any>;
  constructor(private firestore: Firestore) { }

  ngOnInit() {
    const colSettings = collection(this.firestore, 'settings');
    const settings = collectionData(colSettings).toPromise().then(data => {
      console.log('settings', data);
    })
    .finally(() => {
      console.log('finally');
    });
    console.log('settings', settings);
    this.item$ = collectionData(colSettings);
    console.log('items$', this.item$);
  }

}
