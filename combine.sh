#!/usr/bin/sh
python combine.py _main.js > main.js

printf "\033[31;1mmain.js generated. Please move main.js into Res/ folder.\033[m\n"
