
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Setting } from '../models';

@Injectable({ providedIn: 'root' })
export class SettingService {

  settingsCollection: AngularFirestoreCollection<Setting>;
  settings: Observable<Setting[]>;
  settingDoc: AngularFirestoreDocument<Setting>;
  
  constructor(public afs:AngularFirestore, private toastrService: ToastrService) {

    
  }

  listSettings(cid: string) {
    
    this.settingsCollection = this.afs.collection('settings', ref => ref.where('id','==', cid.replace("/","-")));

    // this.meetings = this.afs.collection('meetings').valueChanges();
    this.settings = this.settingsCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Setting;
        data.id = a.payload.doc.id;
        return data;
      });
    }));


    return this.settings;

  }


  getSetting(id: string) {

    return this.afs.collection("settings").doc(id.replace("/","-")).valueChanges();

  }

}
