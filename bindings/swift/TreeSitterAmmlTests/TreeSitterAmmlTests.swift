import XCTest
import SwiftTreeSitter
import TreeSitterAmml

final class TreeSitterAmmlTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_amml())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Amml grammar")
    }
}
