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
    source_file: $ => repeat(
      choice(
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
        $.limit,
        $.parenthasized_expression,
      )
    ),

    parenthasized_expression: $ => prec(20, seq("(", repeat1($.expression), ")")),

    limit: $ => prec.right(
      seq(
        alias("lim", $.operator),
        choice(
          seq(
            alias("as", $.keyword),
            optional("("),
            $.variable,
            alias(choice("->", "→", "approaches"), $.operator),
            $.expression,
            optional(")"),
          ),
          seq(
            "(",
            $.variable,
            alias(choice("->", "→", "approaches"), $.operator),
            $.expression,
            ")",
          ),
        ),
        optional(alias("of", $.keyword))
      )),

    func_call: $ => prec(100, choice(
      seq(field("funcname", $.variable), "of", $.expression),
      seq(field("funcname", $.variable), token.immediate("("), repeat($.expression), ")")),
    ),

    string: $ => seq('"', /[^"]+/, '"'),

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
      prec.right(seq(
        /[\p{Letter}]+/u,
        optional("'"),
        optional(alias(choice(
          repeat1(/[₀-₉\p{Modifier_Letter}]/u),
          seq(
            "_",
            repeat1(/[^\p{Space_Separator}\p{Close_Punctuation}\p{Connector_Punctuation}\p{Dash_Punctuation}\p{Open_Punctuation}\p{Final_Punctuation}\p{Initial_Punctuation}\p{Other_Punctuation}]/u)
          )), $.variable_subscript)
        ),
        optional("'"),
      ))
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
      prec.right(seq(
        alias("let", $.keyword),
        choice($.variable, seq('"', alias(/[^"\n]+/, $.operator), '"')),
        optional($.func_names),
      )),
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
      seq(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/, "/", /[₀₁₂₃₄₅₆₇₈₉]/),
      /\d+(?:[\.⁄]\d+)?/,
      /[\.⁄]\d+/
    ),

    for_range: $ => seq(alias("for", $.keyword), $.variable, alias("=", $.operator), $.expression, alias("..", $.operator), $.expression),

    // integral: $ => prec.left(seq("∫", repeat1($.expression))),

    adhock_operator: $ => /\\[\p{Letter}]+/,
    operator: $ => prec(10, choice(
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
      "_",
      ":",
      ">",
      "<",
      ">=",
      "<=",
      $.adhock_operator,
      //now this is what i call regex
      /\p{Math_Symbol}/u,
    )),
  }
});
