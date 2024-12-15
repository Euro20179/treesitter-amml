// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterAmml",
    products: [
        .library(name: "TreeSitterAmml", targets: ["TreeSitterAmml"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ChimeHQ/SwiftTreeSitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterAmml",
            dependencies: [],
            path: ".",
            sources: [
                "src/parser.c",
                // NOTE: if your language has an external scanner, add it here.
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterAmmlTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterAmml",
            ],
            path: "bindings/swift/TreeSitterAmmlTests"
        )
    ],
    cLanguageStandard: .c11
)
