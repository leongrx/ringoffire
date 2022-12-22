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
    this.routeSubscribe();
  }


  routeSubscribe() {
    this.route.params.subscribe(async (params) => {
      this.gameId = params.id;
      this.subscribeValueChanges();
    })
  }

  subscribeValueChanges() {
    this
      .firestore
      .collection('Game')
      .doc(this.gameId)
      .valueChanges()
      .subscribe((currentGame: any) => {
        this.game.players = currentGame.game.players,
        this.game.stack = currentGame.game.stack,
        this.game.playedCards = currentGame.game.playedCards,
        this.game.currentPlayer = currentGame.game.currentPlayer,
        this.game.pickCardAnimation = currentGame.game.pickCardAnimation,
        this.game.currentCard = currentGame.game.currentCard
      })
  }
  
  newGame() {
    this.game = new Game();
  }
  
  takeCard() {
    if(!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.saveGame();
      debugger
      
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      debugger
      
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        debugger
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000)
    }
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
     .collection('Game')
     .doc(this.gameId)
     .update(this.game.toJson());
     console.log(this.game.toJson().currentCard)
  }
}

