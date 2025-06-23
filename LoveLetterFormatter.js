export default class LoveLetterFormatter {
  constructor(letter) {
    this.letter = letter;
  }
  formatTitle() {

     // capitalizes first letter of each word in the title
    return this.letter.title.replace(/\b\w/g, c => c.toUpperCase());
  }
  shortMessage(length = 100) {
    // trruncates message if too long
    return this.letter.message.length > length
      ? this.letter.message.slice(0, length) + '...'
      : this.letter.message;
  }

  messageWithSignature() {

    //automatic signature addition
    const message = this.letter.message?.trim() || '';
    const name = this.letter.sender_username;
    return `${message}\n\nLove,\n${name}`;
  }



}
