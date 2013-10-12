# Small Basic Interpreter

This is a small basic interpreter written in TypeScript and developed with Node.js. It is using a custom lexer and LR parser which have been completely written by hand from scratch. I am building this for use in a future website, but am putting it on here for anyone to use and share.

This is still very much in development. So far, it has a working Lexer and LR Parser. I am working on re-doing and refining the parse table that the parser uses.

## Install / Setup

After you have cloned the repro, you can install it with the instructions below. You must have Node.js and Npm installed.

First install the Grunt command line tool module:

    npm install -g grunt-cli

Navigate to the project root, and run:

    npm install

## Building and Running

Now you have all the modules you need downloaded and installed. You can now build the code by running `grunt` or `grunt test` to run the unit tests. By running `grunt` it will compile the TypeScript files and then build them into a single file `interpreter.js`.

# The Language

This is an interpreter for Small Basic. Small Basic is, as the name implies, and very small subset of Basic. It has very few statements and blocks. I will lay out the basic pieces of this particular implementation of Small Basic. This is the very basic set of the language. My plan is to add more complex functionality in the form of separate "libraries". I am adding a few extra special characters for this purpose, but they will not be used for now.

### Operators

    + - * / = < > And Or

### Special Characters / Separators

    ( ) . , " : [ ] \ '

### Keywords

    For
    To
    Step
    EndFor
    If
    Then
    Else
    EndIf
    Goto
    While
    EndWhile
    Sub
    EndSub
    ElseIf

### Productions

Currently, these are a work in progress and are subject to change at any time.

    0   Z => S
    1   S => If E Then
    2   S => Else
    3   S => ElseIf
    4   S => EndIf
    5   S => For E To E
    6   S => For E To E Step E
    7   S => EndFor
    8   S => While E
    9   S => EndWhile
    10  S => Sub i
    11  S => EndSub
    12  S => Goto l
    13  S => i(A)
    14  S => i.i(A)
    15  S => i = E
    16  S => l
    17  E => E + T
    18  E => E - T
    19  E => E = T
    20  E => E <> T
    21  E => E <= T
    22  E => E >= T
    23  E => E > T
    24  E => E < T
    25  E => T
    26  T => T * F
    27  T => T / F
    28  T => F
    29  F => (E)
    30  F => t
    31  F => i
    32  A => EB | e
    33  B => ,C | e
    34  C => EB

## License

The Unlicense:
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means.

In jurisdictions that recognize copyright laws, the author or authors of this software dedicate any and all copyright interest in the software to the public domain. We make this dedication for the benefit of the public at large and to the detriment of our heirs and successors. We intend this dedication to be an overt act of relinquishment in perpetuity of all present and future rights to this software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.