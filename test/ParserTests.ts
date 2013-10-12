import parser = module('./../src/Parser');
import Tokens = module('./../src/Tokens');

interface ParseToken {
    Type: string;
    Literal: string;
}

interface ParseNode {
    Type: string;
    Literal: any;
    Left?: ParseNode;
    Operator?: string;
    Right?: ParseNode;
}

export function Parser_throws_error_on_empty_input(test) {
    var input: ParseToken[] = [];

    test.expect(1);
    test.throws(
        function () {
            parser.parse(input);
        },
        function(err) {
            return err.message.indexOf('Incomplete input') != -1;
        }
    );
    test.done();
}

export function Parser_throws_error_on_end_of_line(test) {
    var input: ParseToken[] = [
        { Type: Tokens.Keyword, Literal: 'If' },
        { Type: Tokens.Identifier, Literal: 'x' },
        { Type: Tokens.EndOfLine, Literal: '$' }
    ];

    test.expect(1);
    test.throws(
        function () {
            parser.parse(input);
        },
        function(err) {
            return err.message.indexOf('Unexpected end of line') != -1;
        }
    );
    test.done();
}

export function Parser_returns_correct_tree_on_expression(test) {
    var input: ParseToken[] = [
        { Type: Tokens.Identifier, Literal: 'x' },
        { Type: Tokens.Operator, Literal: '=' },
        { Type: Tokens.NumberLiteral, Literal: '1' },
        { Type: Tokens.Operator, Literal: '+' },
        { Type: Tokens.NumberLiteral, Literal: '2' },
        { Type: Tokens.EndOfLine, Literal: '$' }
    ];
    var result: ParseNode = parser.parse(input);

    test.expect(12);
    test.equal(result.Literal, 15, 'First node production should be production [B => i = E]');
    test.equal(result.Left.Type, Tokens.Production, 'Left node should be a production');
    test.equal(result.Left.Operator, '=', 'Left side operator should be an assignment operator');
    test.equal(result.Left.Right.Literal, 19, 'Right node should be production [E => E + T]');
    test.equal(result.Left.Right.Left.Literal, 23, 'Left node should be production [E => T]');
    test.equal(result.Left.Right.Left.Left.Literal, 26, 'Left node should be production [T => F]');
    test.equal(result.Left.Right.Left.Left.Left.Literal, 28, 'Left node should be production [F => t]');
    test.equal(result.Left.Right.Left.Left.Left.Left.Literal, 1, 'Left node should be number literal 1');

    test.equal(result.Left.Right.Operator, '+', 'Operator should be an add operator');

    test.equal(result.Left.Right.Right.Literal, 26, 'Right node should be production [T => F]');
    test.equal(result.Left.Right.Right.Left.Literal, 28, 'Right node should be production [F => t]');
    test.equal(result.Left.Right.Right.Left.Left.Literal, 2, 'Right node should be number literal 2');
    test.done();
}

export function Parser_returns_correct_tree_on_function_call(test) {
    var input: ParseToken[] = [
        { Type: Tokens.Identifier, Literal: 'function' },
        { Type: Tokens.Separator, Literal: '(' },
        { Type: Tokens.Separator, Literal: ')' },
        { Type: Tokens.EndOfLine, Literal: '$' }
    ];
    var result: ParseNode = parser.parse(input);

    test.expect(2);
    test.equal(result.Literal, 14, 'First node production should be production [S => i.i(A)]');
    test.equal(result.Left.Type, Tokens.Identifier, 'Left node should be an identifier');
    test.done();
}

export function Parser_returns_correct_tree_on_method_call(test) {
    var input: ParseToken[] = [
        { Type: Tokens.Identifier, Literal: 'function' },
        { Type: Tokens.Operator, Literal: '.' },
        { Type: Tokens.Identifier, Literal: 'method' },
        { Type: Tokens.Separator, Literal: '(' },
        { Type: Tokens.Separator, Literal: ')' },
        { Type: Tokens.EndOfLine, Literal: '$' }
    ];
    var result: ParseNode = parser.parse(input);

    test.expect(4);
    test.equal(result.Literal, 13, 'First node production should be production [S => i.i(A)]');
    test.equal(result.Left.Type, Tokens.Identifier, 'Left node should be an identifier');
    test.equal(result.Right.Type, Tokens.Identifier, 'Left side should be an identifier');
    test.equal(result.Operator, '.', 'Operator should be a period operator');
    test.done();
}

export function Parser_returns_correct_tree_on_method_call_with_one_parameter(test) {
    var input: ParseToken[] = [
        { Type: Tokens.Identifier, Literal: 'function' },
        { Type: Tokens.Operator, Literal: '.' },
        { Type: Tokens.Identifier, Literal: 'method' },
        { Type: Tokens.Separator, Literal: '(' },
        { Type: Tokens.Identifier, Literal: 'input' },
        { Type: Tokens.Separator, Literal: ')' },
        { Type: Tokens.EndOfLine, Literal: '$' }
    ];
    var result: ParseNode = parser.parse(input);

    test.expect(5);
    test.equal(result.Literal, 13, 'First node production should be production [S => i.i(A)]');
    test.equal(result.Left.Type, Tokens.Identifier, 'Left node should be an identifier');
    test.equal(result.Right.Type, Tokens.Identifier, 'Left side should be an identifier');
    test.equal(result.Operator, '.', 'Operator should be a period operator');
    test.equal(result.Right.Right.Type, Tokens.Argument, 'Right side should be an argument');
    test.done();
}

export function Parser_returns_correct_tree_on_method_call_with_expression_argument(test) {
    var input: ParseToken[] = [
        { Type: Tokens.Identifier, Literal: 'function' },
        { Type: Tokens.Operator, Literal: '.' },
        { Type: Tokens.Identifier, Literal: 'method' },
        { Type: Tokens.Separator, Literal: '(' },
        { Type: Tokens.NumberLiteral, Literal: '1' },
        { Type: Tokens.Operator, Literal: '+' },
        { Type: Tokens.Separator, Literal: '(' },
        { Type: Tokens.NumberLiteral, Literal: '2' },
        { Type: Tokens.Operator, Literal: '+' },
        { Type: Tokens.NumberLiteral, Literal: '2' },
        { Type: Tokens.Separator, Literal: ')' },
        { Type: Tokens.Separator, Literal: ')' },
        { Type: Tokens.EndOfLine, Literal: '$' }
    ];
    var result: ParseNode = parser.parse(input);

    test.expect(5);
    test.equal(result.Literal, 13, 'First node production should be production [S => i.i(A)]');
    test.equal(result.Left.Type, Tokens.Identifier, 'Left node should be an identifier');
    test.equal(result.Right.Type, Tokens.Identifier, 'Left side should be an identifier');
    test.equal(result.Operator, '.', 'Operator should be a period operator');
    test.equal(result.Right.Right.Type, Tokens.Argument, 'Right side should be an argument');
    test.done();
}