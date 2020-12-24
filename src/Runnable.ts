export default abstract class Runnable {
  protected state: 'running' | 'stopped' = 'stopped';

  protected tickRate: number = 1000;

  start() {
    this.state = 'running';
    this.tick();
  }

  tick() {
    setTimeout(() => {
      if (this.state === 'running') this.tick();
    }, this.tickRate);
  }

  stop() {
    this.state = 'stopped';
  }
}
