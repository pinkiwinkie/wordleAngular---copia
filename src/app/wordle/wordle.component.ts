import { Component, ElementRef, HostListener, Input, QueryList, ViewChildren, asNativeElements } from "@angular/core";
import { WORDS } from "../words";
import { state } from "@angular/animations";

const WORD_LENGTH = 5;
const NUM_TRIES = 6;
const LETTERS = (() => {
  const ret: { [key: string]: boolean } = {};
  for (let charCode = 97; charCode < 97 + 26; charCode++) {
    ret[String.fromCharCode(charCode)] = true;
  }
  return ret;
})();

interface Try {
  letters: Letter[];
}

interface Letter {
  text: string;
  state: LetterState;
}

enum LetterState {
  WRONG,
  PARTIAL_MATCH,
  FULL_MATCH,
  PENDING
}

@Component({
  selector: 'wordle',
  templateUrl: './wordle.component.html',
  styleUrls: ['./wordle.component.css']
})
export class Wordle {
  @ViewChildren('tryContainer') tryContainers!: QueryList<ElementRef>;
  @Input() word: string = ''; 

  readonly tries: Try[] = []
  readonly LetterState = LetterState;

  infoMsg = ''
  fadeOutInfoMessage = false;

  private currentLetterIndex = 0;
  private numSubmittedTries = 0;

  private targetWorld = '';
  private won = false;

  private targetWorldLetterCounts: { [letter: string]: number } = {};

  constructor() {
    for (let i = 0; i < NUM_TRIES; i++) {
      const letters: Letter[] = [];
      for (let j = 0; j < WORD_LENGTH; j++) {
        letters.push({ text: '', state: LetterState.PENDING })
      }
      this.tries.push({ letters })
    }
    if(!this.targetWorld){
      const numWords = WORDS.length;
      const index = Math.floor(Math.random() * numWords);
      const word = WORDS[index];
      if (word.length === WORD_LENGTH) {
        this.targetWorld = word.toLowerCase();
      }
      console.log(this.targetWorld);
    } else{
      this.targetWorld = this.word.toLowerCase();
    }
    
    //this.targetWorld = this.word; //aqui el usuario debe introducir la palabra
    

    for (const letter of this.targetWorld) {
      const count = this.targetWorldLetterCounts[letter];
      if (count == null) {
        this.targetWorldLetterCounts[letter] = 0;
      }
      this.targetWorldLetterCounts[letter]++;
    }
    console.log(this.targetWorldLetterCounts);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.handleClickKey(event.key);
  }

  private handleClickKey(key: string) {
    if (this.won) {
      return;
    }

    if (LETTERS[key.toLowerCase()]) {
      if (this.currentLetterIndex < (this.numSubmittedTries + 1) * WORD_LENGTH) {
        this.setLetter(key);
        this.currentLetterIndex++;
      }
    }
    else if (key === 'Backspace') {
      if (this.currentLetterIndex > this.numSubmittedTries * WORD_LENGTH) {
        this.currentLetterIndex--;
        this.setLetter('');
      }
    } else if (key === 'Enter') {
      this.checkCurrentTry();

    }
  }

  private setLetter(letter: string) {
    const tryIndex = Math.floor(this.currentLetterIndex / WORD_LENGTH);
    const letterIndex = this.currentLetterIndex - tryIndex * WORD_LENGTH;
    this.tries[tryIndex].letters[letterIndex].text = letter;
  }

  private async checkCurrentTry() {
    const currentTry = this.tries[this.numSubmittedTries];
    if (currentTry.letters.some(letter => letter.text === '')) {
      this.showInfoMessage("Not enough letters");
      return;
    }

    const targetWorldLetterCounts = { ...this.targetWorldLetterCounts };
    const states: LetterState[] = [];
    for (let i = 0; i < WORD_LENGTH; i++) {
      const expected = this.targetWorld[i]
      const currentLetter = currentTry.letters[i];
      const got = currentLetter.text.toLowerCase();
      let state = LetterState.WRONG;
      if (expected === got && targetWorldLetterCounts[got] > 0) {
        targetWorldLetterCounts[expected]--;
        state = LetterState.FULL_MATCH;
      } else if (this.targetWorld.includes(got) && targetWorldLetterCounts[got] > 0) {
        targetWorldLetterCounts[got]--;
        state = LetterState.PARTIAL_MATCH;
      }
      states.push(state);
    }
    console.log(states);

    const tryContainer = this.tryContainers.get(this.numSubmittedTries)?.nativeElement as HTMLElement;

    const letterEles = tryContainer.querySelectorAll('.letter-container');
    for (let i = 0; i < letterEles.length; i++) {
      const currentLetterEle = letterEles[i];
      currentLetterEle.classList.add('fold');
      await this.wait(180);
      currentTry.letters[i].state = states[i];
      currentLetterEle.classList.remove('fold');
      await this.wait(180);
    }
    this.numSubmittedTries++;
    if (states.every(state => state === LetterState.FULL_MATCH)) {
      this.showInfoMessage('Nice!')
      this.won = true;
      return;
    }

    if (this.numSubmittedTries === NUM_TRIES) {
      this.showInfoMessage(this.targetWorld.toUpperCase(), false);
    }
  }

  private showInfoMessage(msg: string, hide = true) {
    if (hide) {
      this.infoMsg = msg;
      setTimeout(() => {
        this.fadeOutInfoMessage = true;
        setTimeout(() => {
          this.infoMsg = ''
          this.fadeOutInfoMessage = false;
        })
      }, 2000)
    }
  }

  private async wait(ms: number) {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    })
  }
}