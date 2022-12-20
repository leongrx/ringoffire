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
    this.route.params.subscribe((params) => {
    this.gameId = params.id;
    
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
    })
    this.game.currentCard = this.game.stack.slice(-1).toString();
    console.log('Gameeeee', this.game)
    console.log('CurrentCard', this.game.currentCard)
    debugger
  }
  
  newGame() {
    this.game = new Game();
  }
  
  async takeCard() {
    if(!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      await this.saveGame();
      
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      
      setTimeout(async () => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        await this.saveGame();
      }, 1000)
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(async (name: string) => {
      if(name && name.length > 0) {
        this.game.players.push(name);
        await this.saveGame();
      }
    });
  }

  async saveGame() {
     await 
     this
      .firestore
      .collection('Game')
      .doc(this.gameId)
      .update(this.game.toJson());
  }
}

