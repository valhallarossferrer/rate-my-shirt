import { Component, OnInit } from '@angular/core';
import { addDoc, collection, doc, Firestore, onSnapshot, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.page.html',
  styleUrls: ['./item-view.page.scss'],
})
export class ItemViewPage implements OnInit {
  data;
  activeImgType = 'frontShirt';

  rating = {
    design: 0,
    skill: 0,
    originality: 0,
    final: 100,
    id: null,
  };

  constructor(private router: Router,
    private firestore: Firestore,
    private toastController: ToastController,
    private navController: NavController
  ) {
      this.data = this.router.getCurrentNavigation().extras.state;
      console.log('data', this.data);
      if(!this.data) {
        this.router.navigate(['/home'], {replaceUrl: true});
      }
      this.getMyRating();
  }

  ngOnInit() {

  }

  setActiveImgType(type) {
    this.activeImgType = type;
  }

  calcFinal() {
    const { design, skill, originality} = this.rating;
    this.rating.final = (design + skill + originality) * 10/ 3;
  }


  async submit() {
    const dbRef = collection(this.firestore, 'ratings');

    const docData = {
      createdBy:  this.data.userId,
      itemId: this.data.id,
      ...this.rating
    };
    if(!this.rating.id) {
      await addDoc(dbRef, docData).then(data => {
        console.log('addDoc', data);
        this.presentToast('Success');
        this.navController.back();
      })
      .catch(error => {
        console.log('error', error);
        this.presentToast('Error');
      });
    } else {
      const docRef = doc(this.firestore, 'ratings', this.rating.id);
      await updateDoc(docRef, docData).then(data => {
        console.log('success', data);
        this.presentToast('Success!');
        this.navController.back();
      }).catch(error => {
        console.log('error', error);
        this.presentToast('Error!');
      });
    }
  }

  getMyRating(){
    console.log('getMyRating', this.data.userId, this.data.id);
    const q = query(collection(this.firestore, 'ratings'),
      where('createdBy', '==', this.data.userId),
      where('itemId', '==', this.data.id));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ratings = [];
      console.log('querySnapshot', querySnapshot);
      querySnapshot.forEach((doc) => {
        console.log('querySnapshot doc', doc);
          ratings.push({
            ...doc.data(),
            id: doc.id
          });
      });
      if(ratings.length) {
        this.rating = ratings[0];
      }
    });
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'top'
    });

    await toast.present();
  }
}
