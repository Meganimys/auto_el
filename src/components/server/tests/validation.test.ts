import { isCorrectPassword } from "../Validation";
import { isEqualsPassword } from "../Validation";
import { isCorrectLogin } from "../Validation";
import { isCorrectEmail } from "../Validation";

describe('isCorrectPassword', () => {
  test.each([
    ['ValidPass1!', true],
    ['short', false],
    ['no_digit_OR_UPPER', false],
    ['NODIGIT1!', false],
    ['NoSpecialChar1', false],
  ])('should validate %s as %p', (password, expected) => {
    expect(isCorrectPassword(password)).toBe(expected);
  });
});

describe('check password is equals', () => {
    test.each(
        [
            ['password', 'password', true],
            ['password1', 'password', false],
            ['passWord', 'password', false],
        ]
    )('should validate %s and %s as %p', (pass1, pass2, expected) => {
        expect(isEqualsPassword(pass1, pass2)).toBe(expected);
    });
});

describe('check login is correct', () => {
    test.each(
        [
            ['Admin', true],
            ['@dmin', false],
            ['Adm_i-n', true],
        ]
    )('should validate %s as %p', (login, expected) => {
        expect(isCorrectLogin(login)).toBe(expected);
    });
});

describe('check email is correct', () => {
    test.each(
        [
            ['mail', false],
            ['@mail', false],
            ['mail@gmail.com', true],
        ]
    )('should validate %s as %p', (email, expected) => {
        expect(isCorrectEmail(email)).toBe(expected);
    });
});