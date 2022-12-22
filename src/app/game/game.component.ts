import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit{
  game: Game;
  gameId: string;
  firstCardOnInit: string;

  constructor(private firestore: AngularFirestore, public dialog: MatDialog, private route: ActivatedRoute) {}

   ngOnInit(): void{
    this.newGame();
    this.route.params.subscribe(async (params) => {
      this.gameId = params.id;
      this
        .firestore
        .collection('Games')
        .doc(this.gameId)
        .valueChanges()
        .subscribe((currentGame: any) => {
          this.game.players = currentGame.players,
          this.game.stack = currentGame.stack,
          this.game.playedCards = currentGame.playedCards,
          this.game.currentPlayer = currentGame.currentPlayer,
          this.game.pickCardAnimation = currentGame.pickCardAnimation,
          this.game.currentCard = currentGame.currentCard
        })
    })
  }

  newGame() {
    this.game = new Game();
  }
  
  takeCard() {
    console.log(this.game)
    if(!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.saveGame();
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000)
    }
    console.log(this.game.stack)
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if(name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  saveGame() {
    this
     .firestore
     .collection('Games')
     .doc(this.gameId)
     .update(this.game.toJson());
  }
}

