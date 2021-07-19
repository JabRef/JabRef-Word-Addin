/* eslint-disable no-unused-vars */
declare module "*.worker.ts" {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}
