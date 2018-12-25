#include<stdio.h>
#define END }/*
from __future__ import print_function
def printf(s,*args):print(s%args,end='')
const,char,END=0,0,"""*/
int main(){char*_=" """;const
char*const
s="#include<stdio.h>%c#define END }/*%cfrom __future__ import print_function%cdef printf(s,*args):print(s%cargs,end='')%cconst,char,END=0,0,%c%c%c*/%cint main(){char*_=%c %c%c%c;const%cchar*const%cs=%c%s%c;%cprintf(s,10,10,10,37,10,34,34,34,10,34,34,34,34,10,10,34,s,34,10,10,10);%cEND%c";
printf(s,10,10,10,37,10,34,34,34,10,34,34,34,34,10,10,34,s,34,10,10,10);
END
