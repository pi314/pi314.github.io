#include<stdio.h>
#define d char*
#define END }/*
from __future__ import print_function
def printf(s,*args):print(s%args,end='')
d,char,END=0,0,'''*/
int main(){d //'''
s1="#include<stdio.h>%c#define d char*%c#define END }/*%c";d
s2="from __future__ import print_function%cdef printf(s,*args):";d
s3="print(s%cargs,end='')%cd,char,END=0,0,'''*/%cint main(){d //'''%c";d
m1="s1=%c%s%c;d%cs2=%c%s%c;d%cs3=%c%s%c;d%cm1=%c%s%c;d%c";d
m2="m2=%c%s%c;d%cm3=%c%s%c;d%cs4=%c%s%c;d%cs5=%c%s%c;d%c";d
m3="s6=%c%s%c;d%cs7=%c%s%c;d%cs8=%c%s%c;d%cs9=%c%s%c;%c";d
s4="printf(s1,10,10,10);printf(s2,10);printf(s3,37,10,10,10);%c";d
s5="printf(m1,34,s1,34,10,34,s2,34,10,34,s3,34,10,34,m1,34,10);%c";d
s6="printf(m2,34,m2,34,10,34,m3,34,10,34,s4,34,10,34,s5,34,10);%c";d
s7="printf(m3,34,s6,34,10,34,s7,34,10,34,s8,34,10,34,s9,34,10);%c";d
s8="printf(s4,10);printf(s5,10);printf(s6,10);printf(s7,10);%c";d
s9="printf(s8,10);printf(s9,10);END%c";
printf(s1,10,10,10);printf(s2,10);printf(s3,37,10,10,10);
printf(m1,34,s1,34,10,34,s2,34,10,34,s3,34,10,34,m1,34,10);
printf(m2,34,m2,34,10,34,m3,34,10,34,s4,34,10,34,s5,34,10);
printf(m3,34,s6,34,10,34,s7,34,10,34,s8,34,10,34,s9,34,10);
printf(s4,10);printf(s5,10);printf(s6,10);printf(s7,10);
printf(s8,10);printf(s9,10);END
