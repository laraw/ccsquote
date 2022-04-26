
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Centre } from '../models';

@Injectable({ providedIn: 'root' })
export class CentreService {

  centresCollection: AngularFirestoreCollection<Centre>;
  centres: Observable<Centre[]>;
  centreDoc: AngularFirestoreDocument<Centre>;
  categoryCentresCollection: AngularFirestoreCollection<Centre>;
  categoryCentres: Observable<Centre[]>;

  constructor(public afs:AngularFirestore) {

    
  }

  listCentres(uid) {
    this.centresCollection = this.afs.collection('centres', ref => ref.where('uid','==', uid).orderBy("name","asc"));

    // this.meetings = this.afs.collection('meetings').valueChanges();
    this.centres = this.centresCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Centre;
        data.id = a.payload.doc.id;
        return data;
      });
    }));


    return this.centres;

  }

  addCentre(centre: any) {
    let centreId = this.afs.createId();
    let newCentre:  Centre = {
      id: centreId,
      name: centre.name,      
      uid: centre.uid
      
      
      
    }
    
    return this.centresCollection.add(newCentre);
  }

  updateCentre(centre: Centre) {
    this.centreDoc = this.afs.doc(`centres/${centre.id}`);
    
    return  this.centreDoc.update(centre);
  }
}
