import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router'
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-startscreen',
  templateUrl: './startscreen.component.html',
  styleUrls: ['./startscreen.component.scss']
})
export class StartscreenComponent implements OnInit{
  constructor(private firestore: Firestore, private router: Router) {}

  ngOnInit(): void {
    
  }

  async newGame() {
    let game = new Game();
    const coll = collection(this.firestore, 'Game');
    console.log("Document written with ID: ", coll);
    // CRUD = Create => addDoc, Read, Update => setDoc, Delete
    let gameInfo = await addDoc(coll, {game: game.toJson()});
    this.router.navigateByUrl('game/' + gameInfo.id);
  }
}

// 
