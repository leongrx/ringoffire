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

  constructor(private firestore: AngularFirestore, public dialog: MatDialog, private route: ActivatedRoute) {}

  ngOnInit(): void{
    this.newGame();
    this.route.params.subscribe((params) => {
    console.log(params.id);
    this.gameId = params.id;

    this
      .firestore
      .collection('Game')
      .doc(this.gameId)
      .valueChanges()
      .subscribe((game: any) => {
        this.game.players = game.players,
        this.game.stack = game.stack,
        this.game.playedCards = game.playedCards,
        this.game.currentPlayer = game.currentPlayer,
        this.game.pickCardAnimation = game.pickCardAnimation,
        this.game.currentCard = game.currentCard
      })
    })
    debugger
  }
  
  newGame() {
    this.game = new Game();
  }
  
  takeCard() {
    console.log("Game update", this.game.players);  
    if(!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.saveGame();
      this.game.pickCardAnimation = true;

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.saveGame();
        this.game.pickCardAnimation = false;
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
  }
}

