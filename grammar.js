/**
 * @file Amml grammar for tree-sitter
 * @author euro20179
 * @license MIT
 */

module.exports = grammar({
  name: "amml",

  conflicts: $ => [
    [$.func_call, $.expression ],
    [$.operator, $.func_params]
  ],

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => repeat(choice(
      $.expression,
      $.note,
      $.comment
    )
    ),

    comment: $ => prec.left(seq("/*", /[^\n]+/, "*/")),

    note: $ => seq(
      "NOTE(", alias(/\w+/, $.note_format), ")",
      alias(repeat1(/.+/), $.note_text),
      "ENDNOTE"
    ),

    expression: $ => seq(
      choice(
        $.create_var,
        $.number,
        $.operator,
        $.variable,
        $.func_call,
        $.for_range,
        $.subtraction_bar,
        $.set,
        $.string,
      )
    ),

    string: $ => seq('"', /[^"\n]+/, '"'),

    func_call: $ => seq(field("funcname", $.variable), $.func_params),

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

    variable: $ => prec.left(
      seq(
        repeat1(/[^\p{Math_Symbol}\p{Decimal_Number}\s(){}\\\p{Other_Number}]/u),
        optional(/_[\p{Other_Number}\p{Decimal_Number}]+/u)
      )
    ),

    func_params: $ => seq(
      "(",
      repeat(
        seq(
          //this mess allows for an optional ","
          optional(
            seq($.expression, ",")
          ),
          seq($.expression, optional(","))
        )
      ),
      ")"
    ),

    subtraction_bar: $ => seq(
      alias("|", $.operator),
      optional(alias("^", $.operator)),
      $.number,
      alias("..", $.operator),
      optional(alias("_", $.operator)),
      $.number
    ),

    create_var: $ => seq(alias("let", $.keyword), $.variable, optional($.func_params), alias("=", $.operator), $.expression),

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

    for_range: $ => seq(alias("for", $.keyword), $.variable, alias("=", $.operator), $.number, alias("..", $.operator), $.number),

    integral: $ => prec.left(seq("∫", repeat1($.expression), alias(/d[^\s]+/, $.keyword))),

    operator: $ => choice(
      "+",
      "-",
      "*",
      "/",
      "^",
      "Σ",
      "Π",
      $.integral,
      "=",
      "~=",
      "(",
      ")",
      alias(/\\\w+/, $.adhock_operator),
      //now this is what i call regex
      /\p{Math_Symbol}/u,
    ),
  }
});
