#include <stdio.h>
int main () {
    const char * const code[] = {
        "    ",
        "#include <stdio.h>",
        "int main () {",
        "    const char * const code[] = {",
        "    }};",
        "    int a;",
        "    printf({b}%s%c%s%c{b}, code[15], 10, code[16], 10);",
        "    for (a = 0; a < 24; a += 1) {{",
        "        printf({b}%s%c%s%c,%c{b}, code[0], 34, code[a], 34, 10);",
        "    }}",
        "    for (a = 17; a < 24; a += 1) {{",
        "        printf({b}%s%c{b}, code[a], 10);",
        "    }}",
        "    return 0;",
        "}}",
        "#!/usr/bin/env python",
        "code = [",
        "]",
        "for i in code[1:4]:",
        "    print(i)",
        "for i in code:",
        "    print(code[0]*2+chr(34)+i+chr(34)+',')",
        "for i in code[4:-9]:",
        "    print(i.format(b=chr(34)))",
    };
    int a;
    printf("%s%c%s%c", code[15], 10, code[16], 10);
    for (a = 0; a < 24; a += 1) {
        printf("%s%c%s%c,%c", code[0], 34, code[a], 34, 10);
    }
    for (a = 17; a < 24; a += 1) {
        printf("%s%c", code[a], 10);
    }
    return 0;
}
