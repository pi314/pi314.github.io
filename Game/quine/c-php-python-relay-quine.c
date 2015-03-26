#include <stdio.h>
int main () {
    const char * const code[] = {
        "    ",
        "#include <stdio.h>",
        "int main () {",
        "    const char * const code[] = {",
        "    }};",
        "    int a;",
        "    printf({b}%s%c{b}, code[15], 10);",
        "    for (a = 0; a < 34; a += 1) {{",
        "        printf({b}%s%c%s%c,%c{b}, code[0], 39, code[a], 39, 10);",
        "    }}",
        "    for (a = 16; a < 25; a += 1) {{",
        "        printf({b}%s%c{b}, code[a], 10);",
        "    }}",
        "    return 0;",
        "}}",
        "<?php $code = [",
        "];",
        "print($code[25].chr(10).$code[26].chr(10));",
        "for ($i = 0; $i < 34; $i++) {",
        "    print($code[0].chr(34).$code[$i].chr(34).chr(44).chr(10));",
        "}",
        "for ($i = 27; $i < 34; $i++) {",
        "    print($code[$i].chr(10));",
        "}",
        "?>",
        "#!/usr/bin/env python",
        "code = [",
        "]",
        "for i in code[1:4]:",
        "    print(i)",
        "for i in code:",
        "    print(code[0]*2+chr(34)+i+chr(34)+chr(44))",
        "for i in code[4:-19]:",
        "    print(i.format(b=chr(34)))",
    };
    int a;
    printf("%s%c", code[15], 10);
    for (a = 0; a < 34; a += 1) {
        printf("%s%c%s%c,%c", code[0], 39, code[a], 39, 10);
    }
    for (a = 16; a < 25; a += 1) {
        printf("%s%c", code[a], 10);
    }
    return 0;
}
