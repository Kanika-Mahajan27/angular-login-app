import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Emoji } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { noWhitespaceValidator } from 'src/app/validators/noWhitespaceValidator';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent {

  @Input() placeholder : string = "";
  @Input() size : string = "sm";
  @Input() emojiPicker : boolean = true;
  @Input() actionTitle : string = "Send";

  @Output() submission : EventEmitter<string> = new EventEmitter<string>();
  

  showEmojiPicker : boolean = false;

  inputForm! : FormGroup;
  constructor(private fb : FormBuilder){
    this.inputForm = fb.group({
      text : ['',[Validators.required, noWhitespaceValidator()]]  
    })
  }

  emitSubmission(text : string){
    if(this.inputForm.valid){
      this.submission.emit(this.inputForm.get("text")?.value);
      this.inputForm.reset();
    }else{
      this.inputForm.markAllAsTouched();
    }
  }

  addEmoji(selected : Emoji) {
    const emoji : string = (selected.emoji as any).native; 
    if(this.inputForm.get("text")?.value !== null){
      this.inputForm.get('text')?.setValue(this.inputForm.get("text")?.value + emoji);
    }else{
      this.inputForm.get('text')?.setValue(emoji);
    }   
  }

  get text(){
    return this.inputForm.get("text");
  }

}
