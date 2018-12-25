#include<stdio.h>
#define END }/*
from __future__ import print_function
def printf(s,*args):print(s%args,end='')
char,END=0,'''*/
int main(){char* //'''
s="#include<stdio.h>%c#define END }/*%cfrom __future__ import print_function%cdef printf(s,*args):print(s%cargs,end='')%cchar,END=0,'''*/%cint main(){char* //'''%cs=%c%s%c;%cprintf(s,10,10,10,37,10,10,10,34,s,34,10,10,10);%cEND%c";
printf(s,10,10,10,37,10,10,10,34,s,34,10,10,10);
END
