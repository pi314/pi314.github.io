#include<stdio.h>
int main(){
char *s="#include<stdio.h>%cint main(){%cchar *s=%c%s%c;%cprintf(s,10,10,34,s,34,10,10);}%c";
printf(s,10,10,34,s,34,10,10);}
