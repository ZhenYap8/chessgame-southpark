// AudioAdapter (stub) - maps event types to (future) sounds
export class AudioAdapter {
  constructor(){ this.enabled = true; }
  setEnabled(on){ this.enabled = !!on; }
  /** @param {string} eventType */
  play(eventType){ if(!this.enabled) return; /* TODO implement in step 8 */ }
}
