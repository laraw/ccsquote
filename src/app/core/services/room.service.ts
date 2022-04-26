
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Room, Session } from '../models';

@Injectable({ providedIn: 'root' })
export class RoomService {

  roomsCollection: AngularFirestoreCollection<Room>;
  rooms: Observable<Room[]>;
  roomDoc: AngularFirestoreDocument<Room>;
  categoryRoomsCollection: AngularFirestoreCollection<Room>;
  categoryRooms: Observable<Room[]>;
  roomSessionsCollection: AngularFirestoreCollectionGroup<Session>;
  roomSessions: Observable<Session[]>;
  constructor(public afs:AngularFirestore, private toastrService: ToastrService) {

    
  }

  listRooms(cid) {
    this.roomsCollection = this.afs.collection('rooms', ref => ref.where('cid','==', cid).orderBy("name","asc"));

    // this.meetings = this.afs.collection('meetings').valueChanges();
    this.rooms = this.roomsCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Room;
        data.id = a.payload.doc.id;
        return data;
      });
    }));


    return this.rooms;

  }

  addRoom(room: any) {
    let roomId = this.afs.createId();
    let newRoom:  Room = {
      cid: room.cid,
      id: roomId,
      name: room.name
        
      
      
      
    }
    
    return this.roomsCollection.add(newRoom);
  }

  updateRoom(room: Room) {
    this.roomDoc = this.afs.doc(`rooms/${room.id}`);
    
    return  this.roomDoc.update(room);
  }

  listSessions(roomId) {
    console.log(roomId);
    this.roomSessionsCollection = this.afs.collectionGroup('sessions', ref => ref.where("rid","==",roomId).orderBy("length","asc"))
    this.roomSessions = this.roomSessionsCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Session;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
  
    return this.roomSessions;
  }


  addSession(session: any) {
    let sessionId = this.afs.createId();
    let newSession:  Session = {
      rid: session.rid,
      id: sessionId,
      name: session.name,
      fee1: session.fee1,
      fee2: session.fee2,
      fee3: session.fee3,
      fee4: session.fee4,
      fee5: session.fee5,
      length: session.length
        
      
      
      
    }

    const sessionsRef = this.afs.collection(`rooms/${session.rid}/sessions`).doc(sessionId).ref;

    return sessionsRef.set(newSession, {merge: true})
    
  }

  removeRoom(room: Room) {
    this.afs.doc(`rooms/${room.id}`).delete()
    .then(
    () => this.toastrService.success("Your room was removed successfully."))
    .catch(
      res => {
        this.toastrService.error(res);
      }
    );
  }
  removeSession(session: Session) {
    this.afs.doc(`rooms/${session.rid}/sessions/${session.id}`).delete()
    .then(
    () => this.toastrService.success("Your session was removed successfully."))
    .catch(
      res => {
        this.toastrService.error(res);
      }
    );
  }


}
