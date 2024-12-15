/**
 * @file Amml grammar for tree-sitter
 * @author euro20179
 * @license MIT
 */

module.exports = grammar({
  name: "amml",

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
        $.i,
      )
    ),

    string: $ => seq('"', /[^"\n]+/, '"'),

    i: $ => "i",

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

    variable: $ => prec.left(seq(/[^\d\s(){}\\]/, repeat(/\w/))),

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
      alias("tau", $.constant),
      alias("TAU", $.constant),
      alias("e", $.constant),
      seq(/\d+/, token.immediate(optional(seq(".", /\d+/)))),
    ),

    for_range: $ => seq(alias("for", $.keyword), $.variable, alias("=", $.operator), $.number, alias("..", $.operator), $.number),

    operator: $ => choice(
      "+",
      "-",
      "*",
      "/",
      "^",
      "Σ",
      "Π",
      "∫",
      "=",
      "∈",
      "∩",
      "∪",
      "⊂",
      "⊃",
      "~=",
      alias(/\\\w+/, $.adhock_operator)
    ),
  }
});
