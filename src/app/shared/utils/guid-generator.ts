export function generateGuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    (character) => {
      // tslint:disable-next-line: no-bitwise
      const randomNumber = (Math.random() * 16) | 0;
      // tslint:disable-next-line: no-bitwise
      const replacementValue =
        character === 'x' ? randomNumber : (randomNumber & 0x3) | 0x8;

      return replacementValue.toString(16);
    }
  );
}
