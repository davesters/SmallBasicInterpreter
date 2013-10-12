class ParserException implements Error {
    public name = "ParserException";
    public message: string;

    constructor (errorMessage?: string) {
        this.message = errorMessage;
    }
}

import Tokens = module('./Tokens');
import Machine = module('./State');
import ParserHandler = module('./ParserHandler');

export interface ParseToken {
    Type: string;
    Literal: any;
}

export interface ParseNode {
    Type: string;
    Literal: any;
    Left?: ParseNode;
    Operator?: string;
    Right?: ParseNode;
}

export function parse(input: ParseToken[]): ParseNode {
    Machine.State = 0;
    Machine.Stack = [{ State: 0, Node: null }];

    for (var x = 0; x < input.length; x++) {
        var action: string = getParseAction(input[x]);

        if (action.substr(0, 1) == "r") { // Reduce
            handleReduce(parseInt(action.substr(1)));
            x--;
        } else if (action == "acc") { // Accepted
            if (typeof(Machine.Stack) == "undefined") throw new ParserException("No tokens in parser input at line " + Machine.Line);
            return Machine.Stack[1].Node;
        } else if (action != "") { // Shift
            Machine.State = parseInt(action);
            Machine.Stack.push({ State: Machine.State, Node: {
                    Type: input[x].Type,
                    Literal: input[x].Literal
                }
            });
        } else {
            if (input[x].Literal == '$') {
                throw new ParserException("Unexpected end of line at line " + Machine.Line);
            } else {
                throw new ParserException("Unexpected token '" + input[x].Literal + "' at line " + Machine.Line);
            }
        }
    }

    if (Machine.Stack.length == 1) throw new ParserException("Incomplete input at line " + Machine.Line);
    return null;
}

function getParseAction(token: ParseToken): string {
    if (token.Type == Tokens.Identifier) {
        return Machine.GetParseAction('Iden');
    } else if (token.Type == Tokens.Label) {
        return Machine.GetParseAction('Lab');
    } else if (token.Type == Tokens.DecimalLiteral || token.Type == Tokens.NumberLiteral || token.Type == Tokens.StringLiteral) {
        return Machine.GetParseAction('Lit');
    } else {
        return Machine.GetParseAction(token.Literal);
    }
}

function handleReduce(action: number) {
    switch(action) {
        case 1: // S => If E Then
            break;
        case 2: // S => Else
            ParserHandler.HandleSingleRightSideProduction(2, 'S');
            break;
        case 3: // S => ElseIf
            ParserHandler.HandleSingleRightSideProduction(3, 'S');
            break;
        case 4: // S => EndIf
            ParserHandler.HandleSingleRightSideProduction(4, 'S');
            break;
        case 5: // S => For E To E R
            break;
        case 6: // S => EndFor
            ParserHandler.HandleSingleRightSideProduction(6, 'S');
            break;
        case 7: // R => Step E
            ParserHandler.HandleDoubleRightSideProduction(7, 'R');
            break;
        case 8: // S => While E
            ParserHandler.HandleDoubleRightSideProduction(8, 'S');
            break;
        case 9: // S => EndWhile
            ParserHandler.HandleSingleRightSideProduction(9, 'S');
            break;
        case 10: // S => Sub i
            ParserHandler.HandleDoubleRightSideProduction(10, 'S');
            break;
        case 11: // S => EndSub
            ParserHandler.HandleSingleRightSideProduction(11, 'S');
            break;
        case 12: // S => Goto l (label)
            ParserHandler.HandleDoubleRightSideProduction(12, 'S');
            break;
        case 13: // S => i.i(A)
            ParserHandler.HandleProduction13();
            break;
        case 14: // S => i(A)
            ParserHandler.HandleProduction14();
            break;
        case 15: // S => B
            ParserHandler.HandleSingleRightSideProduction(15, 'S');
            break;
        case 16: // A => E
            ParserHandler.HandleSingleRightSideProduction(16, 'A');
            break;
        case 18: // B => i = E
            ParserHandler.HandleOperationProduction(18, 'B');
            break;
        case 19: // E => E + T
            ParserHandler.HandleOperationProduction(19, 'E');
            break;
        case 20: // E => E - T
            ParserHandler.HandleOperationProduction(20, 'E');
            break;
        case 21: // E => E = T
            ParserHandler.HandleOperationProduction(21, 'E');
            break;
        case 22: // E => E G T
            ParserHandler.HandleOperationProduction(22, 'E');
            break;
        case 23: // E => T
            ParserHandler.HandleSingleRightSideProduction(23, 'E');
            break;
        case 24: // T => T * F
            ParserHandler.HandleOperationProduction(24, 'T');
            break;
        case 25: // T => T / F
            ParserHandler.HandleOperationProduction(25, 'T');
            break;
        case 26: // T => F
            ParserHandler.HandleSingleRightSideProduction(26, 'T');
            break;
        case 27: // F => (E)
            ParserHandler.HandleParenthesisExpression(27, 'F');
            break;
        case 28: // F => t (literal)
            ParserHandler.HandleSingleRightSideProduction(28, 'F');
            break;
        case 29: // F => i (identifier)
            ParserHandler.HandleSingleRightSideProduction(29, 'F');
            break;
        case 30: // G => <>
            ParserHandler.HandleSingleRightSideProduction(30, 'G');
            break;
        case 31: // G => <=
            ParserHandler.HandleSingleRightSideProduction(31, 'G');
            break;
        case 32: // G => >=
            ParserHandler.HandleSingleRightSideProduction(32, 'G');
            break;
        case 33: // G => >
            ParserHandler.HandleSingleRightSideProduction(33, 'G');
            break;
        case 34: // G => <
            ParserHandler.HandleSingleRightSideProduction(34, 'G');
            break;
        case 35: // S => l (label)
            ParserHandler.HandleSingleRightSideProduction(35, 'S');
            break;
    }
}