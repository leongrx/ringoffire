import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { addDoc, collection } from 'firebase/firestore';
import { Game } from 'src/models/game';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-startscreen',
  templateUrl: './startscreen.component.html',
  styleUrls: ['./startscreen.component.scss']
})
export class StartscreenComponent implements OnInit{
  constructor(private firestore: AngularFirestore, private router: Router) {}

  ngOnInit(): void {
    
  }

  async newGame() {
    let game = new Game();
    //Start Game
    this.firestore
      .collection('games')
      .add(game.toJson())
      .then((gameInfo: any) => {
        this.router.navigateByUrl('/game/' + gameInfo.id);
      });
  }
}