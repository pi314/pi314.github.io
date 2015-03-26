#include <iostream>
using namespace std;
int main () {
    string code[] = {
        "    ",
        "#include <iostream>",
        "using namespace std;",
        "int main () {",
        "    string code[] = {",
        "    };",
        "    cout << code[14] << endl;",
        "    for (int a = 0; a < 22; a++) {",
        "        cout << code[0] << char(34) << code[a] << char(34) << ',' << endl;",
        "    }",
        "    for (int a = 15; a < 22; a++) {",
        "        cout << code[a] << endl;",
        "    }",
        "}",
        "code = [",
        "]",
        "for i in code[1:5]:",
        "    print(i)",
        "for i in code:",
        "    print(code[0]+code[0]+chr(34)+i+chr(34)+',')",
        "for i in code[5:14]:",
        "    print(i)",
    };
    cout << code[14] << endl;
    for (int a = 0; a < 22; a++) {
        cout << code[0] << char(34) << code[a] << char(34) << ',' << endl;
    }
    for (int a = 15; a < 22; a++) {
        cout << code[a] << endl;
    }
}
