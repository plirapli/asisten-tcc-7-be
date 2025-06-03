export class ErrorWithStatusCode extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const compareArrays = (a, b) => {
  if (a.length > b.length) {
    return false;
  }

  // Convert arrays to Sets and compare
  const field = new Set(a);
  const reqField = new Set(b);

  return [...field].every((element) => reqField.has(element));
};
