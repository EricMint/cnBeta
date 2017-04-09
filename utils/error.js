function LoginRequiredError(message) {
  this.name = 'LoginRequiredError';
  this.message = (message || '');
}

LoginRequiredError.prototype = Error.prototype;

module.exports.LoginRequiredError = LoginRequiredError;
