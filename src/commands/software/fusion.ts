import { Client } from '../../util';
import { BaseVersionLookup } from './_base';

export default class FusionVersionLookup extends BaseVersionLookup {
  constructor(client: Client) {
    super(client, 'fusion');
  }
}
