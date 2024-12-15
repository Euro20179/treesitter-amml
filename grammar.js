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
      $.note
    )
    ),

    note: $ => seq(
      "\nNOTE(", alias(/\w+/, $.note_format), ")\n",
      alias(repeat1(/./), $.note_text),
      "\nENDNOTE\n"
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

    variable: $ => prec.left(seq(/[^\d\s(){}]/, repeat(/\w/))),

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

    number: $ => seq(/\d+/, token.immediate(optional(seq(".", /\d+/)))),

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
    ),
  }
});
