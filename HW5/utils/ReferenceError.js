class ReferenceError extends Error {
    constructor(message) {
      super(message);
      this.name = "ACCESS ERROR";
    }
}