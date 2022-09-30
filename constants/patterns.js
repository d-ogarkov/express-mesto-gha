const REGEX_PATTERN = {
  url: /(https?:\/\/)?(www.)?[a-z0-9-.]+\.[a-z0-9-]+[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?/i,
  email: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
};

module.exports = {
  REGEX_PATTERN,
};
