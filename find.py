#!/usr/bin/python
import sys
import os

if sys.argv[1] == '-h':
    print 'Usage:'
    print '    %s FIND_STR' % (sys.argv[0])
    print '        Output founded all FIND_STR and file names.'
    print '    %s -s FIND_STR' % (sys.argv[0])
    print '        Only output file names.'
    exit()

find_str = sys.argv[1]

if find_str == '-s':
    output_verbose_level = sys.argv[1]
    find_str = sys.argv[2]
else:
    output_verbose_level = '-a'

clean = True

for target_file in os.listdir('.'):
    if (target_file.startswith('.')):
        continue
    try:
        with open(target_file) as f:
            for linenum, line in enumerate(f):
                if find_str in line:
                    if clean:
                        if output_verbose_level == '-a':
                            print ''
                        print target_file
                        clean = False
                    if output_verbose_level == '-a':
                        print linenum+1, line.strip()
    except:
        pass
    clean = True
