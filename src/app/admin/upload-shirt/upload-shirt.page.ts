import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection, collectionChanges, setDoc, doc, addDoc, updateDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, uploadBytesResumable } from '@angular/fire/storage';
import { getDownloadURL } from '@firebase/storage';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-upload-shirt',
  templateUrl: './upload-shirt.page.html',
  styleUrls: ['./upload-shirt.page.scss'],
})
export class UploadShirtPage implements OnInit {
  form: any = {
    name: '',
    frontImage: {},
    frontShirt: {},
    backImage: {},
    backShirt: {},
  };

  urls = {};

  numOfUploads = 0;
  constructor(
    private firestore: Firestore,
    private storage: Storage,
    private toastController: ToastController,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.presentToast('test!');
  }

  onFileChanged(event, slug) {
    console.log('onFileChanged',event);
    this.form[slug].file = event.target.files[0];

    const fr = new FileReader();
      fr.onload = () => {
        this.form[slug].src = fr.result;
      };
      fr.readAsDataURL(this.form[slug].file);
  }

  async submit() {
    const dbRef = collection(this.firestore, 'items');
    let docId;

    const docData = {
      name:  this.form.name,
      frontImage: '',
      frontShirt: '',
      backImage: '',
      backShirt: '',
    };

    await addDoc(dbRef, docData).then(data => {
      console.log('addDoc', data);
      docId = data.id;
    });

    if(this.form.frontImage.src) { this.upload('frontImage', docId); }
    if(this.form.frontShirt.src) { this.upload('frontShirt', docId); }
    if(this.form.backImage.src) { this.upload('backImage', docId); }
    if(this.form.backShirt.src) { this.upload('backShirt', docId); }

  }

  upload(imageType, docId) {
    const storageRef = ref(this.storage, `${docId}/${imageType}.jpg`);
    const metadata = {
      contentType: 'image/jpeg',
    };
    if(this.form[imageType].src) {
      this.numOfUploads ++;
      const uploadTaskFI = uploadBytesResumable(storageRef, this.form[imageType].file);
      uploadTaskFI.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('progress', progress);
        },
        (error) => {
          this.presentToast('Failed!');
          this.numOfUploads = 0;
         },
        () => {
          getDownloadURL(uploadTaskFI.snapshot.ref).then((downloadURL) => {
            console.log('File uploadTaskFI available at', downloadURL);
            this.urls[imageType] = downloadURL;
            this.checkUploadStatus(docId);
          });
        }
      );
    }
  }

  async checkUploadStatus(docId) {
    this.numOfUploads --;
    if(this.numOfUploads === 0) {
      console.log('this.urls', this.urls, docId);
      const dbRef = doc(this.firestore, 'items', docId);
      await updateDoc(dbRef, this.urls).then(data => {
        console.log('success', data);
        this.presentToast('Success!');
        this.urls = {};
        this.navController.back();
      }).catch(error => {
        console.log('error', error);
        this.presentToast('Error!');
      });
    }
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
