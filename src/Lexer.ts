class LexerException implements Error {
    public name = "LexerException";
    public message: string;

    constructor (errorMessage?: string) {
        this.message = errorMessage;
    }
}

import Machine = module('./State');
import Tokens = module('./Tokens');

var pointer = 0;
var column = 0;
var currentChar = '';
var state = 1;
var token = '';
var tokens = [];

export function analyze(input: string) {
    token = '';
    state = 1;
    tokens = [];
    Machine.Line++;

    for (pointer = 0; pointer < input.length; pointer++) {
        currentChar = input[pointer];
        token += currentChar;

        column = Machine.Columns.indexOf(currentChar) + 2;

        if (column < 2) {
            if (Machine.Letters.indexOf(currentChar.toUpperCase()) != -1) {
                column = 0;
            } else if (Machine.Numbers.indexOf(currentChar.toUpperCase()) != -1) {
                column = 1;
            } else if (state != 10 && state != 12) {
                throw new LexerException('Unidentified character on line: ' + Machine.Line + ', char: ' + (pointer + 1));
            }
        }

        state = Machine.LexTable[state][column];
        var backup = checkForToken(false);

        if (state == 1) {
            if (backup) pointer--;
            token = '';
        }
    }

    state = Machine.LexTable[state][19];
    checkForToken(true);

    if (state != 1) {
        throw new LexerException('Unexpected end of line at line ' + Machine.Line);
    }

    if (tokens.length > 0) {
        tokens.push({ Type: Tokens.EndOfLine, Literal: '$' });
    }

    return tokens;
}

function checkForToken(endofline: bool): bool {
    switch (state) {
        case 3: // End Identifier
            if (!endofline) token = token.substr(0, token.length - 1);
            if (Machine.Keywords.indexOf(token) != -1) {
                tokens.push({ Type: Tokens.Keyword, Literal: token });
            } else if (Machine.Operators.indexOf(token) != -1) {
                tokens.push({ Type: Tokens.Operator, Literal: token });
            } else {
                if (Machine.Symbols.indexOf(token) == -1) {
                    Machine.Symbols.push(token);
                }
                tokens.push({ Type: Tokens.Identifier, Literal: token });
            }
            state = 1;
            return true;
        case 5: // End Number
            if (!endofline) token = token.substr(0, token.length - 1);
            tokens.push({ Type: Tokens.NumberLiteral, Literal: token });
            state = 1;
            return true;
        case 6: // Found Operator
        case 8: // End Compound Operator
            tokens.push({ Type: Tokens.Operator, Literal: token });
            state = 1;
            return false;
        case 9: // End Operator
            if (!endofline) token = token.substr(0, token.length - 1);
            tokens.push({ Type: Tokens.Operator, Literal: token });
            state = 1;
            return true;
        case 11: // End String
            tokens.push({ Type: Tokens.StringLiteral, Literal: token });
            state = 1;
            return false;
        case 13: // End Comment
            state = 1;
            return false;
        case 14: // End Label
            tokens.push({ Type: Tokens.Label, Literal: token });
            state = 1;
            return false;
        case 15: // Found Separator
            tokens.push({ Type: Tokens.Separator, Literal: token });
            state = 1;
            return false;
        case 18: // End Decimal
            if (!endofline) token = token.substr(0, token.length - 1);
            tokens.push({ Type: Tokens.DecimalLiteral, Literal: token });
            state = 1;
            return true;
    }
    return false;
}