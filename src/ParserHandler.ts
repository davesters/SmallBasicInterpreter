export interface ParseNode {
    Type: string;
    Literal: any;
    Left?: ParseNode;
    Operator?: string;
    Right?: ParseNode;
}

export interface ParseRecord {
    State: number;
    Node: ParseNode;
}

import Tokens = module('./Tokens');
import Machine = module('./State');

export function HandleSingleRightSideProduction(production: number, leftSide: string) {
    var records = popRecordsFromStack(1);

    pushNewNode(
        {
            Type: Tokens.Production,
            Literal: production,
            Left: records[0].Node
        },
        leftSide);
}

export function HandleDoubleRightSideProduction(production: number, leftSide: string) {
    var records = popRecordsFromStack(2);

    pushNewNode(
        {
            Type: Tokens.Production,
            Literal: production,
            Left: records[0].Node,
            Right: records[1].Node
        },
        leftSide);
}

export function HandleOperationProduction(production: number, leftSide: string) {
    var records = popRecordsFromStack(3);

    pushNewNode(
        {
            Type: Tokens.Production,
            Literal: production,
            Left: records[2].Node,
            Operator: records[1].Node.Literal,
            Right: records[0].Node
        },
        leftSide);
}

export function HandleParenthesisExpression(production: number, leftSide: string) {
    var records = popRecordsFromStack(3);

    pushNewNode(
        {
            Type: Tokens.Production,
            Literal: production,
            Left: records[1].Node
        },
        leftSide);
}

export function HandleProduction13() {
    var records = popRecordsFromStack(1);
    var arguments: ParseNode = null;

    var node: ParseNode = {
        Type: Tokens.Production,
        Literal: 13
    };

    if (peekLastNode().Literal != '(') {
        do {
            records = popRecordsFromStack(2);

            arguments = {
                Type: Tokens.Argument,
                Literal: null,
                Left: records[0].Node,
                Right: arguments
            };
        } while(records[1].Node.Literal != '(');
    } else {
        popRecordsFromStack(1);
    }

    records = popRecordsFromStack(3);
    node.Left = records[2].Node;
    node.Right = records[0].Node;
    node.Right.Right = arguments;

    node.Operator = '.';

    pushNewNode(node, 'S');
}

export function HandleProduction14() {
    var records = popRecordsFromStack(3);

    var node: ParseNode = {
        Type: Tokens.Production,
        Literal: 14
    };

    if (records[2].Node.Literal == '(') {
        var record4 = popRecordsFromStack(1);
        record4[0].Node.Left = records[1].Node;

        node.Left = record4[0].Node;
    } else {
        node.Left = records[2].Node;
    }

    pushNewNode(node, 'S');
}

function pushNewNode(node: ParseNode, leftSide: string) {
    Machine.State = Machine.GetParseGoto(getLastState(), leftSide);
    Machine.Stack.push({ State: Machine.State, Node: node });
}

function getLastState(): number {
    return Machine.Stack[Machine.Stack.length - 1].State;
}

function peekLastNode(): ParseNode {
    return Machine.Stack[Machine.Stack.length - 1].Node;
}

function popRecordsFromStack(amount: number): ParseRecord[] {
    var records: ParseRecord[] = [];

    for (var x = 0; x < amount; x++) {
        records.push(Machine.Stack.pop());
    }

    return records;
}