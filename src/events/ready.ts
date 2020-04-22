import { Event, Client } from '../util'

export default class ReadyEvent extends Event {
  constructor(client: Client) {
    super(client, {
      disabled: false,
    });
  }

  main(): any {
    console.log(`Hello, I'm ${this.client.user.username}, and I'm ready to rock and roll!`);
    return;
  }
}