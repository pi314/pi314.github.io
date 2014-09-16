#include<iostream>
#include<windows.h>
#include<time.h>
#include<conio.h>
using namespace std;
//SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),7);
//length:43
#define allowing 40
#define downAllow 42
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
#include"matrix-Flow.h"
main()
{
    srand(time(NULL));
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
    Flow f[allowing];
    int a, b, c;
    char * occupied[downAllow][allowing] = {NULL};
    int wave[downAllow][40];
    char ch[2];
    int waveCounter;
    int waveMax;
    int s;
    int eggwave;
    int code[12]={1,1,2,2,3,3,4,4,5,6,6,5};
    int temp[12];
    int top;
    
    waveCounter = -1;
    waveMax = -1;
    eggwave = 0;
    top = 0;
    color(2);
    while(true)
    {
        if(waveCounter == -1)
            Sleep(50);
        else
        {
            for(c = 0; c < 5; c++)
            {
                for(a = 0; a < downAllow; a++)
                {
                    for(b = 0; b < 40; b++)
                    {
                        if(wave[a][b] == -1)
                            continue;
                        if(occupied[a][b] != "||" && occupied[a][b] != "==" && occupied[a][b] != NULL)
                        {
                            if(wave[a][b] == waveCounter)
                            {
                                gotoxy(a,b);
                                cout<<occupied[a][b];
                            }
                            else if(wave[a][b] == waveCounter - 1)
                            {
                                gotoxy(a,b);
                                cout<<occupied[a][b];
                                wave[a][b] = -1;
                            }
                        }
                        else
                        {
                            if(wave[a][b] == waveCounter)
                            {
                                gotoxy(a,b);
                                cout<<str[s][rand()%62];
                            }
                            else if(wave[a][b] == waveCounter - 1)
                            {
                                gotoxy(a,b);
                                cout<<"  ";
                                wave[a][b] = -1;
                            }
                        }
                    }
                }
                waveCounter++;
                if(waveCounter > 6)
                {
                    waveCounter = -1;
                    waveMax = -1;
                    break;
                }
                Sleep(5);
            }
        }
        if(kbhit())
        {
            ch[0] = getch();
            if(ch[0] <= 0)
            {
                ch[1] = getch();
            }
            if(ch[0] == -32 && ch[1] == 72)
            {
                temp[top] = 1;
                top = (top+1)%12;
            }
            else if(ch[0] == -32 && ch[1] == 75)
            {
                temp[top] = 3;
                top = (top+1)%12;
            }
            else if(ch[0] == -32 && ch[1] == 77)
            {
                temp[top] = 4;
                top = (top+1)%12;
            }
            else if(ch[0] == -32 && ch[1] == 80)
            {
                temp[top] = 2;
                top = (top+1)%12;
            }
            else if(ch[0] == 'a' || ch[0] == 'A')
            {
                temp[top] = 5;
                top = (top+1)%12;
            }
            else if(ch[0] == 'b' || ch[0] == 'B')
            {
                temp[top] = 6;
                top = (top+1)%12;
            }
            for(a = 0; a < 12; a++)
            {
                if(temp[(top+a+1)%12] != code[a])
                    break;
            }
            if(a == 12)
                eggwave = 50;
            if(waveMax == -1)
            {
                int xx, yy;
                xx = rand()%downAllow;
                yy = rand()%40;
                for(a = 0; a < downAllow; a++)
                {
                    for(b = 0; b < 40; b++)
                    {
                        wave[a][b] = abs(a-xx)>abs(b-yy)?abs(a-xx):abs(b-yy);
                        if(wave[a][b] > 5)
                        {
                            wave[a][b] = -1;
                        }
                        waveMax = waveMax>wave[a][b]?waveMax:wave[a][b];
                    }
                }
                waveCounter = 0;
                s = rand()%3;
            }
        }
        for(a = 0 ;a < allowing; a++)
        {
            f[a].timeFlow(str, occupied);
        }
        
        for(a = 0; a < allowing; a++)
            if(!(f[a].online()))
                break;
        if(a < allowing)
        {
            int yr = rand()%40;
            int upr = rand()%22;
            int downr = rand()%(downAllow-upr+1)+upr;
            int lengthr = rand()%(downAllow-3)+3;
            for(b = upr; b <= downr; b++)
            {
                if(occupied[b][yr] != NULL)
                    break;
            }
            if(b > downr)
            {
                f[a].turnOn(yr, upr, downr, lengthr, occupied, eggwave);
                if(eggwave > 0)
                eggwave--;
            }
        }
    }
}
