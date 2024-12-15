/**
 * @file Amml grammar for tree-sitter
 * @author euro20179
 * @license MIT
 */

module.exports = grammar({
  name: "amml",

  conflicts: $ => [
    // [$.func_call, $.expression],
  ],

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => repeat(choice(
      $.expression,
      $.note,
      $.comment
    )
    ),

    comment: $ => prec.left(seq("/*", repeat1(/./), "*/")),

    note: $ => seq(
      "/*(", alias(/\w+/, $.note_format), ")",
      alias(repeat1(/.+/), $.note_text),
      "*/"
    ),

    expression: $ => seq(
      choice(
        $.create_var,
        $.number,
        $.operator,
        $.variable,
        $.for_range,
        $.set,
        $.string,
        $.func_call,
        $.parenthasized_expression,
      )
    ),

    parenthasized_expression: $ => prec(10, seq("(", repeat1($.expression), ")")),

    func_call: $ => prec(100, choice(
      seq(field("funcname", $.variable), "of", $.expression),
      seq(field("funcname", $.variable), "(", repeat($.expression), ")")),
    ),

    string: $ => seq('"', /[^"\n]+/, '"'),

    set: $ => seq("{",
      repeat(
        seq(
          optional(
            seq($.expression, ",")
          ),
          seq($.expression, optional(",")
          )
        )
      ),
      "}",
    ),

    variable: $ =>
      seq(
        /[^",_/\*\s()\[\]{}\p{Math_Symbol}\p{Decimal_Number}\\\p{Other_Number}]+/u,
        optional(alias(choice(
          /[₀-₉]+/,
          seq("_", /[\p{Decimal_Number}\p{Other_Number}\d]+/)), $.variable_subscript)
        )
      )
    ,

    func_names: $ => seq(
      "(",
      prec.left(repeat(
        seq(optional(
          seq($.variable, ",")
        ),
          seq($.variable, optional(","))
        ))),
      ")"
    ),

    // subtraction_bar: $ => seq(
    //   alias("|", $.operator),
    //   optional(alias("^", $.operator)),
    //   $.number,
    //   alias("..", $.operator),
    //   optional(alias("_", $.operator)),
    //   $.number
    // ),

    create_var: $ => choice(
      seq(
        alias("let", $.keyword),
        optional(field("leftName", $.variable)),
        $.adhock_operator,
        optional(field("rightName", $.variable)),
        alias("=", $.operator),
      ),
      seq(
        alias("let", $.keyword),
        $.variable,
        optional($.func_names),
        alias("=", $.operator),
      ),
    ),

    number: $ => choice(
      alias("π", $.constant),
      alias("τ", $.constant),
      alias("pi", $.constant),
      alias("PI", $.constant),
      alias("i", $.i),
      alias("tau", $.constant),
      alias("TAU", $.constant),
      alias("e", $.constant),
      /\p{Other_Number}/u,
      /\p{Decimal_Number}/u,
      seq(/\d+/, "⁄", /\d+/),
      seq(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/, "/", /[₀₁₂₃₄₅₆₇₈₉]/),
      seq(/\d+/, token.immediate(optional(seq(".", /\d+/)))),
    ),

    for_range: $ => seq(alias("for", $.keyword), $.variable, alias("=", $.operator), $.expression, alias("..", $.operator), $.expression),

    // integral: $ => prec.left(seq("∫", repeat1($.expression))),

    adhock_operator: $ => /\\\w+/,
    operator: $ => choice(
      "[",
      "]",
      "+",
      "-",
      "*",
      "/",
      "^",
      "Σ",
      "Π",
      "(",
      ")",
      "∫",
      "=",
      "~=",
      ",",
      "|",
      "..",
      $.adhock_operator,
      //now this is what i call regex
      /\p{Math_Symbol}/u,
    ),
  }
});
