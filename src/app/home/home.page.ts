import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection, collectionChanges, query, onSnapshot, where } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  items = [];
  id = '';
  ratings = {};
  constructor(private firestore: Firestore, private router: Router, private route: ActivatedRoute) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.id = this.route.snapshot.paramMap.get('id')!;
    } catch (error) {
      console.log('error', error);
      this.router.navigate(['/home'], {replaceUrl: true});
    }
    console.log('id', this.id);
  }

  ngOnInit() {
    this.getItems();
    this.getRatings();
  }

  getItems() {
    const q = query(collection(this.firestore, 'items'));
    // , where('deleted', '!=', true)
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.items = [];
      querySnapshot.forEach((doc) => {
          this.items.push({...doc.data(), id: doc.id});
      });
      console.log('Current cities in CA: ', this.items);
    });
  }

  goToView(item) {
    console.log('item', item);
    this.router.navigateByUrl('/item-view', { state: {...item, userId: this.id} });
  }

  getRatings() {
    const q = query(collection(this.firestore, 'ratings'),
    where('createdBy', '==', this.id),);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.ratings = {};
      console.log('querySnapshot', querySnapshot);
      querySnapshot.forEach((doc) => {
        console.log('querySnapshot doc', doc.data());
          if(!this.ratings[doc.data().itemId]) { this.ratings[doc.data().itemId] = []; }
          this.ratings[doc.data().itemId].push({
            ...doc.data(),
            id: doc.id
          });
      });
      for (const key in this.ratings) {
        if (this.ratings.hasOwnProperty(key)) {
          this.ratings[key] = this.ratings[key].reduce((a, b) => a + b.final, 0) / this.ratings[key].length;
        }
      }

      console.log('ratings', this.ratings);
    });
  }
}
