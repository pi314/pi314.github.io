#!/usr/bin/python
import sys

with open(sys.argv[1]) as main_file:
    for line in main_file:
        if line[0] == '#':
            sub_file_name = line[1:].strip()
            sub_file = open(sub_file_name)
            for sub_line in sub_file:
                print sub_line,
            pass
        elif line.strip().startswith('//'):
            pass
        else:
            if line.strip() != '':
                print line,
        
