import lexer = module('./../src/Lexer');
import Tokens = module('./../src/Tokens');

export function lexer_returns_correct_tokens_on_if(test) {
    var tokens = lexer.analyze('If (name > 10) Then');

    test.expect(7);
    test.equal(tokens[0].Type, Tokens.Keyword, 'First token should be keyword');
    test.equal(tokens[1].Type, Tokens.Separator, 'Second token should be operator');
    test.equal(tokens[2].Type, Tokens.Identifier, 'Third token should be identifier');
    test.equal(tokens[3].Type, Tokens.Operator, 'Fourth token should be operator');
    test.equal(tokens[4].Type, Tokens.NumberLiteral, 'Fifth token should be number');
    test.equal(tokens[5].Type, Tokens.Separator, 'Sixth token should be operator');
    test.equal(tokens[6].Type, Tokens.Keyword, 'Seventh token should be keyword');
    test.done();
}

export function Negative_decimal_number_is_mapped_properlyn(test) {
    var tokens = lexer.analyze('-100.10');

    test.expect(1);
    test.equal(tokens[0].Type, Tokens.DecimalLiteral, 'First token should be number');
    test.done();
}

export function Decimal_number_is_mapped_properly(test) {
    var tokens = lexer.analyze('100.00');

    test.expect(1);
    test.equal(tokens[0].Type, Tokens.DecimalLiteral, 'First token should be number');
    test.done();
}

export function Negative_number_is_mapped_properly(test) {
    var tokens = lexer.analyze('-100');

    test.expect(1);
    test.equal(tokens[0].Type, Tokens.NumberLiteral, 'First token should be number');
    test.done();
}

export function Lexer_throws_unexpected_end_of_line_on_third_line(test) {
    test.expect(1);
    test.throws(
        function () {
            lexer.analyze('name = "Hello, World');
        },
        function(err) {
            return err.message.indexOf('Unexpected end of line') != -1;
        }
    );
    test.done();
}

export function Lexer_does_not_throw_error_for_unexpected_characters_inside_comment(test) {
    var tokens = lexer.analyze('\'!hdy$%@&;');

    test.expect(1);
    test.ok(tokens.length == 0, 'Tokens should be empty');
    test.done();
}

export function Lexer_does_not_throw_error_for_unexpected_characters_inside_string(test) {
    var tokens = lexer.analyze('"!this is a string!@#$;"');

    test.expect(1);
    test.equal(tokens[0].Type, Tokens.StringLiteral, 'First token should be string');
    test.done();
}

export function Lexer_returns_nothing_on_whitespace_line(test) {
    var tokens = lexer.analyze('   ');

    test.expect(1);
    test.ok(tokens.length == 0, 'Tokens should be empty');
    test.done();
}

export function Lexer_returns_nothing_on_blank_line(test) {
    var tokens = lexer.analyze('');

    test.expect(1);
    test.ok(tokens.length == 0, 'Tokens should be empty');
    test.done();
}

export function Lexer_returns_nothing_after_comment(test) {
    var tokens = lexer.analyze('name = 10 \' This is a comment');

    test.expect(4);
    test.equal(tokens[0].Type, Tokens.Identifier, 'First token should be identifier');
    test.equal(tokens[1].Type, Tokens.Operator, 'Second token should be operator');
    test.equal(tokens[2].Type, Tokens.NumberLiteral, 'Third token should be number');
    test.ok(tokens.length == 4, 'Tokens length should be 3');
    test.done();
}

export function Lexer_returns_nothing_on_commented_line(test) {
    var tokens = lexer.analyze('\' This is a comment');

    test.expect(1);
    test.ok(tokens.length == 0, 'Tokens should be empty');
    test.done();
}

export function Lexer_returns_correct_tokens_with_no_spaces(test) {
    var tokens = lexer.analyze('x=5+2');

    test.expect(5);
    test.equal(tokens[0].Type, Tokens.Identifier, 'First token should be identifier');
    test.equal(tokens[1].Type, Tokens.Operator, 'Second token should be operator');
    test.equal(tokens[2].Type, Tokens.NumberLiteral, 'Third token should be number');
    test.equal(tokens[3].Type, Tokens.Operator, 'Fourth token should be operator');
    test.equal(tokens[4].Type, Tokens.NumberLiteral, 'Fifth token should be number');
    test.done();
}

export function Lexer_throws_Unexpected_end_of_line_on_no_numbers_after_decimal_point(test) {
    test.expect(1);
    test.throws(
        function () {
            lexer.analyze('100. ');
        },
        function(err) {
            return err.message.indexOf('Unexpected end of line') != -1;
        }
    );
    test.done();
}

export function lexer_throws_unexpected_end_of_line_message(test) {
    test.expect(1);
    test.throws(
        function () {
            lexer.analyze('If ("hello" == "hello');
        },
        function(err) {
            return err.message.indexOf('Unexpected end of line') != -1;
        }
    );
    test.done();
}

export function Lexer_throws_Unidentified_character_message(test) {
    test.expect(1);
    test.throws(
        function () {
            lexer.analyze('name = 10;');
        },
        function(err) {
            return err.message.indexOf('Unidentified character on line') != -1;
        }
    );
    test.done();
}

export function Lexer_handles_function_call(test) {
    var tokens = lexer.analyze('Function("parameter")');

    test.expect(4);
    test.equal(tokens[0].Type, Tokens.Identifier, 'First token should be identifier');
    test.equal(tokens[1].Type, Tokens.Separator, 'Second token should be separator');
    test.equal(tokens[2].Type, Tokens.StringLiteral, 'Third token should be string');
    test.equal(tokens[3].Type, Tokens.Separator, 'Fourth token should be separator');
    test.done();
}

export function Lexer_handles_member_function_call(test) {
    var tokens = lexer.analyze('Function.Member()');

    test.expect(5);
    test.equal(tokens[0].Type, Tokens.Identifier, 'First token should be identifier');
    test.equal(tokens[1].Type, Tokens.Operator, 'First token should be operator');
    test.equal(tokens[2].Type, Tokens.Identifier, 'First token should be identifier');
    test.equal(tokens[3].Type, Tokens.Separator, 'Second token should be separator');
    test.equal(tokens[4].Type, Tokens.Separator, 'Fourth token should be separator');
    test.done();
}