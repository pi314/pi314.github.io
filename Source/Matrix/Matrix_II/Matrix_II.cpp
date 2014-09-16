#define AllowAmount 20
#define EggAmount 5
#define EggLengthLimit 30
#define Deepth 40
#define Width 40
#define UniqeRate 150
#include<iostream>
using namespace std;
#include<conio.h>
#include<windows.h>
void gotoxy(int xpos, int ypos)
{
  COORD scrn;    
  HANDLE hOuput = GetStdHandle(STD_OUTPUT_HANDLE);
  scrn.X = 2*ypos; scrn.Y = xpos;
  SetConsoleCursorPosition(hOuput,scrn);
}
void color(int input)
{
    static int last = 0;
    if(last != input)
    {
        SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),input);
        last = input;
    }
}
#include"Matrix_II-Flow.h"
main()
{
    char *str[3][62]={
    {"0 ","1 ","2 ","3 ","4 ","5 ","6 ","7 ","8 ","9 ",
    "a ","b ","c ","d ","e ","f ","g ","h ","i ","j ",
    "k ","l ","m ","n ","o ","p ","q ","r ","s ","t ",
    "u ","v ","w ","x ","y ","z ","A ","B ","C ","D ",
    "E ","F ","G ","H ","I ","J ","K ","L ","M ","N ",
    "O ","P ","Q ","R ","S ","T ","U ","V ","W ","X ",
    "Y ","Z "},
    {" 0"," 1"," 2"," 3"," 4"," 5"," 6"," 7"," 8"," 9",
    " a"," b"," c"," d"," e"," f"," g"," h"," i"," j",
    " k"," l"," m"," n"," o"," p"," q"," r"," s"," t",
    " u"," v"," w"," x"," y"," z"," A"," B"," C"," D",
    " E"," F"," G"," H"," I"," J"," K"," L"," M"," N",
    " O"," P"," Q"," R"," S"," T"," U"," V"," W"," X",
    " Y"," Z"},
    {"¢¯","¢°","¢±","¢²","¢³","¢´","¢µ","¢¶","¢·","¢¸",
    "¢é","¢ê","¢ë","¢ì","¢í","¢î","¢ï","¢ð","¢ñ","¢ò",
    "¢ó","¢ô","¢õ","¢ö","¢÷","¢ø","¢ù","¢ú","¢û","¢ü",
    "¢ý","¢þ","£@","£A","£B","£C","¢Ï","¢Ð","¢Ñ","¢Ò",
    "¢Ó","¢Ô","¢Õ","¢Ö","¢×","¢Ø","¢Ù","¢Ú","¢Û","¢Ü",
    "¢Ý","¢Þ","¢ß","¢à","¢á","¢â","¢ã","¢ä","¢å","¢æ",
    "¢ç","¢è"}
    };
    Flow f[AllowAmount];
    bool occupied[Deepth][Width];
    int a;
    char ch[2];
    int egg;
    char interactionEgg[EggAmount][EggLengthLimit];
    int iEggLength[EggAmount];
    int alter;
    char monitor[8]="Egg(0):";
    
    for(a = 0; a < EggAmount; a++)
    {
        iEggLength[a] = 0;
        interactionEgg[a][0] = 0;
    }
    alter = 0;
    egg = 0;
    for(a = 0; a < Deepth; a++)
        for(int b = 0; b < Width; b++)
            occupied[a][b] = false;
    while(true)
    {
        for(a = 0; a < AllowAmount; a++)
        {
            if(!(f[a].working()))
                f[a].turnOn(occupied, egg, interactionEgg[rand()%EggAmount]);
        }
        for(a = 0; a < AllowAmount; a++)
        {
            f[a].timeFlow(str, occupied);
        }
        while(kbhit())
        {
            ch[0] = getch();
            if(ch[0] <= 0)
            {
                ch[1] = getch();
            }
            if(ch[0] == 13)
                egg++;
            else if(ch[0] == 8)
            {
                iEggLength[alter] = 0;
                interactionEgg[alter][0] = 0;
            }
            else if(ch[0] == -32 && ch[1] == 73)
            {
                alter = (alter+4)%5;
            }
            else if(ch[0] == -32 && ch[1] == 81)
            {
                alter = (alter+1)%5;
            }
            else if(iEggLength[alter] < EggLengthLimit - 1)
            {
                interactionEgg[alter][iEggLength[alter]] = ch[0];
                if(ch[0] < 0)
                {
                    iEggLength[alter]++;
                    interactionEgg[alter][iEggLength[alter]] = ch[1];
                }
                iEggLength[alter]++;
                interactionEgg[alter][iEggLength[alter]] = 0;
            }
            
            monitor[4] = alter+'0';
            char title[100];
            strcpy(title, monitor);
            strcat(title, interactionEgg[alter]);
            SetConsoleTitle(title);
        }
        Sleep(50);
    }
}
